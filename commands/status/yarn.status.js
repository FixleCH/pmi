import { yarnStatus } from '../../providers/yarn.js';

export function checkYarnStatus() {
    const { installed, version } = yarnStatus();
    console.log(`Yarn: ${installed ? 'Installed v' + version : 'Not installed'}`);
    return { installed, version };
}
