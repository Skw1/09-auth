import { api } from './api';
import type { User } from '@/types/user';
import type { Note } from '@/types/note';
import { cookies } from 'next/headers';
import type { AxiosResponse } from 'axios';

const getCookieHeader = async (): Promise<string | undefined> => {
  const cookieStore = await cookies();
  const cookiesList = cookieStore.getAll();

  if (cookiesList.length === 0) return undefined;

  return cookiesList
    .map(({ name, value }) => `${name}=${value}`)
    .join('; ');
};

export const fetchNotes = async (
  params?: { search?: string; page?: number; tag?: string }
): Promise<Note[]> => {
  const cookieHeader = await getCookieHeader();

  const { data } = await api.get<Note[]>('/notes', {
    headers: cookieHeader ? { Cookie: cookieHeader } : {},
    params,
  });

  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const cookieHeader = await getCookieHeader();

  const { data } = await api.get<Note>(`/notes/${id}`, {
    headers: cookieHeader ? { Cookie: cookieHeader } : {},
  });

  return data;
};

export const getMe = async (): Promise<User> => {
  const cookieHeader = await getCookieHeader();

  const { data } = await api.get<User>('/users/me', {
    headers: cookieHeader ? { Cookie: cookieHeader } : {},
  });

  return data;
};

export const checkSession = async (): Promise<AxiosResponse<User | null>> => {
  const cookieHeader = await getCookieHeader();

  return api.get<User | null>('/auth/session', {
    headers: cookieHeader ? { Cookie: cookieHeader } : {},
  });
};