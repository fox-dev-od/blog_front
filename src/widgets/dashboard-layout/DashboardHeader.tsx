import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '../../features/auth/model/authStore';

export const DashboardHeader = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <AppBar
      position="sticky"
      color="transparent"
      elevation={0}
      sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box>
          <Typography sx={{ fontWeight: 700 }}>Administration</Typography>
          <Typography variant="caption" color="text.secondary">
            {user?.email || 'Authenticated session'}
          </Typography>
        </Box>
        <Button variant="outlined" size="small" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};
