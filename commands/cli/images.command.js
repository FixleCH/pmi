import chalk from 'chalk';
import { dockerProvider } from '../../providers/docker.js';

// * images — lista tutte le immagini Docker locali con tag e dimensione

export async function imagesCommand() {
  if (!dockerProvider.isInstalled() || !dockerProvider.isDaemonRunning()) {
    console.log(chalk.red('  ✘  Docker daemon non in esecuzione.'));
    return;
  }

  console.log(chalk.bold.cyan('\n  PMI Images — Immagini Docker locali\n'));

  const output = dockerProvider.listImages();
  if (output) {
    console.log(output);
    //? Mostriamo anche l'uso del disco
    console.log();
    const usage = dockerProvider.getDiskUsage();
    if (usage) console.log(usage);
  } else {
    console.log(chalk.gray('  Nessuna immagine trovata.'));
  }
  console.log();
}
