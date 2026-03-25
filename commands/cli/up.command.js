import chalk from 'chalk';
import { dockerProvider } from '../../providers/docker.js';
import fs from 'fs';
import path from 'path';

// * up — avvia i servizi Docker Compose (--build -d)

export async function upCommand(args = []) {
  if (!dockerProvider.isInstalled() || !dockerProvider.isDaemonRunning()) {
    console.log(chalk.red('  ✘  Docker daemon non in esecuzione.'));
    return;
  }

  if (!fs.existsSync(path.join(process.cwd(), 'docker-compose.yml'))) {
    console.log(chalk.yellow('  ⚠  Nessun docker-compose.yml trovato.'));
    console.log(chalk.gray('     Esegui prima: pmi dockerize\n'));
    return;
  }

  if (!dockerProvider.hasCompose()) {
    console.log(chalk.red('  ✘  docker compose non trovato. Installa Docker Compose.'));
    return;
  }

  const detach = !args.includes('--no-detach');
  console.log(chalk.bold.cyan(`\n  PMI Up — docker compose up --build${detach ? ' -d' : ''}\n`));
  dockerProvider.composeUp(detach);
  console.log(chalk.bold.green('\n  ✔  Servizi avviati.\n'));
  if (detach) console.log(chalk.gray('  Usa "pmi logs" per vedere i log, "pmi ps" per lo stato.\n'));
}
