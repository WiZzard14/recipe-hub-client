'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import Protected from '@/components/Protected';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import type { AdminStats, UserStats } from '@/types';

export default function Dashboard() {
  return (
    <Protected>
      <DashboardContent />
    </Protected>
  );
}

function DashboardContent() {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const stats = await apiFetch<UserStats>('/users/stats');
        setUserStats(stats);
        if (user?.role === 'admin') {
          setAdminStats(await apiFetch<AdminStats>('/users/admin/stats'));
        }
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [user?.role]);

  if (loading) return <LoadingSpinner label="Loading dashboard..." />;

  return (
    <div className="dashboard-page">
      <div className="rounded-[2rem] bg-white p-8 shadow-sm dark:bg-slate-900">
        <div className="flex flex-col gap-6 border-b border-slate-100 pb-8 dark:border-slate-800 sm:flex-row sm:items-center">
          <img src={user?.image || 'https://avatar.iran.liara.run/public'} alt={user?.name || 'User'} className="h-24 w-24 rounded-full border-4 border-orange-100 object-cover" />
          <div className="flex-1">
            <h1 className="text-4xl font-black text-slate-950 dark:text-white">{user?.role === 'admin' ? 'Admin Dashboard Overview' : 'User Dashboard Overview'}</h1>
            <p className="mt-1 text-slate-500">Welcome, {user?.name} • {user?.email}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-black uppercase text-slate-700 dark:bg-slate-800 dark:text-slate-200">{user?.role}</span>
              {user?.isPremium && <span className="rounded-full bg-yellow-100 px-4 py-2 text-xs font-black uppercase text-yellow-700">⭐ Premium</span>}
            </div>
          </div>
          {!user?.isPremium && <Link href="/dashboard/payment" className="rounded-full bg-orange-500 px-6 py-3 font-black text-white hover:bg-orange-600">Upgrade Premium</Link>}
        </div>

        {user?.role === 'admin' && adminStats ? <AdminOverview stats={adminStats} /> : <UserOverview stats={userStats} />}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-orange-50 p-6 dark:border-slate-800 dark:bg-slate-950">
      <p className="text-sm font-bold text-slate-500">{label}</p>
      <p className="mt-2 text-4xl font-black text-orange-500">{value}</p>
    </div>
  );
}

function UserOverview({ stats }: { stats: UserStats | null }) {
  return (
    <div className="mt-8">
      <div className="grid gap-5 md:grid-cols-4">
        <StatCard label="Total Recipes" value={stats?.totalRecipes ?? 0} />
        <StatCard label="Total Favorites" value={stats?.totalFavorites ?? 0} />
        <StatCard label="Likes Received" value={stats?.totalLikesReceived ?? 0} />
        <StatCard label="Premium Badge After Payment" value={stats?.isPremium ? 'Active' : 'No'} />
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-4">
        <DashboardLink href="/dashboard/add-recipe" title="Add Recipe" desc="Publish a new recipe." />
        <DashboardLink href="/dashboard/my-recipes" title="My Recipes" desc="View, update and delete own recipes." />
        <DashboardLink href="/dashboard/favorites" title="My Favorites" desc="Saved favorite recipes." />
        <DashboardLink href="/dashboard/purchased" title="Purchased" desc="Recipes you purchased." />
      </div>
    </div>
  );
}

function AdminOverview({ stats }: { stats: AdminStats }) {
  return (
    <div className="mt-8">
      <div className="grid gap-5 md:grid-cols-4">
        <StatCard label="Total Users" value={stats.totalUsers} />
        <StatCard label="Total Recipes" value={stats.totalRecipes} />
        <StatCard label="Premium Members" value={stats.totalPremiumMembers} />
        <StatCard label="Total Reports" value={stats.totalReports} />
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-5">
        <DashboardLink href="/dashboard/users" title="Manage Users" desc="View, block or unblock users." />
        <DashboardLink href="/dashboard/admin-recipes" title="Manage Recipes" desc="Show all recipes, edit, delete or feature recipes." />
        <DashboardLink href="/dashboard/reports" title="Reports" desc="Dismiss reports or remove recipes." />
        <DashboardLink href="/dashboard/transactions" title="Transactions" desc="View payment records." />
      </div>
    </div>
  );
}

function DashboardLink({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <Link href={href} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-orange-400 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
      <h3 className="text-xl font-black text-slate-950 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{desc}</p>
    </Link>
  );
}
