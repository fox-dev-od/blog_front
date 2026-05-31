import { BlogBlockLayout, BlogPostPayload } from '../../../entities/blog/model/types';
import { BlogPostFormValues } from './types';

const splitTags = (value?: string) =>
  value
    ?.split(',')
    .map((tag) => tag.trim())
    .filter(Boolean) ?? [];

const splitImages = (value?: string) =>
  value
    ?.split('\n')
    .map((url) => url.trim())
    .filter(Boolean) ?? [];

export const normalizeBlogPayloadBeforeSubmit = (
  values: BlogPostFormValues,
): BlogPostPayload => ({
  title: values.title,
  slug: values.slug,
  subtitle: values.subtitle || null,
  coverImage: values.coverImage || null,
  description: values.description || null,
  tags: splitTags(values.tagsText),
  status: values.status ?? 'draft',
  blocks: (values.blocks ?? [])
    .map((block) => {
      const images = splitImages(block.imagesText);
      const html = block.html?.trim();
      const imageUrl = images[0];
      const layout = (block.layout || 'text_only') as BlogBlockLayout;

      return {
        type: block.type || 'text',
        heading: block.heading || null,
        text: block.text || null,
        imageUrl: imageUrl || null,
        images: images,
        html: html || null,
        layout: imageUrl ? layout : 'text_only',
        order: typeof block.order === 'number' ? block.order : Number(block.order ?? 0) || 0,
      };
    })
    .filter((block) => block.imageUrl || block.html || block.heading),
});
