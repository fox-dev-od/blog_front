import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';

export const Loader = () => (
  <Stack sx={{ py: 8, alignItems: 'center', justifyContent: 'center' }}>
    <CircularProgress />
  </Stack>
);
