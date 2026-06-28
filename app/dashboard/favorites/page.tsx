'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import Protected from '@/components/Protected';
import { apiFetch } from '@/lib/api';
import type { Recipe } from '@/types';

export default function FavoritesPage() {
  return (
    <Protected>
      <Favorites />
    </Protected>
  );
}

function Favorites() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const load = async () => {
    try {
      setRecipes(await apiFetch<Recipe[]>('/users/favorites'));
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const remove = async (id: string) => {
    try {
      const res = await apiFetch<{ message: string }>(`/users/favorites/${id}`, { method: 'DELETE' });
      setRecipes((prev) => prev.filter((recipe) => recipe._id !== id));
      setMessage(res.message);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Remove failed');
    }
  };

  if (loading) return <LoadingSpinner label="Loading favorites..." />;

  return (
    <div className="section-shell">
      <h1 className="text-4xl font-black text-slate-950 dark:text-white">My Favorites</h1>
      <p className="mt-2 text-slate-500">Remove favorites or open details.</p>
      {message && <p className="mt-6 rounded-2xl bg-orange-50 p-4 font-bold text-orange-700 dark:bg-orange-950">{message}</p>}
      {recipes.length === 0 ? <div className="mt-8 rounded-3xl bg-white p-10 text-center text-slate-500 dark:bg-slate-900">No favorites saved yet.</div> : (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <article key={recipe._id} className="overflow-hidden rounded-3xl bg-white shadow-sm dark:bg-slate-900">
              <img src={recipe.recipeImage} alt={recipe.recipeName} className="h-52 w-full object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-black text-slate-950 dark:text-white">{recipe.recipeName}</h3>
                <p className="mt-2 text-sm text-slate-500">{recipe.category} • {recipe.cuisineType}</p>
                <div className="mt-5 flex gap-2">
                  <Link href={`/recipe/${recipe._id}`} className="rounded-full bg-orange-500 px-4 py-2 text-sm font-bold text-white">View Details</Link>
                  <button onClick={() => void remove(recipe._id)} className="rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-600 dark:bg-red-950">Remove</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
