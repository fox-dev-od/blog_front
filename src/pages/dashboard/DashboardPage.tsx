import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { FiActivity, FiBookOpen, FiBriefcase, FiShield } from 'react-icons/fi';

import { PageHeader } from '../../shared/ui/PageHeader';

const cards = [
  { label: 'Blog posts', icon: <FiBookOpen size={26} /> },
  { label: 'Cases', icon: <FiBriefcase size={26} /> },
  { label: 'Activity logs', icon: <FiActivity size={26} /> },
  { label: 'Blacklist', icon: <FiShield size={26} /> },
];

export const DashboardPage = () => (
  <>
    <PageHeader title="Dashboard" subtitle="Manage public website content." />
    <Grid container spacing={2}>
      {cards.map((card) => (
        <Grid key={card.label} size={{ xs: 12, md: 3 }}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Stack spacing={1.5}>
              {card.icon}
              <Typography sx={{ fontWeight: 700 }}>{card.label}</Typography>
              <Typography variant="body2" color="text.secondary">
                Open the section from the sidebar.
              </Typography>
            </Stack>
          </Paper>
        </Grid>
      ))}
    </Grid>
  </>
);
