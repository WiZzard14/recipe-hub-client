'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import Protected from '@/components/Protected';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';

export default function PaymentSuccessPage() {
  return (
    <Protected>
      <PaymentSuccess />
    </Protected>
  );
}

function PaymentSuccess() {
  const { refreshUser } = useAuth();
  const [message, setMessage] = useState('Saving payment...');
  const [done, setDone] = useState(false);

  useEffect(() => {
    const save = async () => {
      const params = new URLSearchParams(window.location.search);
      try {
        const data = await apiFetch<{ message: string }>('/payments/success', {
          method: 'POST',
          body: JSON.stringify({ sessionId: params.get('session_id'), type: params.get('type'), recipeId: params.get('recipeId') }),
        });
        await refreshUser();
        setMessage(data.message);
      } catch (err) {
        setMessage(err instanceof Error ? err.message : 'Payment save failed');
      } finally {
        setDone(true);
      }
    };
    void save();
  }, [refreshUser]);

  if (!done) return <LoadingSpinner label={message} />;

  return (
    <div className="section-shell">
      <div className="mx-auto max-w-xl rounded-[2rem] bg-white p-10 text-center shadow-sm dark:bg-slate-900">
        <div className="text-7xl">✅</div>
        <h1 className="mt-5 text-4xl font-black text-slate-950 dark:text-white">Payment Success</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-400">{message}</p>
        <Link href="/dashboard" className="mt-8 inline-flex rounded-full bg-orange-500 px-8 py-3 font-black text-white hover:bg-orange-600">Go to Dashboard</Link>
      </div>
    </div>
  );
}
