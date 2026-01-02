"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useRefrigeratorStore } from "@/store/useRefrigeratorStore";
import { X } from "lucide-react";
import { motion } from "framer-motion";

interface RefrigeratorSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMixIt: () => void;
  isLoading: boolean;
}

export function RefrigeratorSheet({
  open,
  onOpenChange,
  onMixIt,
  isLoading,
}: RefrigeratorSheetProps) {
  const { ingredients, removeIngredient } = useRefrigeratorStore();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:w-[400px] flex flex-col">
        <SheetHeader>
          <SheetTitle>My Refrigerator</SheetTitle>
          <SheetDescription>
            {ingredients.length === 0
              ? "No ingredients selected yet"
              : `${ingredients.length} ingredient${ingredients.length > 1 ? "s" : ""} selected`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-6">
          {ingredients.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-gray-500 text-sm">
                Select ingredients from the grid to add them here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {ingredients.map((ingredient) => (
                <motion.div
                  key={ingredient.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-3 p-3 border border-slate-100 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <img
                    src={ingredient.image}
                    alt={ingredient.name}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-black">
                      {ingredient.name}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {ingredient.category}
                    </p>
                  </div>
                  <button
                    onClick={() => removeIngredient(ingredient.id)}
                    className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {ingredients.length > 0 && (
          <div className="border-t border-slate-100 pt-4 mt-auto">
            <Button
              onClick={onMixIt}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Mixing..." : "Mix It"}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}



