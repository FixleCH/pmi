import chalk from 'chalk';

// * ─────────────────────────────────────────────────────────────────
// * System CLI — validazione provider e suggerimenti fix
// * ─────────────────────────────────────────────────────────────────

export function checkProvider(provider, providerName) {
  //! Lancia se il provider è malformato — errore di programmazione, non utente
  if (!provider || typeof provider.isInstalled !== 'function') {
    throw new Error(`Provider "${providerName}" non disponibile o metodo isInstalled mancante`);
  }
}

export function suggestFix(toolName) {
  const fixes = {
    'docker':   'Installa Docker Desktop da https://www.docker.com/products/docker-desktop',
    'node':     'Installa Node.js da https://nodejs.org o usa nvm',
    'npm':      'NPM viene incluso con Node.js. Reinstalla Node.',
    'yarn':     'Installa Yarn con: npm install -g yarn',
    'composer': 'Installa Composer da https://getcomposer.org',
    'php':      'Installa PHP dal tuo package manager (brew, apt, ecc.)',
    'git':      'Installa Git da https://git-scm.com',
  };
  const suggestion = fixes[toolName.toLowerCase()] || `Verifica che "${toolName}" sia installato e nel PATH.`;
  console.log(chalk.yellow(`  →  ${suggestion}`));
}
