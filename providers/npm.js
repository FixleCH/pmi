import { execSync } from 'node:child_process';

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
  installDependencies() {
    try {
      execSync('npm install', { stdio: 'inherit' });
      return true;
    } catch {
      return false;
    }
  },
  updateDependencies() {
    try {
      execSync('npm update', { stdio: 'inherit' });
      return true;
    } catch {
      return false;
    }
  }
};
