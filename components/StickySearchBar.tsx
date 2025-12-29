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
}

export function StickySearchBar({
  ingredients,
  onSelectIngredient,
  searchQuery: externalSearchQuery,
  onSearchChange,
  onMixIt,
  isLoading,
}: StickySearchBarProps) {
  const { ingredients: selectedIngredients } = useRefrigeratorStore();
  const [internalSearchQuery, setInternalSearchQuery] = useState("");
  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;
  const setSearchQuery = onSearchChange || setInternalSearchQuery;
  const [isOpen, setIsOpen] = useState(false);
  const [filteredIngredients, setFilteredIngredients] = useState<Ingredient[]>([]);
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

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = ingredients.filter((ing) =>
        ing.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredIngredients(filtered);
      setIsOpen(filtered.length > 0);
    } else {
      setFilteredIngredients([]);
      setIsOpen(false);
    }
  }, [searchQuery, ingredients]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (ingredient: Ingredient) => {
    onSelectIngredient(ingredient);
    setSearchQuery("");
    setIsOpen(false);
  };

  return (
    <div
      id="search-section"
      className="py-4 backdrop-blur-md shadow-sm relative z-50 overflow-visible"
      style={{
        background: 'rgba(255, 255, 255, 0.1)'
      }}
    >
      <div ref={searchRef} className="relative mx-auto max-w-4xl px-4 z-50 overflow-visible">
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 z-50 overflow-visible">
            <div className="relative flex items-center group">
              <Search className="absolute left-6 h-6 w-6 text-gray-400 z-10" />
              <input
                type="text"
                placeholder="What ingredients do you have? (e.g., Vodka, Lime...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (filteredIngredients.length > 0) setIsOpen(true);
                }}
                className={cn(
                  "w-full h-16 pl-14 pr-24 rounded-2xl relative z-10",
                  "bg-white border-2 border-slate-900",
                  "text-black text-lg placeholder:text-gray-400",
                  "focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20",
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
                    setIsOpen(false);
                  }}
                  className="absolute right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-20"
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              )}
            </div>

            {isOpen && filteredIngredients.length > 0 && (
              <div className="absolute mt-4 w-full bg-white/30 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl max-h-96 overflow-y-auto z-[100] ring-1 ring-black/5" style={{ position: 'absolute', zIndex: 100 }}>
                {filteredIngredients.map((ingredient) => (
                  <button
                    key={ingredient.id}
                    onClick={() => handleSelect(ingredient)}
                    className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors first:rounded-t-2xl last:rounded-b-2xl flex items-center gap-4"
                  >
                    <img
                      src={ingredient.image}
                      alt={ingredient.name}
                      className="w-10 h-10 rounded object-cover"
                    />
                    <div>
                      <p className="text-black font-medium">{ingredient.name}</p>
                      <p className="text-sm text-gray-500 capitalize">{ingredient.category}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mix It Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
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
                  onClick={onMixIt}
                  disabled={selectedIngredients.length === 0 || isLoading}
                  className={cn(
                    "h-16 px-8 rounded-xl text-lg font-medium whitespace-nowrap relative",
                    "bg-slate-900 hover:bg-slate-800 text-white",
                    "shadow-[0_4px_16px_rgba(0,0,0,0.2),0_8px_24px_rgba(0,0,0,0.15)]",
                    "transition-all duration-200",
                    selectedIngredients.length === 0 && "opacity-50 cursor-not-allowed"
                  )}
                >
            {selectedIngredients.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-black text-xs font-semibold">
                {selectedIngredients.length}
              </span>
            )}
            {isLoading ? "Mixing..." : "Mix It"}
          </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

