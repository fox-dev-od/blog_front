import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { UseFormReturn, useWatch } from 'react-hook-form';

import { BlogPostFormValues } from '../model/types';

type BlogPostPreviewProps = {
  form: UseFormReturn<BlogPostFormValues>;
};

type PreviewBlock = NonNullable<BlogPostFormValues['blocks']>[number];

const splitTags = (value?: string) =>
  value
    ?.split(',')
    .map((tag) => tag.trim())
    .filter(Boolean) ?? [];

const splitImages = (value?: string) =>
  value
    ?.split('\n')
    .map((url) => url.trim())
    .filter(Boolean) ?? [];

const renderBlockImages = (images: string[], layout?: string) => {
  if (images.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns:
          layout === 'image_only' ? 'repeat(2, minmax(0, 1fr))' : 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: 1,
      }}
    >
      {images.map((imageUrl) => (
        <Box
          key={imageUrl}
          component="img"
          src={imageUrl}
          alt=""
          sx={{
            width: '100%',
            aspectRatio: layout === 'image_only' ? '4 / 5' : '4 / 3',
            objectFit: 'cover',
            borderRadius: 1,
            bgcolor: 'grey.100',
          }}
        />
      ))}
    </Box>
  );
};

const renderBlock = (block: PreviewBlock, index: number) => {
  const images = splitImages(block.imagesText);
  const hasText = Boolean(block.heading || block.html);

  if (!hasText && images.length === 0) {
    return null;
  }

  const textContent = (
    <Stack spacing={1.25}>
      {block.heading ? (
        <Typography variant="h5" component="h3" sx={{ fontWeight: 800 }}>
          {block.heading}
        </Typography>
      ) : null}
      {block.html ? (
        <Box
          sx={{
            color: 'text.secondary',
            '& p': { m: 0, mb: 1.25 },
            '& p:last-child': { mb: 0 },
            '& h2': { color: 'text.primary', fontSize: 24, mb: 1, mt: 2 },
            '& ul, & ol': { pl: 3, my: 1 },
            '& img': { maxWidth: '100%', borderRadius: 1 },
            '& a': { color: 'primary.main' },
          }}
          dangerouslySetInnerHTML={{ __html: block.html }}
        />
      ) : null}
    </Stack>
  );
  const imageContent = renderBlockImages(images, block.layout);

  if (block.type === 'gallery') {
    return (
      <Stack key={index} spacing={2}>
        {block.heading ? (
          <Typography variant="h5" component="h3" sx={{ fontWeight: 800 }}>
            {block.heading}
          </Typography>
        ) : null}
        {imageContent}
      </Stack>
    );
  }

  if (block.type === 'text-images' && images.length > 0 && block.layout !== 'image_bottom_text_top') {
    const imageFirst = block.layout === 'image_left_text_right';

    return (
      <Box
        key={index}
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) minmax(180px, 0.8fr)' },
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
      {textContent}
      {block.type === 'text-images' ? imageContent : null}
    </Stack>
  );
};

export const BlogPostPreview = ({ form }: BlogPostPreviewProps) => {
  const values = useWatch({ control: form.control });
  const tags = splitTags(values.tagsText);
  const blocks = values.blocks ?? [];

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        borderRadius: 2,
        position: { lg: 'sticky' },
        top: { lg: 24 },
        maxHeight: { lg: 'calc(100vh - 48px)' },
        overflow: 'auto',
      }}
    >
      <Stack spacing={2.5}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          Превью
        </Typography>
        {values.coverImage ? (
          <Box
            component="img"
            src={values.coverImage}
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
          <Typography variant="h4" component="h2" sx={{ fontWeight: 900, lineHeight: 1.15 }}>
            {values.title || 'Заголовок статьи'}
          </Typography>
          {values.subtitle ? (
            <Typography variant="h6" color="text.secondary">
              {values.subtitle}
            </Typography>
          ) : null}
          {values.description ? (
            <Typography color="text.secondary">{values.description}</Typography>
          ) : null}
        </Stack>
        {tags.length > 0 ? (
          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
            {tags.map((tag) => (
              <Chip key={tag} label={tag} size="small" />
            ))}
          </Stack>
        ) : null}
        {blocks.length > 0 ? <Divider /> : null}
        <Stack spacing={3}>{blocks.map(renderBlock)}</Stack>
      </Stack>
    </Paper>
  );
};
