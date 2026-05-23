import { BlogBlockLayout, BlogPostPayload } from '../../../entities/blog/model/types';
import { BlogPostFormValues } from './types';

const layoutMap: Record<string, BlogBlockLayout> = {
  'text-top': 'image_bottom_text_top',
  'text-left': 'image_right_text_left',
  'text-right': 'image_left_text_right',
  'gallery-grid': 'image_only',
  'gallery-masonry': 'image_only',
  'image-top-text-bottom': 'image_top_text_bottom',
  'image-bottom-text-top': 'image_bottom_text_top',
  'image-left-text-right': 'image_left_text_right',
  'image-right-text-left': 'image_right_text_left',
  'image-only': 'image_only',
  'text-only': 'text_only',
};

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
  tags: splitTags(values.tagsText),
  status: values.status ?? 'draft',
  blocks: (values.blocks ?? [])
    .map((block) => {
      const images = splitImages(block.imagesText);
      const html = block.html?.trim();
      const imageUrl = images[0];
      const layout = layoutMap[block.layout ?? 'text-top'] ?? 'text_only';

      return {
        ...(imageUrl ? { imageUrl } : {}),
        ...(html ? { html } : {}),
        layout: imageUrl ? layout : 'text_only',
      };
    })
    .filter((block) => block.imageUrl || block.html),
});
