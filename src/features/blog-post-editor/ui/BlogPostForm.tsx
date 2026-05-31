import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { useForm, useWatch } from 'react-hook-form';

import { BlogPost, BlogPostPayload } from '../../../entities/blog/model/types';
import { AppButton } from '../../../shared/ui/AppButton';
import { AppTextField } from '../../../shared/ui/AppTextField';
import { ImageUploadField } from '../../../shared/ui/ImageUploadField';
import { normalizeBlogPayloadBeforeSubmit } from '../model/normalizeBlogPayload';
import { blogPostSchema } from '../model/schemas';
import { BlogPostFormValues } from '../model/types';
import { BlogPostPreview } from './BlogPostPreview';
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
      layout: (block.layout || 'text_only') as NonNullable<
        BlogPostFormValues['blocks']
      >[number]['layout'],
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
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = form;
  const coverImage = useWatch({ control: form.control, name: 'coverImage' });

  useEffect(() => {
    reset(toDefaultValues(initialValue));
  }, [initialValue, reset]);

  const submit = handleSubmit(async (values) => {
    await onSubmit(normalizeBlogPayloadBeforeSubmit(values));
  });

  return (
    <Box component="form" onSubmit={submit}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) minmax(360px, 0.8fr)' },
          gap: 3,
          alignItems: 'start',
        }}
      >
        <Stack spacing={3}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Stack spacing={2}>
              <AppTextField
                label="Заголовок"
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
              <AppTextField label="Підзаголовок" {...register('subtitle')} />
              <AppTextField label="Опис" multiline minRows={3} {...register('description')} />
              <ImageUploadField
                onUploaded={([url]) =>
                  form.setValue('coverImage', url, { shouldDirty: true })
                }
              />
              <AppTextField label="Посилання на обкладинку" {...register('coverImage')} />
              {coverImage ? (
                <Box
                  component="img"
                  src={coverImage}
                  alt=""
                  sx={{ width: 180, borderRadius: 1, display: 'block' }}
                />
              ) : null}
              <AppTextField label="Теги" placeholder="design, backend" {...register('tagsText')} />
              <AppTextField
                select
                label="Статус"
                value={watch('status')}
                {...register('status')}
              >
                <MenuItem value="draft">Чернетка</MenuItem>
                <MenuItem value="pending">На перевірці</MenuItem>
                <MenuItem value="published">Опубліковано</MenuItem>
              </AppTextField>
            </Stack>
          </Paper>
          <ContentBlocksEditor form={form} />
          <AppButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Збереження...' : 'Зберегти статтю'}
          </AppButton>
        </Stack>
        <BlogPostPreview form={form} />
      </Box>
    </Box>
  );
};
