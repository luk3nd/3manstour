/**
 * Genera immagini placeholder locali (copertine blog, avatar autori, og image)
 * usando sharp. Utile per far girare il progetto senza dipendere dalla rete.
 *
 * Uso:  npm run placeholders
 *
 * Quando avrai le immagini vere, sostituisci i file in:
 *   - src/content/authors/   (avatar)
 *   - src/content/blog/      (copertine)
 *   - src/content/pages/     (copertine pagine interne)
 *   - public/og-default.jpg  (immagine social di default)
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function coverSvg({ w, h, from, to, label = '' }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${from}"/>
        <stop offset="1" stop-color="${to}"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <circle cx="${w * 0.82}" cy="${h * 0.2}" r="${h * 0.35}" fill="#ffffff" opacity="0.08"/>
    <circle cx="${w * 0.15}" cy="${h * 0.85}" r="${h * 0.28}" fill="#000000" opacity="0.1"/>
    ${
      label
        ? `<text x="50%" y="52%" text-anchor="middle" dominant-baseline="middle"
             font-family="Helvetica, Arial, sans-serif" font-size="${h * 0.28}"
             font-weight="700" fill="#ffffff" opacity="0.9">${label}</text>`
        : ''
    }
  </svg>`;
}

function avatarSvg({ w, h, from, to, label }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${from}"/>
        <stop offset="1" stop-color="${to}"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <text x="50%" y="52%" text-anchor="middle" dominant-baseline="middle"
      font-family="Helvetica, Arial, sans-serif" font-size="${h * 0.4}"
      font-weight="700" fill="#ffffff" opacity="0.92">${label}</text>
  </svg>`;
}

function heroSvg({ w, h, to }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#080808"/>
        <stop offset="0.65" stop-color="#140b03"/>
        <stop offset="1" stop-color="${to}"/>
      </linearGradient>
      <radialGradient id="glow" cx="0.5" cy="0.82" r="0.75">
        <stop offset="0" stop-color="#ff6a00" stop-opacity="0.55"/>
        <stop offset="1" stop-color="#ff6a00" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#sky)"/>
    <rect width="100%" height="100%" fill="url(#glow)"/>
    <rect y="${h * 0.84}" width="100%" height="${h * 0.16}" fill="#000000" opacity="0.35"/>
  </svg>`;
}

async function render(job) {
  const svg =
    job.kind === 'avatar'
      ? avatarSvg(job)
      : job.kind === 'hero'
        ? heroSvg(job)
        : coverSvg(job);

  const out = resolve(root, job.out);
  await mkdir(dirname(out), { recursive: true });

  await sharp(Buffer.from(svg))
    .jpeg({ quality: 82 })
    .toFile(out);

  return job.out;
}

const jobs = [
  // Avatar autori
  { kind: 'avatar', out: 'src/content/authors/avatar-giulia.jpg', w: 600, h: 600, from: '#4f46e5', to: '#a855f7', label: 'GB' },
  { kind: 'avatar', out: 'src/content/authors/avatar-marco.jpg', w: 600, h: 600, from: '#0ea5e9', to: '#22c55e', label: 'MR' },
  { kind: 'avatar', out: 'src/content/authors/avatar-luca.jpg', w: 600, h: 600, from: '#f59e0b', to: '#ef4444', label: 'LV' },

  // Copertine blog (tema arancione/scuro)
  { kind: 'cover', out: 'src/content/blog/cover-fiere.jpg', w: 1600, h: 900, from: '#1a0f05', to: '#ff6a00' },
  { kind: 'cover', out: 'src/content/blog/cover-borgo.jpg', w: 1600, h: 900, from: '#0a0a0a', to: '#7a3a00' },
  { kind: 'cover', out: 'src/content/blog/cover-brutalismo.jpg', w: 1600, h: 900, from: '#141414', to: '#9c4a10' },
  { kind: 'cover', out: 'src/content/blog/cover-mercati.jpg', w: 1600, h: 900, from: '#1a0a00', to: '#f55d00' },
  { kind: 'cover', out: 'src/content/blog/cover-sentiero.jpg', w: 1600, h: 900, from: '#0a0c0a', to: '#c96a1a' },
  { kind: 'cover', out: 'src/content/blog/cover-periferie.jpg', w: 1600, h: 900, from: '#0a0a0f', to: '#ff8c42' },

  // Copertina pagina interna
  { kind: 'cover', out: 'src/content/pages/cover-chi-siamo.jpg', w: 1600, h: 900, from: '#141414', to: '#ff6a00' },

  // Hero home (dark + glow arancione)
  { kind: 'hero', out: 'src/assets/hero.jpg', w: 1920, h: 1080, from: '#080808', to: '#ff6a00' },

  // OG image di default
  { kind: 'cover', out: 'public/og-default.jpg', w: 1200, h: 630, from: '#080808', to: '#ff6a00' },
];

const results = [];
for (const job of jobs) {
  results.push(await render(job));
}

console.log('Immagini placeholder generate:');
for (const file of results) console.log('  -', file);
