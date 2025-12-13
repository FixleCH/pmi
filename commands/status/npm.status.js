import { npmStatus } from '../../providers/npm.js';

export function checkNpmStatus() {
    const { installed, version } = npmStatus();
    console.log(`NPM: ${installed ? 'Installed v' + version : 'Not installed'}`);
    return { installed, version };
}
