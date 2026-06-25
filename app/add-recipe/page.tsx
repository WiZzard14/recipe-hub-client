import RecipeForm from "@/components/RecipieForm"; 

export default function AddRecipePage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-8">Share Your Recipe</h1>
      <RecipeForm />
    </div>
  );
}