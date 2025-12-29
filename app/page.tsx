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
import { AIAssistant } from "@/components/AIAssistant";

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
  const [aiResponse, setAiResponse] = useState<string | any | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [isSearchComplete, setIsSearchComplete] = useState(false);

  const handleIngredientClick = (ingredient: Ingredient) => {
    if (selectedIngredients.some((ing) => ing.id === ingredient.id)) {
      removeIngredient(ingredient.id);
    } else {
      addIngredient(ingredient);
    }
  };

  const handleMixIt = async () => {
    console.log("handleMixIt called", { 
      selectedIngredientsCount: selectedIngredients.length,
      selectedIngredients: selectedIngredients.map(ing => ing.name)
    });
    
    if (selectedIngredients.length === 0) {
      console.warn("No ingredients selected, showing alert");
      alert("Please select at least one ingredient!");
      return;
    }

    console.log("Starting API call with ingredients:", selectedIngredients.map(ing => ing.name));
    
    setIsLoading(true);
    setIsLoadingAI(true);
    setShowAIAssistant(true);
    setIsSearchComplete(true);
    setAiResponse(null);
    setRecipe(null);

    // Build query from selected ingredients
    const ingredientNames = selectedIngredients.map((ing) => ing.name).join(", ");
    const query = `What cocktails can I make with ${ingredientNames}?`;
    
    console.log("API query:", query);

    try {
      console.log("Sending API request to /api/chat");
      console.log("Request body:", JSON.stringify({ 
        query: query,
        ingredients: selectedIngredients
      }, null, 2));
      
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          query: query,
          ingredients: selectedIngredients
        }),
      });
      
      console.log("API response received, status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `Server error: ${response.status}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("API response data:", data);
      
      if (data.error) {
        console.error("API returned error:", data.error);
        throw new Error(data.error);
      }
      
      console.log("Setting AI response:", data.response);
      setAiResponse(data.response);
    } catch (error: any) {
      console.error("AI chat error:", error);
      setAiResponse(null);
      
      // Show more specific error message
      const errorMessage = error?.message || "Failed to generate recipe suggestions. Please try again.";
      
      // Check if it's an API key issue
      if (errorMessage.includes("API key") || errorMessage.includes("OPENAI_API_KEY")) {
        alert("OpenAI API key is not configured. Please add OPENAI_API_KEY to your .env.local file.");
      } else {
        alert(errorMessage);
      }
    } finally {
      setIsLoading(false);
      setIsLoadingAI(false);
    }
  };

  const handleAIQuery = async (query: string) => {
    if (!query.trim() || query.length < 3) {
      return;
    }

    setIsLoading(true);
    setIsLoadingAI(true);
    setShowAIAssistant(true);
    setIsSearchComplete(true);
    setAiResponse(null);
    setRecipe(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          query: query,
          ingredients: selectedIngredients
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `Server error: ${response.status}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setAiResponse(data.response);
    } catch (error: any) {
      console.error("AI chat error:", error);
      setAiResponse(null);
      
      const errorMessage = error?.message || "Failed to generate recipe suggestions. Please try again.";
      if (errorMessage.includes("API key") || errorMessage.includes("OPENAI_API_KEY")) {
        alert("OpenAI API key is not configured. Please add OPENAI_API_KEY to your .env.local file.");
      } else {
        alert(errorMessage);
      }
    } finally {
      setIsLoading(false);
      setIsLoadingAI(false);
    }
  };

  const handleViewAIRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleSearchFocus = () => {
    // Hide AI assistant when user focuses on search to clear the stage
    setShowAIAssistant(false);
    setIsSearchComplete(false);
  };

  // Filter ingredients for search bar dropdown only (not for card swap)
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
        <section className="relative flex items-center justify-center px-4 pb-64 pt-32">
          <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-slate-900 max-w-4xl drop-shadow-sm relative z-10" style={{
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.2), 0 4px 16px rgba(0, 0, 0, 0.15)',
          }}>
            Tell us what you have. We'll tell you what to pour.
          </p>
        </section>
      </ScrollReveal>

      {/* The Tool Section */}
      <section className="px-4 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Sticky Search Bar */}
          <div className="relative z-50 overflow-visible">
            <StickySearchBar
            ingredients={ALL_INGREDIENTS}
            onSelectIngredient={handleIngredientClick}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onMixIt={handleMixIt}
            isLoading={isLoading}
            onSearchFocus={handleSearchFocus}
            onAIQuery={handleAIQuery}
          />
          </div>

          {/* AI Assistant - appears below search bar, above CardSwap */}
          {isSearchComplete && (
            <div className="w-full max-w-4xl mx-auto px-4">
              <AIAssistant
                response={aiResponse}
                isLoading={isLoadingAI}
                isVisible={showAIAssistant}
                onViewRecipe={handleViewAIRecipe}
              />
            </div>
          )}

          {/* Scroll Reveal Transition - Between AI Assistant and Card Swap */}
          <ScrollReveal>
            <section className="relative flex items-center justify-center px-4 pt-64 pb-32">
              <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-slate-900 max-w-4xl drop-shadow-sm relative z-10" style={{
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.2), 0 4px 16px rgba(0, 0, 0, 0.15)',
              }}>
                Or browse our curated collections
              </p>
            </section>
          </ScrollReveal>

          {/* Card Swap Section */}
          <div className="mt-32 py-24 relative z-0 flex justify-center">
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
                    ingredients={ALL_INGREDIENTS}
                    selectedIngredients={selectedIngredients}
                    onIngredientClick={handleIngredientClick}
                  />
                </Card>
                <Card customClass="w-full">
                  <MostPopularCard onRecipeClick={setSelectedRecipe} />
                </Card>
                <Card customClass="w-full">
                  <SeasonalCard onRecipeClick={setSelectedRecipe} />
                </Card>
                <Card customClass="w-full">
                  <BasicCard onRecipeClick={setSelectedRecipe} />
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
