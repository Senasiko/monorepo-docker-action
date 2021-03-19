import path from 'path';
import * as github from '@actions/github';
import * as core from '@actions/core';
import { getPackagesDir, getToken } from './util';
import { resolveDeps, getAllChangedPackageDirs } from './packages';
import {
  buildPackages, login, pushPackages, filterPackages,
} from './docker';
import { deploy } from './swarm';

async function run(): Promise<void> {
  const octokit = github.getOctokit(getToken());
  const { context } = github;
  if (!context.payload.pull_request) {
    core.setFailed('need pull request');
    return
  }
  const { pull_request } = context.payload;
  const octokitBaseFormData = {
    repo: context.repo.repo,
    owner: context.repo.owner,
    pull_number: pull_request.number,
  };
  try {
    const { data: files } = await octokit.pulls.listFiles(octokitBaseFormData);
    const { sha } = context.payload.pull_request.head
    resolveDeps();
    const changedPackageDirs = new Set<string>();
    files.forEach((file) => {
      const filePath = file.blob_url.split(sha)[1].replace(/^\//, '');
      if (new RegExp(`^${getPackagesDir()}/([^/]+)/`).exec(path.resolve('.', filePath))) {
        changedPackageDirs.add(RegExp.$1);
      }
    })
    const all = getAllChangedPackageDirs(changedPackageDirs);
    core.info(`will build dirs: ${Array.from(all).join(', ')}`)
    const filteredPackages = filterPackages(all);
    await buildPackages(filteredPackages);
    await login();
    await pushPackages(filteredPackages);
    await deploy(filteredPackages);
  } catch (e) {
    if (pull_request) {
      try {
        await octokit.issues.createComment({
          ...octokitBaseFormData,
          issue_number: octokitBaseFormData.pull_number,
          body: e.toString(),
        });
        await octokit.pulls.update({
          ...octokitBaseFormData,
          state: 'closed',
        });
      } catch (err) {
        core.error(err);
      }
      core.setFailed(e);
      process.exit(1);
    }
  }
}

run()
