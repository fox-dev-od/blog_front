import { axiosInstance } from '../../../shared/api/axiosInstance';
import { buildQuery } from '../../../shared/lib/buildQuery';
import { ActivityLog } from '../model/types';

export const activityLogsApi = {
  getAll: async (params: Record<string, unknown> = {}) => {
    const { data } = await axiosInstance.get<{
      items: ActivityLog[];
      total: number;
      page: number;
      limit: number;
    }>(`/activity-logs${buildQuery(params)}`);
    return data;
  },
  getById: async (id: string) => {
    const { data } = await axiosInstance.get<ActivityLog>(`/activity-logs/${id}`);
    return data;
  },
  delete: async (id: string) => {
    await axiosInstance.delete(`/activity-logs/${id}`);
  },
};
