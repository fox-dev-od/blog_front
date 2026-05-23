import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { NavLink } from 'react-router-dom';
import {
  FiActivity,
  FiBookOpen,
  FiBriefcase,
  FiGrid,
  FiHome,
  FiShield,
  FiTag,
} from 'react-icons/fi';

const items = [
  { label: 'Dashboard', path: '/dashboard', icon: <FiHome /> },
  { label: 'Blog', path: '/dashboard/blog', icon: <FiBookOpen /> },
  { label: 'Categories', path: '/dashboard/case-categories', icon: <FiTag /> },
  { label: 'Cases', path: '/dashboard/cases', icon: <FiBriefcase /> },
  { label: 'Activity logs', path: '/dashboard/activity-logs', icon: <FiActivity /> },
  { label: 'Blacklist', path: '/dashboard/blacklist', icon: <FiShield /> },
];

export const sidebarWidth = 260;

export const DashboardSidebar = () => (
  <Box
    sx={{
      width: sidebarWidth,
      flexShrink: 0,
      bgcolor: 'background.paper',
      borderRight: 1,
      borderColor: 'divider',
      minHeight: '100vh',
      display: { xs: 'none', md: 'block' },
    }}
  >
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 800 }}>
        DASP Admin
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Content dashboard
      </Typography>
    </Box>
    <Divider />
    <List sx={{ p: 1.5 }}>
      {items.map((item) => (
        <ListItemButton
          key={item.path}
          component={NavLink}
          to={item.path}
          end={item.path === '/dashboard'}
          sx={{
            borderRadius: 1.5,
            mb: 0.5,
            '&.active': {
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              '& .MuiListItemIcon-root': { color: 'inherit' },
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            {item.icon || <FiGrid />}
          </ListItemIcon>
          <ListItemText primary={item.label} />
        </ListItemButton>
      ))}
    </List>
  </Box>
);
