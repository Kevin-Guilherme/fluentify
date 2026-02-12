import { api } from './client';
import { Conversation, Message } from '@/types';

export interface CreateConversationPayload {
  topicId: string;
}

export interface SendMessagePayload {
  audioBlob: Blob;
}

export const conversationsApi = {
  create: (payload: CreateConversationPayload) =>
    api.post<Conversation>('/conversations', payload),

  getById: (id: string) => api.get<Conversation>(`/conversations/${id}`),

  getAll: () => api.get<Conversation[]>('/conversations'),

  sendMessage: async (conversationId: string, audioBlob: Blob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');

    const session = await (await import('@/lib/supabase/client')).supabase.auth.getSession();
    const token = session.data.session?.access_token;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/conversations/${conversationId}/messages`,
      {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    return response.json() as Promise<Message>;
  },

  complete: (conversationId: string) =>
    api.post<Conversation>(`/conversations/${conversationId}/complete`),
};
