import fs from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { config } from '../../src/config/installer.cli.js';

// * ─────────────────────────────────────────────────────────────────
// * dockerize — genera Dockerfile multi-stage + docker-compose.yml + .dockerignore
// * Template reali per Node.js, PHP, Python, Go
// * ─────────────────────────────────────────────────────────────────

const TEMPLATES = {
  node: (port, nodeVer) => ({
    dockerfile: `# syntax=docker/dockerfile:1
# * ─── Stage 1: dipendenze ─────────────────────────────────────────
FROM node:${nodeVer}-alpine AS deps
WORKDIR /app
COPY package*.json ./
#? --omit=dev installa solo produzione, riduciamo la surface di attacco
RUN npm ci --omit=dev

# * ─── Stage 2: build ──────────────────────────────────────────────
FROM node:${nodeVer}-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
#! Rimuovere se il progetto non ha un build step
RUN npm run build 2>/dev/null || true

# * ─── Stage 3: runtime (immagine finale minimale) ─────────────────
FROM node:${nodeVer}-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

#? Creiamo un utente non-root per sicurezza
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY --from=builder /app/dist ./dist 2>/dev/null || true
COPY --from=deps  /app/node_modules ./node_modules
COPY . .

USER appuser
EXPOSE ${port}
CMD ["node", "index.js"]
`,
    compose: `services:
  app:
    build: .
    ports:
      - "${port}:${port}"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    #? Per aggiungere un DB: decommentare la sezione seguente
    # depends_on:
    #   - db
  # db:
  #   image: postgres:16-alpine
  #   environment:
  #     POSTGRES_DB: mydb
  #     POSTGRES_USER: user
  #     POSTGRES_PASSWORD: password
  #   volumes:
  #     - db_data:/var/lib/postgresql/data
# volumes:
#   db_data:
`,
  }),

  php: (port, phpVer) => ({
    dockerfile: `# syntax=docker/dockerfile:1
# * ─── PHP + Apache + Composer ─────────────────────────────────────
FROM php:${phpVer}-apache AS base

#? Installa estensioni comuni: pdo_mysql, mbstring, gd, zip
RUN docker-php-ext-install pdo pdo_mysql mbstring gd zip && \\
    a2enmod rewrite

# * ─── Stage: dipendenze Composer ─────────────────────────────────
FROM base AS deps
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
WORKDIR /var/www/html
COPY composer*.json ./
#! --no-dev in produzione — mai includere dipendenze di sviluppo
RUN composer install --no-dev --optimize-autoloader

# * ─── Stage: runtime ──────────────────────────────────────────────
FROM base AS runner
WORKDIR /var/www/html
COPY --from=deps /var/www/html/vendor ./vendor
COPY . .
RUN chown -R www-data:www-data /var/www/html

EXPOSE ${port}
`,
    compose: `services:
  app:
    build: .
    ports:
      - "${port}:${port}"
    volumes:
      - .:/var/www/html
    restart: unless-stopped
`,
  }),

  python: (port, pyVer) => ({
    dockerfile: `# syntax=docker/dockerfile:1
# * ─── Python ${pyVer} slim ─────────────────────────────────────────
FROM python:${pyVer}-slim AS base
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 \\
    PYTHONUNBUFFERED=1

# * ─── Dipendenze ──────────────────────────────────────────────────
FROM base AS deps
COPY requirements*.txt ./
#? Usiamo --no-cache-dir per ridurre la dimensione dell'immagine
RUN pip install --no-cache-dir -r requirements.txt

# * ─── Runtime ─────────────────────────────────────────────────────
FROM deps AS runner
COPY . .
#? Creiamo utente non-root
RUN adduser --disabled-password --gecos '' appuser
USER appuser

EXPOSE ${port}
CMD ["python", "app.py"]
`,
    compose: `services:
  app:
    build: .
    ports:
      - "${port}:${port}"
    restart: unless-stopped
`,
  }),

  go: (port, goVer) => ({
    dockerfile: `# syntax=docker/dockerfile:1
# * ─── Go build stage ──────────────────────────────────────────────
FROM golang:${goVer}-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
#? Download dipendenze con cache layer separato
RUN go mod download

COPY . .
#! CGO_ENABLED=0 per binary statici — necessario per scratch/alpine
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# * ─── Runtime minimale (immagine quasi vuota) ─────────────────────
FROM scratch AS runner
COPY --from=builder /app/main /main
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
EXPOSE ${port}
ENTRYPOINT ["/main"]
`,
    compose: `services:
  app:
    build: .
    ports:
      - "${port}:${port}"
    restart: unless-stopped
`,
  }),
};

const DOCKERIGNORE = `# * ─── .dockerignore ─────────────────────────────────────────────
# Escludiamo tutto ciò che non serve nel container

# ─── Dipendenze locali ─────────────────────────────────────────
node_modules/
vendor/

# ─── Build locali ──────────────────────────────────────────────
dist/
build/
.next/
.nuxt/

# ─── Git e CI ──────────────────────────────────────────────────
.git/
.github/
.gitignore

# ─── Ambienti di sviluppo ──────────────────────────────────────
.env
.env.*
!.env.example

# ─── Editor e OS ───────────────────────────────────────────────
.DS_Store
*.swp
*.swo
.vscode/
.idea/

# ─── Test e coverage ───────────────────────────────────────────
coverage/
*.test.js
*.spec.js
__tests__/

# ─── Log ───────────────────────────────────────────────────────
*.log
npm-debug.log*

# ─── Docker stesso ─────────────────────────────────────────────
Dockerfile*
docker-compose*.yml
`;

export async function dockerizeCommand() {
  console.log(chalk.bold.blue('\n  PMI Dockerize — Generazione file Docker\n'));

  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'stack',
      message: 'Seleziona il tuo stack:',
      choices: ['Node.js', 'PHP', 'Python', 'Go'],
    },
    {
      type: 'input',
      name: 'port',
      message: 'Porta dell\'applicazione:',
      default: '3000',
      validate: v => /^\d+$/.test(v) || 'Inserisci un numero di porta valido',
    },
    {
      type: 'confirm',
      name: 'overwrite',
      message: 'Sovrascrivere file esistenti (Dockerfile, docker-compose.yml)?',
      default: false,
      when: () => {
        const cwd = process.cwd();
        return fs.existsSync(path.join(cwd, 'Dockerfile')) ||
               fs.existsSync(path.join(cwd, 'docker-compose.yml'));
      },
    },
  ]);

  //? Mappa stack → chiave template
  const stackMap = { 'Node.js': 'node', 'PHP': 'php', 'Python': 'python', 'Go': 'go' };
  const stackKey = stackMap[answers.stack];

  //? Versioni default da config
  const versions = {
    node:   config.defaults.nodeVersion,
    php:    config.defaults.phpVersion,
    python: config.defaults.pythonVersion,
    go:     config.defaults.goVersion,
  };

  const { dockerfile, compose } = TEMPLATES[stackKey](answers.port, versions[stackKey]);

  const cwd = process.cwd();

  //! Non sovrascriviamo senza conferma esplicita
  const write = (filename, content) => {
    const fullPath = path.join(cwd, filename);
    if (fs.existsSync(fullPath) && !answers.overwrite) {
      console.log(chalk.yellow(`  ⚠  ${filename} già esistente — skipped`));
      return;
    }
    fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
    console.log(chalk.green(`  ✔  ${filename} generato`));
  };

  write('Dockerfile', dockerfile);
  write('docker-compose.yml', compose);
  write('.dockerignore', DOCKERIGNORE);

  console.log(chalk.bold.green('\n  ✔  Dockerizzazione completata!'));
  console.log(chalk.gray('\n  Prossimi passi:'));
  console.log(chalk.cyan('    pmi build       # builda l\'immagine'));
  console.log(chalk.cyan('    pmi up           # avvia i servizi\n'));
}
