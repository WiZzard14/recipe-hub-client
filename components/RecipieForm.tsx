"use client";
import { useState } from "react";

export default function RecipeForm() {
  const [formData, setFormData] = useState({
    recipeName: "",
    recipeImage: "",
    category: "",
    cuisineType: "",
    difficultyLevel: "",
    preparationTime: "",
    instructions: "",
    ingredients: "", // Notun field
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ingredients string-ke array banabo
    const ingredientsArray = formData.ingredients.split(",").map(i => i.trim());
    
    const payload = {
        ...formData,
        ingredients: ingredientsArray,
        authorId: "me",
        authorName: "Riadul",
        authorEmail: "me@test.com"
    };

    const res = await fetch("http://localhost:5000/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    if (res.ok) {
        alert("Recipe added successfully!");
    } else {
        alert("Failed: " + result.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4">Add New Recipe</h2>
      <input placeholder="Recipe Name" className="w-full p-2 border mb-3 rounded" required onChange={(e) => setFormData({...formData, recipeName: e.target.value})} />
      <input placeholder="Image URL" className="w-full p-2 border mb-3 rounded" required onChange={(e) => setFormData({...formData, recipeImage: e.target.value})} />
      <input placeholder="Category" className="w-full p-2 border mb-3 rounded" required onChange={(e) => setFormData({...formData, category: e.target.value})} />
      <input placeholder="Ingredients (e.g. Salt, Sugar, Rice)" className="w-full p-2 border mb-3 rounded" required onChange={(e) => setFormData({...formData, ingredients: e.target.value})} />
      <textarea placeholder="Instructions" className="w-full p-2 border mb-3 rounded" required onChange={(e) => setFormData({...formData, instructions: e.target.value})} />
      <button type="submit" className="w-full bg-orange-500 text-white p-2 rounded hover:bg-orange-600">Submit Recipe</button>
    </form>
  );
}