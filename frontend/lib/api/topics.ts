import { api } from './client';
import { Topic } from '@/types';

export interface TopicsFilter {
  difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  category?: string;
}

export const topicsApi = {
  getAll: (filters?: TopicsFilter) => {
    const params = new URLSearchParams();
    if (filters?.difficulty) params.append('difficulty', filters.difficulty);
    if (filters?.category) params.append('category', filters.category);

    const query = params.toString();
    return api.get<Topic[]>(`/topics${query ? `?${query}` : ''}`);
  },

  getById: (id: string) => api.get<Topic>(`/topics/${id}`),
};
