import { npmProvider } from '../../providers/npm.js';
import { yarnProvider } from '../../providers/yarn.js';
import { composerProvider } from '../../providers/composer.js';

export async function installPackages() {
  if (npmProvider.isInstalled()) npmProvider.installDependencies();
  if (yarnProvider.isInstalled()) yarnProvider.installDependencies();
  if (composerProvider.isInstalled()) composerProvider.installDependencies();
}

export async function updatePackages() {
  if (npmProvider.isInstalled()) npmProvider.updateDependencies();
  if (yarnProvider.isInstalled()) yarnProvider.updateDependencies();
  if (composerProvider.isInstalled()) composerProvider.updateDependencies();
}
