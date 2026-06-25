"use client";
import { useEffect, useState } from "react";

export default function BrowseRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/recipes")
      .then((res) => res.json())
      .then((data) => {
        setRecipes(data.recipes);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center mt-20">Loading Delicious Recipes...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">Browse Recipes</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recipes.map((recipe: any) => (
          <div key={recipe._id} className="border rounded-xl p-4 shadow hover:shadow-lg transition">
            <img src={recipe.recipeImage} alt={recipe.recipeName} className="w-full h-48 object-cover rounded-lg mb-4" />
            <h2 className="text-xl font-semibold">{recipe.recipeName}</h2>
            <p className="text-gray-500">{recipe.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
}