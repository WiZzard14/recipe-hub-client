'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import RecipeCard from '@/components/RecipeCard';
import { apiFetch } from '@/lib/api';
import type { Recipe } from '@/types';

export default function Home() {
  const [featured, setFeatured] = useState<Recipe[]>([]);
  const [popular, setPopular] = useState<Recipe[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [featuredData, popularData] = await Promise.all([
          apiFetch<Recipe[]>('/recipes/featured'),
          apiFetch<Recipe[]>('/recipes/popular'),
        ]);
        setFeatured(featuredData);
        setPopular(popularData);
      } catch {
        setFeatured([]);
        setPopular([]);
      }
    };
    void load();
  }, []);

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-100 via-white to-yellow-50 dark:from-slate-950 dark:via-slate-900 dark:to-orange-950">
        <div className="section-shell grid min-h-[78vh] items-center gap-10 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-black text-orange-600 dark:bg-orange-950 dark:text-orange-300">Recipe Sharing Platform</span>
            <h1 className="mt-6 text-5xl font-black leading-tight text-slate-950 dark:text-white md:text-7xl">
              Discover, Share & Save <span className="text-orange-500">Favorite Recipes</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
              RecipeHub helps food lovers publish recipes, browse community favorites, purchase premium recipes and manage their cooking collection from one polished dashboard.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/browse" className="rounded-full bg-orange-500 px-8 py-4 font-black text-white shadow-lg shadow-orange-200 hover:bg-orange-600 dark:shadow-none">Browse Recipes</Link>
              <Link href="/register" className="rounded-full border border-slate-300 bg-white px-8 py-4 font-black text-slate-900 hover:border-orange-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white">Join Community</Link>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.7 }} className="relative">
            <div className="rounded-[2rem] bg-white p-4 shadow-2xl dark:bg-slate-900">
              <img src="https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?q=80&w=1200&auto=format&fit=crop" alt="Healthy recipe bowl" className="h-[420px] w-full rounded-[1.5rem] object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-6 rounded-3xl bg-white p-5 shadow-xl dark:bg-slate-900">
              <p className="text-sm font-bold text-slate-500">Community Likes</p>
              <p className="text-3xl font-black text-orange-500">❤️ {popular.reduce((sum, recipe) => sum + (recipe.likesCount || 0), 0)}</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-shell">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-950 dark:text-white">Featured Recipes</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Admin-selected recipes shown dynamically from the featured collection.</p>
          </div>
          <Link href="/browse" className="font-bold text-orange-500">View all →</Link>
        </div>
        {featured.length ? <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{featured.map((recipe) => <RecipeCard key={recipe._id} recipe={recipe} />)}</div> : <EmptySection message="No featured recipes yet. Admin can feature recipes from dashboard." />}
      </section>

      <section className="bg-white dark:bg-slate-900/60">
        <div className="section-shell">
          <h2 className="text-3xl font-black text-slate-950 dark:text-white">Popular Recipes</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Most liked recipes from the community.</p>
          {popular.length ? <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{popular.map((recipe) => <RecipeCard key={recipe._id} recipe={recipe} />)}</div> : <EmptySection message="Popular recipes will appear after users start liking recipes." />}
        </div>
      </section>

      <section className="section-shell grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl bg-orange-500 p-8 text-white shadow-lg">
          <h3 className="text-2xl font-black">Publish With Confidence</h3>
          <p className="mt-3 text-orange-50">Add ingredients, cuisine, difficulty, preparation time and step-by-step instructions. Normal users can publish two recipes; premium users unlock unlimited publishing.</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-2xl font-black text-slate-950 dark:text-white">Cook Smarter</h3>
          <p className="mt-3 text-slate-600 dark:text-slate-400">Save favorites, buy recipes, report inappropriate posts, and use filters to find exactly what you want to cook.</p>
        </div>
      </section>
    </div>
  );
}

function EmptySection({ message }: { message: string }) {
  return <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-900">{message}</div>;
}
