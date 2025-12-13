import { dockerStatus } from '../../providers/docker.js';

export function getDockerVersion() {
    const { installed, version } = dockerStatus();
    return installed ? version : null;
}
