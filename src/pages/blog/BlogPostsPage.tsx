import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Link } from 'react-router-dom';

import { blogApi } from '../../entities/blog/api/blogApi';
import { BlogPost } from '../../entities/blog/model/types';
import { EmptyState } from '../../shared/ui/EmptyState';
import { Loader } from '../../shared/ui/Loader';
import { PageHeader } from '../../shared/ui/PageHeader';

const loadPosts = async (setItems: (items: BlogPost[]) => void, setLoading: (value: boolean) => void) => {
  setLoading(true);
  try {
    setItems(await blogApi.getAll());
  } finally {
    setLoading(false);
  }
};

export const BlogPostsPage = () => {
  const [items, setItems] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void loadPosts(setItems, setLoading);
  }, []);

  const handleDelete = async (id: string) => {
    await blogApi.delete(id);
    await loadPosts(setItems, setLoading);
  };

  return (
    <>
      <PageHeader
        title="Blog posts"
        action={<Button component={Link} to="/dashboard/blog/create" variant="contained">Create</Button>}
      />
      {loading ? <Loader /> : items.length === 0 ? <EmptyState /> : (
        <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Slug</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.slug}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
                      <Button component={Link} to={`/dashboard/blog/${item._id}`} size="small">Edit</Button>
                      <Button color="error" size="small" onClick={() => void handleDelete(item._id)}>Delete</Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </>
  );
};
