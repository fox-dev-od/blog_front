import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';
import { FiMenu } from 'react-icons/fi';

import { useAuthStore } from '../../features/auth/model/authStore';

type DashboardHeaderProps = {
  onDrawerToggle?: () => void;
};

export const DashboardHeader = ({ onDrawerToggle }: DashboardHeaderProps) => {
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
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 3 } }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={onDrawerToggle}
            sx={{ display: { md: 'none' } }}
          >
            <FiMenu />
          </IconButton>
          <Box>
            <Typography sx={{ fontWeight: 700 }}>Адміністрування</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              {user?.email || 'Авторизована сесія'}
            </Typography>
          </Box>
        </Stack>
        <Button variant="outlined" size="small" onClick={handleLogout}>
          Вийти
        </Button>
      </Toolbar>
    </AppBar>
  );
};
