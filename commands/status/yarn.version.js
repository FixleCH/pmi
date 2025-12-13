import { yarnStatus } from '../../providers/yarn.js';

export function getYarnVersion() {
    const { installed, version } = yarnStatus();
    return installed ? version : null;
}
