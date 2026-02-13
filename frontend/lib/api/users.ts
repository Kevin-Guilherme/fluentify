import { api } from './client';
import { User, UserStats } from '@/types';

export const usersApi = {
  getProfile: () => api.get<User>('/users/me'),

  getStats: () => api.get<UserStats>('/users/me/stats'),

  updateProfile: (data: Partial<User>) =>
    api.patch<User>('/users/me', data),
};
