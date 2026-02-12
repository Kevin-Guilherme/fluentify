import { api } from './client';
import { User, UserStats } from '@/types';

export const usersApi = {
  getProfile: () => api.get<User>('/users/profile'),

  getStats: () => api.get<UserStats>('/users/stats'),

  updateProfile: (data: Partial<User>) =>
    api.put<User>('/users/profile', data),
};
