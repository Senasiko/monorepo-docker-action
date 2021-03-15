import path from 'path';
import { getInput } from '@actions/core';

export function getPackagesDir(): string {
  const packagesPath = getInput('packages_path');
  return path.resolve(__dirname, packagesPath);
}

export function getToken(): string {
  return getInput('token');
}
