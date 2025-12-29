'use client';

import { motion } from 'framer-motion';

interface FloatingHeaderProps {
  onGetStarted?: () => void;
}

export function FloatingHeader({ onGetStarted }: FloatingHeaderProps) {
  const scrollToSearch = () => {
    const searchSection = document.getElementById('search-section');
    if (searchSection) {
      searchSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-6 px-6 py-3 rounded-full border border-white/20 bg-white/10 backdrop-blur-md shadow-lg">
        {/* Logo */}
        <div className="font-bold tracking-tighter text-xl text-slate-900">
          MixIt
        </div>
        
        {/* Links */}
        <nav className="flex items-center gap-6">
          <button
            onClick={scrollToSearch}
            className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
          >
            Pricing
          </button>
          <button
            onClick={scrollToSearch}
            className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
          >
            About
          </button>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
            Login
          </button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onGetStarted || scrollToSearch}
            className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-900 transition-colors shadow-md hover:shadow-lg shadow-purple-500/20"
          >
            Sign Up
          </motion.button>
        </div>
      </div>
    </header>
  );
}

