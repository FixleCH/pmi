import { execSync } from 'node:child_process';

// * ─────────────────────────────────────────────────────────────────
// * NPM Provider — gestione Node Package Manager
// * ─────────────────────────────────────────────────────────────────

export const npmProvider = {

  isInstalled() {
    try {
      execSync('npm -v', { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  },

  getVersion() {
    try {
      return execSync('npm -v', { encoding: 'utf8' }).trim();
    } catch {
      return null;
    }
  },

  installDependencies(production = false) {
    //? production=true equivale a --omit=dev (npm v7+)
    const flag = production ? '--omit=dev' : '';
    try {
      execSync(`npm install ${flag}`.trim(), { stdio: 'inherit' });
      return true;
    } catch {
      return false;
    }
  },

  install(packageName, global = false, dev = false) {
    const gFlag  = global ? '-g' : '';
    const dFlag  = dev ? '--save-dev' : '';
    execSync(`npm install ${gFlag} ${dFlag} ${packageName}`.trim(), { stdio: 'inherit' });
  },

  uninstall(packageName, global = false) {
    const flag = global ? '-g' : '';
    execSync(`npm uninstall ${flag} ${packageName}`.trim(), { stdio: 'inherit' });
  },

  updateDependencies() {
    try {
      execSync('npm update', { stdio: 'inherit' });
      return true;
    } catch {
      return false;
    }
  },

  runScript(scriptName) {
    execSync(`npm run ${scriptName}`, { stdio: 'inherit' });
  },

  audit(fix = false) {
    //! fix=true applica automaticamente le patch sicure — potrebbe aggiornare lock file
    const flag = fix ? '--fix' : '';
    try {
      execSync(`npm audit ${flag}`.trim(), { stdio: 'inherit' });
    } catch {
      //? npm audit esce con codice != 0 se trova vulnerabilità — non è un vero errore
    }
  },

  outdated() {
    try {
      execSync('npm outdated', { stdio: 'inherit' });
    } catch {
      //? Esce con codice 1 se ci sono pacchetti outdated — comportamento atteso
    }
  },

  clearCache() {
    execSync('npm cache clean --force', { stdio: 'inherit' });
  },

  link() {
    execSync('npm link', { stdio: 'inherit' });
  },

  unlink() {
    execSync('npm unlink', { stdio: 'inherit' });
  },

  listGlobal() {
    try {
      return execSync('npm list -g --depth=0', { encoding: 'utf8' }).trim();
    } catch {
      return null;
    }
  },
};

// * ─── Status helper ──────────────────────────────────────────────

export function npmStatus() {
  const installed = npmProvider.isInstalled();
  const version   = installed ? npmProvider.getVersion() : null;
  return { installed, version };
}
