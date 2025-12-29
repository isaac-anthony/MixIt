"use client";

import { useState } from "react";
import { IngredientsTable } from "@/components/IngredientsTable";
import { RecipeCard } from "@/components/RecipeCard";
import { Hero } from "@/components/Hero";
import { FloatingHeader } from "@/components/FloatingHeader";
import { StickySearchBar } from "@/components/StickySearchBar";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { useRefrigeratorStore, Ingredient } from "@/store/useRefrigeratorStore";
import { initialIngredients as ALL_INGREDIENTS } from "@/lib/data";

export default function Home() {
  const { ingredients: selectedIngredients, addIngredient, removeIngredient } = useRefrigeratorStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [recipe, setRecipe] = useState<{
    title: string;
    image: string;
    steps: string[];
    explanation: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleIngredientClick = (ingredient: Ingredient) => {
    if (selectedIngredients.some((ing) => ing.id === ingredient.id)) {
      removeIngredient(ingredient.id);
    } else {
      addIngredient(ingredient);
    }
  };

  const handleMixIt = async () => {
    if (selectedIngredients.length === 0) {
      alert("Please select at least one ingredient!");
      return;
    }

    setIsLoading(true);
    setRecipe(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ingredients: selectedIngredients }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate recipe");
      }

      const data = await response.json();
      setRecipe(data);
      
      // Scroll to recipe
      setTimeout(() => {
        const recipeElement = document.getElementById("recipe-section");
        if (recipeElement) {
          recipeElement.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to generate recipe. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter ingredients based on search
  const filteredIngredients = searchQuery
    ? ALL_INGREDIENTS.filter((ing) =>
        ing.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : ALL_INGREDIENTS;

  return (
    <div className="min-h-screen bg-white relative">
      {/* Floating Header */}
      <FloatingHeader />

      {/* Hero Section */}
      <Hero />

      {/* Scroll Reveal Transition */}
      <ScrollReveal>
        <section className="flex items-center justify-center px-4 py-8">
          <p className="text-3xl sm:text-4xl md:text-5xl font-light text-center text-gray-700 max-w-4xl drop-shadow-sm">
            Tell us what you have. We'll tell you what to pour.
          </p>
        </section>
      </ScrollReveal>

      {/* The Tool Section */}
      <section className="py-8 px-4 relative overflow-visible">
        <div className="max-w-7xl mx-auto overflow-visible">
          {/* Sticky Search Bar */}
          <div className="mt-12 relative z-50 overflow-visible">
            <StickySearchBar
            ingredients={ALL_INGREDIENTS}
            onSelectIngredient={handleIngredientClick}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onMixIt={handleMixIt}
            isLoading={isLoading}
          />
          </div>

          {/* Ingredients Table */}
          <div className="mt-12 relative z-0">
            <IngredientsTable
              ingredients={filteredIngredients}
              selectedIngredients={selectedIngredients}
              onIngredientClick={handleIngredientClick}
              onClearSearch={() => setSearchQuery("")}
            />
          </div>

          {/* Recipe Output */}
          {(recipe || isLoading) && (
            <section id="recipe-section" className="mt-20">
              <RecipeCard recipe={recipe} isLoading={isLoading} />
            </section>
          )}
        </div>
      </section>

    </div>
  );
}
