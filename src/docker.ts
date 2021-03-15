import path from 'path';
import * as github from '@actions/github';
import * as core from '@actions/core';
import execa from 'execa';
import { getPackagesDir } from './util';

function createImageName(packageDir: string): string {
  const registry = core.getInput('registry');
  const prefix = core.getInput('prefix');
  return `${registry}${prefix ? `/${prefix}` : ''}/${packageDir}`;
}

export function createFullImageName(packageDir: string): string {
  const { sha } = github.context;
  const tag = sha.substring(0, 7);
  return `${createImageName(packageDir)}:${tag}`;
}

async function buildPackage(packageDir: string): Promise<void> {
  const packagesPath = getPackagesDir();
  const dockerfile = path.resolve(packagesPath, packageDir, 'Dockerfile');
  const args = [
    'build',
    '-f',
    dockerfile,
    '-t',
    `${createFullImageName(packageDir)}`,
  ];
  try {
    await execa('docker', args);
    core.info(`${packageDir} docker build success`);
  } catch (e) {
    core.error(new Error(`${packageDir} build fail`));
    throw e;
  }
}

export async function buildPackages(packages: Set<string>): Promise<void> {
  await Promise.all(Array.from(packages).map(buildPackage));
}

const isEcr = (registry: string): boolean => !!registry && registry.includes('amazonaws');

const getRegion = (registry: string): string => registry.substring(
  registry.indexOf('ecr.') + 4,
  registry.indexOf('.amazonaws'),
);

const isWindows = (): boolean => process.env.RUNNER_OS === 'Windows';

export function login(): void {
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
    execa.sync(`docker login -u ${username} --password-stdin ${registry}`, {
      input: password,
    });
  }
}

async function pushPackage(packageDir: string): Promise<void> {
  try {
    await execa(`docker push ${createFullImageName(packageDir)}`);
    core.info(`${packageDir} docker push success`);
  } catch (e) {
    core.error(new Error(`${packageDir} push fail`));
    throw e;
  }
}

export async function pushPackages(packages: Set<string>): Promise<void> {
  await Promise.all(Array.from(packages).map(pushPackage));
}
