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

import { casesApi } from '../../entities/case/api/casesApi';
import { CaseItem } from '../../entities/case/model/types';
import { EmptyState } from '../../shared/ui/EmptyState';
import { Loader } from '../../shared/ui/Loader';
import { PageHeader } from '../../shared/ui/PageHeader';

const loadCases = async (setItems: (items: CaseItem[]) => void, setLoading: (value: boolean) => void) => {
  setLoading(true);
  try {
    setItems(await casesApi.getAll());
  } finally {
    setLoading(false);
  }
};

export const CasesPage = () => {
  const [items, setItems] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void loadCases(setItems, setLoading);
  }, []);

  const handleDelete = async (id: string) => {
    await casesApi.delete(id);
    await loadCases(setItems, setLoading);
  };

  return (
    <>
      <PageHeader title="Cases" action={<Button component={Link} to="/dashboard/cases/create" variant="contained">Create</Button>} />
      {loading ? <Loader /> : items.length === 0 ? <EmptyState /> : (
        <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Table>
            <TableHead><TableRow><TableCell>Title</TableCell><TableCell>Slug</TableCell><TableCell>Active</TableCell><TableCell align="right">Actions</TableCell></TableRow></TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.slug}</TableCell>
                  <TableCell>{item.isActive ? 'Yes' : 'No'}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
                      <Button component={Link} to={`/dashboard/cases/${item._id}`} size="small">Edit</Button>
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
