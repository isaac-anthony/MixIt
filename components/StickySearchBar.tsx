"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Ingredient } from "@/store/useRefrigeratorStore";
import { useRefrigeratorStore } from "@/store/useRefrigeratorStore";
import { Button } from "@/components/ui/button";
import { motion, useAnimation } from "framer-motion";

interface StickySearchBarProps {
  ingredients: Ingredient[];
  onSelectIngredient: (ingredient: Ingredient) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onMixIt: () => void;
  isLoading: boolean;
  onSearchFocus?: () => void;
  onAIQuery?: (query: string) => void;
}

export function StickySearchBar({
  ingredients,
  onSelectIngredient,
  searchQuery: externalSearchQuery,
  onSearchChange,
  onMixIt,
  isLoading,
  onSearchFocus,
  onAIQuery,
}: StickySearchBarProps) {
  const { ingredients: selectedIngredients } = useRefrigeratorStore();
  
  // Debug: Log ingredient changes
  useEffect(() => {
    console.log("Selected ingredients changed:", selectedIngredients.length, selectedIngredients.map(ing => ing.name));
  }, [selectedIngredients]);
  const [internalSearchQuery, setInternalSearchQuery] = useState("");
  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;
  const setSearchQuery = onSearchChange || setInternalSearchQuery;
  const searchRef = useRef<HTMLDivElement>(null);
  const pulseControls = useAnimation();
  const pingControls = useAnimation();
  const previousCountRef = useRef(selectedIngredients.length);

  // Pulse animation loop
  useEffect(() => {
    const pulseSequence = async () => {
      while (true) {
        await pulseControls.start({
          boxShadow: '0 0 20px rgba(124, 58, 237, 0.3)',
          transition: { duration: 1.5, ease: 'easeInOut' }
        });
        await new Promise(resolve => setTimeout(resolve, 1500));
        await pulseControls.start({
          boxShadow: '0 0 20px rgba(124, 58, 237, 0.5)',
          transition: { duration: 1.5, ease: 'easeInOut' }
        });
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    };
    pulseSequence();
  }, [pulseControls]);

  // Ping animation when ingredient is added
  useEffect(() => {
    if (selectedIngredients.length > previousCountRef.current) {
      pingControls.start({
        scale: [1, 1.1, 1],
        boxShadow: [
          '0 0 20px rgba(124, 58, 237, 0.3)',
          '0 0 40px rgba(124, 58, 237, 0.6)',
          '0 0 20px rgba(124, 58, 237, 0.3)'
        ],
        transition: { duration: 0.5, ease: 'easeOut' }
      });
    }
    previousCountRef.current = selectedIngredients.length;
  }, [selectedIngredients.length, pingControls]);



  return (
    <div
      id="search-section"
      className="py-4 backdrop-blur-md shadow-sm relative z-50 overflow-visible"
      style={{
        background: 'rgba(255, 255, 255, 0.1)'
      }}
    >
      <div ref={searchRef} className="relative mx-auto max-w-4xl px-4 z-50">
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <div className="relative flex items-center group">
              <Search className="absolute left-6 h-6 w-6 text-gray-400 z-10" />
              <input
                type="text"
                placeholder="Ask me anything about cocktails or search ingredients... (e.g., 'What can I make with vodka?')"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.keyCode === 13)) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("Enter key pressed", { 
                      searchQuery: searchQuery.trim(),
                      selectedIngredientsCount: selectedIngredients.length 
                    });
                    
                    // If there's a search query, use it for AI query
                    if (searchQuery.trim().length > 0) {
                      console.log("Calling onAIQuery with search query");
                      onAIQuery?.(searchQuery.trim());
                    } 
                    // Otherwise, if there are selected ingredients, use Mix It
                    else if (selectedIngredients.length > 0) {
                      console.log("Calling onMixIt from Enter key");
                      onMixIt();
                    } else {
                      console.log("No search query or ingredients selected");
                    }
                  }
                }}
                onFocus={() => {
                  // Notify parent that search is focused (hide AI assistant)
                  onSearchFocus?.();
                }}
                className={cn(
                  "w-full h-16 pl-14 pr-24 rounded-2xl relative z-10",
                  "bg-white border-2 border-transparent",
                  "text-black text-lg placeholder:text-gray-400",
                  "focus:outline-none focus:border-transparent focus:ring-0",
                  "focus:shadow-[0_0_40px_-10px_rgba(168,85,247,0.4)] focus:scale-[1.005]",
                  "focus:placeholder:opacity-50",
                  "shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all duration-200"
                )}
              />
              {/* Keyboard Shortcut Badge */}
              {!searchQuery && (
                <div className="absolute right-4 flex items-center gap-2 z-20 pointer-events-none">
                  <kbd className="text-xs text-gray-400 border border-gray-200 rounded px-1.5 py-0.5 font-mono">
                    ⌘ K
                  </kbd>
                </div>
              )}
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                  }}
                  className="absolute right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-20"
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              )}
            </div>
          </div>

          {/* Mix It Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 1 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0"
          >
            <motion.div
              animate={pulseControls}
              style={{
                boxShadow: '0 0 20px rgba(124, 58, 237, 0.3)',
              }}
            >
              <motion.div
                animate={pingControls}
              >
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log("Mix It button clicked", { 
                        selectedIngredientsCount: selectedIngredients.length, 
                        isLoading,
                        ingredients: selectedIngredients.map(ing => ing.name)
                      });
                      if (selectedIngredients.length > 0 && !isLoading) {
                        onMixIt();
                      } else {
                        console.warn("Button click ignored:", { 
                          hasIngredients: selectedIngredients.length > 0,
                          isLoading 
                        });
                      }
                    }}
                    disabled={selectedIngredients.length === 0 || isLoading}
                    className={cn(
                      "h-16 px-8 rounded-xl text-lg font-bold tracking-tight leading-none",
                      "flex items-center justify-center",
                      "bg-black hover:bg-slate-900 text-white",
                      "shadow-[0_4px_16px_rgba(0,0,0,0.3),0_8px_24px_rgba(0,0,0,0.25)]",
                      "transition-all duration-200",
                      "[&:disabled]:!opacity-100 [&:disabled]:!bg-black",
                      selectedIngredients.length === 0 && "cursor-not-allowed"
                    )}
                  >
              <span className="whitespace-nowrap">{isLoading ? "Mixing..." : "Mix It"}</span>
            </Button>
              </motion.div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}

