import chalk from 'chalk';
import { updatePackages } from '../../src/core/package.manager.command.js';

export async function updateCommand() {
  console.log(chalk.yellow('PMI: Updating dependencies...'));
  await updatePackages();
  console.log(chalk.green('PMI: Update completed!'));
}
