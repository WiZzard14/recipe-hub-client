'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import type { RecipeDetailsResponse } from '@/types';

const reportReasons = ['Spam', 'Offensive Content', 'Copyright Issue'] as const;

export default function RecipeDetails() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const id = params.id;
  const [data, setData] = useState<RecipeDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showReport, setShowReport] = useState(false);
  const [reason, setReason] = useState<(typeof reportReasons)[number]>('Spam');

  const load = async () => {
    setLoading(true);
    try {
      const response = await apiFetch<RecipeDetailsResponse>(`/recipes/${id}`);
      setData(response);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to load recipe');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) void load();
  }, [id]);

  const requireLogin = () => {
    if (!user) {
      router.push(`/login?from=${encodeURIComponent(`/recipe/${id}`)}`);
      return false;
    }
    return true;
  };

  const likeRecipe = async () => {
    if (!requireLogin() || !data) return;
    try {
      const res = await apiFetch<{ message: string; likesCount: number; isLiked: boolean }>(`/recipes/${id}/like`, { method: 'PATCH' });
      setData({ ...data, recipe: { ...data.recipe, likesCount: res.likesCount } });
      setMessage(res.message);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Like failed');
    }
  };

  const toggleFavorite = async () => {
    if (!requireLogin() || !data) return;
    try {
      const res = await apiFetch<{ message: string; isFavorite: boolean }>(`/recipes/${id}/favorite`, { method: 'POST' });
      setData({ ...data, isFavorite: res.isFavorite });
      setMessage(res.message);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Favorite failed');
    }
  };

  const purchaseRecipe = async () => {
    if (!requireLogin()) return;
    try {
      const res = await apiFetch<{ url: string }>('/payments/create-checkout-session', { method: 'POST', body: JSON.stringify({ type: 'recipe', recipeId: id }) });
      window.location.href = res.url;
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Payment failed');
    }
  };

  const reportRecipe = async () => {
    if (!requireLogin()) return;
    try {
      const res = await apiFetch<{ message: string }>(`/recipes/${id}/report`, { method: 'POST', body: JSON.stringify({ reason }) });
      setMessage(res.message);
      setShowReport(false);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Report failed');
    }
  };

  if (loading) return <LoadingSpinner label="Loading recipe details..." />;
  if (!data) return <div className="section-shell text-center font-bold text-red-500">{message || 'Recipe not found.'}</div>;

  const { recipe } = data;

  return (
    <div className="section-shell">
      <div className="overflow-hidden rounded-[2rem] bg-white shadow-xl dark:bg-slate-900">
        <img src={recipe.recipeImage} alt={recipe.recipeName} className="h-[420px] w-full object-cover" />
        <div className="p-6 sm:p-10">
          {message && <p className="mb-6 rounded-2xl bg-orange-50 p-4 text-sm font-bold text-orange-700 dark:bg-orange-950 dark:text-orange-200">{message}</p>}
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
            <div>
              <h1 className="text-4xl font-black text-slate-950 dark:text-white">{recipe.recipeName}</h1>
              <p className="mt-3 text-lg font-semibold text-orange-500">{recipe.category} • {recipe.cuisineType} • {recipe.difficultyLevel}</p>
              <p className="mt-2 text-slate-500">By {recipe.authorName} • ⏱️ {recipe.preparationTime}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={likeRecipe} className="rounded-full bg-red-50 px-5 py-3 font-black text-red-600 hover:bg-red-100 dark:bg-red-950">❤️ {recipe.likesCount || 0}</button>
              <button onClick={toggleFavorite} className="rounded-full bg-orange-50 px-5 py-3 font-black text-orange-600 hover:bg-orange-100 dark:bg-orange-950">{data.isFavorite ? '★ Favorited' : '☆ Favorite'}</button>
              <button onClick={purchaseRecipe} className="rounded-full bg-slate-900 px-5 py-3 font-black text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900">{data.isPurchased ? 'Purchased' : 'Purchase'}</button>
              <button onClick={() => setShowReport(true)} className="rounded-full border border-slate-200 px-5 py-3 font-black text-slate-600 hover:border-red-400 hover:text-red-500 dark:border-slate-700">Report</button>
            </div>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[320px_1fr]">
            <div className="rounded-3xl bg-orange-50 p-6 dark:bg-orange-950/40">
              <h2 className="text-2xl font-black text-slate-950 dark:text-white">Ingredients</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-700 dark:text-slate-300">
                {recipe.ingredients.map((ingredient) => <li key={ingredient}>{ingredient}</li>)}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-950 dark:text-white">Instructions</h2>
              <p className="mt-4 whitespace-pre-line leading-8 text-slate-700 dark:text-slate-300">{recipe.instructions}</p>
            </div>
          </div>
        </div>
      </div>

      {showReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900">
            <h3 className="text-2xl font-black text-slate-950 dark:text-white">Report Recipe</h3>
            <p className="mt-2 text-slate-500">Choose the reason for reporting this recipe.</p>
            <select value={reason} onChange={(e) => setReason(e.target.value as (typeof reportReasons)[number])} className="input-field mt-5">
              {reportReasons.map((item) => <option key={item}>{item}</option>)}
            </select>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setShowReport(false)} className="flex-1 rounded-full border border-slate-200 px-5 py-3 font-bold dark:border-slate-700">Cancel</button>
              <button onClick={reportRecipe} className="flex-1 rounded-full bg-red-500 px-5 py-3 font-bold text-white hover:bg-red-600">Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
