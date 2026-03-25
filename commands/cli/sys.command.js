import chalk from 'chalk';
import os from 'os';
import { execSync } from 'child_process';

// * ─────────────────────────────────────────────────────────────────
// * sys — informazioni sul sistema operativo e hardware
// * Mostra: OS, kernel, arch, CPU, RAM, disco, uptime
// * ─────────────────────────────────────────────────────────────────

/** Converte bytes in formato leggibile */
function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
}

/** Converte secondi in h/m/s */
function formatUptime(seconds) {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${d > 0 ? d + 'd ' : ''}${h}h ${m}m`;
}

/** Esegue un comando e ritorna l'output o null */
function tryExec(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return null;
  }
}

export async function sysCommand() {
  console.log(chalk.bold.blue('\n  PMI SYS — System Information\n'));

  const row = (label, value) => {
    if (!value) return;
    console.log(`  ${chalk.cyan(label.padEnd(20))} ${value}`);
  };

  // ─── Sistema operativo ──────────────────────────────────────────
  console.log(chalk.bold('  ─── OS ─────────────────────────────────────────'));
  row('Platform',     `${os.type()} (${os.platform()})`);
  row('Release',      os.release());
  row('Arch',         os.arch());
  row('Hostname',     os.hostname());
  row('Uptime',       formatUptime(os.uptime()));
  row('Shell',        process.env.SHELL || 'N/A');

  //? Linux: mostriamo anche la distro
  const lsbRelease = tryExec('lsb_release -d 2>/dev/null | cut -d: -f2');
  if (lsbRelease) row('Distro', lsbRelease.trim());

  // ─── CPU ────────────────────────────────────────────────────────
  console.log(chalk.bold('\n  ─── CPU ────────────────────────────────────────'));
  const cpus = os.cpus();
  row('Model',     cpus[0]?.model || 'N/A');
  row('Cores',     `${cpus.length} logical`);
  row('Speed',     `${cpus[0]?.speed} MHz`);
  //? Load average: media 1m / 5m / 15m (non disponibile su Windows)
  const load = os.loadavg();
  row('Load avg',  `${load[0].toFixed(2)} / ${load[1].toFixed(2)} / ${load[2].toFixed(2)}`);

  // ─── RAM ────────────────────────────────────────────────────────
  console.log(chalk.bold('\n  ─── Memory ─────────────────────────────────────'));
  const totalMem = os.totalmem();
  const freeMem  = os.freemem();
  const usedMem  = totalMem - freeMem;
  row('Total',    formatBytes(totalMem));
  row('Used',     formatBytes(usedMem));
  row('Free',     formatBytes(freeMem));
  row('Usage',    `${((usedMem / totalMem) * 100).toFixed(1)}%`);

  // ─── Disco ──────────────────────────────────────────────────────
  console.log(chalk.bold('\n  ─── Disk ───────────────────────────────────────'));
  //? df -h mostra uso disco in formato human-readable
  const df = tryExec('df -h / 2>/dev/null | tail -1');
  if (df) {
    const parts = df.split(/\s+/);
    row('Filesystem', parts[0]);
    row('Size',       parts[1]);
    row('Used',       parts[2]);
    row('Avail',      parts[3]);
    row('Use%',       parts[4]);
  }

  // ─── Network interfaces ─────────────────────────────────────────
  console.log(chalk.bold('\n  ─── Network ────────────────────────────────────'));
  const nets = os.networkInterfaces();
  for (const [ifName, addrs] of Object.entries(nets)) {
    const ipv4 = addrs?.find(a => a.family === 'IPv4' && !a.internal);
    if (ipv4) row(ifName, ipv4.address);
  }

  // ─── Ambiente di sviluppo ───────────────────────────────────────
  console.log(chalk.bold('\n  ─── Runtime ────────────────────────────────────'));
  row('Node.js',   tryExec('node -v'));
  row('NPM',       tryExec('npm -v'));
  row('Docker',    tryExec('docker --version'));
  row('Git',       tryExec('git --version'));

  console.log();
}
