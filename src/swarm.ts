import { Client } from 'ssh2';
import * as core from '@actions/core';
import { createFullImageName } from './docker';

export async function deploy(packages: Set<string>): Promise<void> {
  const host = core.getInput('remote_host');
  const port = parseInt(core.getInput('ssh_port'), 10);
  const username = core.getInput('ssh_username');
  const privateKey = core.getInput('ssh_private_key');
  const password = core.getInput('ssh_password');
  const serviceName = core.getInput('service_name');
  if (!host || !serviceName || !(password || privateKey)) return;
  const conn = new Client();
  await new Promise<void>((resolve, reject) => {
    try {
      conn.connect({
        host,
        port,
        username,
        password,
        privateKey,
      });
      conn.on('ready', async () => {
        // eslint-disable-next-line no-restricted-syntax
        for (const packageDir of Array.from(packages)) {
          // eslint-disable-next-line no-await-in-loop
          await new Promise<void>((packageResolve, packageReject) => {
            const imageName = createFullImageName(packageDir);
            conn.exec(
              `docker service update --image ${imageName} ${serviceName}`,
              (err) => {
                if (err) {
                  packageReject(
                    new Error(`${imageName} deploy error: ${err.message}`),
                  );
                } else packageResolve();
              },
            );
          });
        }
        resolve();
      });
    } catch (e) {
      core.error(e);
      reject(e);
    }
  });
}
