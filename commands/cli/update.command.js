import chalk from 'chalk';
import { updatePackages } from '../../src/core/package.manager.command.js';

// * update — aggiorna le dipendenze di tutti i PM rilevati

export async function updateCommand() {
  console.log(chalk.bold.yellow('\n  PMI Update — Aggiornamento dipendenze...\n'));
  await updatePackages();
  console.log(chalk.bold.green('\n  ✔  Aggiornamento completato.\n'));
}
