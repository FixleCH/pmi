// * ─────────────────────────────────────────────────────────────────
// * CLI Command Router — entry point principale di PMI
// * Registra tutti i comandi disponibili e gestisce il dispatch
// * ─────────────────────────────────────────────────────────────────

// ─── Comandi base ────────────────────────────────────────────────
import { installCommand }   from '../../commands/cli/install.command.js';
import { updateCommand }    from '../../commands/cli/update.command.js';
import { doctorCommand }    from '../../commands/cli/doctor.command.js';
import { envCommand }       from '../../commands/cli/env.command.js';
import { cleanCommand }     from '../../commands/cli/clean.command.js';
import { dockerizeCommand } from '../../commands/cli/dockerize.command.js';
import { selfUpdateCommand }from '../../commands/cli/self_update.command.js';
import { uninstallCommand } from '../../commands/cli/uninstall.command.js';
import { auditCommand }     from '../../commands/cli/audit.command.js';
import { outdatedCommand }  from '../../commands/cli/outdated.command.js';

// ─── Comandi Docker / Container ──────────────────────────────────
import { psCommand }        from '../../commands/cli/ps.command.js';
import { logsCommand }      from '../../commands/cli/logs.command.js';
import { stopCommand }      from '../../commands/cli/stop.command.js';
import { restartCommand }   from '../../commands/cli/restart.command.js';
import { shellCommand }     from '../../commands/cli/shell.command.js';
import { pruneCommand }     from '../../commands/cli/prune.command.js';
import { buildCommand }     from '../../commands/cli/build.command.js';
import { statsCommand }     from '../../commands/cli/stats.command.js';
import { imagesCommand }    from '../../commands/cli/images.command.js';
import { upCommand }        from '../../commands/cli/up.command.js';
import { downCommand }      from '../../commands/cli/down.command.js';
import { portCommand }      from '../../commands/cli/port.command.js';

// ─── Comandi Sysadmin ────────────────────────────────────────────
import { sysCommand }       from '../../commands/cli/sys.command.js';

// ─── Error handling & logging ────────────────────────────────────
import { handleCommandError }    from '../err/resolution.cli.js';
import { logInfo, logWarn, logDebug } from '../err/debug.cli.js';

// * Mappa completa dei comandi: alias → handler
// * Ogni handler è una funzione async che riceve (args)
const COMMAND_MAP = {
  // ─── Package management ─────────────────────────────────────
  'install':     installCommand,     //? Installa le dipendenze del progetto
  'i':           installCommand,     //? Alias breve di install
  'update':      updateCommand,      //? Aggiorna tutte le dipendenze
  'u':           updateCommand,
  'uninstall':   uninstallCommand,   //! Rimuove PMI dal sistema (npm unlink)
  'self-update': selfUpdateCommand,  //? Aggiorna PMI all'ultima versione via git
  'audit':       auditCommand,       //! Controlla vulnerabilità di sicurezza
  'outdated':    outdatedCommand,    //? Lista pacchetti con versioni obsolete

  // ─── Diagnostica ─────────────────────────────────────────────
  'doctor':      doctorCommand,      //? Diagnosi completa ambiente di sviluppo
  'env':         envCommand,         //? Mostra variabili ambiente e versioni
  'sys':         sysCommand,         //? Info sistema: OS, CPU, RAM, disco

  // ─── Pulizia ─────────────────────────────────────────────────
  'clean':       cleanCommand,       //? Rimuove node_modules, vendor, cache, build

  // ─── Docker basics ───────────────────────────────────────────
  'dockerize':   dockerizeCommand,   //? Genera Dockerfile + docker-compose + .dockerignore
  'up':          upCommand,          //? docker compose up --build -d
  'down':        downCommand,        //? docker compose down
  'build':       buildCommand,       //? docker compose build (o docker build)
  'ps':          psCommand,          //? Lista container in esecuzione
  'logs':        logsCommand,        //? Mostra i log di un container/servizio
  'stop':        stopCommand,        //? Ferma un container o tutti i servizi compose
  'restart':     restartCommand,     //? Riavvia container o servizi compose
  'shell':       shellCommand,       //? Apre una shell interattiva in un container
  'stats':       statsCommand,       //? Mostra CPU/RAM/IO dei container live
  'images':      imagesCommand,      //? Lista immagini Docker locali
  'port':        portCommand,        //? Mostra le port mapping di un container
  'prune':       pruneCommand,       //! Pulizia Docker: container, immagini, volumi
};

// * Help compatto mostrato quando PMI viene chiamato senza argomenti
function printHelp() {
  console.log(`
  ${'\x1b[1m'}PMI — Package Manager Interface${'\x1b[0m'}

  ${'\x1b[36m'}USAGE${'\x1b[0m'}
    pmi <command> [options]

  ${'\x1b[36m'}PACKAGE MANAGEMENT${'\x1b[0m'}
    install, i          Installa dipendenze (npm / yarn / composer auto-detect)
    update, u           Aggiorna dipendenze
    audit               Controlla vulnerabilità (npm audit / composer audit)
    outdated            Mostra pacchetti obsoleti
    clean               Rimuove node_modules, vendor, cache, dist, build
    self-update         Aggiorna PMI all'ultima versione
    uninstall           Rimuove PMI dal sistema

  ${'\x1b[36m'}DIAGNOSTICA${'\x1b[0m'}
    doctor              Diagnosi completa ambiente (Node, PHP, Docker, Git...)
    env                 Mostra variabili d'ambiente e versioni
    sys                 Info sistema: OS, CPU, RAM, disco

  ${'\x1b[36m'}DOCKER & CONTAINER${'\x1b[0m'}
    dockerize           Genera Dockerfile, docker-compose.yml, .dockerignore
    up                  docker compose up --build -d
    down                docker compose down
    build [service]     docker compose build
    ps                  Lista container attivi
    logs [container]    Log di un container (--tail=N, --follow)
    stop [container]    Ferma container o tutti i servizi
    restart [container] Riavvia container o servizi
    shell <container>   Shell interattiva in un container
    stats [container]   CPU/RAM/IO dei container in tempo reale
    images              Lista immagini Docker locali
    port <container>    Mostra port mapping del container
    prune               Pulizia completa Docker (container, immagini, volumi)

  ${'\x1b[36m'}FLAGS GLOBALI${'\x1b[0m'}
    --debug             Abilita output di debug verbose
    --help, -h          Mostra questo help
`);
}

export async function runCLI(args) {
  // ─── Flag globali ─────────────────────────────────────────────
  if (args.includes('--debug')) process.env.PMI_DEBUG = 'true';
  if (args.includes('--help') || args.includes('-h')) { printHelp(); return; }

  const command = args[0];
  const rest    = args.slice(1); //? Argomenti dopo il comando (es. nome container)

  if (!command) {
    printHelp();
    return;
  }

  const selectedCommand = COMMAND_MAP[command];

  if (!selectedCommand) {
    logWarn(`Comando sconosciuto: "${command}"`);
    console.log(`  Usa ${'\x1b[36m'}pmi --help${'\x1b[0m'} per vedere tutti i comandi disponibili.`);
    return;
  }

  try {
    logDebug(`Esecuzione comando "${command}" con args: [${rest.join(', ')}]`);
    //? Passiamo 'rest' a ogni handler così i comandi possono ricevere parametri
    await selectedCommand(rest);
  } catch (error) {
    handleCommandError(error, command);
  }
}
