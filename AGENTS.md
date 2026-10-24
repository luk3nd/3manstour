# 3 Man's Tour — istruzioni per gli assistenti AI

Sito statico (Astro 7 + Tailwind 4) pubblicato su Plesk. Questo file dice **cosa puoi
scrivere e modificare** senza rompere la build.

## ⚠️ Regola d'oro

Il contenuto è **validato da uno schema** (`src/content.config.ts`). Se usi un campo
non previsto, un **tag fuori elenco** o un autore inesistente, **la build fallisce** e il
sito non si aggiorna. Usa **solo** i valori elencati in questo file.

---

## 1. Scrivere un articolo del blog

- **Percorso:** `src/content/blog/<slug>.mdx` → l'URL diventa `/blog/<slug>`
  (es. `passo-crocedomini.mdx` → `/blog/passo-crocedomini`)
- **Copertina:** un'immagine nella **stessa cartella**, es. `passo-crocedomini.jpg`,
  richiamata come `./passo-crocedomini.jpg`

### Frontmatter — tutti i campi

| Campo | Tipo | Obbligatorio | Default | Note |
|---|---|---|---|---|
| `title` | testo | **sì** | — | Titolo dell'articolo (diventa l'H1 della pagina) |
| `description` | testo | **sì** | — | 1–2 frasi: SEO e anteprime |
| `pubDate` | data `AAAA-MM-GG` | **sì** | — | Data di pubblicazione |
| `updatedDate` | data `AAAA-MM-GG` | no | — | Mostrata come "Ultimo aggiornamento" |
| `cover` | immagine | **sì** | — | `./nome-file.jpg` (stessa cartella) |
| `coverAlt` | testo | no | il titolo | Descrizione dell'immagine (accessibilità) |
| `author` | id autore | **sì** | — | Uno tra: `guido`, `luca`, `stefano` |
| `category` | testo | no | `luoghi` | Uno tra: `fiere`, `ristoranti`, `luoghi`, `esperienze` |
| `tags` | elenco di testo | no | `[]` | **Solo** i tag dell'elenco qui sotto |
| `draft` | vero/falso | no | `false` | `true` = non pubblicato (non compare da nessuna parte) |
| `featured` | vero/falso | no | `false` | `true` = è il "Reportage scelto" in home (vince il più recente) |
| `place` | testo | no | — | Scheda del reportage: dove (es. `Passo Crocedomini (BS)`) |
| `altitude` | testo | no | — | Scheda: quota (es. `1.895 m`) |
| `duration` | testo | no | — | Scheda: tempo (es. `2 giorni`) |
| `withWhom` | testo | no | — | Scheda: con chi |
| `highlights` | elenco di testo | no | `[]` | Scheda: "Cosa abbiamo trovato" (max 3 punti) |

### Tag ammessi — SOLO questi

```text
eventi · fiere · luoghi · esplorazione · città · fuori Italia · cibo · design
```

> Un tag fuori da questo elenco **blocca la build**. Se serve un tag nuovo, va prima
> aggiunto allo schema `src/content.config.ts` (chiedilo, non inventarlo).

### Categorie ammesse — SOLO queste

| slug | etichetta |
|---|---|
| `fiere` | Fiere |
| `ristoranti` | Ristoranti |
| `luoghi` | Luoghi |
| `esperienze` | Esperienze |

### Esempio completo

```mdx
---
title: "Quella volta al Passo Crocedomini"
description: "Un'escursione improvvisata tra i radar dell'ex base NATO e qualche lezione imparata."
pubDate: 2024-03-13
updatedDate: 2026-10-10
cover: "./passo-crocedomini.jpg"
coverAlt: "I radar dell'ex base NATO sul Passo Crocedomini"
author: "stefano"
category: "luoghi"
tags: ["luoghi", "esplorazione"]
draft: false
featured: true
---

Testo dell'articolo in Markdown…

## Il luogo

Altro testo…
```

### Titoli e indice automatico

- `## Titolo` (h2) e `### Sottotitolo` (h3) finiscono **automaticamente** nell'indice a
  sinistra della pagina (niente link da scrivere a mano).
- `#### …` (h4) **non** entra nell'indice.
- **Non** scrivere `#` (h1): il titolo arriva dal frontmatter.

---

## 2. Autori

- **Percorso:** `src/content/authors/<id>.json` → pagina `/autori/<id>`
- **Id esistenti:** `guido`, `luca`, `stefano`

| Campo | Obbligatorio | Note |
|---|---|---|
| `name` | **sì** | Nome mostrato |
| `role` | no | es. "Fotografo" (default: "Autore") |
| `bio` | **sì** | Biografia estesa |
| `shortBio` | no | Versione breve per le card |
| `avatar` | **sì** | `./avatar-<id>.jpg` (stessa cartella) |
| `email` | no | |
| `socials` | no | oggetto con `x`, `linkedin`, `github`, `instagram`, `website` (URL) |

---

## 3. Pagine interne

- **Percorso:** `src/content/pages/<slug>.md` → URL `/<slug>`
  (es. `chi-siamo.md` → `/chi-siamo`). Sono già presenti: `cookie-policy`,
  `privacy-policy`.
- **Nota:** la home, l'elenco blog, la pagina autori e "Il progetto" **non** sono
  contenuti: sono pagine di codice (`src/pages/*.astro`), non si creano da qui.

| Campo | Obbligatorio | Note |
|---|---|---|
| `title` | **sì** | Titolo della pagina |
| `description` | **sì** | Per la SEO |
| `subtitle` | no | Sottotitolo nell'hero |
| `cover` | no | `./nome-file.jpg` (copertina) |
| `coverAlt` | no | Descrizione della copertina |
| `updatedDate` | no | Data `AAAA-MM-GG` |
| `draft` | no | `true` = non pubblicata |
| `order` | no | Numero, per l'ordinamento |

---

## 4. Domande frequenti (FAQ)

- Si scrivono **nel frontmatter dell'articolo** (o della pagina), sotto `faq:`
- Sono **specifiche di quel post**: non esiste un elenco condiviso
- Compaiono **in fondo all'articolo**, sotto il titolo "Domande frequenti"
- Il markup `FAQPage` è generato da solo: non va scritto a mano
- Se non ci sono domande, **la sezione non compare**

```yaml
faq:
  - question: "Si può arrivare ai radar in auto?"
    answer: "No: gli ultimi chilometri vanno fatti a piedi."
  - question: "Serve attrezzatura particolare?"
    answer: "Scarpe adatte, acqua e uno strato in più."
```

> `question` e `answer` sono **testo semplice**: niente Markdown o HTML.
> Le domande sono **facoltative** (default: nessuna).

---

## 5. Galleria della home

- **Percorso:** `src/content/gallery/<slug>.md` + immagine nella stessa cartella
- **Una foto per file**, come gli articoli.
- Si gestisce dal CMS, collezione **Galleria**: carichi la foto, scrivi descrizione e
  didascalia, imposti l'ordine.

| Campo | Obbligatorio | Note |
|---|---|---|
| `image` | **sì** | `./nome-file.webp` |
| `alt` | **sì** | cosa si vede (accessibilità + SEO) |
| `caption` | no | didascalia mostrata sotto la foto |
| `order` | no | numero: **più basso = prima** in galleria |
| `draft` | no | `true` = non appare |

## 6. Regole tecniche da rispettare

- **Immagini:** ridimensionale **prima** di salvarle (lato lungo ~2000 px, JPEG qualità ~80).
  Astro le ottimizza per il sito, ma Git conserva **per sempre** gli originali: file enormi
  appesantiscono il repository in modo irreversibile.
- **URL:** sempre **senza slash finale** (`/blog/slug`, non `/blog/slug/`).
- **Non toccare i file generati:** `dist/`, `/images/`, `/_astro/`, il branch `deploy` e la
  cartella `httpdocs` su Plesk. Si rigenerano a ogni pubblicazione.
- **Niente credenziali nei file.** La configurazione SMTP vive fuori dal sito e non è
  versionata.
- **Codice ≠ contenuto.** Layout, componenti, `src/pages/*.astro`, `src/config.ts` e i
  workflow sono codice: non modificarli per scrivere contenuti. Se serve un cambiamento di
  struttura, chiedilo.

## 7. Pubblicare

Commit e push su `main` → GitHub Actions compila e pubblica automaticamente su Plesk.
Non serve caricare nulla a mano.

### Checklist prima di pubblicare

- [ ] `title`, `description`, `pubDate`, `cover`, `author` presenti
- [ ] `author` è uno tra `guido`, `luca`, `stefano`
- [ ] `category` è una tra `fiere`, `ristoranti`, `luoghi`, `esperienze`
- [ ] ogni `tags` è nell'elenco ammesso
- [ ] l'immagine `cover` esiste nella stessa cartella e ha un `coverAlt` sensato
- [ ] i titoli interni usano `##` / `###` (non `#`)
- [ ] `draft: true` se non va ancora pubblicato
- [ ] se ci sono `faq`, ogni voce ha sia `question` sia `answer`
