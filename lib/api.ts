export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

type QueryValue = string | number | boolean | undefined | null;

export function buildPath(path: string, query?: Record<string, QueryValue>) {
  const params = new URLSearchParams();
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') params.set(key, String(value));
    });
  }
  const queryString = params.toString();
  return queryString ? `${path}?${queryString}` : path;
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers,
  });

  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await res.json() : await res.text();
  if (!res.ok) {
    const message = typeof data === 'object' && data && 'message' in data ? String(data.message) : 'Request failed';
    throw new Error(message);
  }
  return data as T;
}

export async function uploadToImgbb(file: File): Promise<string> {
  const key = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!key || key.includes('replace')) throw new Error('NEXT_PUBLIC_IMGBB_API_KEY is missing. Use Image URL instead or add the key.');
  const formData = new FormData();
  formData.append('image', file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, { method: 'POST', body: formData });
  const data = await res.json();
  if (!res.ok || !data?.data?.url) throw new Error(data?.error?.message || 'Image upload failed');
  return data.data.url as string;
}
