"use client";

import { motion } from "framer-motion";
import { Ingredient } from "@/store/useRefrigeratorStore";
import { cn } from "@/lib/utils";

interface IngredientCardProps {
  ingredient: Ingredient;
  isSelected: boolean;
  onClick: () => void;
}

export function IngredientCard({
  ingredient,
  isSelected,
  onClick,
}: IngredientCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={cn(
        "relative cursor-pointer rounded-lg overflow-hidden",
        "border transition-all duration-200",
        isSelected
          ? "ring-2 ring-black bg-gray-50 scale-[0.98] shadow-lg"
          : "border-slate-100 bg-white hover:border-slate-300 shadow-md hover:shadow-lg"
      )}
    >
      <div className="aspect-square relative">
        <img
          src={ingredient.image}
          alt={ingredient.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-2 text-center bg-white">
        <p className="text-sm font-medium text-black">{ingredient.name}</p>
      </div>
    </motion.div>
  );
}

