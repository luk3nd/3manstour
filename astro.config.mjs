// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// URL di produzione: cambia qui (e in src/config.ts) quando avrai il dominio.
export default defineConfig({
  site: 'https://www.3manstour.com',
  // URL senza slash finale (es. /contatti).
  // Il .htaccess serve /pagina da /pagina/index.html e reindirizza /pagina/ verso /pagina.
  trailingSlash: 'never',

  integrations: [
    mdx(),
    sitemap({
      // Esclude eventuali pagine di servizio dalla sitemap
      filter: (page) => !page.includes('/grazie'),
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
