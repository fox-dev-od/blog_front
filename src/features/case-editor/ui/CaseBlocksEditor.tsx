import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Controller, useFieldArray, UseFormReturn } from 'react-hook-form';

import { RichTextEditor } from '../../blog-post-editor/ui/RichTextEditor';
import { AppTextField } from '../../../shared/ui/AppTextField';
import { ImageUploadField } from '../../../shared/ui/ImageUploadField';
import { CaseFormValues } from '../model/types';

type CaseBlocksEditorProps = {
  form: UseFormReturn<CaseFormValues>;
  tabIndex: number;
};

export const CaseBlocksEditor = ({ form, tabIndex }: CaseBlocksEditorProps) => {
  const { control, register, getValues, setValue } = form;
  const name = `tabs.${tabIndex}.blocks` as const;
  const { fields, append, remove, move } = useFieldArray({ control, name });
  const appendImageUrls = (blockIndex: number, urls: string[]) => {
    const fieldName = `tabs.${tabIndex}.blocks.${blockIndex}.imagesText` as const;
    const currentValue = getValues(fieldName);
    setValue(fieldName, [currentValue, ...urls].filter(Boolean).join('\n'), {
      shouldDirty: true,
    });
  };

  return (
    <Stack spacing={2}>
      <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
        <Typography sx={{ fontWeight: 700 }}>Блоки</Typography>
        <Button
          size="small"
          variant="outlined"
          onClick={() =>
            append({
              type: 'text',
              layout: 'text-top',
              heading: '',
              html: '',
              imagesText: '',
              order: fields.length,
            })
          }
        >
          Додати блок
        </Button>
      </Stack>
      {fields.map((field, blockIndex) => (
        <Paper key={field.id} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
          <Stack spacing={2}>
            <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
              <Typography>Блок {blockIndex + 1}</Typography>
              <Stack direction="row" spacing={1}>
                <Button size="small" onClick={() => blockIndex > 0 && move(blockIndex, blockIndex - 1)}>
                  Вгору
                </Button>
                <Button
                  size="small"
                  onClick={() => blockIndex < fields.length - 1 && move(blockIndex, blockIndex + 1)}
                >
                  Вниз
                </Button>
                <Button size="small" color="error" onClick={() => remove(blockIndex)}>
                  Видалити
                </Button>
              </Stack>
            </Stack>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <AppTextField select label="Тип" {...register(`tabs.${tabIndex}.blocks.${blockIndex}.type`)}>
                <MenuItem value="text">Текст</MenuItem>
                <MenuItem value="gallery">Галерея</MenuItem>
                <MenuItem value="text-images">Текст із фото</MenuItem>
              </AppTextField>
              <AppTextField select label="Макет" {...register(`tabs.${tabIndex}.blocks.${blockIndex}.layout`)}>
                <MenuItem value="text-top">Текст зверху</MenuItem>
                <MenuItem value="text-left">Текст ліворуч</MenuItem>
                <MenuItem value="text-right">Текст праворуч</MenuItem>
                <MenuItem value="gallery-grid">Галерея сіткою</MenuItem>
                <MenuItem value="gallery-masonry">Галерея masonry</MenuItem>
              </AppTextField>
            </Stack>
            <AppTextField label="Заголовок блоку" {...register(`tabs.${tabIndex}.blocks.${blockIndex}.heading`)} />
            <Controller
              control={control}
              name={`tabs.${tabIndex}.blocks.${blockIndex}.html`}
              render={({ field: editorField }) => (
                <RichTextEditor value={editorField.value} onChange={editorField.onChange} />
              )}
            />
            <ImageUploadField
              multiple
              onUploaded={(urls) => appendImageUrls(blockIndex, urls)}
            />
            <AppTextField
              label="Посилання на фото"
              placeholder="Одне посилання в рядку"
              multiline
              minRows={2}
              {...register(`tabs.${tabIndex}.blocks.${blockIndex}.imagesText`)}
            />
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
};
