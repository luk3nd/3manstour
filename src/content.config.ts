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

export const collections = { authors, blog, pages };
