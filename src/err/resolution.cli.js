import chalk from 'chalk';

// * ─────────────────────────────────────────────────────────────────
// * Resolution CLI — gestione centralizzata degli errori fatali
// * ─────────────────────────────────────────────────────────────────

export function handleCommandError(error, commandName) {
  console.error(chalk.red(`\n  ✘  Comando "${commandName}" fallito: ${error.message}`));

  //? In modalità debug mostriamo lo stack completo
  if (process.env.PMI_DEBUG === 'true') {
    console.error(chalk.gray(error.stack));
  }

  //! suggerimenti contestuali in base al tipo di errore
  if (error.message.includes('EACCES') || error.message.includes('permission')) {
    console.error(chalk.yellow('  →  Prova con sudo o controlla i permessi della directory.'));
  } else if (error.message.includes('command not found') || error.message.includes('ENOENT')) {
    console.error(chalk.yellow(`  →  Strumento non trovato. Esegui "pmi doctor" per diagnosticare.`));
  } else if (error.message.includes('ECONNREFUSED') || error.message.includes('docker')) {
    console.error(chalk.yellow('  →  Docker daemon non raggiungibile. Avvia Docker e riprova.'));
  }

  process.exit(1);
}
