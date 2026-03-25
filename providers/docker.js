import { execSync, spawnSync } from 'node:child_process';

// * ─────────────────────────────────────────────────────────────────
// * Docker Provider — gestione completa dell'engine Docker locale
// * Copre: versione, daemon, immagini, container, compose, prune
// * ─────────────────────────────────────────────────────────────────

export const dockerProvider = {

  // ─── Rilevamento base ───────────────────────────────────────────

  isInstalled() {
    try {
      execSync('docker --version', { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  },

  getVersion() {
    try {
      //? Restituisce la versione dal daemon (più accurata del CLI)
      const raw = execSync('docker version --format "{{.Server.Version}}"', { encoding: 'utf8' });
      return raw.trim();
    } catch {
      //! Fallback: il daemon potrebbe non essere avviato
      try {
        return execSync('docker --version', { encoding: 'utf8' }).trim();
      } catch {
        return null;
      }
    }
  },

  // ─── Stato daemon ───────────────────────────────────────────────

  isDaemonRunning() {
    //? docker info fallisce con exit code != 0 se il daemon è offline
    try {
      execSync('docker info', { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  },

  getInfo() {
    try {
      return execSync(
        'docker info --format "Containers={{.Containers}} Running={{.ContainersRunning}} Images={{.Images}} OS={{.OperatingSystem}} Arch={{.Architecture}}"',
        { encoding: 'utf8' }
      ).trim();
    } catch {
      return null;
    }
  },

  // ─── Container ──────────────────────────────────────────────────

  listContainers(all = false) {
    //? --format json disponibile da Docker 23+ — usiamo table per compatibilità
    try {
      const flag = all ? '-a' : '';
      return execSync(
        `docker ps ${flag} --format "table {{.ID}}\t{{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"`,
        { encoding: 'utf8' }
      ).trim();
    } catch {
      return null;
    }
  },

  stopContainer(nameOrId) {
    //! Invia SIGTERM e attende 10s, poi SIGKILL automaticamente
    execSync(`docker stop ${nameOrId}`, { stdio: 'inherit' });
  },

  startContainer(nameOrId) {
    execSync(`docker start ${nameOrId}`, { stdio: 'inherit' });
  },

  restartContainer(nameOrId) {
    execSync(`docker restart ${nameOrId}`, { stdio: 'inherit' });
  },

  removeContainer(nameOrId, force = false) {
    //! force=true rimuove anche container in esecuzione — usare con cautela
    const flag = force ? '-f' : '';
    execSync(`docker rm ${flag} ${nameOrId}`, { stdio: 'inherit' });
  },

  execShell(nameOrId, shell = 'sh') {
    //? spawnSync gestisce il TTY interattivo — execSync non lo supporta
    spawnSync('docker', ['exec', '-it', nameOrId, shell], { stdio: 'inherit' });
  },

  getLogs(nameOrId, tail = 100, follow = false) {
    const args = ['logs', '--tail', String(tail)];
    if (follow) args.push('-f');
    args.push(nameOrId);
    spawnSync('docker', args, { stdio: 'inherit' });
  },

  getStats(nameOrId = '') {
    //? --no-stream = snapshot singolo invece di live stream
    const args = ['stats', '--no-stream', '--format',
      'table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}'];
    if (nameOrId) args.push(nameOrId);
    spawnSync('docker', args, { stdio: 'inherit' });
  },

  inspect(nameOrId) {
    try {
      return execSync(`docker inspect ${nameOrId}`, { encoding: 'utf8' });
    } catch {
      return null;
    }
  },

  getPorts(nameOrId) {
    try {
      return execSync(`docker port ${nameOrId}`, { encoding: 'utf8' }).trim();
    } catch {
      return null;
    }
  },

  // ─── Immagini ───────────────────────────────────────────────────

  listImages() {
    try {
      return execSync(
        'docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.ID}}\t{{.Size}}\t{{.CreatedSince}}"',
        { encoding: 'utf8' }
      ).trim();
    } catch {
      return null;
    }
  },

  pullImage(image) {
    execSync(`docker pull ${image}`, { stdio: 'inherit' });
  },

  removeImage(image, force = false) {
    //! force=true rimuove anche se usata da container fermi
    const flag = force ? '-f' : '';
    execSync(`docker rmi ${flag} ${image}`, { stdio: 'inherit' });
  },

  buildImage(tag, contextPath = '.', dockerfile = 'Dockerfile') {
    execSync(`docker build -t ${tag} -f ${dockerfile} ${contextPath}`, { stdio: 'inherit' });
  },

  // ─── Docker Compose ─────────────────────────────────────────────

  hasCompose() {
    //? Supporta "docker compose" (plugin v2) e "docker-compose" (standalone v1)
    try {
      execSync('docker compose version', { stdio: 'ignore' });
      return 'v2';
    } catch {
      try {
        execSync('docker-compose --version', { stdio: 'ignore' });
        return 'v1';
      } catch {
        return false;
      }
    }
  },

  composeBin() {
    return this.hasCompose() === 'v2' ? 'docker compose' : 'docker-compose';
  },

  composeUp(detach = true) {
    const flag = detach ? '-d' : '';
    execSync(`${this.composeBin()} up ${flag} --build`, { stdio: 'inherit' });
  },

  composeDown(removeVolumes = false) {
    const flag = removeVolumes ? '-v' : '';
    execSync(`${this.composeBin()} down ${flag}`, { stdio: 'inherit' });
  },

  composeLogs(service = '', tail = 100, follow = false) {
    const args = ['logs', `--tail=${tail}`];
    if (follow) args.push('-f');
    if (service) args.push(service);
    spawnSync(this.hasCompose() === 'v2' ? 'docker' : 'docker-compose',
      this.hasCompose() === 'v2' ? ['compose', ...args] : args,
      { stdio: 'inherit' }
    );
  },

  composeBuild(service = '', noCache = false) {
    const cacheFlag = noCache ? '--no-cache' : '';
    execSync(`${this.composeBin()} build ${cacheFlag} ${service}`.trim(), { stdio: 'inherit' });
  },

  composeRestart(service = '') {
    execSync(`${this.composeBin()} restart ${service}`.trim(), { stdio: 'inherit' });
  },

  composePs() {
    try {
      return execSync(`${this.composeBin()} ps`, { encoding: 'utf8' }).trim();
    } catch {
      return null;
    }
  },

  composeExec(service, cmd = 'sh') {
    spawnSync('sh', ['-c', `${this.composeBin()} exec ${service} ${cmd}`], { stdio: 'inherit' });
  },

  // ─── Pulizia ────────────────────────────────────────────────────

  pruneContainers() {
    //! Rimuove TUTTI i container fermati — irreversibile
    execSync('docker container prune -f', { stdio: 'inherit' });
  },

  pruneImages(all = false) {
    //! all=true: rimuove anche immagini non usate, non solo dangling
    const flag = all ? '-a' : '';
    execSync(`docker image prune -f ${flag}`.trim(), { stdio: 'inherit' });
  },

  pruneVolumes() {
    //! ATTENZIONE: perdita di dati se i volumi non sono backuppati
    execSync('docker volume prune -f', { stdio: 'inherit' });
  },

  pruneSystem(all = false) {
    //! all=true pulisce davvero tutto — usare solo in dev/CI
    const flag = all ? '-a' : '';
    execSync(`docker system prune -f ${flag}`.trim(), { stdio: 'inherit' });
  },

  getDiskUsage() {
    try {
      return execSync('docker system df', { encoding: 'utf8' }).trim();
    } catch {
      return null;
    }
  },

  // ─── Network ────────────────────────────────────────────────────

  listNetworks() {
    try {
      return execSync(
        'docker network ls --format "table {{.Name}}\t{{.Driver}}\t{{.Scope}}"',
        { encoding: 'utf8' }
      ).trim();
    } catch {
      return null;
    }
  },

  // ─── Volumes ────────────────────────────────────────────────────

  listVolumes() {
    try {
      return execSync(
        'docker volume ls --format "table {{.Name}}\t{{.Driver}}\t{{.Mountpoint}}"',
        { encoding: 'utf8' }
      ).trim();
    } catch {
      return null;
    }
  },
};

// * ─── Status helper (usato da commands/status/docker.*) ──────────

export function dockerStatus() {
  const installed = dockerProvider.isInstalled();
  const version   = installed ? dockerProvider.getVersion() : null;
  const daemon    = installed ? dockerProvider.isDaemonRunning() : false;
  return { installed, version, daemon };
}
