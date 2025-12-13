import { npmProvider } from '../../providers/npm.js';
import { yarnProvider } from '../../providers/yarn.js';
import { composerProvider } from '../../providers/composer.js';
import { nodeProvider } from '../../providers/node.js';
import { dockerProvider } from '../../providers/docker.js';
import inquirer from 'inquirer';

async function requireSudo() {
  if (process.getuid && process.getuid() !== 0) {
    console.log('PMI: Some operations may require sudo privileges.');
    const { proceed } = await inquirer.prompt([{
      type: 'confirm',
      name: 'proceed',
      message: 'Continue with sudo if needed?',
      default: true
    }]);
    if (!proceed) process.exit(1);
  }
}

export async function installCommand() {
  await requireSudo();
  console.log('PMI: Detecting stack...');

  if (nodeProvider.isInstalled()) {
    console.log(`Node detected: ${nodeProvider.getVersion()}`);
  } else {
    console.log('Node is not installed! Please install Node.js first.');
    process.exit(1);
  }

  if (npmProvider.isInstalled()) {
    console.log(`NPM detected: ${npmProvider.getVersion()}`);
    console.log('Installing NPM dependencies...');
    npmProvider.installDependencies();
  }

  if (yarnProvider.isInstalled()) {
    console.log(`Yarn detected: ${yarnProvider.getVersion()}`);
    console.log('Installing Yarn dependencies...');
    yarnProvider.installDependencies();
  }

  if (composerProvider.isInstalled()) {
    console.log(`Composer detected: ${composerProvider.getVersion()}`);
    console.log('Installing Composer dependencies...');
    composerProvider.installDependencies();
  }

  if (dockerProvider.isInstalled()) {
    console.log(`Docker detected: ${dockerProvider.getVersion()}`);
  }

  console.log('PMI: Installation completed!');
}
