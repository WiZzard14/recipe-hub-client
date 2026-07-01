'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Protected from '@/components/Protected';
import { useAuth } from '@/context/AuthContext';

const userLinks = [
  { href: '/dashboard', label: 'Overview', desc: 'Stats and premium badge' },
  { href: '/dashboard/add-recipe', label: 'Add Recipe', desc: 'Create a new recipe' },
  { href: '/dashboard/my-recipes', label: 'My Recipes', desc: 'Edit or delete recipes' },
  { href: '/dashboard/favorites', label: 'My Favorites', desc: 'Saved recipes' },
  { href: '/dashboard/purchased', label: 'My Purchased Recipes', desc: 'Paid recipe list' },
  { href: '/dashboard/profile', label: 'Profile', desc: 'Update name and image' },
];

const adminLinks = [
  { href: '/dashboard', label: 'Admin Overview', desc: 'Users, recipes, premium, reports' },
  { href: '/dashboard/users', label: 'Manage Users', desc: 'View, block, unblock' },
  { href: '/dashboard/admin-recipes', label: 'Manage Recipes', desc: 'Edit, delete, feature' },
  { href: '/dashboard/reports', label: 'Recipe Reports', desc: 'Dismiss or remove' },
  { href: '/dashboard/transactions', label: 'Transactions', desc: 'Payment records' },
  { href: '/dashboard/admin-add-featured', label: 'Add Featured Recipe', desc: 'Publish featured recipe' },
];

const isActiveLink = (pathname: string, href: string) => {
  if (href === '/dashboard') return pathname === '/dashboard';
  return pathname === href || pathname.startsWith(`${href}/`);
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Protected>
      <DashboardFrame>{children}</DashboardFrame>
    </Protected>
  );
}

function DashboardFrame({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const links = user?.role === 'admin' ? adminLinks : userLinks;

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[290px_1fr] lg:px-8">
      <aside className="h-fit rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:sticky lg:top-24">
        <div className="border-b border-slate-100 p-4 dark:border-slate-800">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-500">Dashboard Panel</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
            {user?.role === 'admin' ? 'Admin Dashboard' : 'User Dashboard'}
          </h2>
          <p className="mt-1 break-words text-sm text-slate-500">{user?.email}</p>
          {user?.isPremium && <span className="mt-3 inline-flex rounded-full bg-yellow-100 px-3 py-1 text-xs font-black uppercase text-yellow-700 dark:bg-yellow-950 dark:text-yellow-200">⭐ Premium</span>}
        </div>

        <nav className="mt-4 grid gap-2">
          {links.map((link) => {
            const active = isActiveLink(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-2xl px-4 py-3 transition ${active ? 'bg-orange-500 text-white shadow-md shadow-orange-100 dark:shadow-none' : 'text-slate-700 hover:bg-orange-50 hover:text-orange-600 dark:text-slate-200 dark:hover:bg-orange-950/40'}`}
              >
                <span className="block text-sm font-black">{link.label}</span>
                <span className={`mt-1 block text-xs ${active ? 'text-orange-50' : 'text-slate-500 dark:text-slate-400'}`}>{link.desc}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <section className="min-w-0">{children}</section>
    </div>
  );
}
