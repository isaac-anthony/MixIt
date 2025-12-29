"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Ingredient } from "@/store/useRefrigeratorStore";

interface EnterpriseSearchBarProps {
  ingredients: Ingredient[];
  onSelectIngredient: (ingredient: Ingredient) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export function EnterpriseSearchBar({
  ingredients,
  onSelectIngredient,
  searchQuery: externalSearchQuery,
  onSearchChange,
}: EnterpriseSearchBarProps) {
  const [internalSearchQuery, setInternalSearchQuery] = useState("");
  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;
  const setSearchQuery = onSearchChange || setInternalSearchQuery;
  const [isOpen, setIsOpen] = useState(false);
  const [filteredIngredients, setFilteredIngredients] = useState<Ingredient[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

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
    <div ref={searchRef} className="relative mx-auto max-w-2xl px-4">
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-6 h-6 w-6 text-gray-400" />
          <input
            type="text"
            placeholder="What ingredients do you have? (e.g., Vodka, Lime...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              if (filteredIngredients.length > 0) setIsOpen(true);
            }}
            className={cn(
              "w-full h-16 pl-14 pr-14 rounded-2xl",
              "bg-white border border-slate-200",
              "text-black placeholder-gray-400 text-lg",
              "focus:outline-none focus:border-black focus:ring-2 focus:ring-black/10",
              "shadow-2xl transition-all"
            )}
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setIsOpen(false);
              }}
              className="absolute right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          )}
        </div>

        {isOpen && filteredIngredients.length > 0 && (
          <div className="absolute mt-4 w-full bg-white border border-slate-200 rounded-2xl shadow-2xl max-h-96 overflow-y-auto z-50">
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
    </div>
  );
}

