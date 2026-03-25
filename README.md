# PMI — Package Manager Interface
 
PMI è un tool CLI che permette di diagnosticare, gestire e containerizzare l'ambiente di sviluppo.
Supporta Node.js, npm, Yarn, PHP, Composer e Docker con comandi reali e interattivi.

---

## Features

- Diagnosi completa dell'ambiente (`pmi doctor`, `pmi sys`)
- Rileva automaticamente lo stack del progetto (npm, yarn, composer)
- Gestione completa Docker: container, immagini, compose, log, shell, stats
- Pulizia automatica di cache, build e dipendenze
- Audit di sicurezza sulle dipendenze
- Generazione Dockerfile multi-stage per Node.js, PHP, Python, Go
- Supporta ES modules, Node.js >= 18, Better Comments

---

## Installazione

1. Clona il repository:

```bash
git clone https://github.com/HNOWFoundation/pmi.git
cd pmi
```

2. Installa le dipendenze:

```bash
npm install
```

3. Collega `pmi` come comando globale:

```bash
npm link
```

4. Verifica l'installazione:

```bash
pmi doctor
```

---

## Comandi — Package Management

| Comando           | Descrizione                                                   |
| ----------------- | ------------------------------------------------------------- |
| `pmi install`     | Rileva stack (npm/yarn/composer) e installa le dipendenze     |
| `pmi update`      | Aggiorna tutte le dipendenze rilevate                         |
| `pmi audit`       | Controlla vulnerabilità di sicurezza (npm audit / composer)   |
| `pmi outdated`    | Mostra pacchetti con versioni obsolete                        |
| `pmi clean`       | Rimuove node_modules, vendor, cache, dist, build, coverage    |
| `pmi self-update` | Aggiorna PMI via `git pull` + `npm install`                   |
| `pmi uninstall`   | Rimuove il link globale di PMI (`npm unlink`)                 |

## Comandi — Diagnostica

| Comando      | Descrizione                                                      |
| ------------ | ---------------------------------------------------------------- |
| `pmi doctor` | Diagnosi completa: Node, NPM, Yarn, PHP, Docker, Git, Go...      |
| `pmi env`    | Mostra variabili d'ambiente rilevanti (NODE_*, DOCKER_*, PATH…) |
| `pmi sys`    | Info sistema: OS, CPU, RAM, disco, uptime, interfacce di rete   |

## Comandi — Docker & Container

| Comando                       | Descrizione                                          |
| ----------------------------- | ---------------------------------------------------- |
| `pmi dockerize`               | Genera Dockerfile multi-stage, docker-compose, .dockerignore |
| `pmi up`                      | `docker compose up --build -d`                       |
| `pmi down`                    | `docker compose down` (opzione rimozione volumi)     |
| `pmi build [service]`         | `docker compose build` o `docker build`              |
| `pmi ps`                      | Lista container attivi + stato servizi compose       |
| `pmi logs [container]`        | Log di un container/servizio (--tail, --follow)      |
| `pmi stop [container]`        | Ferma un container o tutti i servizi compose         |
| `pmi restart [container]`     | Riavvia container o servizi compose                  |
| `pmi shell <container> [sh]`  | Shell interattiva in un container (`bash`, `sh`...)  |
| `pmi stats [container]`       | CPU/RAM/IO dei container (snapshot o --live)         |
| `pmi images`                  | Lista immagini Docker locali con dimensione          |
| `pmi port <container>`        | Mostra port mapping di un container                  |
| `pmi prune`                   | Pulizia interattiva: container, immagini, volumi     |

---

## Stack supportati da `pmi dockerize`

| Stack    | Dockerfile                                                        |
| -------- | ----------------------------------------------------------------- |
| Node.js  | Multi-stage: deps → builder → runner (Alpine, utente non-root)   |
| PHP      | Apache + estensioni + Composer (multi-stage)                      |
| Python   | Slim + pip + utente non-root                                      |
| Go       | Multi-stage: builder → scratch (binary statico minimo)            |

---

## Flags globali

```bash
pmi <comando> --debug    # Output verbose per debug
pmi --help               # Mostra tutti i comandi
```

---

## Variabili d'ambiente

| Variabile    | Descrizione                            |
| ------------ | -------------------------------------- |
| `PMI_DEBUG`  | Se `true` abilita log di debug verbose |

---

## Contribuire

1. Fai un fork del progetto
2. Crea un branch: `git checkout -b feature/nome-feature`
3. Commit: `git commit -m "feat: descrizione"`
4. Push: `git push origin feature/nome-feature`
5. Apri una Pull Request su GitHub

---

## Licenza

Questo progetto è rilasciato sotto licenza **MIT**.
Vedi il file [LICENSE](LICENSE) per maggiori dettagli.
