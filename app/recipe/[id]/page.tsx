"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Recipe {
  recipeName: string;
  recipeImage: string;
  category: string;
  cuisineType: string;
  ingredients: string[];
  instructions: string;
}

export default function RecipeDetails() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:5000/api/recipes/${id}`)
        .then((res) => res.json())
        .then((data) => setRecipe(data))
        .catch((err) => console.error("Error:", err));
    }
  }, [id]);

  if (!recipe) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 bg-white shadow-lg rounded-3xl">
      <img src={recipe.recipeImage} alt={recipe.recipeName} className="w-full h-80 object-cover rounded-2xl" />
      <h1 className="text-4xl font-bold mt-6 text-gray-800">{recipe.recipeName}</h1>
      <p className="text-orange-500 font-medium mt-2">{recipe.category} • {recipe.cuisineType}</p>
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Ingredients</h2>
        <ul className="list-disc ml-6 space-y-2 text-gray-700">
          {recipe.ingredients.map((ing, index) => <li key={index}>{ing}</li>)}
        </ul>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Instructions</h2>
        <p className="text-gray-700 leading-relaxed">{recipe.instructions}</p>
      </div>
    </div>
  );
}