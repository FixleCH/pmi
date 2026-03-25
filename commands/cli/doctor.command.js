import chalk from 'chalk';
import { printEnvironment } from '../../src/core/version.command.js';

// * ─────────────────────────────────────────────────────────────────
// * doctor — diagnosi REALE dell'ambiente di sviluppo
// * Rileva versioni effettive con execSync, non valori hardcoded
// * ─────────────────────────────────────────────────────────────────

export async function doctorCommand() {
  console.log(chalk.bold.cyan('\n  PMI Doctor — Scanning environment...\n'));
  printEnvironment();
  console.log(chalk.bold.green('  Diagnosis complete!'));
  console.log(chalk.gray('  Per dettagli sistema esegui: pmi sys\n'));
}
