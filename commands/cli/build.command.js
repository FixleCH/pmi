import chalk from 'chalk';
import { dockerProvider } from '../../providers/docker.js';
import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';

// * ─────────────────────────────────────────────────────────────────
// * build — esegue il build dell'immagine Docker
// * Con compose: docker compose build; senza: docker build
// * ─────────────────────────────────────────────────────────────────

export async function buildCommand(args = []) {
  if (!dockerProvider.isInstalled() || !dockerProvider.isDaemonRunning()) {
    console.log(chalk.red('  ✘  Docker daemon non in esecuzione.'));
    return;
  }

  const noCache   = args.includes('--no-cache');
  const isCompose = fs.existsSync(path.join(process.cwd(), 'docker-compose.yml')) &&
                    dockerProvider.hasCompose();
  const service   = args.find(a => !a.startsWith('-'));

  if (isCompose) {
    console.log(chalk.bold.cyan(`\n  PMI Build — docker compose build ${service || ''}${noCache ? ' --no-cache' : ''}\n`));
    dockerProvider.composeBuild(service, noCache);
  } else {
    //? Fallback: docker build diretto se non c'è compose
    const tag = (await inquirer.prompt([{
      type: 'input',
      name: 'tag',
      message: 'Tag dell\'immagine (es. myapp:latest):',
      default: 'myapp:latest',
    }])).tag;

    console.log(chalk.bold.cyan(`\n  PMI Build — docker build -t ${tag}\n`));
    dockerProvider.buildImage(tag);
  }

  console.log(chalk.bold.green('\n  ✔  Build completato.\n'));
}
