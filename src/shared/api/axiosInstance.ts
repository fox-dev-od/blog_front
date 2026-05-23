import axios from 'axios';
import { toast } from 'react-toastify';

import { env } from '../config/env';
import { normalizeError } from '../lib/normalizeError';

export const axiosInstance = axios.create({
  baseURL: env.apiUrl,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const refreshToken = localStorage.getItem('refreshToken');
  if (refreshToken) {
    config.headers['x-refresh-token'] = refreshToken;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    const accessToken = response.headers['x-access-token'];
    const refreshToken = response.headers['x-refresh-token'];

    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    }

    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }

    return response;
  },
  (error) => {
    toast.error(normalizeError(error));
    return Promise.reject(error);
  },
);
