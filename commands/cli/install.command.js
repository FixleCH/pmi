import { npmProvider }      from '../../providers/npm.js';
import { yarnProvider }     from '../../providers/yarn.js';
import { composerProvider } from '../../providers/composer.js';
import { nodeProvider }     from '../../providers/node.js';
import { dockerProvider }   from '../../providers/docker.js';
import { config }           from '../../src/config/installer.cli.js';
import chalk from 'chalk';
import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';

// * ─────────────────────────────────────────────────────────────────
// * install — rileva lo stack del progetto e installa le dipendenze
// * Supporta: npm, yarn, composer. Auto-detect da file di lock/config.
// * ─────────────────────────────────────────────────────────────────

/** Verifica se esiste un file nel CWD */
function hasFile(name) {
  return fs.existsSync(path.join(process.cwd(), name));
}

export async function installCommand() {
  console.log(chalk.bold.blue('\n  PMI Install — Detecting project stack...\n'));

  //! Node.js è un prerequisito hard — senza di esso PMI stesso non girerebbe
  if (!nodeProvider.isInstalled()) {
    console.error(chalk.red('  ✘  Node.js non trovato. Installalo prima da https://nodejs.org'));
    process.exit(1);
  }

  const nodeVersion = nodeProvider.getVersion();
  const majorVersion = nodeProvider.getMajorVersion();
  console.log(chalk.green(`  ✔  Node.js ${nodeVersion} rilevato`));

  //? Avvisa se la versione di Node è inferiore al minimo richiesto
  if (majorVersion < config.minNodeVersion) {
    console.log(chalk.yellow(`  ⚠  Node ${majorVersion} < minimo richiesto (${config.minNodeVersion}). Aggiorna Node.`));
  }

  let installed = 0;

  // ─── npm ────────────────────────────────────────────────────────
  //? Preferiamo yarn se esiste yarn.lock, altrimenti npm se c'è package.json
  if (hasFile('package.json') && npmProvider.isInstalled()) {
    const pm = hasFile('yarn.lock') ? 'yarn' : 'npm';
    const provider = pm === 'yarn' ? yarnProvider : npmProvider;

    console.log(chalk.cyan(`\n  → Installazione con ${pm}...`));
    provider.installDependencies();
    installed++;
  }

  // ─── composer ───────────────────────────────────────────────────
  if (hasFile('composer.json') && composerProvider.isInstalled()) {
    console.log(chalk.cyan('\n  → Installazione con Composer...'));
    composerProvider.installDependencies();
    installed++;
  }

  // ─── Docker info ────────────────────────────────────────────────
  if (dockerProvider.isInstalled()) {
    const daemon = dockerProvider.isDaemonRunning();
    const icon   = daemon ? chalk.green('✔') : chalk.yellow('⚠');
    const status = daemon ? 'daemon in esecuzione' : 'daemon non avviato';
    console.log(`\n  ${icon}  Docker rilevato — ${status}`);
  }

  if (installed === 0) {
    console.log(chalk.yellow('\n  Nessun file di progetto trovato (package.json / composer.json)'));
    console.log(chalk.gray('  Assicurati di essere nella cartella del progetto.\n'));
    return;
  }

  console.log(chalk.bold.green(`\n  ✔  Installazione completata (${installed} package manager).\n`));
}
