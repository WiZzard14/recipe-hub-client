"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Recipe {
  _id: string;
  recipeName: string;
  recipeImage: string;
  category: string;
}

const categories = ["All", "Breakfast", "Lunch", "Dinner", "Snacks"];

export default function BrowseRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const limit = 6;

  useEffect(() => {
    const categoryQuery = selectedCategory === "All" ? "" : `&category=${selectedCategory}`;
    const searchParam = searchQuery ? `&search=${searchQuery}` : "";
    
    fetch(`http://localhost:5000/api/recipes?page=${currentPage}&limit=${limit}${categoryQuery}${searchParam}`)
      .then((res) => res.json())
      .then((data) => {
        setRecipes(data.recipes || []);
        setTotalPages(data.totalPages || 1);
      })
      .catch((err) => console.error("Error fetching:", err));
  }, [currentPage, selectedCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center text-orange-500">Explore Recipes</h1>
      
      {/* Search Bar */}
      <div className="mb-10 flex justify-center">
        <input 
          type="text" 
          placeholder="Search recipes by name..." 
          className="w-full max-w-lg p-4 border rounded-full shadow-sm focus:outline-orange-500"
          onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} 
        />
      </div>
      
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              selectedCategory === cat ? "bg-orange-500 text-white shadow-lg" : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recipes.map((recipe: Recipe) => (
          <Link href={`/recipe/${recipe._id}`} key={recipe._id}>
            <div className="border rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all bg-white cursor-pointer">
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
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-6 mt-12 mb-8">
        <button 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
          disabled={currentPage === 1} 
          className="px-5 py-2.5 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition-all"
        >
          Previous
        </button>
        
        <span className="font-medium text-gray-700 bg-gray-100 px-4 py-2 rounded-lg border">
          Page {currentPage} of {totalPages}
        </span>
        
        <button 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
          disabled={currentPage === totalPages} 
          className="px-5 py-2.5 bg-orange-500 text-white rounded-lg disabled:opacity-50 hover:bg-orange-600 transition-all"
        >
          Next
        </button>
      </div>
    </div>
  );
}