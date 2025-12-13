export function handleCommandError(error, commandName) {
    console.error(`[ERROR] Command "${commandName}" failed: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
}
