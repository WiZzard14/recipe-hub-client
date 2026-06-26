"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RecipeForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    recipeName: "",
    recipeImage: "",
    category: "",
    cuisineType: "",
    difficultyLevel: "",
    preparationTime: "",
    instructions: "",
    ingredients: "", 
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // String theke array te convert kora
    const ingredientsArray = formData.ingredients.split(",").map(i => i.trim());
    
    const payload = {
        ...formData,
        ingredients: ingredientsArray,
        authorName: "Md. Riadul Islam", // Default author
    };

    try {
      const res = await fetch("http://localhost:5000/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ETI SOBCHEYE GURUTTOPURNO! Cookie pathanor jonno.
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      
      if (res.ok) {
          alert("Awesome! Recipe added successfully.");
          router.push("/browse");
      } else {
          alert("Failed to add: " + (result.message || "Please login first."));
      }
    } catch (error) {
      alert("Server connection failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-8 bg-white shadow-xl rounded-2xl mt-10 border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input placeholder="Recipe Name (e.g. Butter Nun)" required className="p-3 border rounded-lg" onChange={(e) => setFormData({...formData, recipeName: e.target.value})} />
        <input placeholder="Image URL (http://...)" required className="p-3 border rounded-lg" onChange={(e) => setFormData({...formData, recipeImage: e.target.value})} />
        <input placeholder="Category (e.g. Dinner, Snacks)" required className="p-3 border rounded-lg" onChange={(e) => setFormData({...formData, category: e.target.value})} />
        <input placeholder="Ingredients (comma separated: Salt, Sugar)" required className="p-3 border rounded-lg" onChange={(e) => setFormData({...formData, ingredients: e.target.value})} />
      </div>
      <textarea placeholder="Step-by-step Instructions" required rows={4} className="w-full p-3 border rounded-lg mb-4" onChange={(e) => setFormData({...formData, instructions: e.target.value})} />
      <button type="submit" className="w-full bg-orange-500 text-white p-3 rounded-lg font-bold text-lg hover:bg-orange-600 transition-all shadow-md">
        Publish Recipe
      </button>
    </form>
  );
}