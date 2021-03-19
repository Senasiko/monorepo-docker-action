import { Client } from 'ssh2';
import * as core from '@actions/core';
import { createFullImageName } from './docker';
import { getPackageJson } from './packages';

interface SwarmOptions {
  name?: string;
  port?: string;
}

function getSwarmOptions(packageDir: string): SwarmOptions {
  const packageJson = getPackageJson(packageDir);
  return packageJson.swarmOptions as SwarmOptions ?? {};
}

async function getExistServices(conn: Client): Promise<Set<string>> {
  const services = new Set<string>();
  return new Promise((resolve, reject) => {
    conn.exec('docker service ls', (err, stream) => {
      if (err) {
        core.error(err);
        reject(new Error('docker service ls error'));
      } else {
        let result = '';
        stream
          .on('data', (data: string | Buffer) => {
            if (typeof data === 'string') result += data;
            else result += data.toString('utf8');
          })
          .on('exit', (exitCode) => {
            if (exitCode !== 0) {
              const error = new Error(`docker service ls error ${exitCode}`)
              core.error(error)
              reject(error);
            } else {
              result.split('\n').map((row) => row.split(/\s+/)[1]).forEach((service) => service && services.add(service))
              resolve(services);
            }
          })
      }
    })
  })
}

async function deployPackage(
  conn: Client,
  services: Set<string>,
  packageDir: string,
): Promise<void> {
  const networkName = core.getInput('network_name');
  return new Promise((resolve, reject) => {
    const registry = core.getInput('registry');
    const options = getSwarmOptions(packageDir);
    const serviceName = options.name ?? packageDir;
    options.name = serviceName;
    core.info(`${serviceName} is existed？${services.has(serviceName)}`)
    let command = '';
    if (services.has(serviceName)) {
      command = `docker service update --image ${registry}/${createFullImageName(packageDir)} ${serviceName}`;
    } else {
      const args = Object.entries(options).map(([key, value]) => `--${key} ${value}`).join(' ')
      command = `docker service create --restart-condition none -e MODE=swarm --network ${networkName} ${args} ${registry}/${createFullImageName(packageDir)} `
    }
    conn.exec(
      command,
      (err, stream) => {
        if (err) {
          core.error(err);
          reject(
            new Error(`${packageDir} service ${command} error: ${err.message}`),
          );
        } else {
          stream
            .on('exit', (exitCode) => {
              if (exitCode !== 0) {
                const error = new Error(`docker service ${packageDir} deploy error ${exitCode}`)
                core.error(error)
                reject(error);
              } else {
                core.info(`${packageDir} deploy success`)
                resolve();
              }
            })
            .on('data', (data: string | Buffer) => {
              core.info(data.toString('utf8'))
            })
            .stderr.on('data', (data) => {
              core.error(data.toString('utf8'))
            });
        }
      },
    );
  })
}

export async function deploy(packages: Set<string>): Promise<void> {
  const host = core.getInput('remote_host');
  const port = parseInt(core.getInput('ssh_port'), 10);
  const username = core.getInput('ssh_username');
  const privateKey = core.getInput('ssh_private_key');
  const password = core.getInput('ssh_password');
  const networkName = core.getInput('network_name');
  if (!host || !networkName || !(password || privateKey)) return;
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
        try {
          const services = await getExistServices(conn);
          core.info(Array.from(services).join(', '))
          // eslint-disable-next-line no-restricted-syntax
          for (const packageDir of Array.from(packages)) {
            await deployPackage(conn, services, packageDir)
          }
          conn.end();
          resolve();
        } catch (e) {
          reject(e);
        }
      });
    } catch (e) {
      core.error(e);
      reject(e);
    }
  });
}
