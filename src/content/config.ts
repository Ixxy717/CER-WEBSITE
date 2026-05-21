import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title:       z.string(),
    date:        z.coerce.date(),
    excerpt:     z.string(),
    cover_image: z.string().optional(),
    author:      z.string().default('Chagrin Electronic Recycling'),
  }),
});

export const collections = { blog };
