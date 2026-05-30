import { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Drawer from '@mui/material/Drawer';
import { Outlet } from 'react-router-dom';

import { DashboardHeader } from './DashboardHeader';
import { DashboardSidebar, sidebarWidth } from './DashboardSidebar';

export const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Desktop Sidebar */}
      <DashboardSidebar />

      {/* Mobile Drawer Sidebar */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: sidebarWidth },
        }}
      >
        <DashboardSidebar mobile onClose={handleDrawerToggle} />
      </Drawer>

      <Box sx={{ minWidth: 0, flex: 1 }}>
        <DashboardHeader onDrawerToggle={handleDrawerToggle} />
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};
