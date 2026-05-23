import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { FiInbox } from 'react-icons/fi';

type EmptyStateProps = {
  title?: string;
  description?: string;
};

export const EmptyState = ({
  title = 'Немає даних',
  description = 'Поки що немає записів для відображення.',
}: EmptyStateProps) => (
  <Paper variant="outlined" sx={{ p: 4, borderRadius: 2 }}>
    <Stack spacing={1.5} sx={{ alignItems: 'center' }}>
      <FiInbox size={32} />
      <Typography sx={{ fontWeight: 700 }}>{title}</Typography>
      <Typography color="text.secondary">{description}</Typography>
    </Stack>
  </Paper>
);
