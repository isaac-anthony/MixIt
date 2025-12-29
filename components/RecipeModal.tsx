"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Wine, GlassWater, Gauge } from "lucide-react";
import { Recipe, SeasonalCollection } from "@/lib/recipeData";
import { useEffect } from "react";

interface RecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: Recipe | SeasonalCollection | null;
}

export function RecipeModal({ isOpen, onClose, recipe }: RecipeModalProps) {
  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!recipe) return null;

  // Determine if it's a Recipe or SeasonalCollection
  const isRecipe = 'category' in recipe;
  const recipeName = isRecipe ? (recipe as Recipe).name : (recipe as SeasonalCollection).title;
  const recipeImage = recipe.image || 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=800&h=600&fit=crop&q=80';
  
  // For recipes, use detailed ingredients if available, otherwise parse from ingredients array
  let detailedIngredients: { name: string; amount: string }[];
  if (isRecipe) {
    const recipeData = recipe as Recipe;
    detailedIngredients = recipeData.detailedIngredients
      ? recipeData.detailedIngredients
      : recipeData.ingredients.map(ing => ({ name: ing, amount: '' }));
  } else {
    const collection = recipe as SeasonalCollection;
    detailedIngredients = collection.ingredients.map(ing => ({ name: ing, amount: '' }));
  }
  
  // For recipes, use steps if available
  let steps: string[];
  if (isRecipe) {
    const recipeData = recipe as Recipe;
    steps = recipeData.steps || [
      `Combine ${recipeData.ingredients.slice(0, 2).join(' and ')} in a shaker with ice`,
      `Shake vigorously for 15 seconds`,
      `Strain into a chilled glass`,
      `Garnish and serve`
    ];
  } else {
    const collection = recipe as SeasonalCollection;
    steps = [
      `Select ingredients from: ${collection.ingredients.slice(0, 3).join(', ')}`,
      `Follow classic preparation methods for ${collection.title}`,
      `Serve in appropriate glassware`,
      `Garnish to enhance flavor profile`
    ];
  }

  const servingSize = isRecipe && 'servingSize' in recipe ? (recipe as Recipe).servingSize : '1 serving';
  const glassware = isRecipe && 'glassware' in recipe ? (recipe as Recipe).glassware : 'Cocktail Glass';
  const abv = isRecipe && 'abv' in recipe ? (recipe as Recipe).abv : '~15-20%';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dim Background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-xl z-[9998]"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-[32px] glass-specular backdrop-blur-2xl border border-white/20 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3),0_0_60px_rgba(168,85,247,0.25)] pointer-events-auto"
              style={{
                background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.90) 0%, rgba(230, 220, 255, 0.95) 20%, rgba(220, 230, 255, 0.95) 50%, rgba(230, 220, 255, 0.95) 80%, rgba(255, 255, 255, 0.90) 100%)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 z-50 p-2 rounded-full bg-white/60 hover:bg-white/80 border border-slate-200/50 hover:border-purple-500/50 transition-all group shadow-sm"
              >
                <X className="w-5 h-5 text-slate-700 group-hover:text-purple-600 transition-colors" />
              </button>

              {/* Header Image */}
              <div className="relative w-full h-[280px] overflow-hidden rounded-t-[32px]">
                <img
                  src={recipeImage}
                  alt={recipeName}
                  className="w-full h-full object-cover saturate-150"
                />
                {/* Gradient Fade */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/80" />
              </div>

              {/* Content */}
              <div className="p-8 overflow-y-auto max-h-[calc(90vh-280px)]">
                {/* Title */}
                <h2 className="text-4xl font-bold text-slate-900 mb-6 tracking-tight">
                  {recipeName}
                </h2>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Left Column: Ingredients */}
                  <div className="bg-white/50 rounded-[32px] p-6 border border-white/20 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.1),0_0_20px_rgba(168,85,247,0.1)]">
                    <h3 className="text-xl font-semibold text-slate-900 mb-4 tracking-tight">
                      Ingredients
                    </h3>
                    <ul className="space-y-3">
                      {detailedIngredients.map((ing, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center gap-3 text-slate-800"
                        >
                          <div className="w-2 h-2 rounded-full bg-purple-600 flex-shrink-0" />
                          <span className="font-mono text-sm text-purple-600 font-semibold">
                            {ing.amount && `${ing.amount} `}
                          </span>
                          <span className="text-slate-800">{ing.name}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* Right Column: Preparation Steps */}
                  <div className="bg-white/50 rounded-[32px] p-6 border border-white/20 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.1),0_0_20px_rgba(168,85,247,0.1)]">
                    <h3 className="text-xl font-semibold text-slate-900 mb-4 tracking-tight">
                      Preparation Steps
                    </h3>
                    <ol className="space-y-3">
                      {steps.map((step, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ 
                            delay: index * 0.1,
                            duration: 0.3,
                            ease: "easeOut"
                          }}
                          className="flex gap-3 text-slate-800"
                        >
                          <span className="font-mono text-sm text-purple-600 flex-shrink-0 w-6">
                            {String(index + 1).padStart(2, '0')}.
                          </span>
                          <span className="text-slate-800">{step}</span>
                        </motion.li>
                      ))}
                    </ol>
                  </div>
                </div>

                {/* Technical Footer - 3 Separate Pills */}
                <div className="flex flex-wrap gap-4 justify-center relative">
                  {/* Serving Size Pill */}
                  <div className="bg-white/50 rounded-full px-6 py-4 border border-white/20 backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.1),0_0_10px_rgba(168,85,247,0.1)] flex items-center gap-3">
                    <div className="p-2 rounded-full bg-white/60 border border-white/20">
                      <Wine className="w-4 h-4 text-slate-600" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">
                        Serving Size
                      </div>
                      <div className="text-sm text-slate-700 font-mono font-semibold">
                        {servingSize}
                      </div>
                    </div>
                  </div>

                  {/* Glassware Pill */}
                  <div className="bg-white/50 rounded-full px-6 py-4 border border-white/20 backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.1),0_0_10px_rgba(168,85,247,0.1)] flex items-center gap-3">
                    <div className="p-2 rounded-full bg-white/60 border border-white/20">
                      <GlassWater className="w-4 h-4 text-slate-600" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">
                        Glassware
                      </div>
                      <div className="text-sm text-slate-700 font-mono font-semibold">
                        {glassware}
                      </div>
                    </div>
                  </div>

                  {/* ABV Estimate Pill */}
                  <div className="bg-white/50 rounded-full px-6 py-4 border border-white/20 backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.1),0_0_10px_rgba(168,85,247,0.1)] flex items-center gap-3">
                    <div className="p-2 rounded-full bg-white/60 border border-white/20">
                      <Gauge className="w-4 h-4 text-slate-600" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">
                        ABV Estimate
                      </div>
                      <div className="text-sm text-slate-700 font-mono font-semibold">
                        {abv}
                      </div>
                    </div>
                  </div>

                  {/* MixIt Brand Watermark */}
                  <div className="absolute bottom-0 right-0 flex items-center gap-1.5 text-slate-400/50 text-xs font-medium tracking-tight">
                    <span>MixIt</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

