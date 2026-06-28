'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useMemo, useState } from 'react';
import Protected from '@/components/Protected';

export default function DemoCheckoutPage() {
  return (
    <Protected>
      <Suspense fallback={<div className="section-shell text-center font-bold text-orange-500">Loading checkout...</div>}>
        <DemoCheckout />
      </Suspense>
    </Protected>
  );
}

function DemoCheckout() {
  const router = useRouter();
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);
  const type = params.get('type') === 'recipe' ? 'recipe' : 'premium';
  const recipeId = params.get('recipeId') || '';
  const amount = params.get('amount') || (type === 'recipe' ? '100' : '500');
  const title = params.get('title') || (type === 'recipe' ? 'Recipe Purchase' : 'RecipeHub Premium Membership');
  const reason = params.get('reason') || 'Stripe secret key is not configured, so demo checkout is active.';

  const successHref = useMemo(() => {
    const sessionId = `dev_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const next = new URLSearchParams({ session_id: sessionId, type });
    if (recipeId) next.set('recipeId', recipeId);
    return `/payment/success?${next.toString()}`;
  }, [recipeId, type]);

  const completePayment = () => {
    setLoading(true);
    router.push(successHref);
  };

  return (
    <div className="section-shell">
      <div className="mx-auto max-w-3xl rounded-[2rem] bg-white p-8 shadow-xl dark:bg-slate-900">
        <div className="text-center">
          <span className="text-6xl">💳</span>
          <p className="mt-4 text-sm font-black uppercase tracking-[0.3em] text-orange-500">Demo Checkout</p>
          <h1 className="mt-3 text-4xl font-black text-slate-950 dark:text-white">Complete Payment</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-400">This page keeps your project fully testable locally without a real Stripe secret key.</p>
        </div>

        <div className="mt-8 rounded-3xl bg-orange-50 p-6 dark:bg-orange-950/40">
          <p className="text-sm font-bold text-slate-500">Payment item</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">{title}</h2>
          <p className="mt-4 text-5xl font-black text-orange-500">৳{amount}</p>
        </div>

        <div className="mt-6 rounded-3xl border border-dashed border-orange-300 bg-white p-5 text-sm font-semibold text-slate-600 dark:border-orange-800 dark:bg-slate-950 dark:text-slate-300">
          <p><span className="font-black text-orange-500">Why demo?</span> {reason}</p>
          <p className="mt-2">For real Stripe checkout, add a valid test/live <code>STRIPE_SECRET_KEY</code> in the server <code>.env</code> and restart the server.</p>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <button onClick={completePayment} disabled={loading} className="rounded-full bg-orange-500 px-8 py-4 font-black text-white hover:bg-orange-600 disabled:opacity-60">
            {loading ? 'Processing...' : 'Complete Demo Payment'}
          </button>
          <Link href={recipeId ? `/recipe/${recipeId}` : '/dashboard'} className="rounded-full border border-slate-200 px-8 py-4 text-center font-black text-slate-700 hover:border-orange-400 hover:text-orange-500 dark:border-slate-700 dark:text-slate-200">
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}
