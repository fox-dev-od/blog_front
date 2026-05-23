import { blogBlockSchema } from '../../blog-post-editor/model/schemas';
import { z } from 'zod';

export const caseInfoSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  value: z.string().min(1, 'Value is required'),
  icon: z.string().optional(),
  order: z.coerce.number().default(0),
});

export const caseTabSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  order: z.coerce.number().default(0),
  isActive: z.boolean().default(true),
  blocks: z.array(blogBlockSchema).default([]),
});

export const caseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  categoryId: z.string().min(1, 'Category is required'),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  coverImage: z.string().optional(),
  order: z.coerce.number().default(0),
  isActive: z.boolean().default(true),
  info: z.array(caseInfoSchema).default([]),
  tabs: z.array(caseTabSchema).default([]),
});
