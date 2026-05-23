import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Controller, UseFormReturn } from 'react-hook-form';

import { AppTextField } from '../../../shared/ui/AppTextField';
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
  const { register, control } = form;

  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      <Stack spacing={2}>
        <Stack
          direction="row"
          sx={{ justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Typography sx={{ fontWeight: 700 }}>Block {index + 1}</Typography>
          <Stack direction="row" spacing={1}>
            <Button size="small" onClick={onMoveUp}>
              Up
            </Button>
            <Button size="small" onClick={onMoveDown}>
              Down
            </Button>
            <Button size="small" color="error" onClick={onRemove}>
              Delete
            </Button>
          </Stack>
        </Stack>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <AppTextField select label="Type" {...register(`blocks.${index}.type`)}>
            <MenuItem value="text">Text</MenuItem>
            <MenuItem value="gallery">Gallery</MenuItem>
            <MenuItem value="text-images">Text with images</MenuItem>
          </AppTextField>
          <AppTextField select label="Layout" {...register(`blocks.${index}.layout`)}>
            <MenuItem value="text-top">Text top</MenuItem>
            <MenuItem value="text-left">Text left</MenuItem>
            <MenuItem value="text-right">Text right</MenuItem>
            <MenuItem value="gallery-grid">Gallery grid</MenuItem>
            <MenuItem value="gallery-masonry">Gallery masonry</MenuItem>
          </AppTextField>
        </Stack>
        <AppTextField label="Heading" {...register(`blocks.${index}.heading`)} />
        <Controller
          control={control}
          name={`blocks.${index}.html`}
          render={({ field }) => (
            <RichTextEditor value={field.value} onChange={field.onChange} />
          )}
        />
        <AppTextField
          label="Image URLs"
          placeholder="One URL per line"
          multiline
          minRows={2}
          {...register(`blocks.${index}.imagesText`)}
        />
      </Stack>
    </Paper>
  );
};
