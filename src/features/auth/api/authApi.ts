import { axiosInstance } from '../../../shared/api/axiosInstance';
import { LoginPayload, LoginResponse } from '../model/types';

export const authApi = {
  login: async (payload: LoginPayload) => {
    const { data } = await axiosInstance.post<LoginResponse>(
      '/auth/login',
      payload,
    );
    return data;
  },
  me: async () => {
    const { data } = await axiosInstance.get<LoginResponse['user']>('/auth/me');
    return data;
  },
  logout: async () => {
    await axiosInstance.post('/auth/logout');
  },
};
