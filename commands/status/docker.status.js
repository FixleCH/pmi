import { dockerStatus } from '../../providers/docker.js';

export function checkDockerStatus() {
    const { installed, version } = dockerStatus();
    console.log(`Docker: ${installed ? 'Installed v' + version : 'Not installed'}`);
    return { installed, version };
}
