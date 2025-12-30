"use client";

import { cn } from "@/lib/utils";

interface SidebarProps {
  onCategorySelect: (category: string | null) => void;
  selectedCategory: string | null;
}

const categories = [
  { id: "spirits", label: "Spirits", icon: "🥃" },
  { id: "mixers", label: "Mixers", icon: "🥤" },
  { id: "garnishes", label: "Garnishes", icon: "🌿" },
  { id: "pantry", label: "Pantry", icon: "🧂" },
];

export function Sidebar({ onCategorySelect, selectedCategory }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-[260px] border-r border-slate-100 bg-white z-30">
      <div className="h-full overflow-y-auto py-6 px-4">
        <div className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
            Categories
          </h2>
          <nav className="space-y-1">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() =>
                  onCategorySelect(
                    selectedCategory === category.id ? null : category.id
                  )
                }
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  selectedCategory === category.id
                    ? "bg-black text-white"
                    : "text-gray-700 hover:bg-gray-50"
                )}
              >
                <span className="text-lg">{category.icon}</span>
                <span>{category.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
}


