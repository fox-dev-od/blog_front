import { axiosInstance } from '../../../shared/api/axiosInstance';
import { CurrentUser, LoginPayload } from '../model/types';

export const authApi = {
  login: async (payload: LoginPayload) => {
    const { data } = await axiosInstance.post<CurrentUser>(
      '/auth/login',
      payload,
    );
    return data;
  },
  me: async () => {
    const { data } = await axiosInstance.get<CurrentUser>('/auth/me');
    return data;
  },
  logout: async () => {
    await axiosInstance.post('/auth/logout');
  },
};
