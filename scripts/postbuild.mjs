// Post-build: tiene pulita la cartella /images/.
//
// Astro scrive nella cartella degli asset (build.assets = "images") anche gli script
// che emette per conto suo (View Transitions, animazioni). Qui spostiamo in /_astro/
// tutto ciò che non è un'immagine, aggiornando i riferimenti in HTML e XML.
//
// Le immagini restano in /images/<nome-descrittivo>.<hash>.<ext>.

import { existsSync } from 'node:fs';
import { mkdir, readdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';

const DIST = 'dist';
const IMAGES = path.join(DIST, 'images');
const ASSETS = path.join(DIST, '_astro');
const IMAGE_EXT = /\.(jpe?g|png|gif|webp|avif|svg|ico)$/i;

if (!existsSync(IMAGES)) {
  process.exit(0);
}

// 1) Sposta fuori da /images/ i file che non sono immagini
await mkdir(ASSETS, { recursive: true });
const moved = [];
for (const name of await readdir(IMAGES)) {
  if (IMAGE_EXT.test(name)) continue;
  await rename(path.join(IMAGES, name), path.join(ASSETS, name));
  moved.push(name);
}

if (moved.length === 0) {
  process.exit(0);
}

// 2) Aggiorna i riferimenti in HTML e XML
const targets = [];
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full);
    else if (/\.(html|xml)$/i.test(entry.name)) targets.push(full);
  }
}
await walk(DIST);

for (const file of targets) {
  let content = await readFile(file, 'utf8');
  let changed = false;
  for (const name of moved) {
    const from = `images/${name}`;
    if (content.includes(from)) {
      content = content.split(from).join(`_astro/${name}`);
      changed = true;
    }
  }
  if (changed) await writeFile(file, content);
}

console.log(
  `[postbuild] ${moved.length} file non-immagine spostati da /images/ a /_astro/`,
);
