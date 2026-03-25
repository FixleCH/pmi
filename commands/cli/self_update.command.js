import chalk from 'chalk';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// * ─────────────────────────────────────────────────────────────────
// * self-update — aggiorna PMI alla versione più recente tramite git
// * Funziona solo se PMI è installato da un clone git locale
// * ─────────────────────────────────────────────────────────────────

const __dirname = path.dirname(fileURLToPath(import.meta.url));
//? La root del progetto PMI è due livelli sopra commands/cli/
const PMI_ROOT  = path.resolve(__dirname, '..', '..', '..');

export async function selfUpdateCommand() {
  console.log(chalk.bold.cyan('\n  PMI Self-Update\n'));

  //? Verifichiamo di essere in un repository git
  const isGitRepo = fs.existsSync(path.join(PMI_ROOT, '.git'));
  if (!isGitRepo) {
    console.log(chalk.yellow('  ⚠  PMI non è stato installato tramite git clone.'));
    console.log(chalk.gray('     Per aggiornare: npm install -g pmi (se pubblicato su npm)\n'));
    return;
  }

  try {
    //? Mostra la versione corrente prima dell'update
    const currentCommit = execSync('git rev-parse --short HEAD', {
      encoding: 'utf8', cwd: PMI_ROOT
    }).trim();
    console.log(chalk.gray(`  Versione corrente: ${currentCommit}`));

    //! git pull potrebbe fallire se ci sono modifiche locali non committate
    console.log(chalk.cyan('  → git pull origin main...'));
    execSync('git pull origin main', { stdio: 'inherit', cwd: PMI_ROOT });

    //? Reinstalla le dipendenze in caso siano cambiate
    console.log(chalk.cyan('\n  → npm install...'));
    execSync('npm install', { stdio: 'inherit', cwd: PMI_ROOT });

    const newCommit = execSync('git rev-parse --short HEAD', {
      encoding: 'utf8', cwd: PMI_ROOT
    }).trim();

    if (currentCommit !== newCommit) {
      console.log(chalk.bold.green(`\n  ✔  Aggiornato: ${currentCommit} → ${newCommit}\n`));
    } else {
      console.log(chalk.bold.green('\n  ✔  PMI è già all\'ultima versione.\n'));
    }
  } catch (err) {
    console.error(chalk.red(`\n  ✘  Self-update fallito: ${err.message}`));
    console.error(chalk.gray('     Prova: cd /percorso/pmi && git pull && npm install\n'));
  }
}
