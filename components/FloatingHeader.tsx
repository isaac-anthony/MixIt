'use client';

import { motion } from 'framer-motion';

interface FloatingHeaderProps {
  onGetStarted?: () => void;
}

export function FloatingHeader({ onGetStarted }: FloatingHeaderProps) {
  const scrollToSection = (sectionId: string, offset: number = 0) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-6 px-6 py-3 rounded-full border border-white/20 bg-white/10 backdrop-blur-md shadow-lg">
        {/* Logo */}
        <button
          onClick={scrollToTop}
          className="font-bold tracking-tighter text-xl text-slate-900 hover:opacity-80 transition-opacity cursor-pointer"
        >
          MixIt
        </button>
        
        {/* Links */}
        <nav className="flex items-center gap-6">
          <button
            onClick={() => scrollToSection('search-section', 200)}
            className="text-sm font-medium text-slate-800 hover:text-black transition-colors"
          >
            Find Recipes
          </button>
          <button
            onClick={() => scrollToSection('collections-section', 200)}
            className="text-sm font-medium text-slate-800 hover:text-black transition-colors"
          >
            Collections
          </button>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="text-sm font-medium text-slate-800 hover:text-black transition-colors">
            Login
          </button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onGetStarted || (() => scrollToSection('search-section', 200))}
            className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-900 transition-colors shadow-md hover:shadow-lg shadow-purple-500/20"
          >
            Sign Up
          </motion.button>
        </div>
      </div>
    </header>
  );
}

