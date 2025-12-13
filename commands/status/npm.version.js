import { npmStatus } from '../../providers/npm.js';

export function getNpmVersion() {
    const { installed, version } = npmStatus();
    return installed ? version : null;
}
