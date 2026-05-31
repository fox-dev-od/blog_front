import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useFieldArray, UseFormReturn } from 'react-hook-form';

import { BlogPostFormValues } from '../model/types';
import { ContentBlockCard } from './ContentBlockCard';

type ContentBlocksEditorProps = {
  form: UseFormReturn<BlogPostFormValues>;
};

export const ContentBlocksEditor = ({ form }: ContentBlocksEditorProps) => {
  const { control } = form;
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'blocks',
  });

  return (
    <Stack spacing={2}>
      <Stack
        direction="row"
        sx={{ justifyContent: 'space-between', alignItems: 'center' }}
      >
        <Typography variant="h6">Контентні блоки</Typography>
        <Button
          variant="outlined"
          onClick={() =>
            append({
              type: 'text',
              layout: 'text_only',
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
      {fields.map((field, index) => (
        <ContentBlockCard
          key={field.id}
          form={form}
          index={index}
          onRemove={() => remove(index)}
          onMoveUp={() => index > 0 && move(index, index - 1)}
          onMoveDown={() => index < fields.length - 1 && move(index, index + 1)}
        />
      ))}
    </Stack>
  );
};
