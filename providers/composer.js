import { execSync } from 'node:child_process';

// * ─────────────────────────────────────────────────────────────────
// * Composer Provider — gestione PHP package manager
// * ─────────────────────────────────────────────────────────────────

export const composerProvider = {

  isInstalled() {
    try {
      execSync('composer --version', { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  },

  getVersion() {
    try {
      //? Estrae solo "X.Y.Z" dalla riga "Composer version X.Y.Z ..."
      const raw = execSync('composer --version', { encoding: 'utf8' }).trim();
      const match = raw.match(/(\d+\.\d+\.\d+)/);
      return match ? match[1] : raw;
    } catch {
      return null;
    }
  },

  installDependencies(noDevDeps = false) {
    //? noDevDeps=true utile in build CI/produzione
    const flag = noDevDeps ? '--no-dev --optimize-autoloader' : '';
    try {
      execSync(`composer install ${flag}`.trim(), { stdio: 'inherit' });
      return true;
    } catch {
      return false;
    }
  },

  updateDependencies(dryRun = false) {
    //? dryRun mostra cosa verrebbe aggiornato senza toccare nulla
    const flag = dryRun ? '--dry-run' : '';
    try {
      execSync(`composer update ${flag}`.trim(), { stdio: 'inherit' });
      return true;
    } catch {
      return false;
    }
  },

  require(package_name, dev = false) {
    const flag = dev ? '--dev' : '';
    execSync(`composer require ${flag} ${package_name}`.trim(), { stdio: 'inherit' });
  },

  remove(package_name) {
    execSync(`composer remove ${package_name}`, { stdio: 'inherit' });
  },

  runScript(scriptName) {
    execSync(`composer run-script ${scriptName}`, { stdio: 'inherit' });
  },

  audit() {
    //! Controlla vulnerabilità note nelle dipendenze installate
    try {
      execSync('composer audit', { stdio: 'inherit' });
    } catch {
      //? Composer audit è disponibile da v2.4 — fallback silenzioso
      console.log('[WARN] composer audit non disponibile (richiede Composer >= 2.4)');
    }
  },

  outdated() {
    execSync('composer outdated --direct', { stdio: 'inherit' });
  },

  clearCache() {
    execSync('composer clear-cache', { stdio: 'inherit' });
  },

  dumpAutoload(optimize = false) {
    const flag = optimize ? '--optimize' : '';
    execSync(`composer dump-autoload ${flag}`.trim(), { stdio: 'inherit' });
  },
};

// * ─── Status helper ──────────────────────────────────────────────

export function composerStatus() {
  const installed = composerProvider.isInstalled();
  const version   = installed ? composerProvider.getVersion() : null;
  return { installed, version };
}
