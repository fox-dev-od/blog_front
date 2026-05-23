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
  const { register, control, getValues, setValue } = form;
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
          <AppTextField select label="Тип" {...register(`blocks.${index}.type`)}>
            <MenuItem value="text">Текст</MenuItem>
            <MenuItem value="gallery">Галерея</MenuItem>
            <MenuItem value="text-images">Текст із фото</MenuItem>
          </AppTextField>
          <AppTextField select label="Макет" {...register(`blocks.${index}.layout`)}>
            <MenuItem value="text-top">Текст зверху</MenuItem>
            <MenuItem value="text-left">Текст ліворуч</MenuItem>
            <MenuItem value="text-right">Текст праворуч</MenuItem>
            <MenuItem value="gallery-grid">Галерея сіткою</MenuItem>
            <MenuItem value="gallery-masonry">Галерея masonry</MenuItem>
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
