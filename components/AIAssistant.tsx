"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { Recipe } from "@/lib/recipeData";
import { useState } from "react";

// Helper function to parse and render bold text (**text**)
const parseBoldText = (text: string) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2);
      return <strong key={index} className="font-bold">{boldText}</strong>;
    }
    return <span key={index}>{part}</span>;
  });
};

interface AIRecipe {
  name: string;
  type?: string;
  ingredients: string[];
  instructions: string;
  image?: string;
}

interface AIAssistantProps {
  response: string | any | null;
  isLoading: boolean;
  isVisible: boolean;
  onViewRecipe?: (recipe: Recipe) => void;
}

export function AIAssistant({ response, isLoading, isVisible, onViewRecipe }: AIAssistantProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // Parse AI response to extract recipes
  const parseRecipes = (): AIRecipe[] => {
    if (!response) return [];

    // If response is already structured object with recipes array
    if (typeof response === 'object' && !Array.isArray(response)) {
      if (response.recipes && Array.isArray(response.recipes)) {
        return response.recipes;
      }
      // Sometimes the response itself might be the recipes array
      if (Array.isArray(response)) {
        return response;
      }
    }

    // If response is a string, try to parse it as JSON
    if (typeof response === 'string') {
      try {
        // Try to find JSON in the string (might have extra text)
        const jsonMatch = response.match(/\{[\s\S]*"recipes"[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : response;
        const parsed = JSON.parse(jsonString);
        if (parsed.recipes && Array.isArray(parsed.recipes)) {
          return parsed.recipes;
        }
      } catch (e) {
        // If JSON parsing fails, try to extract recipes from text format
        return extractRecipesFromText(response);
      }
    }

    return [];
  };

  // Fallback: Extract recipe information from text format
  const extractRecipesFromText = (text: string): AIRecipe[] => {
    const recipes: AIRecipe[] = [];
    
    // Try multiple patterns to extract recipes
    
    // Pattern 1: Numbered recipes with bold names (e.g., "1. **Apple-Orange Screwdriver**")
    let recipePattern = /(\d+)\.\s*\*\*([^*]+)\*\*[\s\S]*?(?=\d+\.\s*\*\*|$)/g;
    let match;
    let recipeIndex = 0;
    
    while ((match = recipePattern.exec(text)) !== null) {
      const recipeText = match[0];
      const name = match[2].trim();
      
      // Extract ingredients (lines starting with "-")
      const ingredientMatches = recipeText.match(/-\s*([^\n]+)/g);
      const ingredients = ingredientMatches 
        ? ingredientMatches.map(ing => ing.replace(/^-\s*/, '').trim())
        : [];
      
      // Extract instructions
      const instructions = extractInstructionsFromText(recipeText);
      
      // Determine type: rotate between Classic, Custom Fusion, and Seasonal
      const types: ('Classic' | 'Custom Fusion' | 'Seasonal')[] = ['Classic', 'Custom Fusion', 'Seasonal', 'Classic', 'Custom Fusion'];
      const type = types[recipeIndex % types.length];
      
      recipes.push({
        name,
        type,
        ingredients,
        instructions,
        image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=400&fit=crop&q=80'
      });
      
      recipeIndex++;
    }
    
    // Pattern 2: Single recipe with bold name (e.g., "**Tropical Fruit Punch**")
    if (recipes.length === 0) {
      const boldNameMatch = text.match(/\*\*([^*]+)\*\*/);
      if (boldNameMatch) {
        const name = boldNameMatch[1].trim();
        const recipeStartIndex = text.indexOf(boldNameMatch[0]);
        const recipeText = text.substring(recipeStartIndex);
        
        // Extract ingredients - look for "Ingredients:" section or bullet points
        let ingredients: string[] = [];
        const ingredientsSection = recipeText.match(/[Ii]ngredients?:?\s*([\s\S]*?)(?=[Ii]nstructions?:|$)/i);
        if (ingredientsSection) {
          const ingredientMatches = ingredientsSection[1].match(/-\s*([^\n]+)/g);
          ingredients = ingredientMatches 
            ? ingredientMatches.map(ing => ing.replace(/^-\s*/, '').trim())
            : [];
        } else {
          // Fallback: find all bullet points before instructions
          const allBullets = recipeText.match(/-\s*([^\n]+)/g);
          if (allBullets) {
            ingredients = allBullets.map(ing => ing.replace(/^-\s*/, '').trim());
          }
        }
        
        // Extract instructions
        const instructions = extractInstructionsFromText(recipeText);
        
        // Only add if we found ingredients or instructions
        if (ingredients.length > 0 || instructions.length > 50) {
          recipes.push({
            name,
            type: 'Custom Fusion',
            ingredients,
            instructions,
            image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=400&fit=crop&q=80'
          });
        }
      }
    }
    
    // Pattern 3: Multiple recipes separated by clear breaks (try to find multiple bold names)
    if (recipes.length === 0 || recipes.length === 1) {
      const allBoldNames = text.match(/\*\*([^*]+)\*\*/g);
      if (allBoldNames && allBoldNames.length > 1) {
        recipes.length = 0; // Reset and re-extract
        recipeIndex = 0;
        
        for (let i = 0; i < allBoldNames.length; i++) {
          const name = allBoldNames[i].replace(/\*\*/g, '').trim();
          const nameIndex = text.indexOf(allBoldNames[i]);
          const nextNameIndex = i < allBoldNames.length - 1 
            ? text.indexOf(allBoldNames[i + 1])
            : text.length;
          const recipeText = text.substring(nameIndex, nextNameIndex);
          
          // Extract ingredients
          const ingredientMatches = recipeText.match(/-\s*([^\n]+)/g);
          const ingredients = ingredientMatches 
            ? ingredientMatches.map(ing => ing.replace(/^-\s*/, '').trim())
            : [];
          
          // Extract instructions
          const instructions = extractInstructionsFromText(recipeText);
          
          const types: ('Classic' | 'Custom Fusion' | 'Seasonal')[] = ['Classic', 'Custom Fusion', 'Seasonal', 'Classic', 'Custom Fusion'];
          const type = types[recipeIndex % types.length];
          
          recipes.push({
            name,
            type,
            ingredients,
            instructions,
            image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=400&fit=crop&q=80'
          });
          
          recipeIndex++;
        }
      }
    }
    
    return recipes;
  };

  // Helper function to extract instructions from recipe text
  const extractInstructionsFromText = (recipeText: string): string => {
    // Look for "Instructions:" section
    const instructionsSection = recipeText.match(/[Ii]nstructions?:?\s*([\s\S]*?)(?=\*\*|$)/i);
    if (instructionsSection) {
      let instructions = instructionsSection[1].trim();
      
      // If it's a numbered list, convert to sentences
      if (instructions.match(/^\d+\./)) {
        const steps = instructions
          .split(/\n\s*\d+\.\s*/)
          .filter(s => s.trim().length > 0)
          .map(s => {
            const trimmed = s.trim();
            return trimmed.endsWith('.') || trimmed.endsWith('!') ? trimmed : trimmed + '.';
          });
        return steps.join(' ');
      }
      
      // Clean up and format
      instructions = instructions
        .replace(/^\d+\.\s*/gm, '') // Remove leading numbers
        .replace(/\n/g, ' ') // Replace newlines with spaces
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();
      
      return instructions || 'Mix all ingredients together. Shake or stir well. Strain into a glass and garnish.';
    }
    
    // Fallback: look for sentences after ingredients
    const sentences = recipeText
      .split(/\.\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.match(/^\d+\./) && !s.match(/^-\s*/))
      .map(s => s.endsWith('.') || s.endsWith('!') ? s : s + '.');
    
    return sentences.length > 0 
      ? sentences.join(' ')
      : 'Mix all ingredients together. Shake or stir well. Strain into a glass and garnish.';
  };

  let recipes = parseRecipes();
  
  // Ensure we always have at least 5 drinks
  if (recipes.length > 0 && recipes.length < 5) {
    // If we have some recipes but fewer than 5, create creative variations with unique names
    const types: ('Classic' | 'Custom Fusion' | 'Seasonal')[] = ['Classic', 'Custom Fusion', 'Seasonal', 'Classic', 'Custom Fusion'];
    
    // Creative name transformations based on the original recipe
    const createVariationName = (originalName: string, index: number): string => {
      const nameLower = originalName.toLowerCase();
      const variations = [
        // Tropical/Island themes
        nameLower.includes('tropical') || nameLower.includes('punch') || nameLower.includes('island') 
          ? ['Caribbean Breeze', 'Island Paradise', 'Tropical Sunset', 'Beachside Cooler', 'Ocean Breeze']
        // Fruit-based
        : nameLower.includes('fruit') || nameLower.includes('berry') || nameLower.includes('citrus')
          ? ['Citrus Burst', 'Berry Bliss', 'Fruit Fusion', 'Tropical Medley', 'Zesty Refresher']
        // Classic cocktails
        : nameLower.includes('martini') || nameLower.includes('margarita') || nameLower.includes('sour')
          ? ['Modern Classic', 'Elevated Twist', 'Refined Blend', 'Sophisticated Mix', 'Premium Blend']
        // Spiced/Warm
        : nameLower.includes('spice') || nameLower.includes('cinnamon') || nameLower.includes('warm')
          ? ['Spiced Delight', 'Cozy Blend', 'Warm Embrace', 'Aromatic Mix', 'Hearty Blend']
        // Default creative names
        : ['Signature Blend', 'Crafted Mix', 'Artisan Creation', 'Premium Mix', 'Refined Blend']
      ];
      
      return variations[0][index % variations[0].length];
    };
    
    while (recipes.length < 5) {
      const baseRecipe = recipes[recipes.length - 1];
      const variationIndex = recipes.length - 1;
      const creativeName = createVariationName(baseRecipe.name, variationIndex);
      
      const newRecipe: AIRecipe = {
        name: creativeName,
        type: types[recipes.length % types.length],
        ingredients: [...baseRecipe.ingredients],
        instructions: baseRecipe.instructions,
        image: baseRecipe.image
      };
      recipes.push(newRecipe);
    }
  }
  
  // Limit to exactly 5 if we have more
  if (recipes.length > 5) {
    recipes = recipes.slice(0, 5);
  }
  
  const hasStructuredRecipes = recipes.length > 0;
  const isTextResponse = typeof response === 'string' && !hasStructuredRecipes;

  const handleViewRecipe = (recipe: AIRecipe) => {
    if (!onViewRecipe) return;
    
    // Convert AI recipe to Recipe format for modal
    const recipeData: Recipe = {
      id: recipe.name.toLowerCase().replace(/\s+/g, '-'),
      name: recipe.name,
      category: 'spirits',
      type: (recipe.type as 'Classic' | 'Custom Fusion' | 'Seasonal') || 'Custom Fusion', // Add type for display in modal
      ingredients: recipe.ingredients.map(ing => {
        // Extract ingredient name (remove measurements)
        return ing.replace(/^\d+\.?\d*\s*(oz|dash|dashes|tsp|tbsp|ml|cl)\s*/i, '').trim();
      }),
      detailedIngredients: recipe.ingredients.map(ing => {
        // Parse "2 oz Vodka" into { name: "Vodka", amount: "2 oz" }
        const match = ing.match(/^(\d+\.?\d*)\s*(oz|dash|dashes|tsp|tbsp|ml|cl)?\s*(.+)$/i);
        if (match) {
          return {
            name: match[3].trim(),
            amount: `${match[1]}${match[2] ? ` ${match[2]}` : ' oz'}`
          };
        }
        return { name: ing, amount: '' };
      }),
      steps: (() => {
        // Split instructions into steps
        let stepList = recipe.instructions
          .split(/\.\s+/)
          .filter(s => s.trim().length > 0)
          .map(s => {
            // Remove any leading numbers and periods (e.g., "1. ", "2. ", "01. ")
            let trimmed = s.trim().replace(/^\d+\.\s*/, '').trim();
            // Remove any leading dashes or bullets
            trimmed = trimmed.replace(/^[-•]\s*/, '').trim();
            // Ensure it ends with proper punctuation
            trimmed = trimmed.endsWith('.') || trimmed.endsWith('!') ? trimmed : trimmed + '.';
            return trimmed;
          })
          .filter(s => s.length > 3); // Filter out very short fragments
        
        // If steps don't start with action words, try to fix them
        const actionWords = ['fill', 'add', 'combine', 'mix', 'shake', 'stir', 'pour', 'strain', 'garnish', 'serve', 'rim', 'place', 'top', 'chill', 'muddle'];
        
        return stepList.map((step, index) => {
          const stepLower = step.toLowerCase().trim();
          // Check if step starts with an action word
          const startsWithAction = actionWords.some(word => stepLower.startsWith(word));
          
          if (!startsWithAction && step.length > 0) {
            // If it doesn't start with an action word, try to find the first verb
            // or prepend a common action word based on context
            if (index === 0) {
              // First step usually starts with "Fill" or "Combine"
              if (!stepLower.match(/^(fill|combine|add|place|pour)/)) {
                return `Fill a glass or shaker with ice. ${step.charAt(0).toUpperCase() + step.slice(1)}`;
              }
            } else if (index === stepList.length - 1) {
              // Last step usually starts with "Garnish" or "Serve"
              if (!stepLower.match(/^(garnish|serve|top|finish)/)) {
                return `Garnish and serve. ${step.charAt(0).toUpperCase() + step.slice(1)}`;
              }
            }
          }
          
          // Capitalize first letter if needed
          return step.charAt(0).toUpperCase() + step.slice(1);
        });
      })(),
      image: recipe.image || 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=400&fit=crop&q=80',
      servingSize: '1 serving',
      glassware: 'Cocktail Glass',
      abv: '~15-20%'
    };

    onViewRecipe(recipeData);
  };

  return (
    <AnimatePresence>
      {isVisible && (response || isLoading) && (
        <motion.div
          initial={{ opacity: 0, y: -20, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -20, height: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full overflow-hidden relative"
        >
          {/* Main Glass Container - Matching CardSwap Style */}
          <div className="relative w-full max-w-4xl mx-auto rounded-[48px] glass-specular border border-white/10 overflow-hidden z-10 h-full flex flex-col" style={{ 
            backgroundColor: `rgba(255, 255, 255, var(--card-bg-opacity, 0.5))`,
            boxShadow: '0 20px 50px rgba(168,85,247,0.1), inset 0 1px 2px rgba(255,255,255,0.1)'
          }}>
            {/* Collapsible Header */}
            <div className="w-full px-6 py-3 flex items-center justify-between hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-white/60 border border-white/20 shadow-sm">
                  <Sparkles className="w-3 h-3 text-purple-600" />
                </div>
                <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">AI Assistant</h2>
              </div>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              >
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4 text-slate-600" />
                </motion.div>
              </button>
            </div>

            {/* Collapsible Content */}
            <motion.div
              initial={false}
              animate={{
                maxHeight: isExpanded ? "1000px" : "0px",
                opacity: isExpanded ? 1 : 0,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden flex-1"
            >
              <div className="px-6 pb-6 pt-2 overflow-y-auto scrollbar-hide">
                {isLoading ? (
                  <div className="flex items-center gap-2 text-slate-700 py-8">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm">Mixing...</span>
                  </div>
                ) : hasStructuredRecipes ? (
                  /* Table Format - Matching IngredientsTable */
                  <div className="relative rounded-[32px] overflow-hidden">
                    {/* Specular Highlight Border */}
                    <div 
                      className="absolute inset-0 rounded-[32px] pointer-events-none"
                      style={{
                        background: 'linear-gradient(to bottom right, rgba(255,255,255,0.4), transparent 30%, transparent 70%, rgba(255,255,255,0.1))',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderTop: '1px solid rgba(255,255,255,0.4)'
                      }}
                    />
                    {/* Table Content */}
                    <div 
                      className="bg-white/50 rounded-[32px] backdrop-blur-md relative border border-white/5"
                      style={{
                        boxShadow: '0 8px 30px rgba(168,85,247,0.4), 0 0 60px rgba(168,85,247,0.3), 0 0 100px rgba(168,85,247,0.2)'
                      }}
                    >
                    {/* Table Header */}
                    <div className="sticky top-0 z-10 bg-white/60 backdrop-blur-md border-b border-white/20 px-6 py-4" style={{
                      boxShadow: '0 2px 8px rgba(168,85,247,0.15)'
                    }}>
                      <div className="grid grid-cols-[1fr_150px] gap-4 items-center">
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-[0.15em]">
                          Drink Name
                        </div>
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-[0.15em]">
                          Category
                        </div>
                      </div>
                    </div>

                    {/* Table Body */}
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={{
                        visible: {
                          transition: {
                            staggerChildren: 0.1,
                            delayChildren: 0.2
                          }
                        }
                      }}
                      className="divide-y divide-white/10"
                      style={{
                        boxShadow: 'inset 0 2px 8px rgba(168,85,247,0.1)'
                      }}
                    >
                      {recipes.map((recipe, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                          onClick={() => handleViewRecipe(recipe)}
                          className="grid grid-cols-[1fr_150px] gap-4 items-center px-8 py-4 transition-all duration-300 group cursor-pointer"
                          style={{
                            transform: 'scale(1)',
                            transition: 'all 300ms ease-out',
                            backgroundColor: 'transparent'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.02) translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 0 10px rgba(168,85,247,0.2)';
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                            e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.borderColor = 'transparent';
                          }}
                        >
                          {/* Drink Name Column - Clickable */}
                          <div className="flex items-center">
                            <div className="font-semibold text-slate-900 text-base group-hover:text-purple-600 transition-colors">
                              {parseBoldText(recipe.name)}
                            </div>
                          </div>

                          {/* Category Column */}
                          <div className="flex items-center justify-end">
                            <span 
                              className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                                recipe.type === 'Custom Fusion' 
                                  ? 'bg-purple-100/60 text-purple-700 border-purple-300/60' 
                                  : 'bg-purple-100/50 text-purple-600 border-purple-200/50'
                              }`}
                            >
                              {recipe.type || 'Custom'}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                    </div>
                  </div>
                ) : isTextResponse ? (
                  /* Fallback: Text Response */
                  <div className="bg-white/50 rounded-[32px] p-6 border border-white/20 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.1),0_0_20px_rgba(168,85,247,0.1)]">
                    <p className="text-slate-900 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                      {parseBoldText(response)}
                    </p>
                  </div>
                ) : null}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
