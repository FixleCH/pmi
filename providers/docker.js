import { execSync } from 'node:child_process';

export const dockerProvider = {
  isInstalled() {
    try {
      execSync('docker --version', { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  },
  getVersion() {
    try {
      return execSync('docker --version', { encoding: 'utf8' }).trim();
    } catch {
      return null;
    }
  }
};
