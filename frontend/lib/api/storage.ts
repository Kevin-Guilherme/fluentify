const STORAGE_URL = process.env.NEXT_PUBLIC_STORAGE_URL || 'http://localhost:3001/storage';

export const storageApi = {
  getAudioUrl: (filename: string) => `${STORAGE_URL}/${filename}`,
};
