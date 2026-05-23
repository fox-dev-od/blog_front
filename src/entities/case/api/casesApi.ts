import { axiosInstance } from '../../../shared/api/axiosInstance';
import { CaseItem, CasePayload } from '../model/types';

export const casesApi = {
  getAll: async () => {
    const { data } = await axiosInstance.get<CaseItem[]>('/cases');
    return data;
  },
  getById: async (id: string) => {
    const { data } = await axiosInstance.get<CaseItem>(`/cases/${id}`);
    return data;
  },
  create: async (payload: CasePayload) => {
    const { data } = await axiosInstance.post<CaseItem>('/cases', payload);
    return data;
  },
  update: async (id: string, payload: Partial<CasePayload>) => {
    const { data } = await axiosInstance.patch<CaseItem>(`/cases/${id}`, payload);
    return data;
  },
  delete: async (id: string) => {
    await axiosInstance.delete(`/cases/${id}`);
  },
};
