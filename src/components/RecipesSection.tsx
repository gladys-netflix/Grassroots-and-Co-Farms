import React, { useState } from 'react';
import { ChefHat, Clock, Users, Plus, Check } from 'lucide-react';
import { RECIPES, PRODUCTS } from '../data/products';
import { Product } from '../types/farm';

interface RecipesSectionProps {
  onAddMultipleToCart: (products: Product[]) => void;
}

export const RecipesSection: React.FC<RecipesSectionProps> = ({ onAddMultipleToCart }) => {
  const [addedRecipeId, setAddedRecipeId] = useState<string | null>(null);

  const handleAddRecipeIngredients = (recipeId: string, productIds: string[]) => {
    const matchedProducts = PRODUCTS.filter((p) => productIds.includes(p.id));
    if (matchedProducts.length > 0) {
      onAddMultipleToCart(matchedProducts);
      setAddedRecipeId(recipeId);
      setTimeout(() => setAddedRecipeId(null), 2000);
    }
  };

  return (
    <section id="recipes" className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-8 border-b border-[#E6DFD3]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-900 mb-2">
            <span>Farm Kitchen</span>
            <span aria-hidden="true">·</span>
            <span>Simple Seasonal Cooking</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1B3523] tracking-tight">
            Field-to-Table Kitchen Inspirations
          </h2>
          <p className="mt-2 text-stone-600 text-sm max-w-xl">
            When vegetables are grown in nutrient-rich living soil, they require very little cooking technique to taste extraordinary. Try these seasonal recipes developed in our farm kitchen.
          </p>
        </div>
      </div>

      {/* Recipes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {RECIPES.map((recipe) => {
          const featuredProduce = PRODUCTS.filter((p) => recipe.featuredProductIds.includes(p.id));
          const isAdded = addedRecipeId === recipe.id;

          return (
            <div
              key={recipe.id}
              className="bg-[#FBF9F5] rounded-2xl border border-[#E6DFD3] p-6 sm:p-8 flex flex-col justify-between"
            >
              <div>
                {/* Meta */}
                <div className="flex items-center gap-4 text-xs text-stone-500 mb-3">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    <span>Prep: {recipe.prepTime}</span>
                  </div>
                  <span aria-hidden="true">·</span>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-stone-400" />
                    <span>{recipe.servings}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-serif font-bold text-2xl text-stone-900 leading-snug">
                  {recipe.title}
                </h3>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  {recipe.description}
                </p>

                {/* Ingredients */}
                <div className="mt-6 pt-4 border-t border-stone-200">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
                    Ingredients List:
                  </h4>
                  <ul className="space-y-1.5 text-xs text-stone-700">
                    {recipe.ingredients.map((ing, i) => (
                      <li key={i} className="flex items-baseline gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-800 shrink-0" />
                        <span>{ing}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Instructions preview */}
                <div className="mt-6 pt-4 border-t border-stone-200">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
                    Preparation Steps:
                  </h4>
                  <ol className="space-y-2 text-xs text-stone-600 list-decimal list-inside">
                    {recipe.instructions.map((step, idx) => (
                      <li key={idx} className="leading-relaxed pl-1">
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Action Button: Add all featured produce to basket */}
              <div className="mt-8 pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="text-xs text-stone-500">
                  <span>Includes {featuredProduce.length} farm items: </span>
                  <span className="font-medium text-stone-800">
                    {featuredProduce.map((p) => p.name).join(', ')}
                  </span>
                </div>

                <button
                  onClick={() => handleAddRecipeIngredients(recipe.id, recipe.featuredProductIds)}
                  className={`px-4 py-2.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-2 shrink-0 ${
                    isAdded
                      ? 'bg-emerald-700 text-white'
                      : 'bg-stone-900 hover:bg-[#1B3523] text-stone-100'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Produce Added to Basket!</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Ingredients to Basket</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
};
