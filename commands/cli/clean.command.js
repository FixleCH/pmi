import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

export async function cleanCommand() {
  console.log(chalk.yellow('PMI: Cleaning project...'));
  // Pulisce node_modules e vendor
  const dirs = ['node_modules', 'vendor'];
  dirs.forEach(dir => {
    const fullPath = path.join(process.cwd(), dir);
    if (fs.existsSync(fullPath)) fs.rmSync(fullPath, { recursive: true, force: true });
  });
  console.log(chalk.green('PMI: Clean completed!'));
}
