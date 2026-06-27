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
        <input value={formData.recipeName} onChange={(e) => updateField('recipeName', e.target.value)} required placeholder="Recipe Name" className="input-field" />
        <select value={formData.category} onChange={(e) => updateField('category', e.target.value)} required className="input-field">
          {RECIPE_CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
        </select>
        <input value={formData.cuisineType} onChange={(e) => updateField('cuisineType', e.target.value)} required placeholder="Cuisine Type" className="input-field" />
        <select value={formData.difficultyLevel} onChange={(e) => updateField('difficultyLevel', e.target.value)} required className="input-field">
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
        <input value={formData.preparationTime} onChange={(e) => updateField('preparationTime', e.target.value)} required placeholder="Preparation Time" className="input-field" />
        <input value={formData.recipeImage} onChange={(e) => updateField('recipeImage', e.target.value)} required placeholder="Image URL or upload below" className="input-field" />
        <input type="file" accept="image/*" onChange={(e) => void handleImage(e.target.files?.[0])} className="input-field md:col-span-2" />
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
        <textarea value={formData.ingredients} onChange={(e) => updateField('ingredients', e.target.value)} required placeholder="Ingredients, comma separated" rows={3} className="input-field md:col-span-2" />
        <textarea value={formData.instructions} onChange={(e) => updateField('instructions', e.target.value)} required placeholder="Step by step instructions" rows={6} className="input-field md:col-span-2" />
      </div>
      <button disabled={saving} className="mt-6 w-full rounded-full bg-orange-500 px-6 py-3 font-black text-white hover:bg-orange-600 disabled:opacity-60">
        {saving ? 'Saving...' : mode === 'edit' ? 'Update Recipe' : forceFeatured ? 'Publish Featured Recipe' : 'Publish Recipe'}
      </button>
    </form>
  );
}
