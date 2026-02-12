import { api } from './client';
import { User } from '@/types';

export interface SignUpPayload {
  email: string;
  password: string;
  name: string;
}

export interface SignInPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export const authApi = {
  signUp: (payload: SignUpPayload) =>
    api.post<AuthResponse>('/auth/signup', payload),

  signIn: (payload: SignInPayload) =>
    api.post<AuthResponse>('/auth/signin', payload),

  getMe: () => api.get<User>('/auth/me'),
};
