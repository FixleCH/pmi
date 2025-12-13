import { composerStatus } from '../../providers/composer.js';

export function checkComposerStatus() {
    const { installed, version } = composerStatus();
    console.log(`Composer: ${installed ? 'Installed v' + version : 'Not installed'}`);
    return { installed, version };
}
