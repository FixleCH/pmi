import chalk from 'chalk';
import { outdatedPackages } from '../../src/core/package.manager.command.js';

// * outdated — mostra pacchetti con versioni obsolete rispetto al registry

export async function outdatedCommand() {
  console.log(chalk.bold.yellow('\n  PMI Outdated — Pacchetti da aggiornare\n'));
  //? Esce con codice 1 se trova outdated — è comportamento atteso di npm/yarn
  await outdatedPackages();
  console.log();
}
