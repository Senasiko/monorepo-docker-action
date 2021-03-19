import path from 'path';
import fs from 'fs';
import cp from 'child_process';
import * as github from '@actions/github';
import * as core from '@actions/core';
import execa from 'execa';
import { getPackagesDir } from './util';

function getDockerfile(packageDir: string): string {
  const packagesPath = getPackagesDir();
  return path.resolve(packagesPath, packageDir, 'Dockerfile');
}

function createImageName(packageDir: string): string {
  const registry = core.getInput('registry');
  const prefix = core.getInput('prefix');
  return `${registry}${prefix ? `/${prefix}` : ''}/${packageDir}`;
}

function createTag(): string {
  const { sha } = github.context;
  return sha.substring(0, 7);
}

export function createFullImageName(packageDir: string): string {
  return `${createImageName(packageDir)}:${createTag()}`;
}

async function buildPackage(packageDir: string): Promise<void> {
  const dockerfile = getDockerfile(packageDir);
  const directory = core.getInput('directory');
  const args = [
    'build',
    '-f',
    dockerfile,
    '-t',
    `${createFullImageName(packageDir)}`,
    directory,
  ];
  try {
    await execa('docker', args);
    core.info(`${packageDir} docker build success`);
  } catch (e) {
    core.error(e)
    throw new Error(`${packageDir} build fail: ${dockerfile}, ${createFullImageName(packageDir)}`);
  }
}

export async function buildPackages(packages: Set<string>): Promise<void> {
  await Promise.all(Array.from(packages).map(buildPackage));
}

export function filterPackages(packages: Set<string>): Set<string> {
  return new Set(Array.from(packages).filter((packageDir) => {
    const dockerfile = getDockerfile(packageDir);
    return fs.existsSync(dockerfile);
  }))
}

const isEcr = (registry: string): boolean => !!registry && registry.includes('amazonaws');

const getRegion = (registry: string): string => registry.substring(
  registry.indexOf('ecr.') + 4,
  registry.indexOf('.amazonaws'),
);

const isWindows = (): boolean => process.env.RUNNER_OS === 'Windows';

export async function login(): Promise<void> {
  const registry = core.getInput('registry');
  const username = core.getInput('username');
  const password = core.getInput('password');

  // If using ECR, use the AWS CLI login command in favor of docker login
  if (isEcr(registry)) {
    const region = getRegion(registry);
    core.info(`Logging into ECR region ${region}...`);

    // Determine whether to run bash or PowerShell version of login command
    if (isWindows()) {
      execa.sync(
        `aws ecr get-login-password --region ${region} | docker login --username AWS --password-stdin ${registry}`,
      );
    } else {
      execa.sync(`$(aws ecr get-login --region ${region} --no-include-email)`);
    }
  } else if (username && password) {
    core.info(`Logging into Docker registry ${registry}...`);
    const result = cp.execSync(`docker login ${registry} -u ${username} --password-stdin`, {
      input: password,
    })
    core.info(result.toString())
  }
}

async function pushPackage(packageDir: string): Promise<void> {
  try {
    cp.execSync(`docker push ${createFullImageName(packageDir)}`, {
      maxBuffer: 50 * 1024 * 1024,
      stdio: 'inherit',
    });
    core.info(`${packageDir} docker push success`);
  } catch (e) {
    core.error(e)
    throw new Error(`${packageDir} push fail`);
  }
}

export async function pushPackages(packages: Set<string>): Promise<void> {
  await Promise.all(Array.from(packages).map(pushPackage));
}
