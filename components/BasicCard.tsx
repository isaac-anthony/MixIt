"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { basicRecipes } from "@/lib/recipeData";
import { cn } from "@/lib/utils";

interface BasicCardProps {
  onRecipeClick?: (recipe: import("@/lib/recipeData").Recipe) => void;
}

export function BasicCard({ onRecipeClick }: BasicCardProps = {}) {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("spirits");

  const categories = [
    { id: "spirits", label: "Spirits" },
    { id: "all", label: "All" },
  ];

  const filteredRecipes =
    selectedCategory === "all"
      ? basicRecipes
      : basicRecipes.filter((recipe) => recipe.category === selectedCategory);

  return (
    <div className="relative w-full max-w-4xl mx-auto rounded-[48px] glass-specular shadow-[0_30px_80px_rgba(0,0,0,0.2),0_0_60px_rgba(168,85,247,0.25)] overflow-hidden z-10 h-full flex flex-col" style={{ backgroundColor: `rgba(255, 255, 255, var(--card-bg-opacity, 0.5))` }}>
      {/* Collapsible Header */}
      <div className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/10 transition-colors">
        <h2 className="text-xl font-bold text-black">Basic</h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
        >
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-slate-600" />
          </motion.div>
        </button>
      </div>

      {/* Collapsible Content */}
      <motion.div
        initial={false}
        animate={{
          maxHeight: isExpanded ? "calc(100% - 60px)" : "0px",
          opacity: isExpanded ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden flex-1"
      >
        <div className="flex p-6 gap-6 h-full overflow-y-auto scrollbar-hide">
          {/* Left Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white/50 rounded-[32px] overflow-hidden h-full p-6 shadow-[0_8px_24px_rgba(0,0,0,0.1),0_0_20px_rgba(168,85,247,0.1)] border border-white/20 backdrop-blur-md">
              <div className="flex flex-col gap-2 h-full">
                <div className="text-xs font-semibold text-slate-900 uppercase tracking-[0.15em] mb-4 px-2 flex items-center h-6">
                  Categories
                </div>
                <div className="relative flex flex-col gap-2 flex-1">
                  {categories.filter(cat => cat.id !== "all").map((category) => (
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
                          layoutId="activeCategoryBasic"
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
                  {/* All category right under the last option */}
                  <div className="pt-2 border-t border-white/10">
                    {categories.filter(cat => cat.id === "all").map((category) => (
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
                            layoutId="activeCategoryBasic"
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
          </div>

          {/* Right Table */}
          <div className="flex-1 min-w-0">
            <div className="bg-white/50 rounded-[32px] overflow-hidden h-full p-1 shadow-[0_8px_24px_rgba(0,0,0,0.1),0_0_20px_rgba(168,85,247,0.1)] border border-white/20 backdrop-blur-md">
              <div className="max-h-[800px] overflow-y-auto overflow-x-auto scrollbar-hide relative">
                {/* Table Header */}
                <div className="sticky top-0 z-20 backdrop-blur-md bg-white/50 border-b border-white/10" style={{ width: 'max-content', minWidth: '100%' }}>
                  <div className="grid grid-cols-[50px_1fr_200px] gap-4 px-4 py-4 min-w-max">
                    <div className="text-xs font-semibold text-slate-600 uppercase tracking-[0.1em] leading-tight flex items-center h-6">
                      Image
                    </div>
                    <div className="text-xs font-semibold text-slate-600 uppercase tracking-[0.1em] leading-tight flex items-center h-6">
                      Recipe Name
                    </div>
                    <div className="text-xs font-semibold text-slate-600 uppercase tracking-[0.1em] leading-tight flex items-center h-6">
                      Ingredients
                    </div>
                  </div>
                </div>

                {/* Table Body */}
                <div className="min-h-[400px]">
                  {filteredRecipes.map((recipe) => (
                    <motion.div
                      key={recipe.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.15 }}
                      whileHover={{
                        scale: 1.02,
                        y: -2,
                        boxShadow: "0 8px 24px rgba(168,85,247,0.25)"
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onRecipeClick?.(recipe);
                      }}
                      data-recipe-click
                      className={cn(
                        "group grid grid-cols-[50px_1fr_200px] gap-4 px-4 py-3.5 h-auto min-h-[60px] min-w-max",
                        "border-b border-white/10 cursor-pointer transition-all duration-300",
                        "hover:bg-white/60 hover:border-purple-200/30"
                      )}
                      style={{
                        backgroundColor: 'transparent'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
                        e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      }}
                    >
                      {/* Image Column */}
                      <div className="flex items-center">
                        <img
                          src={recipe.image || 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=400&fit=crop&q=80'}
                          alt={recipe.name}
                          className="w-10 h-10 rounded-xl object-cover shadow-[0_2px_8px_rgba(0,0,0,0.1)] ring-1 ring-purple-100/30"
                        />
                      </div>
                      <div className="flex items-center">
                        <span className="font-semibold text-slate-800 text-sm tracking-tight">
                          {recipe.name}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs text-slate-600">
                          {recipe.ingredients.join(", ")}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

