import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
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

import { blacklistApi } from '../../entities/blacklist/api/blacklistApi';
import { BlacklistEntry } from '../../entities/blacklist/model/types';
import { AppTextField } from '../../shared/ui/AppTextField';
import { EmptyState } from '../../shared/ui/EmptyState';
import { Loader } from '../../shared/ui/Loader';
import { PageHeader } from '../../shared/ui/PageHeader';

const blacklistSchema = z.object({
  type: z.enum(['ip', 'user']),
  ip: z.string().optional(),
  userId: z.string().optional(),
  reason: z.string().optional(),
  expiresAt: z.string().optional(),
  isActive: z.boolean().default(true),
});

type FormValues = z.input<typeof blacklistSchema>;

const loadBlacklist = async (setItems: (items: BlacklistEntry[]) => void, setLoading: (value: boolean) => void) => {
  setLoading(true);
  try {
    const result = await blacklistApi.getAll();
    setItems(result.items);
  } finally {
    setLoading(false);
  }
};

export const BlacklistPage = () => {
  const [items, setItems] = useState<BlacklistEntry[]>([]);
  const [editing, setEditing] = useState<BlacklistEntry | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const form = useForm<FormValues>({ resolver: zodResolver(blacklistSchema) });

  useEffect(() => {
    void loadBlacklist(setItems, setLoading);
  }, []);

  const openForm = (item?: BlacklistEntry) => {
    setEditing(item ?? null);
    form.reset(
      item
        ? {
            type: item.type,
            ip: item.ip ?? '',
            userId: item.userId ?? '',
            reason: item.reason ?? '',
            expiresAt: item.expiresAt ?? '',
            isActive: item.isActive,
          }
        : { type: 'ip', ip: '', userId: '', reason: '', expiresAt: '', isActive: true },
    );
    setOpen(true);
  };

  const submit = form.handleSubmit(async (values) => {
    const payload = {
      type: values.type,
      ip: values.ip || null,
      userId: values.userId || null,
      reason: values.reason || null,
      expiresAt: values.expiresAt || null,
      isActive: values.isActive ?? true,
    };
    if (editing) {
      await blacklistApi.update(editing._id, payload);
    } else {
      await blacklistApi.create(payload);
    }
    setOpen(false);
    await loadBlacklist(setItems, setLoading);
  });

  const handleDelete = async (id: string) => {
    await blacklistApi.delete(id);
    await loadBlacklist(setItems, setLoading);
  };

  return (
    <>
      <PageHeader title="Чорний список" action={<Button variant="contained" onClick={() => openForm()}>Створити</Button>} />
      {loading ? <Loader /> : items.length === 0 ? <EmptyState /> : (
        <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Table>
            <TableHead><TableRow><TableCell>Тип</TableCell><TableCell>Ціль</TableCell><TableCell>Причина</TableCell><TableCell>Активний</TableCell><TableCell align="right">Дії</TableCell></TableRow></TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.ip || item.userId}</TableCell>
                  <TableCell>{item.reason}</TableCell>
                  <TableCell>{item.isActive ? 'Так' : 'Ні'}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
                      <Button size="small" onClick={() => openForm(item)}>Редагувати</Button>
                      <Button size="small" onClick={() => void (item.isActive ? blacklistApi.deactivate(item._id) : blacklistApi.activate(item._id)).then(() => loadBlacklist(setItems, setLoading))}>{item.isActive ? 'Деактивувати' : 'Активувати'}</Button>
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
        <DialogTitle>{editing ? 'Редагувати запис' : 'Створити запис'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <AppTextField
              select
              label="Тип"
              value={form.watch('type')}
              {...form.register('type')}
            >
              <MenuItem value="ip">IP</MenuItem>
              <MenuItem value="user">Користувач</MenuItem>
            </AppTextField>
            <AppTextField label="IP" {...form.register('ip')} />
            <AppTextField label="ID користувача" {...form.register('userId')} />
            <AppTextField label="Причина" {...form.register('reason')} />
            <AppTextField label="Діє до" placeholder="2026-12-31T23:59:59.000Z" {...form.register('expiresAt')} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Скасувати</Button>
          <Button variant="contained" onClick={() => void submit()} disabled={form.formState.isSubmitting}>Зберегти</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
