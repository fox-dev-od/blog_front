import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Controller, useFieldArray, UseFormReturn } from 'react-hook-form';

import { RichTextEditor } from '../../blog-post-editor/ui/RichTextEditor';
import { AppTextField } from '../../../shared/ui/AppTextField';
import { CaseFormValues } from '../model/types';

type CaseBlocksEditorProps = {
  form: UseFormReturn<CaseFormValues>;
  tabIndex: number;
};

export const CaseBlocksEditor = ({ form, tabIndex }: CaseBlocksEditorProps) => {
  const { control, register } = form;
  const name = `tabs.${tabIndex}.blocks` as const;
  const { fields, append, remove, move } = useFieldArray({ control, name });

  return (
    <Stack spacing={2}>
      <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
        <Typography sx={{ fontWeight: 700 }}>Blocks</Typography>
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
          Add block
        </Button>
      </Stack>
      {fields.map((field, blockIndex) => (
        <Paper key={field.id} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
          <Stack spacing={2}>
            <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
              <Typography>Block {blockIndex + 1}</Typography>
              <Stack direction="row" spacing={1}>
                <Button size="small" onClick={() => blockIndex > 0 && move(blockIndex, blockIndex - 1)}>
                  Up
                </Button>
                <Button
                  size="small"
                  onClick={() => blockIndex < fields.length - 1 && move(blockIndex, blockIndex + 1)}
                >
                  Down
                </Button>
                <Button size="small" color="error" onClick={() => remove(blockIndex)}>
                  Delete
                </Button>
              </Stack>
            </Stack>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <AppTextField select label="Type" {...register(`tabs.${tabIndex}.blocks.${blockIndex}.type`)}>
                <MenuItem value="text">Text</MenuItem>
                <MenuItem value="gallery">Gallery</MenuItem>
                <MenuItem value="text-images">Text with images</MenuItem>
              </AppTextField>
              <AppTextField select label="Layout" {...register(`tabs.${tabIndex}.blocks.${blockIndex}.layout`)}>
                <MenuItem value="text-top">Text top</MenuItem>
                <MenuItem value="text-left">Text left</MenuItem>
                <MenuItem value="text-right">Text right</MenuItem>
                <MenuItem value="gallery-grid">Gallery grid</MenuItem>
                <MenuItem value="gallery-masonry">Gallery masonry</MenuItem>
              </AppTextField>
            </Stack>
            <AppTextField label="Heading" {...register(`tabs.${tabIndex}.blocks.${blockIndex}.heading`)} />
            <Controller
              control={control}
              name={`tabs.${tabIndex}.blocks.${blockIndex}.html`}
              render={({ field: editorField }) => (
                <RichTextEditor value={editorField.value} onChange={editorField.onChange} />
              )}
            />
            <AppTextField
              label="Image URLs"
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
