import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { config } from '../../src/config/installer.cli.js';
import { npmProvider }  from '../../providers/npm.js';
import { yarnProvider } from '../../providers/yarn.js';
import { composerProvider } from '../../providers/composer.js';

// * ─────────────────────────────────────────────────────────────────
// * clean — pulizia completa del progetto
// * Rimuove: node_modules, vendor, cache npm/yarn/composer, dist, build
// * ─────────────────────────────────────────────────────────────────

/** Calcola la dimensione di una directory in MB */
function getDirSizeMB(dirPath) {
  try {
    const output = execSync(`du -sm "${dirPath}" 2>/dev/null | awk '{print $1}'`, { encoding: 'utf8' });
    return parseInt(output.trim()) || 0;
  } catch {
    return 0;
  }
}

export async function cleanCommand() {
  console.log(chalk.bold.yellow('\n  PMI Clean — Pulizia progetto\n'));

  let totalMB = 0;

  // ─── Rimozione cartelle di build/dipendenze ──────────────────────
  for (const dir of config.cleanTargets) {
    const fullPath = path.join(process.cwd(), dir);
    if (fs.existsSync(fullPath)) {
      const sizeMB = getDirSizeMB(fullPath);
      process.stdout.write(chalk.gray(`  Removing ${dir.padEnd(20)}`));
      fs.rmSync(fullPath, { recursive: true, force: true });
      totalMB += sizeMB;
      console.log(chalk.green(`✔  (-${sizeMB} MB)`));
    }
  }

  // ─── Cache npm ──────────────────────────────────────────────────
  if (npmProvider.isInstalled()) {
    process.stdout.write(chalk.gray('  Cleaning npm cache        '));
    try {
      npmProvider.clearCache();
      console.log(chalk.green('✔'));
    } catch {
      console.log(chalk.red('✘  (fallito)'));
    }
  }

  // ─── Cache yarn ─────────────────────────────────────────────────
  if (yarnProvider.isInstalled()) {
    process.stdout.write(chalk.gray('  Cleaning yarn cache       '));
    try {
      yarnProvider.clearCache();
      console.log(chalk.green('✔'));
    } catch {
      console.log(chalk.red('✘  (fallito)'));
    }
  }

  // ─── Cache composer ─────────────────────────────────────────────
  if (composerProvider.isInstalled()) {
    process.stdout.write(chalk.gray('  Cleaning composer cache   '));
    try {
      composerProvider.clearCache();
      console.log(chalk.green('✔'));
    } catch {
      console.log(chalk.red('✘  (fallito)'));
    }
  }

  console.log(chalk.bold.green(`\n  ✔  Clean completato! Spazio liberato: ~${totalMB} MB\n`));
}
