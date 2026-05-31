import { z } from 'zod';

export const caseInfoSchema = z.object({
  label: z.string().min(1, 'Вкажіть назву'),
  value: z.string().min(1, 'Вкажіть значення'),
  icon: z.string().optional(),
  iconSize: z.coerce.number().min(8).max(128).default(24),
  order: z.coerce.number().default(0),
});

export const caseBlockSchema = z.object({
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
    ])
    .default('text-top'),
  order: z.coerce.number().default(0),
});

export const caseTabSchema = z.object({
  title: z.string().min(1, 'Вкажіть назву вкладки'),
  slug: z.string().min(1, 'Вкажіть slug'),
  order: z.coerce.number().default(0),
  isActive: z.boolean().default(true),
  blocks: z.array(caseBlockSchema).default([]),
});

export const caseSchema = z.object({
  title: z.string().min(1, 'Вкажіть назву'),
  slug: z.string().min(1, 'Вкажіть slug'),
  categoryId: z.string().min(1, 'Оберіть категорію'),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  coverImage: z.string().optional(),
  order: z.coerce.number().default(0),
  isActive: z.boolean().default(true),
  info: z.array(caseInfoSchema).default([]),
  tabs: z.array(caseTabSchema).default([]),
});
