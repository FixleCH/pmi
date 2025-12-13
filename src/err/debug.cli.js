export function logDebug(msg) {
    if (process.env.PMI_DEBUG === 'true') {
        console.log(`[DEBUG] ${msg}`);
    }
}

export function logInfo(msg) {
    console.log(`[INFO] ${msg}`);
}

export function logWarn(msg) {
    console.warn(`[WARN] ${msg}`);
}
