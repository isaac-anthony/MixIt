"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Ingredient } from "@/store/useRefrigeratorStore";
import { Check, Plus, SearchX, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface IngredientsTableProps {
  ingredients: Ingredient[];
  selectedIngredients: Ingredient[];
  onIngredientClick: (ingredient: Ingredient) => void;
  onClearSearch?: () => void;
}

const categories = [
  { id: "spirits", label: "Spirits" },
  { id: "mixers", label: "Mixers" },
  { id: "garnishes", label: "Garnishes" },
  { id: "pantry", label: "Pantry" },
  { id: "all", label: "All" },
];

export function IngredientsTable({
  ingredients,
  selectedIngredients,
  onIngredientClick,
  onClearSearch,
}: IngredientsTableProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isContainerExpanded, setIsContainerExpanded] = useState<boolean>(false);

  const isSelected = (ingredient: Ingredient) => {
    return selectedIngredients.some((ing) => ing.id === ingredient.id);
  };

  const filteredIngredients =
    selectedCategory === "all"
      ? ingredients
      : ingredients.filter((ing) => ing.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      spirits: "bg-purple-100/50 text-purple-700",
      mixers: "bg-blue-100/50 text-blue-700",
      garnishes: "bg-green-100/50 text-green-700",
      pantry: "bg-amber-100/50 text-amber-700",
    };
    return colors[category] || "bg-gray-100/50 text-gray-600";
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto rounded-[48px] border border-white/20 bg-white/10 backdrop-blur-2xl shadow-[0_30px_80px_rgba(0,0,0,0.2),0_0_60px_rgba(168,85,247,0.25)] overflow-hidden z-10">
      {/* Collapsible Header */}
      <button
        onClick={() => setIsContainerExpanded(!isContainerExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/10 transition-colors"
      >
        <h2 className="text-lg font-semibold text-slate-900">Or browse ingredients</h2>
        <motion.div
          animate={{ rotate: isContainerExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-slate-600" />
        </motion.div>
      </button>

      {/* Collapsible Content */}
      <motion.div
        initial={false}
        animate={{
          maxHeight: isContainerExpanded ? "800px" : "0px",
          opacity: isContainerExpanded ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="flex p-6 gap-6 min-h-[600px]">
          {/* Left Sidebar - Separate Rounded Container */}
          <div className="w-64 flex-shrink-0">
        <div className="bg-white/30 rounded-[32px] overflow-hidden h-full p-6 shadow-[0_8px_24px_rgba(0,0,0,0.1),0_0_20px_rgba(168,85,247,0.1)] border border-white/20 backdrop-blur-md">
          <div className="flex flex-col gap-2 h-full">
            <div className="text-xs font-semibold text-slate-900 uppercase tracking-[0.15em] mb-4 px-2 flex items-center h-6">
              Categories
            </div>
            {/* All Categories in Order */}
            <div className="relative">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "relative w-full flex items-center px-3 py-2.5 rounded-xl text-sm transition-all",
                    "text-left text-slate-800 font-medium tracking-tight",
                    selectedCategory === category.id
                      ? "font-semibold"
                      : "hover:bg-white/10"
                  )}
                >
                  {selectedCategory === category.id && (
                    <motion.div
                      layoutId="activeCategory"
                      className="absolute inset-0 bg-purple-100/50 border border-purple-200/50 rounded-xl z-0 shadow-[0_4px_12px_rgba(168,85,247,0.15)]"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10">{category.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

          {/* Right Table */}
          <div className="flex-1 min-w-0">
            <div className="bg-white/30 rounded-[32px] overflow-hidden h-full p-1 shadow-[0_8px_24px_rgba(0,0,0,0.1),0_0_20px_rgba(168,85,247,0.1)] border border-white/20 backdrop-blur-md">
              {/* Scrollable Content */}
              <div className="max-h-[600px] overflow-y-auto scrollbar-hide">
                {/* Table Header */}
                <div className="grid grid-cols-[50px_1fr_100px_50px] gap-4 px-4 py-4 border-b border-white/10 sticky top-0 z-20 backdrop-blur-md bg-white/50">
                  <div className="text-xs font-semibold text-slate-600 uppercase tracking-[0.1em] leading-tight flex items-center h-6">
                    Image
                  </div>
                  <div className="text-xs font-semibold text-slate-600 uppercase tracking-[0.1em] leading-tight flex items-center h-6">
                    Name
                  </div>
                  <div className="text-xs font-semibold text-slate-600 uppercase tracking-[0.1em] leading-tight flex items-center h-6">
                    Category
                  </div>
                  <div className="text-xs font-semibold text-slate-600 uppercase tracking-[0.1em] leading-tight text-center flex items-center justify-center h-6">
                    Status
                  </div>
                </div>
            {/* Table Body */}
            <div className="min-h-[400px]">
              {filteredIngredients.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center justify-center h-full min-h-[400px] py-16"
                >
                  <SearchX className="w-20 h-20 text-gray-300 mb-6" />
                  <p className="text-lg text-slate-600 font-medium mb-4">
                    No ingredients found. Maybe run to the store?
                  </p>
                  {onClearSearch && (
                    <Button
                      onClick={onClearSearch}
                      variant="outline"
                      className="px-6 py-2 text-sm font-medium border-slate-300 text-slate-700 hover:bg-slate-50"
                    >
                      Clear Search
                    </Button>
                  )}
                </motion.div>
              ) : (
                filteredIngredients.map((ingredient) => {
                  const selected = isSelected(ingredient);
                  return (
                    <motion.div
                      key={ingredient.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.15 }}
                      onClick={() => onIngredientClick(ingredient)}
                      whileHover={{ 
                        scale: 1.01,
                      }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className={cn(
                        "grid grid-cols-[50px_1fr_100px_50px] gap-4 px-4 py-3.5 h-14",
                        "border-b border-white/10 cursor-pointer transition-all duration-200",
                        "hover:bg-white/40 hover:shadow-[0_2px_8px_rgba(168,85,247,0.1)]",
                        selected && "bg-purple-50/30 border-purple-200/20"
                      )}
                    >
                      {/* Icon Column */}
                      <div className="flex items-center">
                        <img
                          src={ingredient.image}
                          alt={ingredient.name}
                          className="w-10 h-10 rounded-xl object-cover shadow-[0_2px_8px_rgba(0,0,0,0.1)] ring-1 ring-purple-100/30"
                        />
                      </div>

                      {/* Name Column */}
                      <div className="flex items-center">
                        <span className="font-semibold text-slate-800 text-sm tracking-tight">
                          {ingredient.name}
                        </span>
                      </div>

                      {/* Category Column */}
                      <div className="flex items-center">
                        <span
                          className={cn(
                            "text-xs px-2.5 py-1 rounded-md font-semibold tracking-wide",
                            getCategoryColor(ingredient.category)
                          )}
                        >
                          {ingredient.category.charAt(0).toUpperCase() +
                            ingredient.category.slice(1)}
                        </span>
                      </div>

                      {/* Status/Action Column */}
                      <div className="flex items-center justify-center">
                        {selected ? (
                          <motion.div
                            key="checkmark"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 25,
                            }}
                            className="w-5 h-5 rounded-full bg-slate-900 flex items-center justify-center shadow-sm"
                          >
                            <motion.div
                              initial={{ scale: 0, rotate: -90 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ 
                                delay: 0.1, 
                                type: "spring", 
                                stiffness: 400,
                                damping: 20
                              }}
                            >
                              <Check className="w-3 h-3 text-white" />
                            </motion.div>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="plus"
                            initial={{ scale: 1, rotate: 0 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center hover:border-slate-400 hover:bg-white/10 transition-all"
                          >
                            <Plus className="w-3 h-3 text-slate-400" />
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
