import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Controller, UseFormReturn } from 'react-hook-form';

import { AppTextField } from '../../../shared/ui/AppTextField';
import { ImageUploadField } from '../../../shared/ui/ImageUploadField';
import { BlogPostFormValues } from '../model/types';
import { RichTextEditor } from './RichTextEditor';

type ContentBlockCardProps = {
  form: UseFormReturn<BlogPostFormValues>;
  index: number;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
};

export const ContentBlockCard = ({
  form,
  index,
  onRemove,
  onMoveUp,
  onMoveDown,
}: ContentBlockCardProps) => {
  const { register, control, getValues, setValue, watch } = form;
  const imagesFieldName = `blocks.${index}.imagesText` as const;
  const appendImageUrls = (urls: string[]) => {
    const currentValue = getValues(imagesFieldName);
    setValue(
      imagesFieldName,
      [currentValue, ...urls].filter(Boolean).join('\n'),
      { shouldDirty: true },
    );
  };

  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      <Stack spacing={2}>
        <Stack
          direction="row"
          sx={{ justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Typography sx={{ fontWeight: 700 }}>Блок {index + 1}</Typography>
          <Stack direction="row" spacing={1}>
            <Button size="small" onClick={onMoveUp}>
              Вгору
            </Button>
            <Button size="small" onClick={onMoveDown}>
              Вниз
            </Button>
            <Button size="small" color="error" onClick={onRemove}>
              Видалити
            </Button>
          </Stack>
        </Stack>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <AppTextField
            select
            label="Тип"
            value={watch(`blocks.${index}.type`)}
            {...register(`blocks.${index}.type`)}
          >
            <MenuItem value="text">Текст</MenuItem>
            <MenuItem value="gallery">Галерея</MenuItem>
            <MenuItem value="text-images">Текст із фото</MenuItem>
          </AppTextField>
          <AppTextField
            select
            label="Макет"
            value={watch(`blocks.${index}.layout`)}
            {...register(`blocks.${index}.layout`)}
          >
            <MenuItem value="image_bottom_text_top">Текст зверху, зображення знизу</MenuItem>
            <MenuItem value="image_top_text_bottom">Текст знизу, зображення зверху</MenuItem>
            <MenuItem value="image_right_text_left">Текст ліворуч, зображення праворуч</MenuItem>
            <MenuItem value="image_left_text_right">Текст праворуч, зображення ліворуч</MenuItem>
            <MenuItem value="image_only">Тільки зображення</MenuItem>
            <MenuItem value="text_only">Тільки текст</MenuItem>
          </AppTextField>
        </Stack>
        <AppTextField label="Заголовок блоку" {...register(`blocks.${index}.heading`)} />
        <Controller
          control={control}
          name={`blocks.${index}.html`}
          render={({ field }) => (
            <RichTextEditor value={field.value} onChange={field.onChange} />
          )}
        />
        <ImageUploadField multiple onUploaded={appendImageUrls} />
        <AppTextField
          label="Посилання на фото"
          placeholder="Одне посилання в рядку"
          multiline
          minRows={2}
          {...register(imagesFieldName)}
        />
      </Stack>
    </Paper>
  );
};
