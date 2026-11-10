// src/content.config.ts
// Astro 5+ (Content Layer API).
// Jika proyek Anda masih Astro 4, gunakan file src/content/config.ts dengan:
//
//   import { defineCollection, z } from 'astro:content';
//   const blog = defineCollection({
//     type: 'content',
//     schema: z.object({ ...sama seperti di bawah... }),
//   });
//   export const collections = { blog };
//
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: ['**/*.md'], base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // z.coerce.date() menerima string "2026-11-09" dari frontmatter
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    category: z.string().default('Tutorial'),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
