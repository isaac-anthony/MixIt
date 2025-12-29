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
import CardSwap, { Card } from "@/components/CardSwap";
import { MostPopularCard } from "@/components/MostPopularCard";
import { SeasonalCard } from "@/components/SeasonalCard";
import { BasicCard } from "@/components/BasicCard";
import { RecipeModal } from "@/components/RecipeModal";
import { Recipe, SeasonalCollection } from "@/lib/recipeData";

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
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | SeasonalCollection | null>(null);

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
    <div className="relative min-h-screen overflow-hidden" style={{
      background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.90) 0%, rgba(230, 220, 255, 0.95) 15%, rgba(220, 230, 255, 0.95) 35%, rgba(210, 220, 255, 0.95) 50%, rgba(220, 230, 255, 0.95) 65%, rgba(230, 220, 255, 0.95) 85%, rgba(255, 255, 255, 0.90) 100%)'
    }}>
      {/* Fixed Aurora Orbs - Infinite Depth */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        {/* Top Left: Purple */}
        <div 
          className="absolute -top-[400px] -left-[400px] w-[800px] h-[800px] rounded-full"
          style={{
            background: '#7c3aed',
            opacity: 0.15,
            filter: 'blur(1000px)',
          }}
        />
        {/* Bottom Right: Deep Blue */}
        <div 
          className="absolute -bottom-[450px] -right-[450px] w-[900px] h-[900px] rounded-full"
          style={{
            background: '#2563eb',
            opacity: 0.10,
            filter: 'blur(1200px)',
          }}
        />
        {/* Center: Subtle Magenta (behind Search) */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            background: '#d946ef',
            opacity: 0.05,
            filter: 'blur(800px)',
          }}
        />
      </div>

      {/* Floating Header */}
      <FloatingHeader />

      {/* Hero Section */}
      <Hero />

      {/* Scroll Reveal Transition */}
      <ScrollReveal>
        <section className="relative flex items-center justify-center px-4 py-32">
          <p className="text-3xl sm:text-4xl md:text-5xl font-light text-center text-slate-900 max-w-4xl drop-shadow-sm relative z-10 font-bold" style={{
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.2), 0 4px 16px rgba(0, 0, 0, 0.15)',
          }}>
            Tell us what you have. We'll tell you what to pour.
          </p>
        </section>
      </ScrollReveal>

      {/* The Tool Section */}
      <section className="py-24 px-4 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Sticky Search Bar */}
          <div className="mt-12 mb-20 relative z-50 overflow-visible">
            <StickySearchBar
            ingredients={ALL_INGREDIENTS}
            onSelectIngredient={handleIngredientClick}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onMixIt={handleMixIt}
            isLoading={isLoading}
          />
          </div>

          {/* Card Swap Section */}
          <div className="mt-96 py-24 relative z-0 flex justify-center">
            <div className="w-full max-w-5xl relative z-10">
              <CardSwap
                width={800}
                height={700}
                cardDistance={120}
                verticalDistance={100}
                skewAmount={4}
              >
              <Card customClass="w-full">
                <IngredientsTable
                  ingredients={filteredIngredients}
                  selectedIngredients={selectedIngredients}
                  onIngredientClick={handleIngredientClick}
                  onClearSearch={() => setSearchQuery("")}
                />
              </Card>
              <Card customClass="w-full">
                <MostPopularCard onRecipeClick={(recipe) => setSelectedRecipe(recipe)} />
              </Card>
              <Card customClass="w-full">
                <SeasonalCard onRecipeClick={(collection) => setSelectedRecipe(collection)} />
              </Card>
              <Card customClass="w-full">
                <BasicCard onRecipeClick={(recipe) => setSelectedRecipe(recipe)} />
              </Card>
            </CardSwap>
            </div>
          </div>

          {/* Recipe Output */}
          {(recipe || isLoading) && (
            <section id="recipe-section" className="mt-20">
              <RecipeCard recipe={recipe} isLoading={isLoading} />
            </section>
          )}
        </div>
      </section>

      {/* Recipe Modal */}
      <RecipeModal
        isOpen={!!selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
        recipe={selectedRecipe}
      />
    </div>
  );
}
