import { execSync } from 'node:child_process';

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
  installDependencies() {
    try {
      execSync('yarn install', { stdio: 'inherit' });
      return true;
    } catch {
      return false;
    }
  },
  updateDependencies() {
    try {
      execSync('yarn upgrade', { stdio: 'inherit' });
      return true;
    } catch {
      return false;
    }
  }
};
