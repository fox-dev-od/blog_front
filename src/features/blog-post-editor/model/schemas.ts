import { z } from 'zod';

export const blogBlockSchema = z.object({
  type: z.enum(['text', 'gallery', 'text-images']).default('text'),
  heading: z.string().optional(),
  text: z.string().optional(),
  html: z.string().optional(),
  imagesText: z.string().optional(),
  layout: z
    .enum([
      'text-top',
      'text-left',
      'text-right',
      'gallery-grid',
      'gallery-masonry',
      'image-top-text-bottom',
      'image-bottom-text-top',
      'image-left-text-right',
      'image-right-text-left',
      'image-only',
      'text-only',
    ])
    .default('text-top'),
  order: z.coerce.number().default(0),
});

export const blogPostSchema = z.object({
  title: z.string().min(1, 'Вкажіть заголовок'),
  slug: z.string().min(1, 'Вкажіть slug'),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  coverImage: z.string().optional(),
  tagsText: z.string().optional(),
  status: z.enum(['draft', 'pending', 'published']).default('draft'),
  blocks: z.array(blogBlockSchema).default([]),
});
