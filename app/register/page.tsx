'use client';

import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/firebase/firebase.config';
import { apiFetch } from '@/lib/api';
import type { AuthUser } from '@/types';

export default function Register() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', image: '', password: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const validatePassword = () => /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/.test(formData.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validatePassword()) {
      setError('Password must be at least 6 characters with one uppercase and one lowercase letter.');
      return;
    }
    setSaving(true);
    try {
      await apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(formData) });
      router.push('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setSaving(false);
    }
  };

  const handleGoogleLogin = async () => {
    setSaving(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      const data = await apiFetch<{ message: string; user: AuthUser }>('/auth/google', {
        method: 'POST',
        body: JSON.stringify({ name: result.user.displayName, email: result.user.email, image: result.user.photoURL }),
      });
      setUser(data.user);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google registration failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-center text-3xl font-black text-slate-950 dark:text-white">Register</h1>
        <p className="mt-2 text-center text-slate-500">Create your RecipeHub account</p>
        {error && <p className="mt-5 rounded-2xl bg-red-50 p-3 text-center text-sm font-bold text-red-600 dark:bg-red-950">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input required placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-field" />
          <input type="email" required placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="input-field" />
          <input placeholder="Image URL" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className="input-field" />
          <input type="password" required placeholder="Password: min 6, uppercase, lowercase" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="input-field" />
          <button disabled={saving} className="w-full rounded-full bg-orange-500 px-6 py-3 font-black text-white hover:bg-orange-600 disabled:opacity-60">{saving ? 'Please wait...' : 'Register'}</button>
        </form>
        <div className="my-5 flex items-center gap-3 text-sm font-bold text-slate-400"><span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />OR<span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" /></div>
        <button disabled={saving} onClick={handleGoogleLogin} className="w-full rounded-full border border-slate-200 px-6 py-3 font-black text-slate-700 hover:border-orange-400 dark:border-slate-700 dark:text-slate-200">Continue with Google</button>
        <p className="mt-5 text-center text-sm text-slate-600 dark:text-slate-400">Already have an account? <Link href="/login" className="font-black text-orange-500">Login</Link></p>
      </div>
    </div>
  );
}
