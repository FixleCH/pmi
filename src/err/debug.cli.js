import chalk from 'chalk';

// * ─────────────────────────────────────────────────────────────────
// * Debug CLI — sistema di logging con livelli
// * Attivare debug con: PMI_DEBUG=true pmi <cmd>  o  pmi <cmd> --debug
// * ─────────────────────────────────────────────────────────────────

export function logDebug(msg) {
  //? Visibile solo con PMI_DEBUG=true — non mostrare mai in produzione
  if (process.env.PMI_DEBUG === 'true') {
    console.log(chalk.gray(`[DEBUG] ${msg}`));
  }
}

export function logInfo(msg) {
  console.log(chalk.blue(`[INFO]  ${msg}`));
}

export function logWarn(msg) {
  console.warn(chalk.yellow(`[WARN]  ${msg}`));
}

export function logError(msg) {
  //! Usare per errori non fatali — per errori fatali usare handleCommandError
  console.error(chalk.red(`[ERROR] ${msg}`));
}

export function logSuccess(msg) {
  console.log(chalk.green(`[OK]    ${msg}`));
}
