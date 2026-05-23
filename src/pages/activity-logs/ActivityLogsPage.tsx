import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { activityLogsApi } from '../../entities/activity-log/api/activityLogsApi';
import { ActivityLog } from '../../entities/activity-log/model/types';
import { EmptyState } from '../../shared/ui/EmptyState';
import { Loader } from '../../shared/ui/Loader';
import { PageHeader } from '../../shared/ui/PageHeader';

const loadLogs = async (setItems: (items: ActivityLog[]) => void, setLoading: (value: boolean) => void) => {
  setLoading(true);
  try {
    const result = await activityLogsApi.getAll({ page: 1, limit: 50 });
    setItems(result.items);
  } finally {
    setLoading(false);
  }
};

export const ActivityLogsPage = () => {
  const [items, setItems] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void loadLogs(setItems, setLoading);
  }, []);

  const handleDelete = async (id: string) => {
    await activityLogsApi.delete(id);
    await loadLogs(setItems, setLoading);
  };

  return (
    <>
      <PageHeader title="Журнал активності" />
      {loading ? <Loader /> : items.length === 0 ? <EmptyState /> : (
        <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Table>
            <TableHead><TableRow><TableCell>Дія</TableCell><TableCell>Метод</TableCell><TableCell>URL</TableCell><TableCell>Статус</TableCell><TableCell>Створено</TableCell><TableCell align="right">Дії</TableCell></TableRow></TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.action}</TableCell>
                  <TableCell>{item.method}</TableCell>
                  <TableCell>{item.url}</TableCell>
                  <TableCell><Chip size="small" color={item.success ? 'success' : 'error'} label={item.statusCode ?? 'н/д'} /></TableCell>
                  <TableCell>{new Date(item.createdAt).toLocaleString()}</TableCell>
                  <TableCell align="right"><Button size="small" color="error" onClick={() => void handleDelete(item._id)}>Видалити</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </>
  );
};
