"use client";
import { useEffect, useState } from "react";

interface Recipe {
  _id: string;
  recipeName: string;
  recipeImage: string;
  category: string;
}

export default function BrowseRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6; // Ek page-e koyta recipe dekhabo

  useEffect(() => {
    // Backend-e API call korar shomoy page ebang limit pathano hocche
    fetch(`http://localhost:5000/api/recipes?page=${currentPage}&limit=${limit}`)
      .then((res) => res.json())
      .then((data) => {
        setRecipes(data.recipes || []);
        setTotalPages(data.totalPages || 1); // Backend theke total page nibe
      })
      .catch((err) => console.error("Error fetching:", err));
  }, [currentPage]); // Page change holei notun data fetch korbe

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center text-orange-500">Explore Recipes</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recipes.map((recipe: Recipe) => (
          <div key={recipe._id} className="border rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={recipe.recipeImage} 
              alt={recipe.recipeName} 
              className="w-full h-52 object-cover rounded-xl mb-4" 
            />
            <h2 className="text-xl font-bold text-gray-800 mb-2">{recipe.recipeName}</h2>
            <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
              {recipe.category}
            </span>
          </div>
        ))}
      </div>

      {/* Pagination Buttons */}
      <div className="flex justify-center items-center gap-6 mt-12 mb-8">
        <button 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-5 py-2.5 bg-gray-200 text-gray-700 font-bold rounded-lg disabled:opacity-50 hover:bg-gray-300 transition-all"
        >
          Previous
        </button>
        
        <span className="font-medium text-gray-700 bg-gray-100 px-4 py-2 rounded-lg border">
          Page {currentPage} of {totalPages}
        </span>
        
        <button 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-5 py-2.5 bg-orange-500 text-white font-bold rounded-lg disabled:opacity-50 hover:bg-orange-600 transition-all"
        >
          Next
        </button>
      </div>
    </div>
  );
}