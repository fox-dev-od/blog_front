import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';

import { CaseItem } from '../../../entities/case/model/types';
import { CaseBlocksPreview } from './CaseBlocksPreview';

type CasePreviewDialogProps = {
  item: CaseItem | null;
  open: boolean;
  onClose: () => void;
};

const getCategoryTitle = (item: CaseItem) => {
  const category = item.categoryId;

  if (typeof category === 'object' && category && 'title' in category) {
    return String(category.title);
  }

  return String(category ?? '-');
};

export const CasePreviewDialog = ({ item, open, onClose }: CasePreviewDialogProps) => {
  const tabs = useMemo(() => item?.tabs?.filter((tab) => tab.isActive !== false) ?? [], [item]);
  const [activeTab, setActiveTab] = useState(0);
  const currentTab = tabs[activeTab] ?? tabs[0];

  if (!item) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Превʼю кейсу</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={3}>
          {item.coverImage ? (
            <Box
              component="img"
              src={item.coverImage}
              alt=""
              sx={{
                width: '100%',
                aspectRatio: '16 / 9',
                objectFit: 'cover',
                borderRadius: 1,
                bgcolor: 'grey.100',
              }}
            />
          ) : null}
          <Stack spacing={1}>
            <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
              <Chip label={getCategoryTitle(item)} size="small" />
              <Chip label={item.isActive ? 'Активний' : 'Неактивний'} size="small" />
              <Chip label={`Порядок ${item.order ?? 0}`} size="small" />
            </Stack>
            <Typography variant="h4" sx={{ fontWeight: 900 }}>
              {item.title}
            </Typography>
            {item.subtitle ? (
              <Typography variant="h6" color="text.secondary">
                {item.subtitle}
              </Typography>
            ) : null}
            {item.description ? (
              <Typography color="text.secondary">{item.description}</Typography>
            ) : null}
          </Stack>
          {item.info?.length ? (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: 1,
              }}
            >
              {item.info.map((infoItem) => (
                <Box key={`${infoItem.label}-${infoItem.value}`} sx={{ p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
                  {infoItem.icon ? (
                    <Box
                      component="img"
                      src={infoItem.icon}
                      alt=""
                      sx={{
                        width: infoItem.iconSize ?? 24,
                        height: infoItem.iconSize ?? 24,
                        objectFit: 'contain',
                        mb: 1,
                      }}
                    />
                  ) : null}
                  <Typography variant="caption" color="text.secondary">
                    {infoItem.label}
                  </Typography>
                  <Typography sx={{ fontWeight: 800 }}>{infoItem.value}</Typography>
                </Box>
              ))}
            </Box>
          ) : null}
          <Divider />
          {tabs.length > 0 ? (
            <Stack spacing={2}>
              <Tabs
                value={Math.min(activeTab, tabs.length - 1)}
                onChange={(_, value: number) => setActiveTab(value)}
                variant="scrollable"
              >
                {tabs.map((tab) => (
                  <Tab key={tab.slug} label={tab.title} />
                ))}
              </Tabs>
              <CaseBlocksPreview blocks={currentTab?.blocks} />
            </Stack>
          ) : (
            <CaseBlocksPreview blocks={[]} />
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
