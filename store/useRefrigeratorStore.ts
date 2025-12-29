import { create } from 'zustand';

export interface Ingredient {
  id: string;
  name: string;
  image: string;
  category: 'spirits' | 'mixers' | 'garnishes' | 'pantry';
}

interface RefrigeratorState {
  ingredients: Ingredient[];
  addIngredient: (ingredient: Ingredient) => void;
  removeIngredient: (id: string) => void;
  clearRefrigerator: () => void;
}

export const useRefrigeratorStore = create<RefrigeratorState>((set) => ({
  ingredients: [],
  addIngredient: (ingredient) =>
    set((state) => {
      // Prevent duplicates
      if (state.ingredients.some((ing) => ing.id === ingredient.id)) {
        return state;
      }
      return { ingredients: [...state.ingredients, ingredient] };
    }),
  removeIngredient: (id) =>
    set((state) => ({
      ingredients: state.ingredients.filter((ing) => ing.id !== id),
    })),
  clearRefrigerator: () => set({ ingredients: [] }),
}));

