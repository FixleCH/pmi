import chalk from 'chalk';
import { dockerProvider } from '../../providers/docker.js';
import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';

// * restart — riavvia container o servizi compose

export async function restartCommand(args = []) {
  if (!dockerProvider.isInstalled() || !dockerProvider.isDaemonRunning()) {
    console.log(chalk.red('  ✘  Docker daemon non in esecuzione.'));
    return;
  }

  const isCompose = fs.existsSync(path.join(process.cwd(), 'docker-compose.yml')) &&
                    dockerProvider.hasCompose();
  const target = args[0];

  if (isCompose) {
    const service = target || '';
    console.log(chalk.bold.cyan(`\n  PMI Restart — ${service || 'tutti i servizi'}...\n`));
    dockerProvider.composeRestart(service);
  } else {
    const name = target || (await inquirer.prompt([{
      type: 'input',
      name: 'name',
      message: 'Nome o ID container da riavviare:',
    }])).name;
    console.log(chalk.bold.cyan(`\n  PMI Restart — ${name}...\n`));
    dockerProvider.restartContainer(name);
  }

  console.log(chalk.bold.green('\n  ✔  Restart completato.\n'));
}
