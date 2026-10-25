# Style guide — 3 Man's Tour

Regole condivise da tutte le pagine. Se una pagina se ne discosta, è un errore, non una variante.

## 1. Struttura di pagina

- **Hero di pagina** (non home, non articolo): compatta, testo a sinistra, senza foto di sfondo.
  `breadcrumb → eyebrow → h1.page-title → sottotitolo → riga arancione`.
- Ogni sezione successiva apre con `.section-head`:
  `p.section-index` (numero + nome) · `h2` · slot laterale facoltativo.
- Ritmo verticale unico: `--section-y` (padding delle sezioni).
- Larghezza: `.container` per il layout, `.container-narrow` (46rem) per i testi lunghi.

## 2. Tipografia

- Titoli: **Barlow Condensed 600**, `letter-spacing: -0.015em`.
- Testo: **DM Sans 16px** minimo per tutto ciò che va letto.
- Etichette: **JetBrains Mono** maiuscolo, `0.16em`.
- Accento: `<em>` nei titoli = arancione (bianco su fondo arancione).

## 3. Colori

`--ink #0a0a08` · `--surface #131311` · `--paper #f3f0e8` · `--muted #9c988e`
`--orange #ff4e00` · `--line #2a2a26`

Niente altri colori. Niente grigi Tailwind fuori scala.

## 4. Forme

- **Angoli netti**: nessun `border-radius`.
- Filetti da `1px solid var(--line)`.
- Il divisore arancione segna solo la fine di una hero.

## 5. Componenti (riuso obbligatorio)

`.btn` (`--orange`, `--ghost`, `--dark`, `--small`) · `.text-link` · `.round-btn` ·
`.section-index` · `.micro` · `.tag-chip` · `.chip-cat` ·
`.about` / `.about__grid` / `.about__media` / `.about__copy` ·
`.team` · `.method` / `.method__steps` · `.manifesto` · `.cta` ·
`.post-card` (`--large`, `--small`) · `.gallery__*` · `.social__*`.

Nessuna pagina inventa una variante locale: se serve un blocco nuovo, prima si aggiunge qui.

## 6. Immagini

- Sempre via `astro:assets` (`<Image>`), mai file grezzi.
- Hero articolo: copertina di sfondo + velo, 50vh desktop.
- Blocchi editoriali: 4:3 o 1:1, `object-fit: cover`.

## 7. Movimento

Reveal leggero solo dove non nasconde contenuto. Se un'animazione può lasciare
una sezione invisibile, meglio nessuna animazione.
