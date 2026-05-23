import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { FiActivity, FiBookOpen, FiBriefcase, FiShield } from 'react-icons/fi';

import { PageHeader } from '../../shared/ui/PageHeader';

const cards = [
  { label: 'Статті блогу', icon: <FiBookOpen size={26} /> },
  { label: 'Кейси', icon: <FiBriefcase size={26} /> },
  { label: 'Журнал активності', icon: <FiActivity size={26} /> },
  { label: 'Чорний список', icon: <FiShield size={26} /> },
];

export const DashboardPage = () => (
  <>
    <PageHeader title="Панель керування" subtitle="Керування контентом публічного сайту." />
    <Grid container spacing={2}>
      {cards.map((card) => (
        <Grid key={card.label} size={{ xs: 12, md: 3 }}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Stack spacing={1.5}>
              {card.icon}
              <Typography sx={{ fontWeight: 700 }}>{card.label}</Typography>
              <Typography variant="body2" color="text.secondary">
                Відкрийте розділ у бічному меню.
              </Typography>
            </Stack>
          </Paper>
        </Grid>
      ))}
    </Grid>
  </>
);
