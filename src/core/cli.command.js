// Esempio CORRETTO
import { installCommand } from '../../commands/cli/install.command.js';
import { updateCommand } from '../../commands/cli/update.command.js';
import { doctorCommand } from '../../commands/cli/doctor.command.js';
import { envCommand } from '../../commands/cli/env.command.js';
import { cleanCommand } from '../../commands/cli/clean.command.js';
import { dockerizeCommand } from '../../commands/cli/dockerize.command.js';
import { selfUpdateCommand } from '../../commands/cli/self_update.command.js';
import { uninstallCommand } from '../../commands/cli/uninstall.command.js';

// Error handling & logging
import { handleCommandError } from '../err/resolution.cli.js';
import { logInfo, logWarn, logDebug } from '../err/debug.cli.js';

export async function runCLI(args) {
    const command = args[0];

    const commandMap = {
        install: installCommand,
        i: installCommand,
        update: updateCommand,
        doctor: doctorCommand,
        env: envCommand,
        clean: cleanCommand,
        dockerize: dockerizeCommand,
        'self-update': selfUpdateCommand,
        uninstall: uninstallCommand
    };

    if (!command) {
        logInfo("PMI CLI");
        console.log(`
Usage: pmi <command>

Commands:
  install, i        Install dependencies
  update            Update dependencies
  doctor            Diagnose environment
  env               Show environment status
  clean             Clean cache and modules
  dockerize         Generate Docker files
  self-update       Update PMI itself
  uninstall         Remove PMI
`);
        return;
    }

    const selectedCommand = commandMap[command];

    if (!selectedCommand) {
        logWarn(`Unknown command "${command}"`);
        return;
    }

    try {
        logDebug(`Running command "${command}"`);
        await selectedCommand();
        logInfo(`Command "${command}" completed successfully.`);
    } catch (error) {
        handleCommandError(error, command);
    }
}

// Optional: enable debug mode via ENV
if (process.argv.includes('--debug')) {
    process.env.PMI_DEBUG = 'true';
}
