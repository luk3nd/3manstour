import { SITE } from '../config';

export function GET() {
  const sitemap = new URL('sitemap-index.xml', SITE.url).href;
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
