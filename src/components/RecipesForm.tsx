// RecipeComponent.tsx - Component for displaying a recipe
import React from 'react';

// TypeScript interfaces
export interface Ingredient {
  name: string;
  quantity: string;
}

export interface Recipe {
  id: number;
  name: string;
  ingredients: Ingredient[];
  instructions: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: string;
  cuisine: string;
  caloriesPerServing: number;
  tags: string[];
  userId: number;
  image?: string;
}

interface RecipeComponentProps {
  recipe: Recipe;
  onEdit: (recipe: Recipe) => void;
  onDelete: (id: number) => Promise<void>;
  isEditing: boolean;
  isDeleting: boolean;
}

const RecipeComponent: React.FC<RecipeComponentProps> = ({ 
  recipe, 
  onEdit,
  onDelete,
  isEditing,
  isDeleting
}) => {
  const handleEdit = () => {
    onEdit(recipe);
    // Scroll to top where the form will be
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${recipe.name}"?`)) {
      onDelete(recipe.id);
    }
  };

  const getTotalTime = (recipe: Recipe): number => {
    return recipe.prepTimeMinutes + recipe.cookTimeMinutes;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">{recipe.name}</h3>
          <div className="flex space-x-2">
            <button 
              onClick={handleEdit}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
              disabled={isEditing || isDeleting}
            >
              {isEditing ? 'Editing...' : 'Edit'}
            </button>
            <button 
              onClick={handleDelete}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
              disabled={isEditing || isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
        
        {recipe.image && (
          <div className="h-48 bg-gray-300 flex items-center justify-center mb-4">
            <img 
              src={recipe.image || '/api/placeholder/600/300'} 
              alt={recipe.name} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="flex flex-wrap mb-4 text-sm">
          <div className="mr-4 mb-2">
            <span className="font-medium">Prep:</span> {recipe.prepTimeMinutes} min
          </div>
          <div className="mr-4 mb-2">
            <span className="font-medium">Cook:</span> {recipe.cookTimeMinutes} min
          </div>
          <div className="mr-4 mb-2">
            <span className="font-medium">Total:</span> {getTotalTime(recipe)} min
          </div>
          <div className="mr-4 mb-2">
            <span className="font-medium">Servings:</span> {recipe.servings}
          </div>
          <div className="mr-4 mb-2">
            <span className="font-medium">Difficulty:</span> {recipe.difficulty}
          </div>
          <div className="mb-2">
            <span className="font-medium">Cuisine:</span> {recipe.cuisine}
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="font-semibold text-lg mb-2">Ingredients:</h4>
          <ul className="list-disc pl-5 space-y-1">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>
                {ingredient.name} - {ingredient.quantity}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mb-4">
          <h4 className="font-semibold text-lg mb-2">Instructions:</h4>
          <ol className="list-decimal pl-5 space-y-2">
            {recipe.instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ol>
        </div>
        
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {recipe.tags.map((tag, index) => (
              <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-sm">
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {recipe.caloriesPerServing && (
          <div className="mt-4 text-sm">
            <span className="font-medium">Calories:</span> {recipe.caloriesPerServing} per serving
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeComponent;