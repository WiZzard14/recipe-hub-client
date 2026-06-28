'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Protected({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) router.push(`/login?from=${encodeURIComponent(pathname)}`);
    if (!loading && user && adminOnly && user.role !== 'admin') router.push('/dashboard');
  }, [adminOnly, loading, pathname, router, user]);

  if (loading) return <LoadingSpinner label="Checking authentication..." />;
  if (!user || (adminOnly && user.role !== 'admin')) return null;
  return <>{children}</>;
}
