# PMI - Package Manager Interface

PMI è un tool CLI che permette di diagnosticare e gestire l'ambiente di sviluppo, inclusi Node.js, npm, Yarn, PHP, Composer e Docker.  

---

## Features

- Diagnosi completa dell'ambiente di sviluppo (`pmi doctor`)
- Controllo versioni e stato di Node.js, npm, Yarn, PHP, Composer e Docker
- Comandi CLI modulari per installazioni, aggiornamenti e pulizia
- Facile da usare come comando globale senza pubblicare su npm
- Supporta ES modules e Node.js >=18

---

## Installazione 

Per installare `pmi` sul tuo computer basta eseguire questi passaggi:

1. Clona il repository:

```bash
git clone https://github.com/HNOWFoundation/pmi.git
cd pmi
````

2. Installa le dipendenze:

```bash
sudo npm install 
```

3. Collega `pmi` come comando globale:

```bash
npm link
```

4. Verifica l’installazione:

```bash
pmi doctor
```

---

## Comandi principali

| Comando           | Descrizione                                    |
| ----------------- | ---------------------------------------------- |
| `pmi doctor`      | Diagnostica completa dell'ambiente di sviluppo |
| `pmi install`     | Installa un pacchetto o dipendenza             |
| `pmi update`      | Aggiorna pacchetti o dipendenze                |
| `pmi clean`       | Pulisce cache e file temporanei                |
| `pmi uninstall`   | Rimuove un pacchetto o dipendenza              |
| `pmi self-update` | Aggiorna PMI stesso                            |
| `pmi dockerize`   | Genera un file di prova `Dockerfile`          |

---

## Contribuire

1. Fai un fork del progetto
2. Crea un branch per la tua feature/fix: `git checkout -b feature/nome-feature`
3. Fai commit delle modifiche: `git commit -m "Descrizione"`
4. Pusha il branch: `git push origin feature/nome-feature`
5. Apri una Pull Request su GitHub

---

## Licenza

Questo progetto è rilasciato sotto licenza **MIT**.
Vedi il file [LICENSE](LICENSE) per maggiori dettagli.
