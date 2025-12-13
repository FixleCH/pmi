export function checkProvider(provider, providerName) {
    if (!provider || typeof provider.isInstalled !== 'function') {
        throw new Error(`Provider "${providerName}" non disponibile o metodo isInstalled mancante`);
    }
}

export function suggestFix(providerName) {
    console.log(`[SUGGEST] Verifica che "${providerName}" sia installato e aggiornato.`);
}
