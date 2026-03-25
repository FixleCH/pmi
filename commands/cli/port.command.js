import chalk from 'chalk';
import { dockerProvider } from '../../providers/docker.js';
import inquirer from 'inquirer';

// * port — mostra le port mapping di un container specifico

export async function portCommand(args = []) {
  if (!dockerProvider.isInstalled() || !dockerProvider.isDaemonRunning()) {
    console.log(chalk.red('  ✘  Docker daemon non in esecuzione.'));
    return;
  }

  let target = args[0];

  if (!target) {
    //? Mostriamo i container attivi per aiutare la selezione
    const running = dockerProvider.listContainers(false);
    console.log(chalk.bold.cyan('\n  PMI Port\n'));
    if (running) console.log(running + '\n');

    const { name } = await inquirer.prompt([{
      type: 'input',
      name: 'name',
      message: 'Nome o ID container:',
    }]);
    target = name;
  }

  if (!target) { console.log(chalk.yellow('  Nessun container specificato.\n')); return; }

  console.log(chalk.bold.cyan(`\n  PMI Port — ${target}\n`));
  const ports = dockerProvider.getPorts(target);
  if (ports) {
    console.log(ports);
  } else {
    console.log(chalk.gray('  Nessuna porta esposta o container non trovato.'));
  }
  console.log();
}
