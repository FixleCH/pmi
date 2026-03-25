import chalk from 'chalk';
import { dockerProvider } from '../../providers/docker.js';

// * ─────────────────────────────────────────────────────────────────
// * stats — mostra statistiche CPU/RAM/IO dei container
// * Uso: pmi stats [container] [--live]
// * ─────────────────────────────────────────────────────────────────

export async function statsCommand(args = []) {
  if (!dockerProvider.isInstalled() || !dockerProvider.isDaemonRunning()) {
    console.log(chalk.red('  ✘  Docker daemon non in esecuzione.'));
    return;
  }

  //? --live rimuove --no-stream e lascia girare in modalità live
  const live = args.includes('--live');
  const target = args.find(a => !a.startsWith('-'));

  console.log(chalk.bold.cyan(`\n  PMI Stats${live ? ' (live — Ctrl+C per uscire)' : ''}\n`));

  if (live) {
    //! In modalità live il processo rimane attivo fino a Ctrl+C
    const { spawnSync } = await import('child_process');
    const dockerArgs = ['stats', '--format',
      'table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}'];
    if (target) dockerArgs.push(target);
    spawnSync('docker', dockerArgs, { stdio: 'inherit' });
  } else {
    dockerProvider.getStats(target);
  }
  console.log();
}
