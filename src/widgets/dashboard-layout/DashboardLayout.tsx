import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Outlet } from 'react-router-dom';

import { DashboardHeader } from './DashboardHeader';
import { DashboardSidebar } from './DashboardSidebar';

export const DashboardLayout = () => (
  <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
    <DashboardSidebar />
    <Box sx={{ minWidth: 0, flex: 1 }}>
      <DashboardHeader />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  </Box>
);
