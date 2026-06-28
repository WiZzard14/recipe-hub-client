import Protected from '@/components/Protected';
import RecipeForm from '@/components/RecipeForm';

export default function AddRecipePage() {
  return (
    <Protected>
      <div className="section-shell">
        <h1 className="mb-8 text-center text-4xl font-black text-slate-950 dark:text-white">Add Recipe</h1>
        <RecipeForm />
      </div>
    </Protected>
  );
}
