import chalk from 'chalk';
import { execSync } from 'child_process';
import inquirer from 'inquirer';
import path from 'path';
import { fileURLToPath } from 'url';

// * ─────────────────────────────────────────────────────────────────
// * uninstall — rimuove il link globale di PMI dal sistema
// * Usa npm unlink per rimuovere il symlink globale creato da npm link
// * ─────────────────────────────────────────────────────────────────

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PMI_ROOT  = path.resolve(__dirname, '..', '..', '..');

export async function uninstallCommand() {
  console.log(chalk.bold.red('\n  PMI Uninstall\n'));

  //! Chiediamo conferma prima di procedere — azione irreversibile
  const { confirm } = await inquirer.prompt([{
    type: 'confirm',
    name: 'confirm',
    message: 'Sei sicuro di voler rimuovere PMI dal sistema?',
    default: false,
  }]);

  if (!confirm) {
    console.log(chalk.gray('\n  Operazione annullata.\n'));
    return;
  }

  try {
    //? npm unlink rimuove il symlink globale — il codice sorgente rimane intatto
    console.log(chalk.cyan('  → npm unlink...'));
    execSync('npm unlink', { stdio: 'inherit', cwd: PMI_ROOT });
    console.log(chalk.bold.green('\n  ✔  PMI rimosso dal sistema.'));
    console.log(chalk.gray('     Il codice sorgente è ancora in: ' + PMI_ROOT));
    console.log(chalk.gray('     Per reinstallare: cd ' + PMI_ROOT + ' && npm link\n'));
  } catch (err) {
    console.error(chalk.red(`\n  ✘  Uninstall fallito: ${err.message}\n`));
  }
}
