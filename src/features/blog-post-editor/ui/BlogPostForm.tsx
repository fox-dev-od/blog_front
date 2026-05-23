import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { useForm } from 'react-hook-form';

import { BlogPost, BlogPostPayload } from '../../../entities/blog/model/types';
import { AppButton } from '../../../shared/ui/AppButton';
import { AppTextField } from '../../../shared/ui/AppTextField';
import { blogPostSchema } from '../model/schemas';
import { BlogPostFormValues } from '../model/types';
import { ContentBlocksEditor } from './ContentBlocksEditor';

type BlogPostFormProps = {
  initialValue?: BlogPost | null;
  onSubmit: (payload: BlogPostPayload) => Promise<void>;
};

const toDefaultValues = (post?: BlogPost | null): BlogPostFormValues => ({
  title: post?.title ?? '',
  slug: post?.slug ?? '',
  subtitle: post?.subtitle ?? '',
  description: post?.description ?? '',
  coverImage: post?.coverImage ?? '',
  tagsText: post?.tags?.join(', ') ?? '',
  status: post?.status ?? 'draft',
  blocks:
    post?.blocks?.map((block, index) => ({
      type: block.type ?? 'text',
      heading: block.heading ?? '',
      text: block.text ?? '',
      html: block.html ?? '',
      imagesText: block.images?.join('\n') ?? block.imageUrl ?? '',
      layout: (block.layout || 'text-top') as
        | 'text-top'
        | 'text-left'
        | 'text-right'
        | 'gallery-grid'
        | 'gallery-masonry',
      order: block.order ?? index,
    })) ?? [],
});

export const BlogPostForm = ({ initialValue, onSubmit }: BlogPostFormProps) => {
  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: toDefaultValues(initialValue),
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const submit = handleSubmit(async (values) => {
    await onSubmit({
      title: values.title,
      slug: values.slug,
      subtitle: values.subtitle || null,
      description: values.description || null,
      coverImage: values.coverImage || null,
      tags:
        values.tagsText
          ?.split(',')
          .map((tag: string) => tag.trim())
          .filter(Boolean) ?? [],
      status: values.status ?? 'draft',
      blocks: (values.blocks ?? []).map((block, index: number) => ({
        type: block.type,
        heading: block.heading || null,
        text: block.text || null,
        html: block.html || null,
        images:
          block.imagesText
            ?.split('\n')
            .map((url: string) => url.trim())
            .filter(Boolean) ?? [],
        layout: block.layout ?? 'text-top',
        order: index,
      })),
    });
  });

  return (
    <Box component="form" onSubmit={submit}>
      <Stack spacing={3}>
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Stack spacing={2}>
            <AppTextField
              label="Title"
              {...register('title')}
              error={Boolean(errors.title)}
              helperText={errors.title?.message}
            />
            <AppTextField
              label="Slug"
              {...register('slug')}
              error={Boolean(errors.slug)}
              helperText={errors.slug?.message}
            />
            <AppTextField label="Subtitle" {...register('subtitle')} />
            <AppTextField label="Description" multiline minRows={3} {...register('description')} />
            <AppTextField label="Cover image URL" {...register('coverImage')} />
            <AppTextField label="Tags" placeholder="design, backend" {...register('tagsText')} />
            <AppTextField select label="Status" {...register('status')}>
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="published">Published</MenuItem>
            </AppTextField>
          </Stack>
        </Paper>
        <ContentBlocksEditor form={form} />
        <AppButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save article'}
        </AppButton>
      </Stack>
    </Box>
  );
};
