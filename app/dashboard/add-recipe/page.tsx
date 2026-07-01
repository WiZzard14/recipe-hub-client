'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Protected from '@/components/Protected';
import RecipeForm from '@/components/RecipeForm';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import type { UserStats } from '@/types';

export default function AddRecipePage() {
  return (
    <Protected>
      <AddRecipeContent />
    </Protected>
  );
}

function AddRecipeContent() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setStats(await apiFetch<UserStats>('/users/stats'));
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  if (loading) return <LoadingSpinner label="Checking recipe limit..." />;

  const recipesUsed = stats?.totalRecipes ?? 0;
  const isPremium = Boolean(stats?.isPremium || user?.isPremium);
  const reachedLimit = !isPremium && recipesUsed >= 2;

  return (
    <div className="dashboard-page">
      <div className="mx-auto mb-8 max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-orange-500">User Dashboard</p>
        <h1 className="mt-3 text-4xl font-black text-slate-950 dark:text-white">Add Recipe</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-400">
          Fill in all required recipe fields, upload the recipe image with ImgBB, and save the new recipe into the recipes collection.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <span className="rounded-full bg-orange-50 px-4 py-2 text-sm font-black text-orange-700 dark:bg-orange-950 dark:text-orange-200">
            Recipes added: {recipesUsed}{isPremium ? ' / Unlimited' : ' / 2'}
          </span>
          {isPremium ? (
            <span className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-black text-yellow-700 dark:bg-yellow-950 dark:text-yellow-200">⭐ Premium: Unlimited Recipes</span>
          ) : (
            <Link href="/dashboard/payment" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-black text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900">Upgrade for Unlimited</Link>
          )}
        </div>
      </div>

      {reachedLimit ? (
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-orange-200 bg-orange-50 p-8 text-center shadow-sm dark:border-orange-900 dark:bg-orange-950/40">
          <h2 className="text-2xl font-black text-slate-950 dark:text-white">Recipe limit reached</h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Normal users can add a maximum of 2 recipes. Purchase premium membership to add unlimited recipes.
          </p>
          <Link href="/dashboard/payment" className="mt-6 inline-flex rounded-full bg-orange-500 px-8 py-3 font-black text-white hover:bg-orange-600">Become Premium</Link>
        </div>
      ) : (
        <RecipeForm />
      )}
    </div>
  );
}
