'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import Protected from '@/components/Protected';
import RecipeForm from '@/components/RecipeForm';
import { apiFetch } from '@/lib/api';
import type { Recipe } from '@/types';

export default function MyRecipesPage() {
  return (
    <Protected>
      <MyRecipes />
    </Protected>
  );
}

function MyRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [editing, setEditing] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const load = async () => {
    try {
      setRecipes(await apiFetch<Recipe[]>('/recipes/my-recipes'));
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to load recipes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const remove = async (id: string) => {
    if (!confirm('Delete this recipe?')) return;
    try {
      const res = await apiFetch<{ message: string }>(`/recipes/${id}`, { method: 'DELETE' });
      setRecipes((prev) => prev.filter((recipe) => recipe._id !== id));
      setMessage(res.message);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  if (loading) return <LoadingSpinner label="Loading your recipes..." />;

  return (
    <div className="dashboard-page">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-4xl font-black text-slate-950 dark:text-white">My Recipes</h1>
          <p className="mt-2 text-slate-500">View, update and delete your own recipes.</p>
        </div>
        <Link href="/dashboard/add-recipe" className="rounded-full bg-orange-500 px-6 py-3 font-black text-white hover:bg-orange-600">+ Add Recipe</Link>
      </div>
      {message && <p className="mb-5 rounded-2xl bg-orange-50 p-4 font-bold text-orange-700 dark:bg-orange-950">{message}</p>}
      {recipes.length === 0 ? <div className="rounded-3xl bg-white p-10 text-center text-slate-500 dark:bg-slate-900">No recipes yet.</div> : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <article key={recipe._id} className="overflow-hidden rounded-3xl bg-white shadow-sm dark:bg-slate-900">
              <img src={recipe.recipeImage} alt={recipe.recipeName} className="h-52 w-full object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-black text-slate-950 dark:text-white">{recipe.recipeName}</h3>
                <p className="mt-2 text-sm text-slate-500">{recipe.category} • ❤️ {recipe.likesCount}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Link href={`/recipe/${recipe._id}`} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold dark:bg-slate-800">View</Link>
                  <button onClick={() => setEditing(recipe)} className="rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-600 dark:bg-blue-950">Edit</button>
                  <button onClick={() => void remove(recipe._id)} className="rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-600 dark:bg-red-950">Delete</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
      {editing && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 p-4">
          <div className="mx-auto my-8 max-w-4xl">
            <div className="mb-4 flex justify-end">
              <button onClick={() => setEditing(null)} className="rounded-full bg-white px-5 py-2 font-bold text-slate-900">Close</button>
            </div>
            <RecipeForm mode="edit" initial={editing} onUpdated={(recipe) => { setRecipes((prev) => prev.map((item) => item._id === recipe._id ? recipe : item)); setEditing(null); }} />
          </div>
        </div>
      )}
    </div>
  );
}
