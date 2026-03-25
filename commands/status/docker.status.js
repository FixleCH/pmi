import { dockerStatus } from '../../providers/docker.js';

// * docker.status — wrapper per il check stato Docker
//? Usato da doctor e env command per mostrare stato daemon

export function checkDockerStatus() {
    const { installed, version, daemon } = dockerStatus();
    const daemonStr = installed ? (daemon ? ' (daemon running)' : ' (daemon stopped)') : '';
    console.log(`Docker: ${installed ? 'Installed v' + version + daemonStr : 'Not installed'}`);
    return { installed, version, daemon };
}
