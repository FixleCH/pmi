import chalk from 'chalk';
import { execSync } from 'child_process';

// * ─────────────────────────────────────────────────────────────────
// * env — mostra variabili d'ambiente rilevanti per lo sviluppo
// * Filtra le variabili PATH, NODE_*, NPM_*, DOCKER_* e simili
// * ─────────────────────────────────────────────────────────────────

export async function envCommand() {
  console.log(chalk.bold.magenta('\n  PMI — Environment Variables\n'));

  //? Pattern di variabili rilevanti per lo sviluppo
  const RELEVANT_PATTERNS = [
    /^PATH$/,
    /^NODE/,
    /^NPM/,
    /^YARN/,
    /^PHP/,
    /^COMPOSER/,
    /^DOCKER/,
    /^HOME$/,
    /^USER$/,
    /^SHELL$/,
    /^LANG$/,
    /^CI$/,
    /^PMI_/,
  ];

  const entries = Object.entries(process.env)
    .filter(([key]) => RELEVANT_PATTERNS.some(p => p.test(key)))
    .sort(([a], [b]) => a.localeCompare(b));

  for (const [key, value] of entries) {
    const k = chalk.cyan(key.padEnd(24));
    //! Tronchiamo PATH perché può essere molto lungo
    const v = key === 'PATH'
      ? value.split(':').join('\n' + ' '.repeat(26))
      : value;
    console.log(`  ${k} ${v}`);
  }

  //? Mostriamo anche la working directory e il progetto corrente
  console.log();
  console.log(`  ${chalk.cyan('CWD'.padEnd(24))} ${process.cwd()}`);

  try {
    const gitBranch = execSync('git rev-parse --abbrev-ref HEAD 2>/dev/null', { encoding: 'utf8' }).trim();
    console.log(`  ${chalk.cyan('GIT_BRANCH'.padEnd(24))} ${gitBranch}`);
  } catch { /* non è una repo git */ }

  console.log();
}
