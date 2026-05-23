import { ReactNode } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
};

export const PageHeader = ({ title, subtitle, action }: PageHeaderProps) => (
  <Stack
    direction={{ xs: 'column', sm: 'row' }}
    spacing={2}
    sx={{ mb: 3, justifyContent: 'space-between' }}
  >
    <Stack spacing={0.5}>
      <Typography variant="h4" sx={{ fontWeight: 700 }}>
        {title}
      </Typography>
      {subtitle ? (
        <Typography color="text.secondary">{subtitle}</Typography>
      ) : null}
    </Stack>
    {action}
  </Stack>
);
