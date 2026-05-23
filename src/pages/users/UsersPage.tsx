import { useEffect, useMemo, useState } from 'react';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Link } from 'react-router-dom';

import { usersApi } from '../../entities/user/api/usersApi';
import { User } from '../../entities/user/model/types';
import { AppTextField } from '../../shared/ui/AppTextField';
import { EmptyState } from '../../shared/ui/EmptyState';
import { Loader } from '../../shared/ui/Loader';
import { PageHeader } from '../../shared/ui/PageHeader';

const loadUsers = async (
  setItems: (items: User[]) => void,
  setError: (error: string | null) => void,
  setLoading: (value: boolean) => void,
) => {
  setLoading(true);
  setError(null);
  try {
    setItems(await usersApi.getAll());
  } catch (error) {
    setError(error instanceof Error ? error.message : 'Не вдалося завантажити користувачів');
  } finally {
    setLoading(false);
  }
};

const formatDate = (value?: string) =>
  value ? new Intl.DateTimeFormat('uk', { dateStyle: 'medium' }).format(new Date(value)) : '-';

export const UsersPage = () => {
  const [items, setItems] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    void loadUsers(setItems, setError, setLoading);
  }, []);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return items;
    }

    return items.filter(
      (item) =>
        item.email.toLowerCase().includes(query) ||
        item.name.toLowerCase().includes(query),
    );
  }, [items, search]);

  const handleDelete = async (id: string) => {
    await usersApi.delete(id);
    await loadUsers(setItems, setError, setLoading);
  };

  return (
    <>
      <PageHeader title="Користувачі" subtitle="Керування обліковими записами та ролями." />
      <Stack spacing={2}>
        <AppTextField
          label="Пошук"
          placeholder="email або імʼя користувача"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        {loading ? (
          <Loader />
        ) : error ? (
          <EmptyState title="Не вдалося завантажити користувачів" description={error} />
        ) : filteredItems.length === 0 ? (
          <EmptyState title="Користувачів не знайдено" description="Спробуйте інший пошуковий запит." />
        ) : (
          <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Email</TableCell>
                  <TableCell>Імʼя</TableCell>
                  <TableCell>Роль</TableCell>
                  <TableCell>Створено</TableCell>
                  <TableCell>Статус</TableCell>
                  <TableCell align="right">Дії</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>
                      <Chip label={item.role} size="small" />
                    </TableCell>
                    <TableCell>{formatDate(item.createdAt)}</TableCell>
                    <TableCell>
                      <Chip
                        label={item.isActive ? 'Активний' : 'Неактивний'}
                        color={item.isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
                        <Button component={Link} to={`/dashboard/users/${item._id}`} size="small">
                          Редагувати
                        </Button>
                        <Button
                          color="error"
                          size="small"
                          onClick={() => void handleDelete(item._id)}
                        >
                          Видалити
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )}
      </Stack>
    </>
  );
};
