"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Ingredient } from "@/store/useRefrigeratorStore";

interface SearchBarProps {
  ingredients: Ingredient[];
  onSelectIngredient: (ingredient: Ingredient) => void;
}

export function SearchBar({ ingredients, onSelectIngredient }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
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
    <div
      ref={searchRef}
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4"
    >
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              if (filteredIngredients.length > 0) setIsOpen(true);
            }}
            className={cn(
              "w-full pl-12 pr-10 py-3 rounded-full",
              "bg-white border-2 border-gray-200",
              "text-black placeholder-gray-400",
              "focus:outline-none focus:border-black",
              "shadow-lg transition-all"
            )}
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setIsOpen(false);
              }}
              className="absolute right-3 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>

        {isOpen && filteredIngredients.length > 0 && (
          <div className="absolute mt-2 w-full bg-white border-2 border-black rounded-lg shadow-xl max-h-60 overflow-y-auto z-50">
            {filteredIngredients.map((ingredient) => (
              <button
                key={ingredient.id}
                onClick={() => handleSelect(ingredient)}
                className="w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors first:rounded-t-lg last:rounded-b-lg"
              >
                <span className="text-black font-medium">{ingredient.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

