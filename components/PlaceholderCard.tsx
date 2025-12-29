"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface PlaceholderCardProps {
  title: string;
}

export function PlaceholderCard({ title }: PlaceholderCardProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  return (
    <div className="relative w-full max-w-4xl mx-auto rounded-[48px] border border-white/20 bg-white/10 backdrop-blur-2xl shadow-[0_30px_80px_rgba(0,0,0,0.2),0_0_60px_rgba(168,85,247,0.25)] overflow-hidden z-10 h-full flex flex-col">
      {/* Collapsible Header */}
      <div className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/10 transition-colors">
        <h2 className="text-xl font-bold text-black">{title}</h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
        >
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-slate-600" />
          </motion.div>
        </button>
      </div>

      {/* Collapsible Content */}
      <motion.div
        initial={false}
        animate={{
          maxHeight: isExpanded ? "calc(100% - 60px)" : "0px",
          opacity: isExpanded ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden flex-1"
      >
        <div className="flex p-6 gap-6 h-full overflow-y-auto scrollbar-hide">
          {/* Left Sidebar - Separate Rounded Container */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white/30 rounded-[32px] overflow-hidden h-full p-6 shadow-[0_8px_24px_rgba(0,0,0,0.1),0_0_20px_rgba(168,85,247,0.1)] border border-white/20 backdrop-blur-md">
              <div className="flex flex-col gap-2 h-full">
                <div className="text-xs font-semibold text-slate-900 uppercase tracking-[0.15em] mb-4 px-2 flex items-center h-6">
                  Categories
                </div>
                <div className="text-sm text-slate-600 text-center py-8">
                  Coming soon...
                </div>
              </div>
            </div>
          </div>

          {/* Right Table */}
          <div className="flex-1 min-w-0">
            <div className="bg-white/30 rounded-[32px] overflow-hidden h-full p-1 shadow-[0_8px_24px_rgba(0,0,0,0.1),0_0_20px_rgba(168,85,247,0.1)] border border-white/20 backdrop-blur-md">
              {/* Scrollable Content */}
              <div className="max-h-[800px] overflow-y-auto scrollbar-hide">
                {/* Table Header */}
                <div className="grid grid-cols-[50px_1fr_100px_50px] gap-4 px-4 py-4 border-b border-white/10 sticky top-0 z-20 backdrop-blur-md bg-white/50">
                  <div className="text-xs font-semibold text-slate-600 uppercase tracking-[0.1em] leading-tight flex items-center h-6">
                    Image
                  </div>
                  <div className="text-xs font-semibold text-slate-600 uppercase tracking-[0.1em] leading-tight flex items-center h-6">
                    Name
                  </div>
                  <div className="text-xs font-semibold text-slate-600 uppercase tracking-[0.1em] leading-tight flex items-center h-6">
                    Category
                  </div>
                  <div className="text-xs font-semibold text-slate-600 uppercase tracking-[0.1em] leading-tight text-center flex items-center justify-center h-6">
                    Status
                  </div>
                </div>

                {/* Empty State */}
                <div className="flex flex-col items-center justify-center h-full min-h-[400px] py-16">
                  <p className="text-lg text-slate-600 font-medium">
                    {title} content coming soon...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

