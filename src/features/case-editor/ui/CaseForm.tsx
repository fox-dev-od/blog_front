import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { useForm } from 'react-hook-form';

import { CaseCategory } from '../../../entities/case-category/model/types';
import { CaseItem, CasePayload } from '../../../entities/case/model/types';
import { AppButton } from '../../../shared/ui/AppButton';
import { AppTextField } from '../../../shared/ui/AppTextField';
import { ImageUploadField } from '../../../shared/ui/ImageUploadField';
import { caseSchema } from '../model/schemas';
import { CaseFormValues } from '../model/types';
import { CaseInfoEditor } from './CaseInfoEditor';
import { CaseTabsEditor } from './CaseTabsEditor';

type CaseFormProps = {
  initialValue?: CaseItem | null;
  categories: CaseCategory[];
  onSubmit: (payload: CasePayload) => Promise<void>;
};

const toDefaultValues = (item?: CaseItem | null): CaseFormValues => ({
  title: item?.title ?? '',
  slug: item?.slug ?? '',
  categoryId:
    typeof item?.categoryId === 'object' ? (item.categoryId as { _id: string })._id : item?.categoryId ?? '',
  subtitle: item?.subtitle ?? '',
  description: item?.description ?? '',
  coverImage: item?.coverImage ?? '',
  order: item?.order ?? 0,
  isActive: item?.isActive ?? true,
  info: item?.info?.map((infoItem, index) => ({
    ...infoItem,
    icon: infoItem.icon ?? '',
    iconSize: infoItem.iconSize ?? 24,
    order: infoItem.order ?? index,
  })) ?? [],
  tabs:
    item?.tabs?.map((tab) => ({
      ...tab,
      isActive: tab.isActive ?? true,
      blocks: tab.blocks.map((block, index) => ({
        type: block.type ?? 'text',
        heading: block.heading ?? '',
        text: block.text ?? '',
        html: block.html ?? '',
        imagesText: block.images?.join('\n') ?? '',
        layout: (block.layout || 'text-top') as
          | 'text-top'
          | 'text-left'
          | 'text-right'
          | 'gallery-grid'
          | 'gallery-masonry',
        order: block.order ?? index,
      })),
    })) ?? [],
});

export const CaseForm = ({ initialValue, categories, onSubmit }: CaseFormProps) => {
  const form = useForm<CaseFormValues>({
    resolver: zodResolver(caseSchema),
    defaultValues: toDefaultValues(initialValue),
  });
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = form;
  const coverImage = watch('coverImage');

  useEffect(() => {
    reset(toDefaultValues(initialValue));
  }, [initialValue, reset]);

  const submit = handleSubmit(async (values) => {
    await onSubmit({
      title: values.title,
      slug: values.slug,
      categoryId: values.categoryId,
      subtitle: values.subtitle || null,
      description: values.description || null,
      coverImage: values.coverImage || null,
      order: Number(values.order ?? 0),
      isActive: values.isActive ?? true,
      info: (values.info ?? []).map((item, index: number) => ({
        ...item,
        icon: item.icon || null,
        iconSize: Number(item.iconSize ?? 24),
        order: index,
      })),
      tabs: (values.tabs ?? []).map((tab, tabIndex: number) => ({
        title: tab.title,
        slug: tab.slug,
        isActive: tab.isActive ?? true,
        order: tabIndex,
        blocks: (tab.blocks ?? []).map((block, blockIndex: number) => ({
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
          order: blockIndex,
        })),
      })),
    });
  });

  return (
    <Box component="form" onSubmit={submit}>
      <Stack spacing={3}>
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Stack spacing={2}>
            <AppTextField label="Назва" {...register('title')} error={Boolean(errors.title)} helperText={errors.title?.message} />
            <AppTextField label="Slug" {...register('slug')} error={Boolean(errors.slug)} helperText={errors.slug?.message} />
            <AppTextField
              select
              label="Категорія"
              value={watch('categoryId')}
              {...register('categoryId')}
              error={Boolean(errors.categoryId)}
              helperText={errors.categoryId?.message}
            >
              {categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.title}
                </MenuItem>
              ))}
            </AppTextField>
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
            <FormControlLabel control={<Checkbox defaultChecked {...register('isActive')} />} label="Активний" />
          </Stack>
        </Paper>
        <CaseInfoEditor form={form} />
        <CaseTabsEditor form={form} />
        <AppButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Збереження...' : 'Зберегти кейс'}
        </AppButton>
      </Stack>
    </Box>
  );
};
