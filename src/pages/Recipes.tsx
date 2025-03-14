// RecipesPage.tsx - Page component for managing recipes
import React, { useState, useEffect } from 'react';
import RecipeComponent, { Recipe, Ingredient } from '../components/RecipesForm';

interface RecipesResponse {
  recipes: Recipe[];
  total: number;
  skip: number;
  limit: number;
}

interface RecipeForm {
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

const RecipesPage: React.FC = () => {
  // State for recipes list
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [newIngredient, setNewIngredient] = useState<{ name: string; quantity: string }>({ 
    name: '', 
    quantity: '' 
  });
  const [newInstruction, setNewInstruction] = useState<string>('');
  const [newTag, setNewTag] = useState<string>('');
  
  // Initialize form with empty values
  const initialFormState: RecipeForm = {
    name: '',
    ingredients: [],
    instructions: [],
    prepTimeMinutes: 0,
    cookTimeMinutes: 0,
    servings: 1,
    difficulty: 'Easy',
    cuisine: 'American',
    caloriesPerServing: 0,
    tags: [],
    userId: 1
  };
  
  const [recipeForm, setRecipeForm] = useState<RecipeForm>({...initialFormState});
  
  // UI state
  const [editMode, setEditMode] = useState<boolean>(false);
  const [currentRecipeId, setCurrentRecipeId] = useState<number | null>(null);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<Record<number, boolean>>({});

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async (): Promise<void> => {
    try {
      setLoading(true);
      
      // First check localStorage
      const localRecipes = localStorage.getItem('dummyjson_recipes');
      
      if (localRecipes) {
        // Use local recipes if available
        setRecipes(JSON.parse(localRecipes));
        setLoading(false);
      } else {
        // Otherwise fetch from API
        const response = await fetch('https://dummyjson.com/recipes');
        const data: RecipesResponse = await response.json();
        
        if (data && data.recipes) {
          setRecipes(data.recipes);
          // Save to localStorage
          localStorage.setItem('dummyjson_recipes', JSON.stringify(data.recipes));
        }
        setLoading(false);
      }
    } catch (err) {
      setError('Failed to fetch recipes');
      setLoading(false);
      console.error('Error fetching recipes:', err);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    
    if (name === 'prepTimeMinutes' || name === 'cookTimeMinutes' || name === 'servings' || name === 'caloriesPerServing') {
      setRecipeForm({
        ...recipeForm,
        [name]: parseInt(value, 10) || 0
      });
    } else {
      setRecipeForm({
        ...recipeForm,
        [name]: value
      });
    }
  };

  // Ingredient handlers
  const handleIngredientChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setNewIngredient({
      ...newIngredient,
      [name]: value
    });
  };

  const addIngredient = (): void => {
    if (newIngredient.name.trim() && newIngredient.quantity.trim()) {
      setRecipeForm({
        ...recipeForm,
        ingredients: [...recipeForm.ingredients, { ...newIngredient }]
      });
      setNewIngredient({ name: '', quantity: '' });
    }
  };

  const removeIngredient = (index: number): void => {
    const updatedIngredients = [...recipeForm.ingredients];
    updatedIngredients.splice(index, 1);
    setRecipeForm({
      ...recipeForm,
      ingredients: updatedIngredients
    });
  };

  // Instruction handlers
  const addInstruction = (): void => {
    if (newInstruction.trim()) {
      setRecipeForm({
        ...recipeForm,
        instructions: [...recipeForm.instructions, newInstruction]
      });
      setNewInstruction('');
    }
  };

  const removeInstruction = (index: number): void => {
    const updatedInstructions = [...recipeForm.instructions];
    updatedInstructions.splice(index, 1);
    setRecipeForm({
      ...recipeForm,
      instructions: updatedInstructions
    });
  };

  // Tag handlers
  const addTag = (): void => {
    if (newTag.trim() && !recipeForm.tags.includes(newTag.trim())) {
      setRecipeForm({
        ...recipeForm,
        tags: [...recipeForm.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string): void => {
    setRecipeForm({
      ...recipeForm,
      tags: recipeForm.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const resetForm = (): void => {
    setRecipeForm({...initialFormState});
    setNewIngredient({ name: '', quantity: '' });
    setNewInstruction('');
    setNewTag('');
    setEditMode(false);
    setCurrentRecipeId(null);
  };

  const handleAddNewClick = (): void => {
    resetForm();
    setIsFormVisible(true);
    setEditMode(false);
  };

  const handleDeleteRecipe = async (id: number): Promise<void> => {
    try {
      // Mark as deleting for UI feedback
      setIsDeleting(prev => ({ ...prev, [id]: true }));
      
      // Call the API (for consistency, though the dummy API doesn't actually delete)
      await fetch(`https://dummyjson.com/recipes/${id}`, {
        method: 'DELETE'
      });
      
      // Update local state
      const updatedRecipes = recipes.filter(recipe => recipe.id !== id);
      setRecipes(updatedRecipes);
      
      // Update localStorage
      localStorage.setItem('dummyjson_recipes', JSON.stringify(updatedRecipes));
      
      // Reset deletion state
      setIsDeleting(prev => ({ ...prev, [id]: false }));
      
    } catch (err) {
      setError('Failed to delete recipe');
      // Reset deletion state
      setIsDeleting(prev => ({ ...prev, [id]: false }));
      console.error('Error deleting recipe:', err);
    }
  };

  const handleEditClick = (recipe: Recipe): void => {
    // Populate form with recipe data
    setRecipeForm({
      name: recipe.name,
      ingredients: [...recipe.ingredients],
      instructions: [...recipe.instructions],
      prepTimeMinutes: recipe.prepTimeMinutes,
      cookTimeMinutes: recipe.cookTimeMinutes,
      servings: recipe.servings,
      difficulty: recipe.difficulty,
      cuisine: recipe.cuisine,
      caloriesPerServing: recipe.caloriesPerServing || 0,
      tags: [...(recipe.tags || [])],
      userId: recipe.userId,
      image: recipe.image
    });
    setCurrentRecipeId(recipe.id);
    setEditMode(true);
    setIsFormVisible(true);
  };

  const handleCancel = (): void => {
    resetForm();
    setIsFormVisible(false);
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!recipeForm.name.trim() || recipeForm.ingredients.length === 0 || recipeForm.instructions.length === 0) {
      setError('Please fill all required fields: name, ingredients, and instructions');
      return;
    }
    
    try {
      setActionLoading(true);
      
      let updatedRecipes: Recipe[];
      
      if (editMode && currentRecipeId) {
        // Update existing recipe - first call API for consistency
        const response = await fetch(`https://dummyjson.com/recipes/${currentRecipeId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(recipeForm)
        });
        
        const updatedRecipe = await response.json();
        
        // Find the original recipe to preserve fields not changed
        const originalRecipe = recipes.find(recipe => recipe.id === currentRecipeId);
        if (!originalRecipe) throw new Error('Recipe not found');
        
        // Create a complete updated recipe object combining original and new data
        const completeUpdatedRecipe: Recipe = {
          ...originalRecipe,
          name: recipeForm.name,
          ingredients: [...recipeForm.ingredients],
          instructions: [...recipeForm.instructions],
          prepTimeMinutes: recipeForm.prepTimeMinutes,
          cookTimeMinutes: recipeForm.cookTimeMinutes,
          servings: recipeForm.servings,
          difficulty: recipeForm.difficulty,
          cuisine: recipeForm.cuisine,
          caloriesPerServing: recipeForm.caloriesPerServing,
          tags: [...recipeForm.tags],
          userId: recipeForm.userId,
          image: recipeForm.image
        };
        
        // Update in state
        updatedRecipes = recipes.map(recipe => 
          recipe.id === currentRecipeId ? completeUpdatedRecipe : recipe
        );
      } else {
        // Add new recipe - first call API for consistency
        const response = await fetch('https://dummyjson.com/recipes/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(recipeForm)
        });
        
        let newRecipe = await response.json();
        
        // If API didn't provide an ID, generate one
        if (!newRecipe.id) {
          const highestId = Math.max(...recipes.map(recipe => recipe.id), 0);
          newRecipe.id = highestId + 1;
        }
        
        // Create a complete recipe object
        newRecipe = {
          id: newRecipe.id,
          name: recipeForm.name,
          ingredients: [...recipeForm.ingredients],
          instructions: [...recipeForm.instructions],
          prepTimeMinutes: recipeForm.prepTimeMinutes,
          cookTimeMinutes: recipeForm.cookTimeMinutes,
          servings: recipeForm.servings,
          difficulty: recipeForm.difficulty,
          cuisine: recipeForm.cuisine,
          caloriesPerServing: recipeForm.caloriesPerServing,
          tags: [...recipeForm.tags],
          userId: recipeForm.userId,
          image: recipeForm.image
        };
        
        // Add to state
        updatedRecipes = [newRecipe, ...recipes];
      }
      
      // Update state and localStorage
      setRecipes(updatedRecipes);
      localStorage.setItem('dummyjson_recipes', JSON.stringify(updatedRecipes));
      
      // Reset form and UI
      resetForm();
      setIsFormVisible(false);
      setActionLoading(false);
      
    } catch (err) {
      setError(`Failed to ${editMode ? 'update' : 'create'} recipe`);
      setActionLoading(false);
      console.error(`Error ${editMode ? 'updating' : 'creating'} recipe:`, err);
    }
  };

  // Show error banner with reset option
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <button 
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setError(null)}
          >
            <span className="text-xl">&times;</span>
          </button>
        </div>
        <button 
          onClick={fetchRecipes}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Recipes</h1>
        <button 
          onClick={handleAddNewClick}
          className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition"
          disabled={actionLoading}
        >
          Add New Recipe
        </button>
      </div>
      
      {/* Recipe form - conditionally displayed */}
      {isFormVisible && (
        <div className="bg-gray-50 p-6 rounded-lg mb-8 shadow-md">
          <h2 className="text-2xl font-semibold mb-4">{editMode ? 'Edit Recipe' : 'Add New Recipe'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="name">Recipe Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={recipeForm.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Ingredients</label>
              <div className="flex mb-2">
                <input
                  type="text"
                  name="name"
                  placeholder="Ingredient name"
                  className="flex-1 p-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newIngredient.name}
                  onChange={handleIngredientChange}
                />
                <input
                  type="text"
                  name="quantity"
                  placeholder="Amount"
                  className="w-1/3 p-2 border-t border-b border-r border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newIngredient.quantity}
                  onChange={handleIngredientChange}
                />
                <button 
                  type="button" 
                  className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600"
                  onClick={addIngredient}
                >
                  Add
                </button>
              </div>
              
              <ul className="bg-white border border-gray-200 rounded-md divide-y">
                {recipeForm.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex justify-between items-center p-3">
                    <span>{ingredient.name} - {ingredient.quantity}</span>
                    <button 
                      type="button" 
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeIngredient(index)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
                {recipeForm.ingredients.length === 0 && (
                  <li className="p-3 text-gray-400">No ingredients added yet</li>
                )}
              </ul>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Instructions</label>
              <div className="flex mb-2">
                <input
                  type="text"
                  placeholder="Add instruction step"
                  className="flex-1 p-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newInstruction}
                  onChange={(e) => setNewInstruction(e.target.value)}
                />
                <button 
                  type="button" 
                  className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600"
                  onClick={addInstruction}
                >
                  Add
                </button>
              </div>
              
              <ol className="bg-white border border-gray-200 rounded-md list-decimal pl-10 pr-4 py-2">
                {recipeForm.instructions.map((instruction, index) => (
                  <li key={index} className="py-2 flex justify-between items-center">
                    <span>{instruction}</span>
                    <button 
                      type="button" 
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeInstruction(index)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
                {recipeForm.instructions.length === 0 && (
                  <li className="py-2 text-gray-400">No instructions added yet</li>
                )}
              </ol>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="prepTimeMinutes">Prep Time (minutes)</label>
                <input
                  type="number"
                  id="prepTimeMinutes"
                  name="prepTimeMinutes"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={recipeForm.prepTimeMinutes}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="cookTimeMinutes">Cook Time (minutes)</label>
                <input
                  type="number"
                  id="cookTimeMinutes"
                  name="cookTimeMinutes"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={recipeForm.cookTimeMinutes}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="servings">Servings</label>
                <input
                  type="number"
                  id="servings"
                  name="servings"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={recipeForm.servings}
                  onChange={handleInputChange}
                  min="1"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="difficulty">Difficulty</label>
                <select
                  id="difficulty"
                  name="difficulty"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={recipeForm.difficulty}
                  onChange={handleInputChange}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="cuisine">Cuisine</label>
                <input
                  type="text"
                  id="cuisine"
                  name="cuisine"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={recipeForm.cuisine}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="caloriesPerServing">Calories Per Serving</label>
              <input
                type="number"
                id="caloriesPerServing"
                name="caloriesPerServing"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={recipeForm.caloriesPerServing}
                onChange={handleInputChange}
                min="0"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Tags</label>
              <div className="flex mb-2">
                <input
                  type="text"
                  placeholder="Add a tag"
                  className="flex-1 p-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                />
                <button 
                  type="button" 
                  className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600"
                  onClick={addTag}
                >
                  Add
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {recipeForm.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    {tag}
                    <button 
                      type="button" 
                      className="ml-2 text-blue-600 hover:text-blue-800"
                      onClick={() => removeTag(tag)}
                    >
                      &times;
                    </button>
                  </span>
                ))}
                {recipeForm.tags.length === 0 && (
                  <span className="text-gray-500 text-sm">No tags added yet</span>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button 
                type="button" 
                className="bg-gray-300 text-gray-800 py-2 px-6 rounded-md hover:bg-gray-400 transition"
                onClick={handleCancel}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition"
                disabled={actionLoading}
              >
                {actionLoading 
                  ? (editMode ? 'Saving...' : 'Adding...') 
                  : (editMode ? 'Save Changes' : 'Add Recipe')}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Recipes list */}
      <div className="space-y-8">
        <h2 className="text-2xl font-semibold mb-4">Recipe Collection</h2>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {recipes.length > 0 ? (
              recipes.map(recipe => (
                <RecipeComponent 
                  key={recipe.id} 
                  recipe={recipe} 
                  onEdit={handleEditClick}
                  onDelete={handleDeleteRecipe}
                  isEditing={actionLoading && currentRecipeId === recipe.id}
                  isDeleting={Boolean(isDeleting[recipe.id])}
                />
              ))
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No recipes yet</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new recipe.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipesPage;