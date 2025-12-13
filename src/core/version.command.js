import { execSync } from 'child_process';
import chalk from 'chalk';

export function printEnvironment() {
  console.log(chalk.blue('PMI: Diagnosing environment...\n'));

  try {
    const nodeVersion = execSync('node -v').toString().trim();
    console.log(`Node: ${nodeVersion}`);

    const npmVersion = execSync('npm -v').toString().trim();
    console.log(`NPM: ${npmVersion}`);

    const yarnVersion = execSync('yarn -v').toString().trim();
    console.log(`Yarn: ${yarnVersion}`);

    const phpVersion = execSync('php -v').toString().split('\n')[0];
    console.log(`PHP version: ${phpVersion}`);

    const composerVersion = execSync('composer -V').toString().trim();
    console.log(`Composer: ${composerVersion}`);

    const dockerVersion = execSync('docker -v').toString().trim();
    console.log(`Docker: ${dockerVersion}`);

  } catch (error) {
    console.log(chalk.red('Error detecting environment:'), error.message);
  }

  console.log(chalk.green('\nPMI: Diagnosis complete!'));
}
