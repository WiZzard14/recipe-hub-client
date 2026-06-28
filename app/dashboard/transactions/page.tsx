'use client';

import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import Protected from '@/components/Protected';
import { apiFetch } from '@/lib/api';
import type { Payment, Recipe } from '@/types';

export default function TransactionsPage() {
  return (
    <Protected adminOnly>
      <Transactions />
    </Protected>
  );
}

function Transactions() {
  const [transactions, setTransactions] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try { setTransactions(await apiFetch<Payment[]>('/payments/transactions')); }
      finally { setLoading(false); }
    };
    void load();
  }, []);

  if (loading) return <LoadingSpinner label="Loading transactions..." />;

  return (
    <div className="section-shell">
      <h1 className="text-4xl font-black text-slate-950 dark:text-white">Transactions</h1>
      <p className="mt-2 text-slate-500">Payment status, amount, date and transaction ID.</p>
      <div className="mt-8 overflow-hidden rounded-3xl bg-white shadow-sm dark:bg-slate-900">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-orange-50 dark:bg-slate-800"><tr><th className="p-4">User</th><th className="p-4">Type</th><th className="p-4">Recipe</th><th className="p-4">Amount</th><th className="p-4">Status</th><th className="p-4">Transaction ID</th><th className="p-4">Date</th></tr></thead>
          <tbody>
            {transactions.map((payment) => {
              const recipe = typeof payment.recipeId === 'object' ? payment.recipeId as Recipe : null;
              return (
                <tr key={payment._id} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="p-4">{payment.userEmail}</td>
                  <td className="p-4 capitalize">{payment.type}</td>
                  <td className="p-4">{recipe?.recipeName || '-'}</td>
                  <td className="p-4">৳{payment.amount}</td>
                  <td className="p-4">{payment.paymentStatus}</td>
                  <td className="p-4 font-mono text-xs">{payment.transactionId}</td>
                  <td className="p-4">{new Date(payment.paidAt).toLocaleDateString()}</td>
                </tr>
              );
            })}
            {transactions.length === 0 && <tr><td className="p-10 text-center text-slate-500" colSpan={7}>No transactions yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
