import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { BlogContentBlock } from '../../../entities/blog/model/types';
import { EmptyState } from '../../../shared/ui/EmptyState';

type CaseBlocksPreviewProps = {
  blocks?: BlogContentBlock[];
};

const renderImages = (images: string[]) => {
  if (images.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: 1,
      }}
    >
      {images.map((image) => (
        <Box
          key={image}
          component="img"
          src={image}
          alt=""
          sx={{
            width: '100%',
            aspectRatio: '4 / 3',
            objectFit: 'cover',
            borderRadius: 1,
            bgcolor: 'grey.100',
          }}
        />
      ))}
    </Box>
  );
};

export const CaseBlocksPreview = ({ blocks = [] }: CaseBlocksPreviewProps) => {
  if (blocks.length === 0) {
    return <EmptyState title="Немає блоків" description="У цій вкладці немає контенту для превʼю." />;
  }

  return (
    <Stack spacing={3}>
      {blocks.map((block, index) => {
        const images = block.images ?? (block.imageUrl ? [block.imageUrl] : []);
        const imageContent = renderImages(images);
        const textContent = (
          <Stack spacing={1}>
            {block.heading ? (
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                {block.heading}
              </Typography>
            ) : null}
            {block.text ? <Typography color="text.secondary">{block.text}</Typography> : null}
            {block.html ? (
              <Box
                sx={{
                  color: 'text.secondary',
                  '& p': { mt: 0, mb: 1 },
                  '& p:last-child': { mb: 0 },
                  '& img': { maxWidth: '100%', borderRadius: 1 },
                }}
                dangerouslySetInnerHTML={{ __html: block.html }}
              />
            ) : null}
          </Stack>
        );
        const isSideBySide = block.layout === 'text-left' || block.layout === 'text-right';
        const imageFirst = block.layout === 'text-right';

        if (isSideBySide && images.length > 0) {
          return (
            <Box
              key={index}
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 2,
                alignItems: 'start',
              }}
            >
              {imageFirst ? imageContent : textContent}
              {imageFirst ? textContent : imageContent}
            </Box>
          );
        }

        return (
          <Stack key={index} spacing={2}>
            {block.type === 'gallery' ? null : textContent}
            {imageContent}
          </Stack>
        );
      })}
    </Stack>
  );
};
