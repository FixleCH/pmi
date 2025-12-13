import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

export async function uninstallCommand() {
  console.log(chalk.red('PMI: Removing PMI from system...'));
  const indexPath = path.join(process.cwd(), 'index.js');
  if (fs.existsSync(indexPath)) fs.unlinkSync(indexPath);
  console.log(chalk.green('PMI: Uninstallation completed!'));
}
