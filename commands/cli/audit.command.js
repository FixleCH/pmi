import chalk from 'chalk';
import { auditPackages } from '../../src/core/package.manager.command.js';

// * ─────────────────────────────────────────────────────────────────
// * audit — controlla vulnerabilità di sicurezza nelle dipendenze
// * Usa npm audit e/o composer audit a seconda dello stack
// * ─────────────────────────────────────────────────────────────────

export async function auditCommand() {
  //! Questo comando può produrre output lungo — non è un errore
  console.log(chalk.bold.red('\n  PMI Audit — Security vulnerability scan\n'));
  await auditPackages();
  console.log(chalk.gray('\n  Per correggere automaticamente: npm audit fix\n'));
}
