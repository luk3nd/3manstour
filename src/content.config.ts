import { defineCollection, reference } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/**
 * Autori — file JSON in src/content/authors/*.json
 * L'avatar è un'immagine locale risolta rispetto al file JSON.
 * Questi dati sono condivisi tra la pagina autore e il box autore in fondo
 * agli articoli (fonte unica).
 */
const authors = defineCollection({
  loader: glob({
    pattern: '**/*.json',
    base: './src/content/authors',
    generateId: ({ entry }) => entry.replace(/\.json$/, ''),
  }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string().default('Autore'),
      bio: z.string(),
      shortBio: z.string().optional(),
      avatar: image(),
      email: z.email().optional(),
      socials: z
        .object({
          x: z.url().optional(),
          linkedin: z.url().optional(),
          github: z.url().optional(),
          instagram: z.url().optional(),
          website: z.url().optional(),
        })
        .default({}),
    }),
});

/**
 * Blog — file Markdown/MDX in src/content/blog/*.mdx
 */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      cover: image(),
      coverAlt: z.string().optional(),
      author: reference('authors'),
      category: z.string().default('luoghi'),
      tags: z
        .array(
          z.enum(['eventi', 'fiere', 'luoghi', 'esplorazione', 'città', 'fuori Italia', 'cibo', 'design']),
        )
        .default([]),
      draft: z.boolean().default(false),
      featured: z.boolean().default(false),
      /**
       * Scheda del "Reportage scelto" in home — tutti facoltativi.
       * Se compilati, compaiono nel blocco; se vuoti, il blocco si adatta.
       */
      place: z.string().optional(),
      altitude: z.string().optional(),
      duration: z.string().optional(),
      withWhom: z.string().optional(),
      highlights: z.array(z.string()).default([]),
      /** Domande frequenti specifiche dell'articolo (sezione in fondo + markup FAQPage). */
      faq: z
        .array(
          z.object({
            question: z.string(),
            answer: z.string(),
          }),
        )
        .default([]),
    }),
});

/**
 * Pagine interne — file Markdown/MDX in src/content/pages/*.md
 * (hero: titolo + sottotitolo + immagine copertina)
 */
const pages = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pages' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      description: z.string(),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      updatedDate: z.coerce.date().optional(),
      draft: z.boolean().default(false),
      order: z.number().default(0),
      /** Domande frequenti della pagina (sezione in fondo + markup FAQPage). */
      faq: z
        .array(
          z.object({
            question: z.string(),
            answer: z.string(),
          }),
        )
        .default([]),
    }),
});

/**
 * Galleria — una foto per file in src/content/gallery/
 * Si gestisce dal CMS: aggiungi la foto, scrivi didascalia e ordine.
 */
const gallery = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/gallery' }),
  schema: ({ image }) =>
    z.object({
      image: image(),
      alt: z.string(),
      caption: z.string().optional(),
      order: z.number().default(0),
      draft: z.boolean().default(false),
    }),
});

export const collections = { authors, blog, pages, gallery };
