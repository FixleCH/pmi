import { composerStatus } from '../../providers/composer.js';

export function getComposerVersion() {
    const { installed, version } = composerStatus();
    return installed ? version : null;
}
