'use client';

import { useState } from 'react';
import Protected from '@/components/Protected';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import type { AuthUser } from '@/types';

export default function ProfilePage() {
  return (
    <Protected>
      <Profile />
    </Protected>
  );
}

function Profile() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [image, setImage] = useState(user?.image || '');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const data = await apiFetch<{ message: string; user: AuthUser }>('/users/profile', { method: 'PUT', body: JSON.stringify({ name, image }) });
      setUser(data.user);
      setMessage(data.message);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Profile update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="section-shell">
      <div className="mx-auto max-w-3xl rounded-[2rem] bg-white p-8 shadow-sm dark:bg-slate-900">
        <div className="flex flex-col items-center gap-4 text-center">
          <img src={image || 'https://avatar.iran.liara.run/public'} alt={name} className="h-32 w-32 rounded-full border-4 border-orange-100 object-cover" />
          <h1 className="text-4xl font-black text-slate-950 dark:text-white">Profile</h1>
          <p className="text-slate-500">Update name and image. Premium badge is shown based on payment.</p>
          <div className="flex gap-2">
            <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-black uppercase dark:bg-slate-800">{user?.role}</span>
            {user?.isPremium && <span className="rounded-full bg-yellow-100 px-4 py-2 text-xs font-black uppercase text-yellow-700">⭐ Premium Member</span>}
          </div>
        </div>
        {message && <p className="mt-6 rounded-2xl bg-orange-50 p-4 text-center font-bold text-orange-700 dark:bg-orange-950">{message}</p>}
        <form onSubmit={save} className="mt-8 space-y-4">
          <input value={name} onChange={(e) => setName(e.target.value)} required className="input-field" placeholder="Name" />
          <input value={image} onChange={(e) => setImage(e.target.value)} className="input-field" placeholder="Image URL" />
          <button disabled={saving} className="w-full rounded-full bg-orange-500 px-6 py-3 font-black text-white hover:bg-orange-600 disabled:opacity-60">{saving ? 'Saving...' : 'Update Profile'}</button>
        </form>
      </div>
    </div>
  );
}
