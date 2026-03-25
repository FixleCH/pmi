import { execSync } from 'node:child_process';

// * ─────────────────────────────────────────────────────────────────
// * Yarn Provider — gestione Yarn (v1 classic e v2+/berry)
// * ─────────────────────────────────────────────────────────────────

export const yarnProvider = {

  isInstalled() {
    try {
      execSync('yarn -v', { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  },

  getVersion() {
    try {
      return execSync('yarn -v', { encoding: 'utf8' }).trim();
    } catch {
      return null;
    }
  },

  isBerry() {
    //? Yarn Berry (v2+) ha un sistema di plugin e PnP molto diverso da v1
    const v = this.getVersion();
    return v ? parseInt(v.split('.')[0]) >= 2 : false;
  },

  installDependencies() {
    try {
      execSync('yarn install', { stdio: 'inherit' });
      return true;
    } catch {
      return false;
    }
  },

  add(packageName, dev = false) {
    const flag = dev ? '--dev' : '';
    execSync(`yarn add ${flag} ${packageName}`.trim(), { stdio: 'inherit' });
  },

  remove(packageName) {
    execSync(`yarn remove ${packageName}`, { stdio: 'inherit' });
  },

  updateDependencies() {
    try {
      //? yarn upgrade-interactive è disponibile solo in v1 classic
      execSync(this.isBerry() ? 'yarn up' : 'yarn upgrade', { stdio: 'inherit' });
      return true;
    } catch {
      return false;
    }
  },

  runScript(scriptName) {
    execSync(`yarn ${scriptName}`, { stdio: 'inherit' });
  },

  audit() {
    //! yarn audit non è disponibile in Berry (v2+) — usa npm audit o snyk
    if (this.isBerry()) {
      console.log('[WARN] yarn audit non disponibile in Yarn Berry. Usa npm audit.');
      return;
    }
    try {
      execSync('yarn audit', { stdio: 'inherit' });
    } catch {
      //? Esce con codice != 0 se trova vulnerabilità
    }
  },

  outdated() {
    try {
      execSync('yarn outdated', { stdio: 'inherit' });
    } catch {
      //? Esce con codice 1 — comportamento atteso
    }
  },

  clearCache() {
    execSync('yarn cache clean', { stdio: 'inherit' });
  },
};

// * ─── Status helper ──────────────────────────────────────────────

export function yarnStatus() {
  const installed = yarnProvider.isInstalled();
  const version   = installed ? yarnProvider.getVersion() : null;
  return { installed, version };
}
