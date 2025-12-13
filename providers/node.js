import { execSync } from 'node:child_process';

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
  }
};
