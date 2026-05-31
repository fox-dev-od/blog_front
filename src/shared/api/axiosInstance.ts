import axios from 'axios';
import { toast } from 'react-toastify';

import { env } from '../config/env';
import { normalizeError } from '../lib/normalizeError';

export const axiosInstance = axios.create({
  baseURL: env.apiUrl,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      window.dispatchEvent(new Event('auth:logout'));
    }

    const isAuthMe = error.config?.url?.includes('/auth/me');
    if (!isAuthMe) {
      toast.error(normalizeError(error));
    }

    return Promise.reject(error);
  },
);
