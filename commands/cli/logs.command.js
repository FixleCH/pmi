import chalk from 'chalk';
import { dockerProvider } from '../../providers/docker.js';
import inquirer from 'inquirer';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// * ─────────────────────────────────────────────────────────────────
// * logs — mostra i log di un container o servizio compose
// * Uso: pmi logs [container] [--tail=N] [--follow]
// * ─────────────────────────────────────────────────────────────────

export async function logsCommand(args = []) {
  if (!dockerProvider.isInstalled() || !dockerProvider.isDaemonRunning()) {
    console.log(chalk.red('  ✘  Docker daemon non in esecuzione.'));
    return;
  }

  //? Parsing flags
  const follow = args.includes('-f') || args.includes('--follow');
  const tailArg = args.find(a => a.startsWith('--tail='));
  const tail = tailArg ? parseInt(tailArg.split('=')[1]) : 100;
  const nameArg = args.find(a => !a.startsWith('-'));

  const isCompose = fs.existsSync(path.join(process.cwd(), 'docker-compose.yml')) &&
                    dockerProvider.hasCompose();

  let target = nameArg;

  if (!target) {
    //? Se siamo in un progetto compose, offriamo la lista dei servizi
    if (isCompose) {
      try {
        const psOutput = dockerProvider.composePs();
        console.log(chalk.bold.cyan('\n  PMI Logs — Seleziona un servizio:\n'));
        console.log(psOutput || '  (nessun servizio attivo)');
        const { service } = await inquirer.prompt([{
          type: 'input',
          name: 'service',
          message: 'Nome del servizio (vuoto per tutti):',
          default: '',
        }]);
        target = service;
      } catch { /* fallback a docker ps */ }
    } else {
      //? Lista container globali e chiediamo quale
      const containers = dockerProvider.listContainers(false);
      console.log(chalk.bold.cyan('\n  PMI Logs\n'));
      if (containers) console.log(containers);
      const { name } = await inquirer.prompt([{
        type: 'input',
        name: 'name',
        message: 'Nome o ID container:',
      }]);
      target = name;
    }
  }

  if (!target && !isCompose) {
    console.log(chalk.yellow('  Nessun container selezionato.\n'));
    return;
  }

  console.log(chalk.bold.cyan(`\n  PMI Logs — ${target || 'tutti i servizi'} (--tail=${tail}${follow ? ', --follow' : ''})\n`));

  if (isCompose) {
    dockerProvider.composeLogs(target, tail, follow);
  } else {
    dockerProvider.getLogs(target, tail, follow);
  }
}
