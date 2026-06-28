'use client';

import { useEffect, useState } from 'react';
import RecipeCard from '@/components/RecipeCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { apiFetch, buildPath } from '@/lib/api';
import type { PaginatedRecipes, Recipe } from '@/types';

export default function BrowseRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const path = buildPath('/recipes', { page, limit: 8, search, category: selected.join(',') });
        const data = await apiFetch<PaginatedRecipes>(path);
        setRecipes(data.data);
        setCategories(data.categories);
        setTotalPages(data.pagination.totalPages);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load recipes');
      } finally {
        setLoading(false);
      }
    };
    const timer = window.setTimeout(() => void load(), 250);
    return () => window.clearTimeout(timer);
  }, [page, search, selected]);

  const toggleCategory = (category: string) => {
    setPage(1);
    setSelected((prev) => prev.includes(category) ? prev.filter((item) => item !== category) : [...prev, category]);
  };

  return (
    <div className="section-shell">
      <div className="mb-8 rounded-3xl bg-white p-6 shadow-sm dark:bg-slate-900">
        <h1 className="text-4xl font-black text-slate-950 dark:text-white">Browse All Recipes</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Filter recipes by category using server-side MongoDB $in and pagination.</p>
        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto]">
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search by name, category or cuisine..." className="input-field" />
          <button onClick={() => { setSearch(''); setSelected([]); setPage(1); }} className="rounded-2xl border border-slate-200 px-5 py-3 font-bold hover:border-orange-400 dark:border-slate-700">Reset</button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button key={category} onClick={() => toggleCategory(category)} className={`rounded-full px-4 py-2 text-sm font-bold transition ${selected.includes(category) ? 'bg-orange-500 text-white' : 'bg-orange-50 text-orange-700 hover:bg-orange-100 dark:bg-orange-950 dark:text-orange-200'}`}>
              {category}
            </button>
          ))}
        </div>
      </div>

      {loading ? <LoadingSpinner label="Loading recipes..." /> : error ? <div className="rounded-3xl bg-red-50 p-8 text-center font-bold text-red-600 dark:bg-red-950">{error}</div> : recipes.length === 0 ? (
        <div className="rounded-3xl bg-white p-10 text-center text-slate-500 dark:bg-slate-900">No recipes found.</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {recipes.map((recipe) => <RecipeCard key={recipe._id} recipe={recipe} />)}
        </div>
      )}

      <div className="mt-10 flex items-center justify-center gap-4">
        <button disabled={page <= 1} onClick={() => setPage((prev) => Math.max(prev - 1, 1))} className="rounded-full border border-slate-200 px-5 py-3 font-bold disabled:opacity-40 dark:border-slate-700">Previous</button>
        <span className="font-bold text-slate-600 dark:text-slate-300">Page {page} of {totalPages}</span>
        <button disabled={page >= totalPages} onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))} className="rounded-full border border-slate-200 px-5 py-3 font-bold disabled:opacity-40 dark:border-slate-700">Next</button>
      </div>
    </div>
  );
}
