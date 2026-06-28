'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';

const linkClass = (active: boolean) =>
  `font-medium transition hover:text-orange-500 ${active ? 'text-orange-500' : 'text-slate-700 dark:text-slate-200'}`;

export default function NavbarComponent() {
  const { user, setUser, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } finally {
      setUser(null);
      router.push('/');
      router.refresh();
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex min-h-16 max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="text-2xl font-black tracking-tight text-orange-500">
          Recipe<span className="text-slate-900 dark:text-white">Hub</span>
        </Link>

        <div className="order-3 flex w-full flex-wrap items-center gap-4 sm:order-2 sm:w-auto">
          <Link href="/" className={linkClass(pathname === '/')}>Home</Link>
          <Link href="/browse" className={linkClass(pathname.startsWith('/browse'))}>Browse Recipes</Link>
          {user && <Link href="/dashboard" className={linkClass(pathname.startsWith('/dashboard'))}>Dashboard</Link>}
          {user && <Link href="/dashboard/profile" className={linkClass(pathname === '/dashboard/profile')}>Profile</Link>}
        </div>

        <div className="order-2 flex items-center gap-3 sm:order-3">
          <ThemeToggle />
          {loading ? (
            <span className="text-sm text-slate-500">Loading...</span>
          ) : user ? (
            <div className="flex items-center gap-3">
              <img
                src={user.image || 'https://avatar.iran.liara.run/public'}
                alt={user.name}
                className="h-10 w-10 rounded-full border-2 border-orange-400 object-cover"
              />
              <button onClick={handleLogout} className="rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-100 dark:bg-red-950 dark:text-red-300">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="rounded-full px-4 py-2 font-semibold text-slate-700 hover:text-orange-500 dark:text-slate-200">Login</Link>
              <Link href="/register" className="rounded-full bg-orange-500 px-5 py-2 font-bold text-white hover:bg-orange-600">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
