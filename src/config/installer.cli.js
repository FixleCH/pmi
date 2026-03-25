// * ─────────────────────────────────────────────────────────────────
// * Installer Config — costanti e template globali di PMI
// * ─────────────────────────────────────────────────────────────────

export const config = {
  //? Versione minima di Node richiesta
  minNodeVersion: 18,

  //? Se true, avvisa l'utente quando servono privilegi elevati
  requireSudo: true,

  //! Versioni di default usate nei template Dockerfile
  defaults: {
    nodeVersion:    '22',
    phpVersion:     '8.3',
    pythonVersion:  '3.12',
    goVersion:      '1.23',
    alpineVersion:  '3.20',
  },

  //? Cartelle rimosse da `pmi clean`
  cleanTargets: [
    'node_modules',
    'vendor',
    '.cache',
    'dist',
    'build',
    'coverage',
    '.turbo',
    '.next',
    '.nuxt',
    '.output',
    'tmp',
    '.tmp',
  ],
};
