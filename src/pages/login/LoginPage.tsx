import Box from '@mui/material/Box';

import { LoginForm } from '../../features/auth/ui/LoginForm';

export const LoginPage = () => (
  <Box
    sx={{
      minHeight: '100vh',
      display: 'grid',
      placeItems: 'center',
      bgcolor: 'background.default',
      p: 2,
    }}
  >
    <LoginForm />
  </Box>
);
