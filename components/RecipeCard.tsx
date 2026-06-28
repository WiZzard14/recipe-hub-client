import Link from 'next/link';
import type { Recipe } from '@/types';

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
      <div className="relative h-56 overflow-hidden">
        <img src={recipe.recipeImage} alt={recipe.recipeName} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-orange-600 shadow dark:bg-slate-900/90">
          {recipe.category}
        </span>
        {recipe.isFeatured && <span className="absolute right-4 top-4 rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold text-slate-900">Featured</span>}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-black text-slate-900 group-hover:text-orange-500 dark:text-white">{recipe.recipeName}</h3>
        <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400">{recipe.cuisineType} • {recipe.difficultyLevel}</p>
        <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-300">
          <span>⏱️ {recipe.preparationTime}</span>
          <span>❤️ {recipe.likesCount || 0}</span>
          <span>👨‍🍳 {recipe.authorName}</span>
        </div>
        <Link href={`/recipe/${recipe._id}`} className="mt-6 inline-flex justify-center rounded-full bg-orange-500 px-5 py-3 font-bold text-white transition hover:bg-orange-600">
          View Details
        </Link>
      </div>
    </article>
  );
}
