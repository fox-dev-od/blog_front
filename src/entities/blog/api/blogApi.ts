import { axiosInstance } from '../../../shared/api/axiosInstance';
import { buildQuery } from '../../../shared/lib/buildQuery';
import { BlogPost, BlogPostPayload } from '../model/types';

export const blogApi = {
  getAll: async (params: Record<string, unknown> = {}) => {
    const { data } = await axiosInstance.get<{ items?: BlogPost[] } | BlogPost[]>(
      `/blog${buildQuery(params)}`,
    );
    return Array.isArray(data) ? data : data.items ?? [];
  },
  getById: async (id: string) => {
    const { data } = await axiosInstance.get<BlogPost>(`/blog/${id}`);
    return data;
  },
  create: async (payload: BlogPostPayload) => {
    const { data } = await axiosInstance.post<BlogPost>('/blog', payload);
    return data;
  },
  update: async (id: string, payload: Partial<BlogPostPayload>) => {
    const { data } = await axiosInstance.patch<BlogPost>(`/blog/${id}`, payload);
    return data;
  },
  delete: async (id: string) => {
    await axiosInstance.delete(`/blog/${id}`);
  },
};
