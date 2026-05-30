import { axiosInstance } from '../../../shared/api/axiosInstance';
import { User, UserCreatePayload, UserUpdatePayload } from '../model/types';

export const usersApi = {
  getAll: async () => {
    const { data } = await axiosInstance.get<User[]>('/users');
    return data;
  },
  getById: async (id: string) => {
    const { data } = await axiosInstance.get<User>(`/users/${id}`);
    return data;
  },
  create: async (payload: UserCreatePayload) => {
    const { data } = await axiosInstance.post<User>('/users', payload);
    return data;
  },
  update: async (id: string, payload: UserUpdatePayload) => {
    const { data } = await axiosInstance.patch<User>(`/users/${id}`, payload);
    return data;
  },
  delete: async (id: string) => {
    await axiosInstance.delete(`/users/${id}`);
  },
};
