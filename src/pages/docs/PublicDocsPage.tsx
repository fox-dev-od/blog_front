import Box from '@mui/material/Box';

import { ApiDocsContent } from '../../widgets/api-docs/ApiDocsContent';

export const PublicDocsPage = () => (
  <Box sx={{ maxWidth: 960, mx: 'auto', p: { xs: 2, md: 4 } }}>
    <ApiDocsContent />
  </Box>
);
