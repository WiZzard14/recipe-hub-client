'use client';

import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import Protected from '@/components/Protected';
import { apiFetch } from '@/lib/api';
import type { AuthUser } from '@/types';

export default function ManageUsersPage() {
  return (
    <Protected adminOnly>
      <ManageUsers />
    </Protected>
  );
}

function ManageUsers() {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const load = async () => {
    try {
      const data = await apiFetch<{ data: AuthUser[] }>('/users/admin/all?limit=50');
      setUsers(data.data);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const setBlocked = async (id: string, isBlocked: boolean) => {
    try {
      const data = await apiFetch<{ message: string; user: AuthUser }>(`/users/admin/${id}/block`, { method: 'PATCH', body: JSON.stringify({ isBlocked }) });
      setUsers((prev) => prev.map((user) => user.id === id ? data.user : user));
      setMessage(data.message);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Action failed');
    }
  };

  if (loading) return <LoadingSpinner label="Loading users..." />;

  return (
    <div className="dashboard-page">
      <h1 className="text-4xl font-black text-slate-950 dark:text-white">Manage Users</h1>
      <p className="mt-2 text-slate-500">Admin can view users and block/unblock accounts.</p>
      {message && <p className="mt-6 rounded-2xl bg-orange-50 p-4 font-bold text-orange-700 dark:bg-orange-950">{message}</p>}
      <div className="mt-8 overflow-hidden rounded-3xl bg-white shadow-sm dark:bg-slate-900">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-orange-50 dark:bg-slate-800"><tr><th className="p-4">User</th><th className="p-4">Email</th><th className="p-4">Role</th><th className="p-4">Premium</th><th className="p-4">Status</th><th className="p-4">Action</th></tr></thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-slate-100 dark:border-slate-800">
                <td className="p-4 font-bold">{user.name}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">{user.role}</td>
                <td className="p-4">{user.isPremium ? 'Yes' : 'No'}</td>
                <td className="p-4">{user.isBlocked ? 'Blocked' : 'Active'}</td>
                <td className="p-4"><button onClick={() => void setBlocked(user.id, !user.isBlocked)} className="rounded-full bg-orange-500 px-4 py-2 font-bold text-white">{user.isBlocked ? 'Unblock' : 'Block'}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
