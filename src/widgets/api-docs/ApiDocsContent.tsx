import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const codeSx = {
  p: 2,
  borderRadius: 1,
  bgcolor: 'grey.950',
  color: 'grey.50',
  overflow: 'auto',
  fontSize: 13,
};

export const ApiDocsContent = () => (
  <Stack spacing={3}>
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Stack spacing={1}>
        <Typography variant="h4" sx={{ fontWeight: 900 }}>
          Публічне API DASP
        </Typography>
        <Typography color="text.secondary">
          Ці endpoints можна використовувати для інтеграції публічних статей, кейсів і
          категорій. Захищені адміністративні endpoints працюють через cookie-based auth.
        </Typography>
      </Stack>
    </Paper>

    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Stack spacing={2}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          Публічні endpoints
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 3 }}>
          <li>
            <code>GET /blog</code> - список опублікованих статей.
          </li>
          <li>
            <code>GET /blog/:slug</code> - одна опублікована стаття за slug.
          </li>
          <li>
            <code>GET /cases/public/by-slug/:slug</code> - активний кейс за slug.
          </li>
          <li>
            <code>GET /case-categories/public</code> - список активних категорій кейсів.
          </li>
          <li>
            <code>GET /case-categories/public/by-slug/:slug</code> - активна категорія за slug.
          </li>
        </Box>
      </Stack>
    </Paper>

    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Stack spacing={2}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          Авторизація
        </Typography>
        <Typography color="text.secondary">
          Захищені endpoints використовують httpOnly cookies. Браузерний клієнт має
          надсилати credentials у кожному захищеному запиті.
        </Typography>
        <Box component="pre" sx={codeSx}>
          <code>{`const api = axios.create({
  baseURL: 'https://api.example.com',
  withCredentials: true,
});

await api.post('/auth/login', { email, password });
const me = await api.get('/auth/me');`}</code>
        </Box>
        <Box component="pre" sx={codeSx}>
          <code>{`await fetch('https://api.example.com/auth/me', {
  method: 'GET',
  credentials: 'include',
});`}</code>
        </Box>
      </Stack>
    </Paper>

    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Stack spacing={2}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          Приклад відповіді
        </Typography>
        <Box component="pre" sx={codeSx}>
          <code>{`{
  "_id": "65f...",
  "title": "Запуск проєкту",
  "slug": "project-launch",
  "subtitle": "Як був реалізований проєкт",
  "tags": ["design", "backend"],
  "status": "published",
  "blocks": [
    {
      "imageUrl": "https://example.com/image.jpg",
      "html": "<p>Контент статті</p>",
      "layout": "image_bottom_text_top"
    }
  ]
}`}</code>
        </Box>
      </Stack>
    </Paper>
  </Stack>
);
