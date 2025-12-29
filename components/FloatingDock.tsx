"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useRefrigeratorStore } from "@/store/useRefrigeratorStore";
import { Button } from "@/components/ui/button";

interface FloatingDockProps {
  onMixIt: () => void;
  isLoading: boolean;
}

export function FloatingDock({ onMixIt, isLoading }: FloatingDockProps) {
  const { ingredients, removeIngredient } = useRefrigeratorStore();

  if (ingredients.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-2xl"
      >
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-white border border-slate-200 rounded-2xl shadow-2xl px-4 sm:px-6 py-4 backdrop-blur-md">
          {/* Selected Ingredients */}
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            {ingredients.map((ingredient) => (
              <motion.div
                key={ingredient.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="relative group"
              >
                <img
                  src={ingredient.image}
                  alt={ingredient.name}
                  className="w-12 h-12 rounded-lg object-cover border-2 border-slate-200"
                />
                <button
                  onClick={() => removeIngredient(ingredient.id)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Mix It Button */}
          <div className="hidden sm:block h-12 w-px bg-slate-200" />
          <Button
            onClick={onMixIt}
            disabled={isLoading}
            className="h-12 px-8 rounded-xl w-full sm:w-auto"
          >
            {isLoading ? "Mixing..." : "Mix It"}
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

