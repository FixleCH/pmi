import { nodeStatus } from '../../providers/node.js';

export function checkNodeStatus() {
    const { installed, version } = nodeStatus();
    console.log(`Node.js: ${installed ? 'Installed v' + version : 'Not installed'}`);
    return { installed, version };
}
