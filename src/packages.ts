import path from 'path';
import fs from 'fs';
import * as core from '@actions/core';
import { getPackagesDir } from './util';

const parentMap = new Map<string, Set<string>>();
const childrenMap = new Map<string, Set<string>>();
const dirMap = new Map<string, string>();

function resolvePackage(packageDir: string): void {
  const packagesPath = getPackagesDir();
  try {
    const packageJson = require(path.resolve(
      packagesPath,
      packageDir,
      'package.json',
    ));
    const { name } = packageJson;
    dirMap.set(packageJson.name, packageDir);
    const parents = new Set<string>();
    Object.entries<string>(packageJson.dependencies)
      .filter(([, version]) => /^workspaces/.exec(version))
      .forEach(([key]) => {
        parents.add(key);
      });
    parentMap.set(packageJson.name, parents);
    Array.from(parents).forEach((dep) => {
      if (childrenMap.has(dep)) {
        childrenMap.get(dep)?.add(name);
      } else {
        const children = new Set<string>();
        children.add(name);
        childrenMap.set(dep, children);
      }
    })
  } catch (e) {
    core.error(e);
    throw e;
  }
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
    const parents = parentMap.get(changedDir);
    if (parents) {
      Array.from(parents).forEach(
        (parent) => dirMap.get(parent) && all.add(dirMap.get(parent)!),
      );
    }
    all.add(dirMap.get(changedDir)!);
  })
  return all;
}
