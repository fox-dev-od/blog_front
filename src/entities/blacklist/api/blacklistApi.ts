import { axiosInstance } from '../../../shared/api/axiosInstance';
import { buildQuery } from '../../../shared/lib/buildQuery';
import { BlacklistEntry, BlacklistPayload } from '../model/types';

export const blacklistApi = {
  getAll: async (params: Record<string, unknown> = {}) => {
    const { data } = await axiosInstance.get<{
      items: BlacklistEntry[];
      total: number;
    }>(`/blacklist${buildQuery(params)}`);
    return data;
  },
  getById: async (id: string) => {
    const { data } = await axiosInstance.get<BlacklistEntry>(`/blacklist/${id}`);
    return data;
  },
  create: async (payload: BlacklistPayload) => {
    const { data } = await axiosInstance.post<BlacklistEntry>(
      '/blacklist',
      payload,
    );
    return data;
  },
  update: async (id: string, payload: Partial<BlacklistPayload>) => {
    const { data } = await axiosInstance.patch<BlacklistEntry>(
      `/blacklist/${id}`,
      payload,
    );
    return data;
  },
  delete: async (id: string) => {
    await axiosInstance.delete(`/blacklist/${id}`);
  },
  activate: async (id: string) => {
    const { data } = await axiosInstance.patch<BlacklistEntry>(
      `/blacklist/${id}/activate`,
    );
    return data;
  },
  deactivate: async (id: string) => {
    const { data } = await axiosInstance.patch<BlacklistEntry>(
      `/blacklist/${id}/deactivate`,
    );
    return data;
  },
};
