import { axiosInstance } from '../../../shared/api/axiosInstance';
import { CaseCategory, CaseCategoryPayload } from '../model/types';

export const caseCategoriesApi = {
  getAll: async () => {
    const { data } = await axiosInstance.get<CaseCategory[]>('/case-categories');
    return data;
  },
  getById: async (id: string) => {
    const { data } = await axiosInstance.get<CaseCategory>(
      `/case-categories/${id}`,
    );
    return data;
  },
  create: async (payload: CaseCategoryPayload) => {
    const { data } = await axiosInstance.post<CaseCategory>(
      '/case-categories',
      payload,
    );
    return data;
  },
  update: async (id: string, payload: Partial<CaseCategoryPayload>) => {
    const { data } = await axiosInstance.patch<CaseCategory>(
      `/case-categories/${id}`,
      payload,
    );
    return data;
  },
  delete: async (id: string) => {
    await axiosInstance.delete(`/case-categories/${id}`);
  },
};
