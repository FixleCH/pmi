import chalk from 'chalk';
import { dockerProvider } from '../../providers/docker.js';
import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';

// * down — ferma e rimuove i servizi Docker Compose

export async function downCommand(args = []) {
  if (!dockerProvider.isInstalled() || !dockerProvider.isDaemonRunning()) {
    console.log(chalk.red('  ✘  Docker daemon non in esecuzione.'));
    return;
  }

  let removeVolumes = args.includes('-v') || args.includes('--volumes');

  if (!removeVolumes) {
    const { confirm } = await inquirer.prompt([{
      type: 'confirm',
      name: 'confirm',
      //! Rimuovere volumi cancella i dati persistenti — default false
      message: 'Rimuovere anche i volumi? (ATTENZIONE: cancella i dati)',
      default: false,
    }]);
    removeVolumes = confirm;
  }

  console.log(chalk.bold.yellow(`\n  PMI Down${removeVolumes ? ' (con volumi)' : ''}...\n`));
  dockerProvider.composeDown(removeVolumes);
  console.log(chalk.bold.green('\n  ✔  Servizi fermati e rimossi.\n'));
}
