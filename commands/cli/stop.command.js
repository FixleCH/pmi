import chalk from 'chalk';
import { dockerProvider } from '../../providers/docker.js';
import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';

// * stop — ferma container Docker o servizi compose

export async function stopCommand(args = []) {
  if (!dockerProvider.isInstalled() || !dockerProvider.isDaemonRunning()) {
    console.log(chalk.red('  ✘  Docker daemon non in esecuzione.'));
    return;
  }

  const isCompose = fs.existsSync(path.join(process.cwd(), 'docker-compose.yml')) &&
                    dockerProvider.hasCompose();
  const target = args[0];

  if (isCompose && !target) {
    //! Fermiamo tutti i servizi compose nella directory corrente
    console.log(chalk.bold.yellow('\n  PMI Stop — Fermando tutti i servizi compose...\n'));
    dockerProvider.composeDown(false);
    console.log(chalk.bold.green('\n  ✔  Servizi fermati.\n'));
  } else {
    const name = target || (await inquirer.prompt([{
      type: 'input',
      name: 'name',
      message: 'Nome o ID container da fermare:',
    }])).name;

    console.log(chalk.bold.yellow(`\n  PMI Stop — Fermando ${name}...\n`));
    dockerProvider.stopContainer(name);
    console.log(chalk.bold.green(`\n  ✔  Container ${name} fermato.\n`));
  }
}
