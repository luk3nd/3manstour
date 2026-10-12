# 3 Man's Tour

Sito web statico costruito con **Astro 7** + **Tailwind CSS 4**, con un modulo contatti
in **PHP** (invio email via SMTP). Pensato per il deploy su **Plesk**, con un ambiente
locale in **Docker/OrbStack** che replica lo stesso stack.

## Caratteristiche

- Home page (hero, missione, categorie, Instagram, diario, team)
- **Pagina "Il progetto"** dedicata (`src/pages/chi-siamo.astro`): team con foto, storia e nome, metodo
- **Blocco Instagram** curato a mano (`src/components/InstagramFeed.astro`): griglia di post scelti con link
- **Blog**: elenco con paginazione e filtro per tag, più pagine dedicate per tag
- **Template articolo**: hero con copertina, titolo, data, autore e tag; box autore in fondo
- **Pagine autore**: hero con foto, nome, bio + elenco degli articoli dell'autore
- **Pagine interne**: template con hero (titolo, sottotitolo, copertina)
- **SEO**: sitemap, `robots.txt`, metatag generali / pagine / blog, Open Graph, JSON-LD
- **Immagini ottimizzate**: ridimensionate e convertite in WebP in fase di build
- **Draft**: gli articoli con `draft: true` sono esclusi da pagine, elenchi, sitemap e RSS
- **Feed RSS** in `/rss.xml`
- **Modulo contatti PHP** con antispam (honeypot) e invio SMTP

## Requisiti

- Node.js 20+ (testato con Node 26)
- Per il test locale del PHP: **OrbStack** (o Docker Desktop)

## Avvio rapido

```bash
npm install

# Genera immagini placeholder (se non hai ancora le immagini reali)
npm run placeholders

# Sviluppo (Astro, senza PHP)
npm run dev            # http://localhost:4321

# Build di produzione
npm run build          # genera la cartella dist/
npm run preview        # anteprima della build
```

## Contenuti

Tutti i contenuti vivono in `src/content/`:

| Cosa | Dove | Note |
|------|------|------|
| Articoli | `src/content/blog/*.mdx` | Markdown + componenti |
| Autori | `src/content/authors/*.json` | Dati condivisi tra articolo e pagina autore |
| Pagine interne | `src/content/pages/*.md` | About, privacy, cookie, ecc. |

Gli schemi sono definiti in `src/content.config.ts`.

### Nuovo articolo

Crea `src/content/blog/mio-articolo.mdx`:

```mdx
---
title: "Titolo dell'articolo"
description: "Descrizione per la SEO e le anteprime."
pubDate: 2026-10-01
cover: "./cover-mio-articolo.jpg"   # file nella stessa cartella
coverAlt: "Descrizione della copertina"
author: "luca"                      # id di un autore esistente
category: "luoghi"                  # fiere | ristoranti | luoghi | esperienze
tags: ["luoghi", "esplorazione"]    # solo i tag previsti dallo schema
draft: false
featured: false
---

Contenuto in Markdown…
```

### Nuovo autore

Crea `src/content/authors/mario-bianchi.json` con un avatar (`./avatar-mario.jpg`) nella
stessa cartella. Lo stesso dato alimenta la pagina `/autori/mario-bianchi/` e il box in
fondo agli articoli.

### Nuova pagina interna

Crea `src/content/pages/nome-pagina.md` (la URL sarà `/nome-pagina/`).

## Immagini

Astro ottimizza le immagini in build (resize + WebP/AVIF) tramite `astro:assets` e `sharp`.

- **Immagini di prova**: `npm run placeholders` (genera copertine e avatar segnaposto)
- **Immagini reali da Unsplash**: compila il manifest in `scripts/fetch-images.mjs` e lancia
  `npm run images`. Puoi prendere l'URL diretto da Unsplash e aggiungere parametri come
  `?w=2000&q=80&fm=jpg&fit=crop`.

L'og image di default è `public/og-default.jpg` (sostituibile).

### Immagini stock delle sezioni home

Le immagini di sfondo delle card ("Cosa esploriamo") sono in `src/assets/stock-*.jpg`,
da **StockSnap.io** (licenza CC0, uso libero anche commerciale, nessuna attribuzione richiesta).
Per sostituirle basta rimpiazzare i file omonimi.

### Blocco Instagram

`src/components/InstagramFeed.astro` mostra una griglia di 6 post scelti a mano. Le copertine
sono in `src/assets/instagram/` e i link puntano ai post reali: per aggiornare il blocco basta
sostituire le immagini e gli URL nell'array `posts` del componente. (Sono volutamente copertine
statiche invece degli embed nativi, che caricherebbero 6 iframe di Instagram e stonerebbero con
il tema scuro.)

## Modulo contatti (PHP + SMTP)

L'endpoint è `public/api/contact.php` (in build diventa `dist/api/contact.php`).
Usa **PHPMailer** via Composer e legge la configurazione dalle variabili d'ambiente.

```bash
cp .env.example .env     # poi compila host, porta, utente, password reali
```

### Test locale con OrbStack / Docker

> Il server di sviluppo di Astro **non** esegue PHP. Per testarlo serve Docker.

```bash
npm run build            # genera dist/ (con dist/api/contact.php e .htaccess)
npm run serve:php        # docker compose up --build  -> http://localhost:8080
```

Al primo avvio il container installa PHPMailer automaticamente
(`composer install` in `dist/api/`). Apri `http://localhost:8080/contatti/` e prova il form.

Se non hai configurato l'SMTP, l'endpoint risponde con un messaggio chiaro e logga il
messaggio invece di inviarlo.

### Deploy con Plesk Git (metodo principale)

Plesk Git pubblica **il contenuto del repository**, non il build. Per questo la Action
`.github/workflows/publish.yml` compila il sito e lo spinge sul branch **`deploy`**.

1. Ad ogni push su `main` la Action genera `dist/` (incluso `api/vendor` con PHPMailer) e lo
   pubblica sul branch `deploy` (cronologia mantenuta, nessun force push).
2. In Plesk: **Siti web e domini → Git → Aggiungi repository**:
   - **Repository URL**: `git@github.com:luk3nd/3manstour.git` (SSH) — Plesk **non** supporta
     l'autenticazione HTTP per i repo remoti: per un repo privato serve una chiave SSH.
   - Plesk genera una **chiave pubblica**: aggiungila su GitHub → repo → *Settings → Deploy keys*
     (senza write access).
   - **Repository name**: `3manstour`
   - **Deployment directory**: la document root del dominio (di solito `httpdocs`)
   - **Deployment mode**: `Automatic`
   - **Branch**: `deploy`
   - **Post deployment actions**: nessuna (il sito è statico)
3. Per il deploy automatico aggiungi in GitHub → *Settings → Webhooks* l'URL fornito da Plesk.

> Se rendi il repository **pubblico**, puoi usare l'URL HTTPS e non serve la chiave.

**Prima del primo deploy**: svuota la document root dal vecchio WordPress (file + `.htaccess`),
altrimenti il suo `index.php` e le regole di rewrite continuano a rispondere. Fai prima un backup
da Plesk (*Backup Manager*).

### Deploy alternativo via rsync (SSH)

Questa è la via alternativa (si avvia solo manualmente da GitHub → Actions). Serve l'accesso SSH.

`.github/workflows/deploy.yml` compila in CI (`npm ci && npm run build`) e carica `dist/` nella
document root di Plesk via **rsync su SSH**, trasferendo **solo i file cambiati**. Si avvia
manualmente, dopo aver impostato i segreti.

**Segreti da impostare** — GitHub → Settings → Secrets and variables → Actions:

| Segreto | Esempio | Note |
|---|---|---|
| `REMOTE_HOST` | `123.45.67.89` | host SSH del server Plesk |
| `REMOTE_USER` | `sito` | utente SSH di Plesk |
| `REMOTE_PORT` | `22` | porta SSH |
| `REMOTE_PATH` | `/var/www/vhosts/3manstour.com/httpdocs/` | **con lo slash finale** |
| `REMOTE_SSH_KEY` | `-----BEGIN OPENSSH PRIVATE KEY-----…` | chiave privata SSH |

**Preparazione lato Plesk**

1. Abilita l'accesso **SSH/SFTP** per l'utente del dominio (Plesk → dominio → Accesso SSH).
2. Genera una coppia di chiavi in locale (`ssh-keygen -t ed25519 -C deploy`) e aggiungi la
   **chiave pubblica** tra quelle autorizzate dell'utente (`~/.ssh/authorized_keys`).
3. Incolla la **chiave privata** nel segreto `REMOTE_SSH_KEY`.
4. Fai un push su `main` e controlla il risultato in GitHub → **Actions**.

**Attenzione**

- `api/vendor/` è **escluso** dal deploy (il form contatti usa PHPMailer via Composer). Se serve,
  installalo sul server con `composer install --working-dir=api`.
- Il flag `--delete` rimuove dalla document root i file non presenti in `dist/` (tranne gli
  esclusi). Se hai file gestiti a mano sul server, aggiungi un `--exclude` o togli `--delete`.
- Alternativa **senza SSH**: un'azione FTPS (es. `SamKirkland/FTP-Deploy-Action`) carica solo i file
  cambiati usando le credenziali FTP di Plesk.

### Deploy manuale (alternativa)

1. `npm run build`
2. Carica il **contenuto di `dist/`** nella document root del dominio.
3. Assicurati che la cartella `api/` contenga `contact.php` e il `vendor/` di PHPMailer
   (esegui `composer install --working-dir=api` sul server, oppure carica il `vendor/`
   generato in locale).
4. Imposta le variabili SMTP tra le impostazioni PHP di Plesk (o usa un file incluso non
   versionato). I nominativi sono gli stessi di `.env.example`.
5. Se cambi il dominio, aggiorna l'URL in **due punti**: `astro.config.mjs` e `src/config.ts`.

## SEO

- Sitemap generata automaticamente in `/sitemap-index.xml`
- `robots.txt` dinamico (`src/pages/robots.txt.ts`)
- Metatag a tre livelli: sito (`BaseLayout`), pagine (`PageLayout`), articoli
  (`BlogPostLayout`, con Open Graph article + JSON-LD `BlogPosting`)
- JSON-LD `Person`/`ProfilePage` per le pagine autore

## Analytics e Search Console

### Google Analytics 4

1. Imposta il Measurement ID in `src/config.ts` → `SITE.gaMeasurementId` (es. `G-XXXXXXXXXX`).
2. `src/components/ConsentBanner.astro` mostra il banner cookie e carica GA4 **solo dopo il
   consenso** (basic mode): prima dell'accettazione non viene contattato Google.
3. Il link "Preferenze cookie" nel footer riapre il banner.
4. Con `gaMeasurementId` vuoto, banner e analytics restano disattivati.

### Google Search Console

- **File HTML** (consigliato): scarica il file di verifica da Search Console e mettilo in `public/`;
  dopo la build finisce nella root del sito.
- **Meta tag** (alternativa): inserisci il codice in `src/config.ts` →
  `SITE.googleSiteVerification`.
- Sitemap da inviare: `https://www.3manstour.com/sitemap-index.xml`.

> In UE i cookie di analisi richiedono il consenso: se cambi fornitore o finalità, aggiorna
> `cookie-policy.md` e `privacy-policy.md`.

## Animazioni

Animazioni con **GSAP + ScrollTrigger** e **View Transitions** native di Astro.

- Modulo: `src/scripts/animations.ts`, inizializzato su `astro:page-load` (sicuro con le
  transizioni tra pagine).
- Attributi disponibili nel markup:
  - `data-hero-item` / `data-hero-image` — composizione in ingresso dell'hero.
  - `data-animate` — elemento da rivelare allo scroll.
  - `data-reveal` — sulla sezione: i `[data-animate]` interni si rivelano insieme (evita che
    le card di uno stesso blocco compaiano una alla volta).
  - `data-parallax="6"` — leggero parallax sull'immagine.
  - `data-counter="12"` — numero animato quando entra in viewport.
  - `data-tilt` — leggera inclinazione della card al passaggio del mouse.
- Con `prefers-reduced-motion: reduce` le animazioni sono disattivate e i contenuti restano visibili.
- Se gli script non partono, la classe `.js` su `<html>` viene rimossa e gli elementi
  `[data-animate]` tornano visibili.

> Script e View Transitions: gli script che manipolano il DOM (header, slider, banner cookie) devono
> agganciarsi all'evento `astro:page-load`, altrimenti si perdono dopo una navigazione client-side.

## Struttura

```
src/
  components/     Header, Footer, SEO, Hero, BlogCard, AuthorCard, AuthorBio, TagList, TagFilter, Pagination, ContactForm
  content/        blog (mdx), authors (json), pages (md)
  layouts/        BaseLayout, PageLayout, BlogPostLayout, AuthorLayout
  lib/            utils (date, slug, reading time)
  pages/          rotte
  styles/         global.css (Tailwind + design tokens)
  config.ts       dati del sito (nome, url, navigazione, contatti)
public/
  api/contact.php Endpoint PHP del modulo contatti
  .htaccess       ErrorDocument, cache, header
docker/           Dockerfile + entrypoint per il PHP locale
scripts/          fetch-images, generate-placeholders
```

## Personalizzazione rapida

- Colori, font e stili base: `src/styles/global.css` (`@theme` + `.prose`)
- Nome sito, URL, navigazione, contatti: `src/config.ts`
- URL di produzione: `astro.config.mjs` (chiave `site`)
