import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useFieldArray, UseFormReturn } from 'react-hook-form';

import { AppTextField } from '../../../shared/ui/AppTextField';
import { ImageUploadField } from '../../../shared/ui/ImageUploadField';
import { CaseFormValues } from '../model/types';

type CaseInfoEditorProps = {
  form: UseFormReturn<CaseFormValues>;
};

export const CaseInfoEditor = ({ form }: CaseInfoEditorProps) => {
  const { control, register, setValue, watch } = form;
  const { fields, append, remove, move } = useFieldArray({ control, name: 'info' });
  const info = watch('info');

  return (
    <Stack spacing={2}>
      <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6">Інформація</Typography>
        <Button
          variant="outlined"
          onClick={() =>
            append({ label: '', value: '', icon: '', iconSize: 24, order: fields.length })
          }
        >
          Додати інформацію
        </Button>
      </Stack>
      {fields.map((field, index) => (
        <Paper key={field.id} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
              <Button size="small" onClick={() => index > 0 && move(index, index - 1)}>
                Вгору
              </Button>
              <Button size="small" onClick={() => index < fields.length - 1 && move(index, index + 1)}>
                Вниз
              </Button>
              <Button size="small" color="error" onClick={() => remove(index)}>
                Видалити
              </Button>
            </Stack>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <AppTextField label="Назва" {...register(`info.${index}.label`)} />
              <AppTextField label="Значення" {...register(`info.${index}.value`)} />
            </Stack>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <AppTextField label="Посилання на іконку" {...register(`info.${index}.icon`)} />
              <AppTextField
                label="Розмір іконки, px"
                type="number"
                {...register(`info.${index}.iconSize`)}
              />
              {info?.[index]?.icon ? (
                <img
                  src={info[index]?.icon ?? ''}
                  alt=""
                  style={{
                    width: Number(info[index]?.iconSize ?? 24),
                    height: Number(info[index]?.iconSize ?? 24),
                    objectFit: 'contain',
                    alignSelf: 'center',
                  }}
                />
              ) : null}
            </Stack>
            <ImageUploadField
              label="Завантажити іконку"
              helperText="Файл буде завантажено на imgbb, у поле збережеться пряме посилання."
              onUploaded={([url]) =>
                setValue(`info.${index}.icon`, url, { shouldDirty: true })
              }
            />
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
};
