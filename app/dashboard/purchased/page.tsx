'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import Protected from '@/components/Protected';
import { apiFetch } from '@/lib/api';
import type { Payment, Recipe } from '@/types';

export default function PurchasedPage() {
  return (
    <Protected>
      <Purchased />
    </Protected>
  );
}

function Purchased() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setPayments(await apiFetch<Payment[]>('/users/purchased'));
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  if (loading) return <LoadingSpinner label="Loading purchased recipes..." />;

  return (
    <div className="section-shell">
      <h1 className="text-4xl font-black text-slate-950 dark:text-white">My Purchased Recipes</h1>
      <p className="mt-2 text-slate-500">All purchased recipes are shown in table format.</p>
      <div className="mt-8 overflow-hidden rounded-3xl bg-white shadow-sm dark:bg-slate-900">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-orange-50 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <tr><th className="p-4">Recipe</th><th className="p-4">Amount</th><th className="p-4">Status</th><th className="p-4">Date</th><th className="p-4">Action</th></tr>
          </thead>
          <tbody>
            {payments.map((payment) => {
              const recipe = typeof payment.recipeId === 'object' ? payment.recipeId as Recipe : null;
              return (
                <tr key={payment._id} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="p-4 font-bold">{recipe?.recipeName || 'Recipe'}</td>
                  <td className="p-4">৳{payment.amount}</td>
                  <td className="p-4">{payment.paymentStatus}</td>
                  <td className="p-4">{new Date(payment.paidAt).toLocaleDateString()}</td>
                  <td className="p-4">{recipe ? <Link href={`/recipe/${recipe._id}`} className="font-bold text-orange-500">View Details</Link> : 'Unavailable'}</td>
                </tr>
              );
            })}
            {payments.length === 0 && <tr><td colSpan={5} className="p-10 text-center text-slate-500">No purchased recipes yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
