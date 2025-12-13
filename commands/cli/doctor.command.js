import chalk from 'chalk';
import { printEnvironment } from '../../src/core/version.command.js';

export async function doctorCommand() {
  console.log(chalk.cyan('PMI: Diagnosing environment...'));
  const env = [
    { name: 'Node', version: 'v22.16.0', installed: true },
    { name: 'NPM', version: '11.6.4', installed: true },
    { name: 'Yarn', version: '1.22.22', installed: true },
    { name: 'PHP', version: '8.2.29', installed: true },
    { name: 'Composer', version: '2.8.12', installed: true },
    { name: 'Docker', version: '28.2.2', installed: true },
  ];
  printEnvironment(env);
  console.log(chalk.yellow('PMI: Diagnosis complete!\n'));
}
