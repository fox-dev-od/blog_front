import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { caseCategoriesApi } from '../../entities/case-category/api/caseCategoriesApi';
import { CaseCategory } from '../../entities/case-category/model/types';
import { AppTextField } from '../../shared/ui/AppTextField';
import { EmptyState } from '../../shared/ui/EmptyState';
import { ImageUploadField } from '../../shared/ui/ImageUploadField';
import { Loader } from '../../shared/ui/Loader';
import { PageHeader } from '../../shared/ui/PageHeader';

const caseCategorySchema = z.object({
  title: z.string().min(1, 'Вкажіть назву'),
  slug: z.string().min(1, 'Вкажіть slug'),
  description: z.string().optional(),
  image: z.string().optional(),
  order: z.coerce.number().default(0),
  isActive: z.boolean().default(true),
});

type FormValues = z.input<typeof caseCategorySchema>;

const loadCategories = async (setItems: (items: CaseCategory[]) => void, setLoading: (value: boolean) => void) => {
  setLoading(true);
  try {
    setItems(await caseCategoriesApi.getAll());
  } finally {
    setLoading(false);
  }
};

export const CaseCategoriesPage = () => {
  const [items, setItems] = useState<CaseCategory[]>([]);
  const [editing, setEditing] = useState<CaseCategory | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const form = useForm<FormValues>({ resolver: zodResolver(caseCategorySchema) });

  useEffect(() => {
    void loadCategories(setItems, setLoading);
  }, []);

  const openForm = (item?: CaseCategory) => {
    setEditing(item ?? null);
    form.reset(
      item
        ? {
            title: item.title,
            slug: item.slug,
            description: item.description ?? '',
            image: item.image ?? '',
            order: item.order,
            isActive: item.isActive,
          }
        : { title: '', slug: '', description: '', image: '', order: 0, isActive: true },
    );
    setOpen(true);
  };

  const submit = form.handleSubmit(async (values) => {
    if (editing) {
      await caseCategoriesApi.update(editing._id, {
        ...values,
        order: Number(values.order ?? 0),
        isActive: values.isActive ?? true,
      });
    } else {
      await caseCategoriesApi.create({
        ...values,
        order: Number(values.order ?? 0),
        isActive: values.isActive ?? true,
      });
    }
    setOpen(false);
    await loadCategories(setItems, setLoading);
  });

  const handleDelete = async (id: string) => {
    await caseCategoriesApi.delete(id);
    await loadCategories(setItems, setLoading);
  };

  return (
    <>
      <PageHeader title="Категорії кейсів" action={<Button variant="contained" onClick={() => openForm()}>Створити</Button>} />
      {loading ? <Loader /> : items.length === 0 ? <EmptyState /> : (
        <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Table>
            <TableHead><TableRow><TableCell>Назва</TableCell><TableCell>Slug</TableCell><TableCell>Активна</TableCell><TableCell align="right">Дії</TableCell></TableRow></TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.slug}</TableCell>
                  <TableCell>{item.isActive ? 'Так' : 'Ні'}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
                      <Button size="small" onClick={() => openForm(item)}>Редагувати</Button>
                      <Button size="small" color="error" onClick={() => void handleDelete(item._id)}>Видалити</Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Редагувати категорію' : 'Створити категорію'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <AppTextField label="Назва" {...form.register('title')} error={Boolean(form.formState.errors.title)} helperText={form.formState.errors.title?.message} />
            <AppTextField label="Slug" {...form.register('slug')} error={Boolean(form.formState.errors.slug)} helperText={form.formState.errors.slug?.message} />
            <AppTextField label="Опис" multiline minRows={3} {...form.register('description')} />
            <ImageUploadField
              onUploaded={([url]) =>
                form.setValue('image', url, { shouldDirty: true })
              }
            />
            <AppTextField label="Посилання на фото" {...form.register('image')} />
            <AppTextField label="Порядок" type="number" {...form.register('order')} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Скасувати</Button>
          <Button variant="contained" onClick={() => void submit()} disabled={form.formState.isSubmitting}>
            Зберегти
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
