"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

interface Recipe {
  title: string;
  image: string;
  steps: string[];
  explanation: string;
}

interface RecipeCardProps {
  recipe: Recipe | null;
  isLoading: boolean;
}

export function RecipeCard({ recipe, isLoading }: RecipeCardProps) {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl mx-auto"
      >
        <Card className="border border-slate-100 shadow-lg">
          <CardHeader>
            <div className="h-8 bg-gray-200 rounded animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-48 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (!recipe) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="border border-slate-100 shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl">{recipe.title}</CardTitle>
          <CardDescription>Your custom cocktail recipe</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-100 shadow-md">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Recipe Steps</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              {recipe.steps.map((step, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {step}
                </motion.li>
              ))}
            </ol>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xl font-semibold mb-2">Why This Works</h3>
            <p className="text-gray-700 leading-relaxed">{recipe.explanation}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

