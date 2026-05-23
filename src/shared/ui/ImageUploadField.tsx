import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ChangeEvent, useRef, useState } from 'react';
import { FiUpload } from 'react-icons/fi';
import { toast } from 'react-toastify';

import { uploadImageToImgbb } from '../api/imageUploadApi';
import { normalizeError } from '../lib/normalizeError';

type ImageUploadFieldProps = {
  multiple?: boolean;
  label?: string;
  helperText?: string;
  onUploaded: (urls: string[]) => void;
};

export const ImageUploadField = ({
  multiple = false,
  label = 'Завантажити фото',
  helperText = 'Файл буде завантажено на imgbb, у форму додасться посилання.',
  onUploaded,
}: ImageUploadFieldProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';

    if (files.length === 0) {
      return;
    }

    setIsUploading(true);

    try {
      const urls = await Promise.all(files.map((file) => uploadImageToImgbb(file)));
      onUploaded(urls);
      toast.success(urls.length === 1 ? 'Файл завантажено' : 'Файли завантажено');
    } catch (error) {
      toast.error(normalizeError(error));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        hidden
        onChange={handleChange}
      />
      <Button
        variant="outlined"
        startIcon={<FiUpload />}
        disabled={isUploading}
        onClick={() => inputRef.current?.click()}
      >
        {isUploading ? 'Завантаження...' : label}
      </Button>
      <Typography variant="caption" color="text.secondary">
        {helperText}
      </Typography>
    </Stack>
  );
};
