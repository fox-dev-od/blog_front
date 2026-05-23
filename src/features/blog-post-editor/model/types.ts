import { z } from 'zod';

import { blogPostSchema } from './schemas';

export type BlogPostFormValues = z.input<typeof blogPostSchema>;
