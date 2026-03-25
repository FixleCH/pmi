import { execSync } from 'child_process';
import chalk from 'chalk';

// * ─────────────────────────────────────────────────────────────────
// * version.command — rileva le versioni REALI degli strumenti
// * Ogni tool viene controllato in isolamento: un fallimento
// * non interrompe il controllo degli altri
// * ─────────────────────────────────────────────────────────────────

/**
 * Prova a eseguire un comando e ritorna la prima riga dell'output.
 * @param {string} cmd
 * @returns {{ ok: boolean, value: string }}
 */
function tryExec(cmd) {
  try {
    const out = execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    return { ok: true, value: out.split('\n')[0].trim() };
  } catch {
    return { ok: false, value: null };
  }
}

/**
 * Stampa una riga formattata con stato e versione.
 * @param {string} name   - nome dello strumento
 * @param {boolean} ok    - installato?
 * @param {string} value  - versione rilevata
 */
function printRow(name, ok, value) {
  const icon    = ok ? chalk.green('✔') : chalk.red('✘');
  const label   = chalk.bold(name.padEnd(12));
  const version = ok ? chalk.cyan(value) : chalk.red('non trovato');
  console.log(`  ${icon}  ${label} ${version}`);
}

// * Mappa degli strumenti da rilevare: nome → comando di versione
const TOOLS = [
  { name: 'Node.js',   cmd: 'node -v' },
  { name: 'NPM',       cmd: 'npm -v' },
  { name: 'Yarn',      cmd: 'yarn -v' },
  { name: 'Bun',       cmd: 'bun -v' },
  { name: 'PHP',       cmd: 'php -r "echo PHP_VERSION;"' },
  { name: 'Composer',  cmd: 'composer --version 2>/dev/null | awk \'{print $3}\'' },
  { name: 'Python',    cmd: 'python3 --version' },
  { name: 'pip',       cmd: 'pip3 --version' },
  { name: 'Go',        cmd: 'go version' },
  { name: 'Rust',      cmd: 'rustc --version' },
  { name: 'Docker',    cmd: 'docker --version' },
  { name: 'Compose',   cmd: 'docker compose version --short 2>/dev/null || docker-compose --version' },
  { name: 'Git',       cmd: 'git --version' },
  { name: 'Make',      cmd: 'make --version | head -1' },
  { name: 'curl',      cmd: 'curl --version | head -1' },
];

export function printEnvironment() {
  console.log();
  console.log(chalk.bold.blue('  ┌─ PMI Environment Scan ─────────────────────────┐'));
  console.log();
  let found = 0;
  for (const tool of TOOLS) {
    const { ok, value } = tryExec(tool.cmd);
    printRow(tool.name, ok, value);
    if (ok) found++;
  }
  console.log();
  console.log(chalk.bold.blue(`  └─ ${found}/${TOOLS.length} tools rilevati ───────────────────────────┘`));
  console.log();
}
