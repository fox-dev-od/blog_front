import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

import { casesApi } from '../../entities/case/api/casesApi';
import { CaseItem } from '../../entities/case/model/types';
import { CasePreviewDialog } from '../../features/case-preview/ui/CasePreviewDialog';
import { EmptyState } from '../../shared/ui/EmptyState';
import { Loader } from '../../shared/ui/Loader';
import { PageHeader } from '../../shared/ui/PageHeader';

const loadCases = async (
  setItems: (items: CaseItem[]) => void,
  setLoading: (value: boolean) => void,
) => {
  setLoading(true);
  try {
    setItems(await casesApi.getAll());
  } finally {
    setLoading(false);
  }
};

const getCategoryTitle = (item: CaseItem) => {
  const category = item.categoryId;

  if (typeof category === 'object' && category && 'title' in category) {
    return category.title;
  }

  return String(category ?? '-');
};

export const CasesPage = () => {
  const [items, setItems] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewItem, setPreviewItem] = useState<CaseItem | null>(null);

  useEffect(() => {
    void loadCases(setItems, setLoading);
  }, []);

  const handleDelete = async (id: string) => {
    await casesApi.delete(id);
    await loadCases(setItems, setLoading);
  };

  return (
    <>
      <PageHeader
        title="Кейси"
        action={
          <Button component={Link} to="/dashboard/cases/create" variant="contained">
            Створити
          </Button>
        }
      />
      {loading ? (
        <Loader />
      ) : items.length === 0 ? (
        <EmptyState />
      ) : (
        <Stack spacing={2}>
          {items.map((item) => (
            <Paper key={item._id} sx={{ p: 2, borderRadius: 2 }}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                {item.coverImage ? (
                  <Box
                    component="img"
                    src={item.coverImage}
                    alt=""
                    sx={{
                      width: { xs: '100%', md: 180 },
                      aspectRatio: '16 / 10',
                      objectFit: 'cover',
                      borderRadius: 1,
                      bgcolor: 'grey.100',
                      flexShrink: 0,
                    }}
                  />
                ) : null}
                <Stack spacing={1} sx={{ flex: 1, minWidth: 0 }}>
                  <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
                    <Chip label={item.isActive ? 'Активний' : 'Неактивний'} size="small" />
                    <Chip label={`Порядок ${item.order ?? 0}`} size="small" />
                    <Chip label={getCategoryTitle(item)} size="small" />
                  </Stack>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.slug}
                  </Typography>
                  {item.description || item.subtitle ? (
                    <Typography color="text.secondary">
                      {item.description || item.subtitle}
                    </Typography>
                  ) : null}
                </Stack>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start' }}>
                  <Button size="small" onClick={() => setPreviewItem(item)}>
                    Превʼю
                  </Button>
                  <Button component={Link} to={`/dashboard/cases/${item._id}`} size="small">
                    Редагувати
                  </Button>
                  <Button color="error" size="small" onClick={() => void handleDelete(item._id)}>
                    Видалити
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}
      <CasePreviewDialog
        item={previewItem}
        open={Boolean(previewItem)}
        onClose={() => setPreviewItem(null)}
      />
    </>
  );
};
