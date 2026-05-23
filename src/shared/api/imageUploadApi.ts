import axios from 'axios';

import { env } from '../config/env';

type ImgbbResponse = {
  data?: {
    display_url?: string;
    url?: string;
  };
};

export const uploadImageToImgbb = async (file: File) => {
  if (!env.imgbbApiKey) {
    throw new Error('Не вказано VITE_IMGBB_API_KEY для завантаження файлів');
  }

  const formData = new FormData();
  formData.append('key', env.imgbbApiKey);
  formData.append('image', file);

  const { data } = await axios.post<ImgbbResponse>(
    'https://api.imgbb.com/1/upload',
    formData,
  );

  const url = data.data?.display_url ?? data.data?.url;

  if (!url) {
    throw new Error('imgbb не повернув посилання на файл');
  }

  return url;
};
