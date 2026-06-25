"use client";
import { useEffect, useState } from "react";

export default function BrowseRecipes() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/recipes")
      .then((res) => res.json())
      .then((data) => setRecipes(data.recipes))
      .catch(err => console.error("Error fetching:", err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">All Recipes</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recipes.map((recipe: any) => (
          <div key={recipe._id} className="border rounded-xl p-4 shadow hover:shadow-lg transition">
            <img src={recipe.recipeImage} alt={recipe.recipeName} className="w-full h-48 object-cover rounded-lg mb-4" />
            <h2 className="text-xl font-semibold">{recipe.recipeName}</h2>
            <p className="text-orange-500 font-medium">{recipe.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
}