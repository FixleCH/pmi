import chalk from 'chalk';
import { dockerProvider } from '../../providers/docker.js';
import fs from 'fs';
import path from 'path';

// * ─────────────────────────────────────────────────────────────────
// * ps — lista container Docker (attivi o tutti)
// * Se docker-compose.yml esiste usa compose ps in aggiunta
// * ─────────────────────────────────────────────────────────────────

export async function psCommand(args = []) {
  const showAll = args.includes('-a') || args.includes('--all');

  if (!dockerProvider.isInstalled()) {
    console.log(chalk.red('  ✘  Docker non trovato. Installalo da https://www.docker.com'));
    return;
  }

  if (!dockerProvider.isDaemonRunning()) {
    console.log(chalk.red('  ✘  Docker daemon non in esecuzione. Avvia Docker e riprova.'));
    return;
  }

  console.log(chalk.bold.cyan(`\n  PMI PS — Container ${showAll ? '(tutti)' : 'in esecuzione'}\n`));

  //? Se siamo in un progetto compose, mostriamo prima lo stato dei servizi
  const isCompose = fs.existsSync(path.join(process.cwd(), 'docker-compose.yml')) &&
                    dockerProvider.hasCompose();

  if (isCompose) {
    console.log(chalk.bold('  ─── Servizi Compose ─────────────────────────────'));
    const composePs = dockerProvider.composePs();
    if (composePs) console.log(composePs);
    console.log(chalk.bold('\n  ─── Tutti i Container ───────────────────────────'));
  }

  const output = dockerProvider.listContainers(showAll);
  if (output) {
    console.log(output);
  } else {
    console.log(chalk.gray('  Nessun container trovato.'));
  }

  //? Mostriamo anche l'uso disco Docker
  const disk = dockerProvider.getDiskUsage();
  if (disk) {
    console.log(chalk.bold('\n  ─── Docker Disk Usage ───────────────────────────'));
    console.log(disk);
  }

  console.log();
}
