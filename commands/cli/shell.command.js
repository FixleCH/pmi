import chalk from 'chalk';
import { dockerProvider } from '../../providers/docker.js';
import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';

// * ─────────────────────────────────────────────────────────────────
// * shell — apre una shell interattiva in un container
// * Prova /bin/bash, poi sh come fallback
// * ─────────────────────────────────────────────────────────────────

export async function shellCommand(args = []) {
  if (!dockerProvider.isInstalled() || !dockerProvider.isDaemonRunning()) {
    console.log(chalk.red('  ✘  Docker daemon non in esecuzione.'));
    return;
  }

  const isCompose = fs.existsSync(path.join(process.cwd(), 'docker-compose.yml')) &&
                    dockerProvider.hasCompose();

  let target = args[0];
  //? Supporta shell custom: pmi shell mycontainer bash
  let shell = args[1] || 'sh';

  if (!target) {
    const containers = dockerProvider.listContainers(false);
    console.log(chalk.bold.cyan('\n  PMI Shell\n'));
    if (containers) console.log(containers + '\n');

    const { name } = await inquirer.prompt([{
      type: 'input',
      name: 'name',
      message: `Nome/ID container${isCompose ? ' o servizio compose' : ''}:`,
    }]);
    target = name;
  }

  if (!target) { console.log(chalk.yellow('  Nessun target specificato.\n')); return; }

  console.log(chalk.bold.cyan(`\n  PMI Shell → ${target} (${shell})\n`));
  console.log(chalk.gray('  Digita "exit" per uscire dalla shell del container.\n'));

  if (isCompose) {
    dockerProvider.composeExec(target, shell);
  } else {
    dockerProvider.execShell(target, shell);
  }
}
