/**
 * Scarica immagini reali (Unsplash o fonti compatibili) e le salva in locale,
 * pronte per essere ridimensionate e convertite in WebP da Astro in fase di build.
 *
 * Uso:
 *   node scripts/fetch-images.mjs           # scarica solo le immagini mancanti
 *   node scripts/fetch-images.mjs --force   # riscarica tutto
 *
 * Come ottenere un URL diretto da Unsplash:
 *   1. Apri la foto su unsplash.com
 *   2. Tasto destro sull'immagine → "Copia indirizzo immagine" (images.unsplash.com/photo-...)
 *   3. Aggiungi i parametri di rendering, es. ?w=2000&q=80&fm=jpg&fit=crop
 *
 * Le immagini vanno referenziate nel frontmatter dei contenuti con un percorso
 * relativo al file, es. cover: "./cover-mio-articolo.jpg"
 */
import { mkdir, access, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const force = process.argv.includes('--force');

/** Elenco delle immagini da scaricare. Aggiungi qui le tue. */
const manifest = [
  // Esempio (rimuovi il commento e incolla URL e percorso reali):
  // {
  //   out: 'src/content/blog/mio-articolo/cover.jpg',
  //   url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=2000&q=80&fm=jpg&fit=crop',
  //   credit: 'Foto di Fotografo su Unsplash',
  // },
];

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function download(item) {
  const out = resolve(root, item.out);

  if (!force && (await exists(out))) {
    console.log('· salto (già presente):', item.out);
    return;
  }

  const response = await fetch(item.url, {
    headers: { 'User-Agent': 'openchamber-image-fetcher/1.0' },
  });

  if (!response.ok) {
    throw new Error(`Download fallito (${response.status}) per ${item.url}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, buffer);
  console.log('✓ scaricata:', item.out, item.credit ? `— ${item.credit}` : '');
}

if (manifest.length === 0) {
  console.log('Nessuna immagine nel manifest. Aggiungile in scripts/fetch-images.mjs.');
  console.log('In alternativa usa "npm run placeholders" per immagini di prova.');
  process.exit(0);
}

for (const item of manifest) {
  await download(item);
}
console.log('Fatto.');
