import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useFieldArray, UseFormReturn } from 'react-hook-form';

import { AppTextField } from '../../../shared/ui/AppTextField';
import { CaseFormValues } from '../model/types';

type CaseInfoEditorProps = {
  form: UseFormReturn<CaseFormValues>;
};

export const CaseInfoEditor = ({ form }: CaseInfoEditorProps) => {
  const { control, register } = form;
  const { fields, append, remove, move } = useFieldArray({ control, name: 'info' });

  return (
    <Stack spacing={2}>
      <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6">Info</Typography>
        <Button variant="outlined" onClick={() => append({ label: '', value: '', icon: '', order: fields.length })}>
          Add info
        </Button>
      </Stack>
      {fields.map((field, index) => (
        <Paper key={field.id} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
              <Button size="small" onClick={() => index > 0 && move(index, index - 1)}>Up</Button>
              <Button size="small" onClick={() => index < fields.length - 1 && move(index, index + 1)}>Down</Button>
              <Button size="small" color="error" onClick={() => remove(index)}>Delete</Button>
            </Stack>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <AppTextField label="Label" {...register(`info.${index}.label`)} />
              <AppTextField label="Value" {...register(`info.${index}.value`)} />
              <AppTextField label="Icon" {...register(`info.${index}.icon`)} />
            </Stack>
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
};
