import { npmProvider }      from '../../providers/npm.js';
import { yarnProvider }     from '../../providers/yarn.js';
import { composerProvider } from '../../providers/composer.js';

// * ─────────────────────────────────────────────────────────────────
// * Package Manager Command — orchestrazione multi-PM
// * Rileva automaticamente quali PM sono installati e li usa
// * ─────────────────────────────────────────────────────────────────

export async function installPackages() {
  //? Installa con tutti i PM disponibili nel sistema
  if (npmProvider.isInstalled())      npmProvider.installDependencies();
  if (yarnProvider.isInstalled())     yarnProvider.installDependencies();
  if (composerProvider.isInstalled()) composerProvider.installDependencies();
}

export async function updatePackages() {
  if (npmProvider.isInstalled())      npmProvider.updateDependencies();
  if (yarnProvider.isInstalled())     yarnProvider.updateDependencies();
  if (composerProvider.isInstalled()) composerProvider.updateDependencies();
}

export async function auditPackages() {
  //! Controlla vulnerabilità — potrebbe produrre molto output
  if (npmProvider.isInstalled())      npmProvider.audit();
  if (composerProvider.isInstalled()) composerProvider.audit();
}

export async function outdatedPackages() {
  if (npmProvider.isInstalled())      npmProvider.outdated();
  if (yarnProvider.isInstalled())     yarnProvider.outdated();
  if (composerProvider.isInstalled()) composerProvider.outdated();
}
