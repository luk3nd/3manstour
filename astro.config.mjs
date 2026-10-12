// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// URL di produzione: cambia qui (e in src/config.ts) quando avrai il dominio.
export default defineConfig({
  site: 'https://www.3manstour.com',
  // URL senza slash finale (es. /contatti)
  trailingSlash: 'never',

  // Le immagini vanno in /images/ (URL leggibili). Il resto degli asset in /_astro/.
  build: { assets: 'images' },

  integrations: [
    mdx(),
    sitemap({
      // Esclude eventuali pagine di servizio dalla sitemap
      filter: (page) => !page.includes('/grazie'),
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        output: {
          // Solo le immagini vanno in /images/; il resto (CSS, JS, font) resta in /_astro/
          assetFileNames: (assetInfo) => {
            const name = assetInfo.names?.[0] ?? assetInfo.name ?? '';
            return /\.(jpe?g|png|gif|webp|avif|svg|ico)$/i.test(name)
              ? 'images/[name].[hash][extname]'
              : '_astro/[name].[hash][extname]';
          },
        },
      },
    },
  },
});
