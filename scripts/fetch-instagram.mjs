/**
 * Scarica gli ultimi post Instagram durante la build.
 * Se META_TOKEN non è impostato, non fa nulla: il sito usa la lista statica.
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const TOKEN = (process.env.META_TOKEN || '').trim();
const VERSION = (process.env.API_VERSION || 'v26.0').trim();
const OUT_DIR = 'src/assets/instagram/auto';
const OUT_JSON = 'src/data/instagram.generated.json';
const COUNT = 6;

const FIELDS = 'id,caption,media_type,media_product_type,thumbnail_url,media_url,permalink';

async function api(pathname, params) {
  const url = new URL(`https://graph.facebook.com/${VERSION}${pathname}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  url.searchParams.set('access_token', TOKEN);
  const res = await fetch(url);
  const json = await res.json();
  if (json.error) throw new Error(json.error.message);
  return json;
}

async function main() {
  if (!TOKEN) {
    console.log('[instagram] META_TOKEN assente: uso la lista statica');
    return;
  }

  let userId = (process.env.IG_USER_ID || '').trim();
  if (!userId) {
    const pages = await api('/me/accounts', {
      fields: 'instagram_business_account{id,username}',
      limit: '100',
    });
    userId = (pages.data || []).find((p) => p.instagram_business_account)?.instagram_business_account?.id || '';
  }
  if (!userId) throw new Error('nessun account Instagram Business collegato alla Pagina');

  const media = await api(`/${userId}/media`, { fields: FIELDS, limit: '12' });
  const picks = (media.data || [])
    .map((m) => ({ ...m, image: m.thumbnail_url || m.media_url }))
    .filter((m) => m.image && m.permalink)
    .slice(0, COUNT);

  if (!picks.length) {
    console.log('[instagram] nessun post con immagine');
    return;
  }

  await fs.mkdir(OUT_DIR, { recursive: true });
  const items = [];
  for (const [i, post] of picks.entries()) {
    const res = await fetch(post.image);
    if (!res.ok) continue;
    const file = `${String(i).padStart(2, '0')}.jpg`;
    await fs.writeFile(path.join(OUT_DIR, file), Buffer.from(await res.arrayBuffer()));
    const caption = (post.caption || '').split('\n')[0].trim();
    items.push({
      file,
      url: post.permalink,
      alt: caption || 'Post Instagram di 3 Man’s Tour',
      caption: caption.slice(0, 60),
    });
  }

  await fs.mkdir(path.dirname(OUT_JSON), { recursive: true });
  await fs.writeFile(
    OUT_JSON,
    JSON.stringify({ items, fetchedAt: new Date().toISOString() }, null, 2),
  );
  console.log(`[instagram] aggiornati ${items.length} post`);
}

main().catch((error) => {
  console.warn('[instagram] fetch non riuscito, resto sulla lista statica:', error.message);
});
