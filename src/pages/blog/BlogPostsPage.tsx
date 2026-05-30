import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { Link } from 'react-router-dom';

import { blogApi } from '../../entities/blog/api/blogApi';
import { BlogPost, BlogPostStatus } from '../../entities/blog/model/types';
import { EmptyState } from '../../shared/ui/EmptyState';
import { Loader } from '../../shared/ui/Loader';
import { PageHeader } from '../../shared/ui/PageHeader';

const loadPosts = async (
  setItems: (items: BlogPost[]) => void,
  setLoading: (value: boolean) => void,
  statusFilter: string,
) => {
  setLoading(true);
  try {
    const params: Record<string, unknown> = {};
    if (statusFilter && statusFilter !== 'all') {
      params.status = statusFilter;
    }
    setItems(await blogApi.getAdminAll(params));
  } finally {
    setLoading(false);
  }
};

const statusLabels: Record<BlogPostStatus, string> = {
  draft: 'Чернетка',
  pending: 'На перевірці',
  published: 'Опубліковано',
};

const getStatusColor = (status: BlogPostStatus) => {
  switch (status) {
    case 'draft':
      return 'default';
    case 'pending':
      return 'warning';
    case 'published':
      return 'success';
    default:
      return 'default';
  }
};

export const BlogPostsPage = () => {
  const [items, setItems] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    void loadPosts(setItems, setLoading, statusFilter);
  }, [statusFilter]);

  const handleDelete = async (id: string) => {
    await blogApi.delete(id);
    await loadPosts(setItems, setLoading, statusFilter);
  };

  const getAuthorName = (authorId: BlogPost['authorId']) => {
    if (!authorId) return 'Невідомий';
    if (typeof authorId === 'object') {
      return authorId.name;
    }
    return authorId;
  };

  return (
    <>
      <PageHeader
        title="Статті блогу"
        action={
          <Button component={Link} to="/dashboard/blog/create" variant="contained">
            Створити статтю
          </Button>
        }
      />

      <Stack spacing={2}>
        <FormControl size="small" sx={{ alignSelf: 'flex-start', minWidth: 200 }}>
          <InputLabel id="status-filter-label">Фільтр за статусом</InputLabel>
          <Select
            labelId="status-filter-label"
            id="status-filter"
            value={statusFilter}
            label="Фільтр за статусом"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">Всі статуси</MenuItem>
            <MenuItem value="draft">Чернетка</MenuItem>
            <MenuItem value="pending">На перевірці</MenuItem>
            <MenuItem value="published">Опубліковано</MenuItem>
          </Select>
        </FormControl>

        {loading ? (
          <Loader />
        ) : items.length === 0 ? (
          <EmptyState
            title="Статей не знайдено"
            description={
              statusFilter !== 'all'
                ? 'Спробуйте вибрати інший статус або створити нову статтю.'
                : 'Створіть свою першу статтю в блозі.'
            }
          />
        ) : (
          <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Заголовок</TableCell>
                  <TableCell>Slug</TableCell>
                  <TableCell>Автор</TableCell>
                  <TableCell>Статус</TableCell>
                  <TableCell align="right">Дії</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell sx={{ fontWeight: 600 }}>{item.title}</TableCell>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: 13 }}>{item.slug}</TableCell>
                    <TableCell>{getAuthorName(item.authorId)}</TableCell>
                    <TableCell>
                      <Chip
                        label={statusLabels[item.status]}
                        color={getStatusColor(item.status)}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
                        <Button component={Link} to={`/dashboard/blog/${item._id}`} size="small">
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
