import { nodeStatus } from '../../providers/node.js';

export function getNodeVersion() {
    const { installed, version } = nodeStatus();
    return installed ? version : null;
}
