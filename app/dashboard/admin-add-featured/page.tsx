import Protected from '@/components/Protected';
import RecipeForm from '@/components/RecipeForm';

export default function AdminAddFeaturedRecipePage() {
  return (
    <Protected adminOnly>
      <div className="dashboard-page">
        <div className="mx-auto mb-8 max-w-3xl text-center">
          <span className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-black text-yellow-700 dark:bg-yellow-950 dark:text-yellow-200">Admin Featured Recipe</span>
          <h1 className="mt-4 text-4xl font-black text-slate-950 dark:text-white">Add Featured Food</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            Add a new recipe and automatically show it in the Featured Recipes section on the Home page.
          </p>
        </div>
        <RecipeForm allowFeature forceFeatured redirectPath="/dashboard/admin-recipes" />
      </div>
    </Protected>
  );
}
