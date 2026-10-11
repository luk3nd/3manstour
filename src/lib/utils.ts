/**
 * Formatta una data in italiano esteso, es. "3 marzo 2026".
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/**
 * Formatta una data in formato macchina (ISO, solo giorno).
 */
export function isoDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Trasforma un testo in uno slug URL-safe.
 */
export function slugify(input: string): string {
  return input
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Stima i minuti di lettura dal corpo del contenuto (markdown/HTML).
 */
export function readingTime(body = '', wordsPerMinute = 200): number {
  const text = body.replace(/<[^>]+>/g, ' ').replace(/[#*_>`~\-\[\]()]/g, ' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / wordsPerMinute));
}

/**
 * Restituisce tutti i tag univoci presenti in una lista di post.
 */
export function uniqueTags(posts: { data: { tags: string[] } }[]): string[] {
  const set = new Set<string>();
  for (const post of posts) {
    for (const tag of post.data.tags ?? []) set.add(tag);
  }
  return [...set].sort((a, b) => a.localeCompare(b, 'it'));
}

/**
 * Tronca un testo a un numero massimo di caratteri, senza spezzare le parole.
 */
export function excerpt(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : max).trim()}…`;
}
