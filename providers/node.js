import { execSync } from 'node:child_process';

// * ─────────────────────────────────────────────────────────────────
// * Node Provider — rilevamento e info su Node.js runtime
// * ─────────────────────────────────────────────────────────────────

export const nodeProvider = {

  isInstalled() {
    try {
      execSync('node -v', { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  },

  getVersion() {
    try {
      return execSync('node -v', { encoding: 'utf8' }).trim();
    } catch {
      return null;
    }
  },

  getMajorVersion() {
    //? Ritorna solo il numero major (es. 22 da "v22.16.0") per check compatibilità
    const v = this.getVersion();
    return v ? parseInt(v.replace('v', '').split('.')[0]) : null;
  },

  isLTS() {
    //? Versioni LTS: pari (18, 20, 22...) — dispari sono Current/non-LTS
    const major = this.getMajorVersion();
    return major ? major % 2 === 0 : false;
  },

  meetsMinimum(minMajor = 18) {
    //! PMI richiede Node >= 18 per supporto ESM nativo e fetch API
    const major = this.getMajorVersion();
    return major ? major >= minMajor : false;
  },

  getArch() {
    try {
      return execSync('node -e "console.log(process.arch)"', { encoding: 'utf8' }).trim();
    } catch {
      return null;
    }
  },

  getPlatform() {
    try {
      return execSync('node -e "console.log(process.platform)"', { encoding: 'utf8' }).trim();
    } catch {
      return null;
    }
  },
};

// * ─── Status helper ──────────────────────────────────────────────

export function nodeStatus() {
  const installed = nodeProvider.isInstalled();
  const version   = installed ? nodeProvider.getVersion() : null;
  return { installed, version };
}
