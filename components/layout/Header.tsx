"use client";

import { useState, useRef, useEffect } from "react";
import { Search, ShoppingBag, User, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Ingredient } from "@/store/useRefrigeratorStore";
import { useRefrigeratorStore } from "@/store/useRefrigeratorStore";

interface HeaderProps {
  ingredients: Ingredient[];
  onSelectIngredient: (ingredient: Ingredient) => void;
  onRefrigeratorClick: () => void;
}

export function Header({
  ingredients,
  onSelectIngredient,
  onRefrigeratorClick,
}: HeaderProps) {
  const { ingredients: selectedIngredients } = useRefrigeratorStore();
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
    <header className="sticky top-4 z-40 mx-auto max-w-7xl px-4 ml-[280px]">
      <div className="relative">
        <div
          className={cn(
            "flex items-center gap-4 rounded-full border border-slate-100 bg-white/80 backdrop-blur-md px-4 py-3 shadow-sm"
          )}
        >
          {/* Brand */}
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">Mixit</span>
          </div>

          {/* Search */}
          <div ref={searchRef} className="relative flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (filteredIngredients.length > 0) setIsOpen(true);
                }}
                className={cn(
                  "w-full rounded-full border-0 bg-transparent pl-10 pr-10 py-2 text-sm",
                  "text-black placeholder-gray-400",
                  "focus:outline-none"
                )}
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setIsOpen(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-3 w-3 text-gray-400" />
                </button>
              )}
            </div>

            {isOpen && filteredIngredients.length > 0 && (
              <div className="absolute mt-2 w-full bg-white border border-slate-100 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
                {filteredIngredients.map((ingredient) => (
                  <button
                    key={ingredient.id}
                    onClick={() => handleSelect(ingredient)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg text-sm"
                  >
                    <span className="text-black font-medium">{ingredient.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Refrigerator Button */}
            <button
              onClick={onRefrigeratorClick}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ShoppingBag className="h-5 w-5 text-gray-700" />
              {selectedIngredients.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
                  {selectedIngredients.length}
                </span>
              )}
            </button>

            {/* Profile */}
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <User className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

