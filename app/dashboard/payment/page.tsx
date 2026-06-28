'use client';

import { useState } from 'react';
import Protected from '@/components/Protected';
import { apiFetch } from '@/lib/api';

export default function PremiumPaymentPage() {
  return (
    <Protected>
      <PremiumPayment />
    </Protected>
  );
}

function PremiumPayment() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const checkout = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await apiFetch<{ url: string; message?: string }>('/payments/create-checkout-session', { method: 'POST', body: JSON.stringify({ type: 'premium' }) });
      window.location.href = res.url;
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Payment checkout failed');
      setLoading(false);
    }
  };

  return (
    <div className="section-shell">
      <div className="mx-auto max-w-3xl rounded-[2rem] bg-white p-8 text-center shadow-sm dark:bg-slate-900">
        <span className="text-6xl">👑</span>
        <h1 className="mt-4 text-4xl font-black text-slate-950 dark:text-white">Become a Premium Member</h1>
        <p className="mt-4 text-slate-600 dark:text-slate-400">Premium users unlock a premium profile badge and unlimited recipe publishing.</p>
        {message && <p className="mt-6 rounded-2xl bg-red-50 p-4 font-bold text-red-600 dark:bg-red-950">{message}</p>}
        <div className="mt-8 rounded-3xl bg-orange-50 p-8 dark:bg-orange-950/40">
          <p className="text-sm font-bold text-slate-500">One-time payment</p>
          <p className="mt-2 text-5xl font-black text-orange-500">৳500</p>
        </div>
        <button onClick={checkout} disabled={loading} className="mt-8 rounded-full bg-orange-500 px-10 py-4 font-black text-white hover:bg-orange-600 disabled:opacity-60">{loading ? 'Redirecting...' : 'Pay / Demo Checkout'}</button>
      </div>
    </div>
  );
}
