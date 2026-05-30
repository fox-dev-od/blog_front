import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';

const codeSx = {
  p: 2,
  borderRadius: 1,
  bgcolor: '#1e293b', // Rich dark slate background (ensures high contrast)
  color: '#f8fafc', // Bright off-white text (perfectly visible)
  overflow: 'auto',
  fontSize: 13,
  fontFamily: 'monospace',
  position: 'relative',
  border: '1px solid #334155',
  '&:hover .copy-btn': {
    opacity: 1,
  },
};

type ApiDocsContentProps = {
  detailed?: boolean;
};

// Colors for HTTP Methods
const getMethodColor = (method: string) => {
  switch (method.toUpperCase()) {
    case 'GET':
      return { bg: '#e8f5e9', text: '#2e7d32', border: '#a5d6a7' };
    case 'POST':
      return { bg: '#e3f2fd', text: '#1565c0', border: '#90caf9' };
    case 'PATCH':
    case 'PUT':
      return { bg: '#fff8e1', text: '#b78103', border: '#ffe082' };
    case 'DELETE':
      return { bg: '#ffebee', text: '#c62828', border: '#ef9a9a' };
    default:
      return { bg: '#f5f5f5', text: '#616161', border: '#e0e0e0' };
  }
};

export const ApiDocsContent = ({ detailed = false }: ApiDocsContentProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [clientType, setClientType] = useState<'fetch' | 'axios' | 'curl'>('fetch');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleCopy = (text: string, id: string) => {
    void navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper component to render an API endpoint accordion
  const EndpointCard = ({
    method,
    path,
    desc,
    params = [],
    bodySchema = '',
    responseExample = '',
    codeExamples = { fetch: '', axios: '', curl: '' },
    id,
  }: {
    method: string;
    path: string;
    desc: string;
    params?: { name: string; type: string; required: boolean; desc: string }[];
    bodySchema?: string;
    responseExample: string;
    codeExamples: { fetch: string; axios: string; curl: string };
    id: string;
  }) => {
    const colors = getMethodColor(method);
    const activeCode = codeExamples[clientType] || '';

    return (
      <Accordion sx={{ border: `1px solid ${colors.border}`, mb: 1.5, borderRadius: '8px !important', overflow: 'hidden' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '100%', alignItems: { xs: 'flex-start', sm: 'center' } }}>
            <Chip
              label={method.toUpperCase()}
              size="small"
              sx={{
                bgcolor: colors.bg,
                color: colors.text,
                fontWeight: 900,
                border: `1px solid ${colors.border}`,
                width: 75,
                textAlign: 'center',
              }}
            />
            <Typography sx={{ fontFamily: 'monospace', fontWeight: 700, color: 'text.primary', fontSize: { xs: 13, sm: 15 } }}>
              {path}
            </Typography>
            <Typography color="text.secondary" sx={{ flexGrow: 1, fontSize: 14 }}>
              {desc}
            </Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails sx={{ px: { xs: 2, sm: 3 }, pb: 3, borderTop: '1px solid', borderColor: 'divider' }}>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <Typography variant="body2">{desc}</Typography>

            {params.length > 0 && (
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                  Параметри запиту / шляху
                </Typography>
                <Table size="small" sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                  <TableHead sx={{ bgcolor: 'grey.50' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Параметр</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Тип</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Обовʼязковий</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Опис</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {params.map((p) => (
                      <TableRow key={p.name}>
                        <TableCell sx={{ fontFamily: 'monospace' }}>{p.name}</TableCell>
                        <TableCell>{p.type}</TableCell>
                        <TableCell>{p.required ? 'Так' : 'Ні'}</TableCell>
                        <TableCell>{p.desc}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            )}

            {bodySchema && (
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                  Тіло запиту (JSON Schema)
                </Typography>
                <Box component="pre" sx={{ ...codeSx, m: 0 }}>
                  <Button
                    size="small"
                    variant="text"
                    color="inherit"
                    className="copy-btn"
                    onClick={() => handleCopy(bodySchema, `${id}-body`)}
                    startIcon={copiedId === `${id}-body` ? <CheckIcon sx={{ color: 'success.main' }} /> : <ContentCopyIcon />}
                    sx={{
                      position: 'absolute',
                      right: 8,
                      top: 8,
                      opacity: 0,
                      transition: 'opacity 0.2s',
                      color: '#94a3b8',
                      bgcolor: 'rgba(255,255,255,0.08)',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' },
                    }}
                  >
                    {copiedId === `${id}-body` ? 'Скопійовано' : 'Копіювати'}
                  </Button>
                  <code>{bodySchema}</code>
                </Box>
              </Box>
            )}

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                Приклад коду для інтеграції ({clientType === 'fetch' ? 'Fetch API' : clientType === 'axios' ? 'Axios' : 'cURL'})
              </Typography>
              <Box component="pre" sx={{ ...codeSx, m: 0 }}>
                <Button
                  size="small"
                  variant="text"
                  color="inherit"
                  className="copy-btn"
                  onClick={() => handleCopy(activeCode, `${id}-code`)}
                  startIcon={copiedId === `${id}-code` ? <CheckIcon sx={{ color: 'success.main' }} /> : <ContentCopyIcon />}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    color: '#94a3b8',
                    bgcolor: 'rgba(255,255,255,0.08)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' },
                  }}
                >
                  {copiedId === `${id}-code` ? 'Скопійовано' : 'Копіювати'}
                </Button>
                <code>{activeCode}</code>
              </Box>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                Приклад відповіді сервера (JSON)
              </Typography>
              <Box component="pre" sx={{ ...codeSx, m: 0 }}>
                <Button
                  size="small"
                  variant="text"
                  color="inherit"
                  className="copy-btn"
                  onClick={() => handleCopy(responseExample, `${id}-response`)}
                  startIcon={copiedId === `${id}-response` ? <CheckIcon sx={{ color: 'success.main' }} /> : <ContentCopyIcon />}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    color: '#94a3b8',
                    bgcolor: 'rgba(255,255,255,0.08)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' },
                  }}
                >
                  {copiedId === `${id}-response` ? 'Скопійовано' : 'Копіювати'}
                </Button>
                <code>{responseExample}</code>
              </Box>
            </Box>
          </Stack>
        </AccordionDetails>
      </Accordion>
    );
  };

  // 1. Brief view for public page
  if (!detailed) {
    return (
      <Stack spacing={3}>
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Stack spacing={1}>
            <Typography variant="h4" sx={{ fontWeight: 900 }}>
              Публічне API DASP
            </Typography>
            <Typography color="text.secondary">
              Ці endpoints можна використовувати для інтеграції публічних статей, кейсів і
              категорій.
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
                <code>GET /cases/public</code> - список активних кейсів.
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
              Приклад запиту Fetch
            </Typography>
            <Box component="pre" sx={codeSx}>
              <code>{`fetch('https://api.example.com/blog')
  .then(res => res.json())
  .then(posts => console.log(posts));`}</code>
            </Box>
          </Stack>
        </Paper>
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      {/* 1. Header controls */}
      <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Stack spacing={0.5}>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              Публічна API документація розробника
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Детальний опис виключно публічних endpoints інтеграції для вашого сайту чи мобільного додатка.
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} sx={{ bgcolor: 'grey.100', p: 0.5, borderRadius: 2 }}>
            <Button
              size="small"
              variant={clientType === 'fetch' ? 'contained' : 'text'}
              onClick={() => setClientType('fetch')}
              sx={{ borderRadius: 1.5, textTransform: 'none' }}
            >
              Fetch API
            </Button>
            <Button
              size="small"
              variant={clientType === 'axios' ? 'contained' : 'text'}
              onClick={() => setClientType('axios')}
              sx={{ borderRadius: 1.5, textTransform: 'none' }}
            >
              Axios
            </Button>
            <Button
              size="small"
              variant={clientType === 'curl' ? 'contained' : 'text'}
              onClick={() => setClientType('curl')}
              sx={{ borderRadius: 1.5, textTransform: 'none' }}
            >
              cURL
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* 2. Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto" sx={{ '& .MuiTab-root': { fontWeight: 700 } }}>
          <Tab label="Статті Блогу (Blog)" />
          <Tab label="Кейси (Cases)" />
          <Tab label="Категорії (Categories)" />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      {activeTab === 0 && (
        <Box>
          <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
              Публічне API Блогу
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Використовуйте ці endpoints для відображення опублікованих статей вашим користувачам на будь-яких зовнішніх платформах.
            </Typography>
          </Paper>

          <EndpointCard
            id="blog-list"
            method="GET"
            path="/blog"
            desc="Отримати список усіх опублікованих статей блогу"
            params={[
              { name: 'search', type: 'string', required: false, desc: 'Пошук по назві або підзаголовку' },
              { name: 'tag', type: 'string', required: false, desc: 'Фільтрування статей за певним тегом' },
            ]}
            responseExample={`[
  {
    "_id": "65f8a001ab...",
    "title": "Сучасні підходи до веб-дизайну",
    "slug": "modern-web-design-approaches",
    "subtitle": "Огляд сучасних UI/UX рішень",
    "tags": ["design", "ui", "ux"],
    "status": "published",
    "createdAt": "2026-05-30T09:00:00.000Z"
  }
]`}
            codeExamples={{
              fetch: `fetch('https://api.example.com/blog?tag=design')
  .then(res => res.json())
  .then(posts => console.log(posts));`,
              axios: `axios.get('https://api.example.com/blog', {
  params: { tag: 'design' }
})
.then(res => console.log(res.data));`,
              curl: `curl -X GET "https://api.example.com/blog?tag=design"`,
            }}
          />

          <EndpointCard
            id="blog-detail"
            method="GET"
            path="/blog/:slug"
            desc="Отримати детальну інформацію про статтю за її унікальним slug"
            params={[{ name: 'slug', type: 'string', required: true, desc: 'Унікальний slug статті' }]}
            responseExample={`{
  "_id": "65f8a001ab...",
  "title": "Сучасні підходи до веб-дизайну",
  "slug": "modern-web-design-approaches",
  "subtitle": "Огляд сучасних UI/UX рішень",
  "tags": ["design", "ui", "ux"],
  "status": "published",
  "blocks": [
    {
      "html": "<p>Це тіло статті з насиченим форматуванням...</p>",
      "layout": "text_only"
    }
  ],
  "createdAt": "2026-05-30T09:00:00.000Z"
}`}
            codeExamples={{
              fetch: `fetch('https://api.example.com/blog/modern-web-design-approaches')
  .then(res => res.json())
  .then(post => console.log(post));`,
              axios: `axios.get('https://api.example.com/blog/modern-web-design-approaches')
  .then(res => console.log(res.data));`,
              curl: `curl -X GET https://api.example.com/blog/modern-web-design-approaches`,
            }}
          />
        </Box>
      )}

      {activeTab === 1 && (
        <Box>
          <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
              Публічне API Кейсів (Cases)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Endpoints для отримання активних публічних кейсів, портфоліо чи реалізованих проєктів.
            </Typography>
          </Paper>

          <EndpointCard
            id="cases-list"
            method="GET"
            path="/cases/public"
            desc="Отримати список всіх активних публічних кейсів"
            responseExample={`[
  {
    "_id": "65f8b50fab...",
    "title": "Впровадження ERP-системи в рітейлі",
    "slug": "erp-implementation-retail",
    "description": "Як ми оптимізували бізнес-процеси великої торгової мережі...",
    "isActive": true,
    "categoryId": "65f8b201cd..."
  }
]`}
            codeExamples={{
              fetch: `fetch('https://api.example.com/cases/public')
  .then(res => res.json())
  .then(cases => console.log(cases));`,
              axios: `axios.get('https://api.example.com/cases/public')
  .then(res => console.log(res.data));`,
              curl: `curl -X GET https://api.example.com/cases/public`,
            }}
          />

          <EndpointCard
            id="cases-by-cat"
            method="GET"
            path="/cases/public/by-category/:categorySlug"
            desc="Отримати список кейсів, відфільтрованих за slug категорії"
            params={[{ name: 'categorySlug', type: 'string', required: true, desc: 'Slug категорії кейсів' }]}
            responseExample={`[
  {
    "_id": "65f8b50fab...",
    "title": "Впровадження ERP-системи в рітейлі",
    "slug": "erp-implementation-retail",
    "description": "Як ми оптимізували бізнес-процеси...",
    "isActive": true,
    "categoryId": "65f8b201cd..."
  }
]`}
            codeExamples={{
              fetch: `fetch('https://api.example.com/cases/public/by-category/business-automation')
  .then(res => res.json())
  .then(cases => console.log(cases));`,
              axios: `axios.get('https://api.example.com/cases/public/by-category/business-automation')
  .then(res => console.log(res.data));`,
              curl: `curl -X GET https://api.example.com/cases/public/by-category/business-automation`,
            }}
          />

          <EndpointCard
            id="cases-detail"
            method="GET"
            path="/cases/public/by-slug/:slug"
            desc="Отримати детальний зміст конкретного публічного кейсу за його slug"
            params={[{ name: 'slug', type: 'string', required: true, desc: 'Slug кейсу' }]}
            responseExample={`{
  "_id": "65f8b50fab...",
  "title": "Впровадження ERP-системи в рітейлі",
  "slug": "erp-implementation-retail",
  "description": "Як ми оптимізували бізнес-процеси...",
  "isActive": true,
  "categoryId": "65f8b201cd...",
  "createdAt": "2026-05-30T10:00:00.000Z"
}`}
            codeExamples={{
              fetch: `fetch('https://api.example.com/cases/public/by-slug/erp-implementation-retail')
  .then(res => res.json())
  .then(data => console.log(data));`,
              axios: `axios.get('https://api.example.com/cases/public/by-slug/erp-implementation-retail')
  .then(res => console.log(res.data));`,
              curl: `curl -X GET https://api.example.com/cases/public/by-slug/erp-implementation-retail`,
            }}
          />
        </Box>
      )}

      {activeTab === 2 && (
        <Box>
          <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
              Публічне API Категорій Кейсів
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Усі кейси згруповані у категорії. Ці endpoints повертають список активних категорій для фільтрації чи побудови меню.
            </Typography>
          </Paper>

          <EndpointCard
            id="cats-list"
            method="GET"
            path="/case-categories/public"
            desc="Отримати список всіх активних публічних категорій"
            responseExample={`[
  {
    "_id": "65f8b201cd...",
    "name": "Автоматизація бізнесу",
    "slug": "business-automation",
    "isActive": true
  }
]`}
            codeExamples={{
              fetch: `fetch('https://api.example.com/case-categories/public')
  .then(res => res.json())
  .then(categories => console.log(categories));`,
              axios: `axios.get('https://api.example.com/case-categories/public')
  .then(res => console.log(res.data));`,
              curl: `curl -X GET https://api.example.com/case-categories/public`,
            }}
          />

          <EndpointCard
            id="cats-detail"
            method="GET"
            path="/case-categories/public/by-slug/:slug"
            desc="Отримати інформацію про категорію кейсів за її slug"
            params={[{ name: 'slug', type: 'string', required: true, desc: 'Slug категорії' }]}
            responseExample={`{
  "_id": "65f8b201cd...",
  "name": "Автоматизація бізнесу",
  "slug": "business-automation",
  "isActive": true,
  "createdAt": "2026-05-30T09:30:00.000Z"
}`}
            codeExamples={{
              fetch: `fetch('https://api.example.com/case-categories/public/by-slug/business-automation')
  .then(res => res.json())
  .then(cat => console.log(cat));`,
              axios: `axios.get('https://api.example.com/case-categories/public/by-slug/business-automation')
  .then(res => console.log(res.data));`,
              curl: `curl -X GET https://api.example.com/case-categories/public/by-slug/business-automation`,
            }}
          />
        </Box>
      )}
    </Stack>
  );
};
