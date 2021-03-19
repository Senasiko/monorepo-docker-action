import path from 'path';
import fs from 'fs';
import { getPackagesDir } from './util';

const parentMap = new Map<string, Set<string>>();
const childrenMap = new Map<string, Set<string>>();
const dirMap = new Map<string, string>();
const nameMap = new Map<string, string>();

interface PackageItem {
  [x: string]: string | PackageItem
}

export function getPackageJson(packageDir: string): PackageItem {
  const packagesPath = getPackagesDir();
  return require(path.resolve(
    packagesPath,
    packageDir,
    'package.json',
  ));
}

function resolvePackage(packageDir: string): void {
  const packageJson = getPackageJson(packageDir);
  const { name } = packageJson as { name: string };
  dirMap.set(name, packageDir);
  nameMap.set(packageDir, name);
  const parents = new Set<string>();
  if (typeof packageJson.dependencies === 'object') {
    Object.entries<string>(packageJson.dependencies as Record<string, string>)
      .filter(([, version]) => /^workspaces/.exec(version))
      .forEach(([key]) => {
        parents.add(key);
      });
  }
  parentMap.set(name, parents);
  Array.from(parents).forEach((dep) => {
    if (childrenMap.has(dep)) {
      childrenMap.get(dep)?.add(name);
    } else {
      const children = new Set<string>();
      children.add(name);
      childrenMap.set(dep, children);
    }
  })
}

export function resolveDeps(): void {
  const packagesPath = getPackagesDir();
  const packages = fs.readdirSync(path.resolve(__dirname, packagesPath));
  packages.forEach(resolvePackage);
}

export function getAllChangedPackageDirs(
  changedPackageDirs: Set<string>,
): Set<string> {
  const changedArr = Array.from(changedPackageDirs);
  const all = new Set<string>();
  changedArr.forEach((changedDir) => {
    const children = childrenMap.get(nameMap.get(changedDir)!);
    if (children) {
      Array.from(children).forEach(
        (child) => dirMap.get(child) && all.add(dirMap.get(child)!),
      );
    }
    all.add(changedDir);
  })
  return all;
}
