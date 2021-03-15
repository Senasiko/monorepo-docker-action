import * as github from '@actions/github';
import * as core from '@actions/core';
import { getPackagesDir, getToken } from './util';
import { resolveDeps, getAllChangedPackageDirs } from './packages';
import { buildPackages, login, pushPackages } from './docker';
import { deploy } from './swarm';

async function run(): Promise<void> {
  const octokit = github.getOctokit(getToken());
  const { context } = github;
  if (!context.payload.pull_request) {
    core.error('need pull request');
    return;
  }
  const { pull_request } = context.payload;
  const { data: files } = await octokit.pulls.listFiles({
    repo: context.repo.repo,
    owner: context.repo.owner,
    pull_number: pull_request.number,
  });
  resolveDeps();
  const changedPackageDirs = new Set<string>();
  files.forEach((file) => {
    const filePath = file.blob_url.split(file.sha)[1].replace(/^\//, '');
    if (new RegExp(`^${getPackagesDir()}/([^/])/`).exec(filePath)) {
      changedPackageDirs.add(RegExp.$1);
    }
  })
  const all = getAllChangedPackageDirs(changedPackageDirs);
  login();
  await buildPackages(all);
  await pushPackages(all);
  await deploy(all);
}

run();
