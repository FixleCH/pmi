import { doctorCommand } from './doctor.command.js';
import chalk from 'chalk';

export async function envCommand() {
  console.log(chalk.magenta('PMI: Environment summary\n'));
  await doctorCommand();
}
