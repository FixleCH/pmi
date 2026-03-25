import chalk from 'chalk';
import { dockerProvider } from '../../providers/docker.js';
import inquirer from 'inquirer';

// * ─────────────────────────────────────────────────────────────────
// * prune — pulizia selettiva o completa delle risorse Docker
// * ─────────────────────────────────────────────────────────────────

export async function pruneCommand(args = []) {
  if (!dockerProvider.isInstalled() || !dockerProvider.isDaemonRunning()) {
    console.log(chalk.red('  ✘  Docker daemon non in esecuzione.'));
    return;
  }

  console.log(chalk.bold.red('\n  PMI Prune — Pulizia risorse Docker\n'));

  //? Mostriamo prima quanto spazio è occupato
  const usage = dockerProvider.getDiskUsage();
  if (usage) {
    console.log(usage);
    console.log();
  }

  const { scope } = await inquirer.prompt([{
    type: 'list',
    name: 'scope',
    message: 'Cosa vuoi rimuovere?',
    choices: [
      { name: 'Container fermati',              value: 'containers' },
      { name: 'Immagini dangling (senza tag)',   value: 'images' },
      { name: 'Tutte le immagini non usate',    value: 'images-all' },
      { name: 'Volumi non montati',             value: 'volumes' },
      { name: 'Tutto (system prune)',           value: 'system' },
      { name: 'Tutto in modo aggressivo (-a)',  value: 'system-all' },
    ],
  }]);

  //! Conferma extra per le operazioni distruttive
  const { confirm } = await inquirer.prompt([{
    type: 'confirm',
    name: 'confirm',
    message: chalk.red('Questa operazione è irreversibile. Continuare?'),
    default: false,
  }]);

  if (!confirm) { console.log(chalk.gray('\n  Operazione annullata.\n')); return; }

  switch (scope) {
    case 'containers':  dockerProvider.pruneContainers(); break;
    case 'images':      dockerProvider.pruneImages(false); break;
    case 'images-all':  dockerProvider.pruneImages(true); break;
    case 'volumes':     dockerProvider.pruneVolumes(); break;
    case 'system':      dockerProvider.pruneSystem(false); break;
    case 'system-all':  dockerProvider.pruneSystem(true); break;
  }

  console.log();
  //? Mostriamo lo spazio dopo la pulizia
  const usageAfter = dockerProvider.getDiskUsage();
  if (usageAfter) console.log(usageAfter);
  console.log(chalk.bold.green('\n  ✔  Pulizia completata.\n'));
}
