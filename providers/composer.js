import { execSync } from 'node:child_process';

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
      return execSync('composer --version', { encoding: 'utf8' }).trim();
    } catch {
      return null;
    }
  },
  installDependencies() {
    try {
      execSync('composer install', { stdio: 'inherit' });
      return true;
    } catch {
      return false;
    }
  },
  updateDependencies() {
    try {
      execSync('composer update', { stdio: 'inherit' });
      return true;
    } catch {
      return false;
    }
  }
};
