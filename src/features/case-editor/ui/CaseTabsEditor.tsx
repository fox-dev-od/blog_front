import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useFieldArray, UseFormReturn } from 'react-hook-form';

import { AppTextField } from '../../../shared/ui/AppTextField';
import { CaseFormValues } from '../model/types';
import { CaseBlocksEditor } from './CaseBlocksEditor';

type CaseTabsEditorProps = {
  form: UseFormReturn<CaseFormValues>;
};

export const CaseTabsEditor = ({ form }: CaseTabsEditorProps) => {
  const { control, register } = form;
  const { fields, append, remove, move } = useFieldArray({ control, name: 'tabs' });

  return (
    <Stack spacing={2}>
      <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6">Tabs</Typography>
        <Button
          variant="outlined"
          onClick={() =>
            append({ title: '', slug: '', order: fields.length, isActive: true, blocks: [] })
          }
        >
          Add tab
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
              <AppTextField label="Title" {...register(`tabs.${index}.title`)} />
              <AppTextField label="Slug" {...register(`tabs.${index}.slug`)} />
              <FormControlLabel control={<Checkbox defaultChecked {...register(`tabs.${index}.isActive`)} />} label="Active" />
            </Stack>
            <CaseBlocksEditor form={form} tabIndex={index} />
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
};
