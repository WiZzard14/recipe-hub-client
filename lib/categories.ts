export const RECIPE_CATEGORIES = ['Dinner', 'Lunch', 'Breakfast', 'Dessert', 'Snacks'] as const;

export type RecipeCategory = (typeof RECIPE_CATEGORIES)[number];

export function normalizeCategoryLabel(category?: string) {
  if (!category) return 'Dinner';
  const value = category.trim().toLowerCase();
  if (value === 'desert' || value === 'dessert') return 'Dessert';
  if (value === 'snack' || value === 'snacks') return 'Snacks';
  if (value === 'breakfast') return 'Breakfast';
  if (value === 'lunch') return 'Lunch';
  if (value === 'dinner') return 'Dinner';
  return 'Dinner';
}
