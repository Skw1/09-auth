import axios from 'axios';
import type { User } from '@/types/user';
import type { Note } from '@/types/note';

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const fetchNotes = async (
  cookies?: string,
  params?: { search?: string; page?: number; tag?: string }
): Promise<Note[]> => {
  const { data } = await axios.get<Note[]>(`${baseURL}/api/notes`, {
    params,
    headers: { Cookie: cookies },
  });
  return data;
};

export const fetchNoteById = async (id: string, cookies?: string): Promise<Note> => {
  const { data } = await axios.get<Note>(`${baseURL}/api/notes/${id}`, {
    headers: { Cookie: cookies },
  });
  return data;
};

export const getMe = async (cookies?: string): Promise<User> => {
  const { data } = await axios.get<User>(`${baseURL}/api/users/me`, {
    headers: { Cookie: cookies },
  });
  return data;
};

export const checkSession = async (cookies?: string): Promise<User | null> => {
  const { data } = await axios.get<User | '' | null>(`${baseURL}/api/auth/session`, {
    headers: { Cookie: cookies },
  });
  return data || null;
};
