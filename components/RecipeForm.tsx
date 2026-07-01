'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, uploadToImgbb } from '@/lib/api';
import { RECIPE_CATEGORIES, normalizeCategoryLabel } from '@/lib/categories';
import type { Recipe } from '@/types';

interface RecipeFormProps {
  initial?: Partial<Recipe>;
  mode?: 'create' | 'edit';
  onUpdated?: (recipe: Recipe) => void;
  allowFeature?: boolean;
  forceFeatured?: boolean;
  redirectPath?: string;
}

const emptyForm = {
  recipeName: '',
  recipeImage: '',
  category: 'Dinner',
  cuisineType: '',
  difficultyLevel: 'Easy',
  preparationTime: '',
  ingredients: '',
  instructions: '',
  isFeatured: false,
};

export default function RecipeForm({
  initial,
  mode = 'create',
  onUpdated,
  allowFeature = false,
  forceFeatured = false,
  redirectPath = '/dashboard/my-recipes',
}: RecipeFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    ...emptyForm,
    ...initial,
    category: normalizeCategoryLabel(initial?.category),
    isFeatured: forceFeatured ? true : Boolean(initial?.isFeatured),
    ingredients: Array.isArray(initial?.ingredients) ? initial.ingredients.join(', ') : '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const updateField = (name: string, value: string | boolean) => setFormData((prev) => ({ ...prev, [name]: value }));

  const handleImage = async (file?: File) => {
    if (!file) return;
    setMessage('Uploading image...');
    try {
      const url = await uploadToImgbb(file);
      updateField('recipeImage', url);
      setMessage('Image uploaded successfully.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Image upload failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    const payload = {
      ...formData,
      category: normalizeCategoryLabel(formData.category),
      isFeatured: allowFeature ? Boolean(formData.isFeatured) : false,
      ingredients: formData.ingredients.split(',').map((item) => item.trim()).filter(Boolean),
    };

    try {
      if (mode === 'edit' && initial?._id) {
        const data = await apiFetch<{ message: string; recipe: Recipe }>(`/recipes/${initial._id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        setMessage(data.message);
        onUpdated?.(data.recipe);
      } else {
        await apiFetch<{ message: string; recipe: Recipe }>('/recipes', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        router.push(redirectPath);
        router.refresh();
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to save recipe');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
      {message && <p className="mb-5 rounded-2xl bg-orange-50 p-4 text-sm font-semibold text-orange-700 dark:bg-orange-950 dark:text-orange-200">{message}</p>}
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">Recipe Name<input value={formData.recipeName} onChange={(e) => updateField('recipeName', e.target.value)} required placeholder="Recipe Name" className="input-field" /></label>
        <label className="grid gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">Category<select value={formData.category} onChange={(e) => updateField('category', e.target.value)} required className="input-field">
          {RECIPE_CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
        </select></label>
        <label className="grid gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">Cuisine Type<input value={formData.cuisineType} onChange={(e) => updateField('cuisineType', e.target.value)} required placeholder="Cuisine Type" className="input-field" /></label>
        <label className="grid gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">Difficulty Level<select value={formData.difficultyLevel} onChange={(e) => updateField('difficultyLevel', e.target.value)} required className="input-field">
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select></label>
        <label className="grid gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">Preparation Time<input value={formData.preparationTime} onChange={(e) => updateField('preparationTime', e.target.value)} required placeholder="Example: 30 minutes" className="input-field" /></label>
        <label className="grid gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">Recipe Image URL<input value={formData.recipeImage} onChange={(e) => updateField('recipeImage', e.target.value)} required placeholder="Upload with ImgBB or paste image URL" className="input-field" /></label>
        <label className="grid gap-2 text-sm font-bold text-slate-700 dark:text-slate-200 md:col-span-2">Recipe Image Upload (ImgBB)<input type="file" accept="image/*" onChange={(e) => void handleImage(e.target.files?.[0])} className="input-field" /><span className="text-xs font-semibold text-slate-500 dark:text-slate-400">The file is uploaded to ImgBB when NEXT_PUBLIC_IMGBB_API_KEY is configured. The uploaded URL is automatically placed in the image URL field.</span></label>
        {allowFeature && (
          <label className="flex items-center gap-3 rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-sm font-black text-yellow-800 dark:border-yellow-900 dark:bg-yellow-950 dark:text-yellow-200 md:col-span-2">
            <input
              type="checkbox"
              checked={Boolean(formData.isFeatured)}
              onChange={(e) => updateField('isFeatured', e.target.checked)}
              className="h-5 w-5 accent-orange-500"
            />
            Show this recipe in Featured Recipes on the Home page
          </label>
        )}
        <label className="grid gap-2 text-sm font-bold text-slate-700 dark:text-slate-200 md:col-span-2">Ingredients<textarea value={formData.ingredients} onChange={(e) => updateField('ingredients', e.target.value)} required placeholder="Ingredients, comma separated" rows={3} className="input-field" /></label>
        <label className="grid gap-2 text-sm font-bold text-slate-700 dark:text-slate-200 md:col-span-2">Instructions<textarea value={formData.instructions} onChange={(e) => updateField('instructions', e.target.value)} required placeholder="Step by step instructions" rows={6} className="input-field" /></label>
      </div>
      <button disabled={saving} className="mt-6 w-full rounded-full bg-orange-500 px-6 py-3 font-black text-white hover:bg-orange-600 disabled:opacity-60">
        {saving ? 'Saving...' : mode === 'edit' ? 'Update Recipe' : forceFeatured ? 'Publish Featured Recipe' : 'Publish Recipe'}
      </button>
    </form>
  );
}
