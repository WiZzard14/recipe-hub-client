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

  // Zero-config mode: if no imgbb key is supplied, keep the assignment working by
  // converting small uploaded images to a data URL. Add a real imgbb key later for
  // production-grade permanent image hosting.
  if (!key || key.includes('replace')) {
    if (file.size > 950_000) {
      throw new Error('Image is too large for zero-config upload. Use an Image URL or add NEXT_PUBLIC_IMGBB_API_KEY.');
    }
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error('Image preview upload failed'));
      reader.readAsDataURL(file);
    });
  }

  const formData = new FormData();
  formData.append('image', file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, { method: 'POST', body: formData });
  const data = await res.json();
  if (!res.ok || !data?.data?.url) throw new Error(data?.error?.message || 'Image upload failed');
  return data.data.url as string;
}
