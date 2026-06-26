'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import Protected from '@/components/Protected';
import RecipeForm from '@/components/RecipeForm';
import { apiFetch } from '@/lib/api';
import type { PaginatedRecipes, Recipe } from '@/types';

export default function ManageRecipesPage() {
  return (
    <Protected adminOnly>
      <ManageRecipes />
    </Protected>
  );
}

function ManageRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [editing, setEditing] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const load = async () => {
    try {
      const data = await apiFetch<PaginatedRecipes>('/recipes?limit=50');
      setRecipes(data.data);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to load recipes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const action = async (id: string, type: 'delete' | 'feature') => {
    try {
      const path = type === 'delete' ? `/recipes/${id}` : `/recipes/${id}/feature`;
      const method = type === 'delete' ? 'DELETE' : 'PATCH';
      const data = await apiFetch<{ message: string; recipe?: Recipe }>(path, { method });
      setMessage(data.message);
      if (type === 'delete') setRecipes((prev) => prev.filter((recipe) => recipe._id !== id));
      if (data.recipe) setRecipes((prev) => prev.map((recipe) => recipe._id === id ? data.recipe as Recipe : recipe));
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Action failed');
    }
  };

  if (loading) return <LoadingSpinner label="Loading recipes..." />;

  return (
    <div className="section-shell">
      <h1 className="text-4xl font-black text-slate-950 dark:text-white">Manage Recipes</h1>
      <p className="mt-2 text-slate-500">Admin can edit, delete and feature recipes. Featured recipes appear on the Home page.</p>
      {message && <p className="mt-6 rounded-2xl bg-orange-50 p-4 font-bold text-orange-700 dark:bg-orange-950">{message}</p>}
      <div className="mt-8 overflow-hidden rounded-3xl bg-white shadow-sm dark:bg-slate-900">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-orange-50 dark:bg-slate-800"><tr><th className="p-4">Recipe</th><th className="p-4">Author</th><th className="p-4">Category</th><th className="p-4">Likes</th><th className="p-4">Featured</th><th className="p-4">Actions</th></tr></thead>
          <tbody>
            {recipes.map((recipe) => (
              <tr key={recipe._id} className="border-t border-slate-100 dark:border-slate-800">
                <td className="p-4 font-bold">{recipe.recipeName}</td>
                <td className="p-4">{recipe.authorName}</td>
                <td className="p-4">{recipe.category}</td>
                <td className="p-4">{recipe.likesCount}</td>
                <td className="p-4">{recipe.isFeatured ? 'Yes' : 'No'}</td>
                <td className="p-4"><div className="flex flex-wrap gap-2"><Link href={`/recipe/${recipe._id}`} className="rounded-full bg-slate-100 px-3 py-2 font-bold dark:bg-slate-800">View</Link><button onClick={() => setEditing(recipe)} className="rounded-full bg-blue-50 px-3 py-2 font-bold text-blue-600 dark:bg-blue-950">Edit</button><button onClick={() => void action(recipe._id, 'feature')} className="rounded-full bg-yellow-100 px-3 py-2 font-bold text-yellow-700">Feature</button><button onClick={() => void action(recipe._id, 'delete')} className="rounded-full bg-red-50 px-3 py-2 font-bold text-red-600 dark:bg-red-950">Delete</button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editing && <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 p-4"><div className="mx-auto my-8 max-w-4xl"><div className="mb-4 flex justify-end"><button onClick={() => setEditing(null)} className="rounded-full bg-white px-5 py-2 font-bold text-slate-900">Close</button></div><RecipeForm mode="edit" initial={editing} onUpdated={(recipe) => { setRecipes((prev) => prev.map((item) => item._id === recipe._id ? recipe : item)); setEditing(null); }} /></div></div>}
    </div>
  );
}
