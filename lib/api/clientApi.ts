import { api, ApiError } from './api';
import type { User } from '@/types/user';
import type { Note } from '@/types/note';

interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (params?: {
  search?: string;
  page?: number;
  tag?: string;
}): Promise<NotesResponse> => {
  const { data } = await api.get<NotesResponse>('/notes', { params });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
};

export const createNote = async (note: {
  title: string;
  content: string;
  tag: string;
}): Promise<Note> => {
  const { data } = await api.post<Note>('/notes', note);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
};

export const register = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<User> => {
  try {
    const { data } = await api.post<User>('/auth/register', {
      email,
      password,
    });
    return data;
  } catch (err: unknown) {
    const axiosError = err as ApiError;
    throw new Error(axiosError.response?.data?.error || 'Registration failed');
  }
};

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<User> => {
  try {
    const { data } = await api.post<User>('/auth/login', { email, password });
    return data;
  } catch (err: unknown) {
    const axiosError = err as ApiError;
    throw new Error(axiosError.response?.data?.error || 'Login failed');
  }
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const getMe = async (): Promise<User> => {
  const { data } = await api.get<User>('/users/me');
  return data;
};

export const updateMe = async (update: { username: string }): Promise<User> => {
  const { data } = await api.patch<User>('/users/me', update);
  return data;
};


export const checkSession = async (): Promise<User | null> => {
  const { data } = await api.get<User | '' | null>('/auth/session');
  return data || null;
};
