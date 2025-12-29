"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import CountUp from "@/components/ui/CountUp";
import { Button } from "@/components/ui/button";

export function Hero() {
  const [iteration, setIteration] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToSearch = () => {
    const searchSection = document.getElementById('search-section');
    if (searchSection) {
      searchSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCountEnd = () => {
    // When count reaches 999, restart after a brief delay
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIteration(prev => prev + 1);
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Dot Grid Pattern */}
      <div 
        className="absolute inset-0 -z-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(128, 128, 128, 0.07) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(128, 128, 128, 0.07) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)',
        }}
      />
      
      {/* Aurora Mesh Gradients */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="bg-purple-400/35 w-[900px] h-[900px] blur-[160px] rounded-full absolute -top-40 -left-20" />
        <div className="bg-blue-400/30 w-[800px] h-[800px] blur-[150px] rounded-full absolute top-20 right-0" />
        <div className="bg-purple-300/25 w-[700px] h-[700px] blur-[140px] rounded-full absolute bottom-0 left-1/2 -translate-x-1/2" />
      </div>

      {/* Hero Animation Video - Full Screen */}
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
          style={{
            opacity: 0.9,
            objectPosition: 'center center',
            maskImage: 'linear-gradient(to bottom, black 0%, black 50%, rgba(0,0,0,0.8) 70%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 50%, rgba(0,0,0,0.8) 70%, transparent 100%)',
          }}
        >
          <source src="/hero-splash.mp4" type="video/mp4" />
        </video>
      </div>
      
      {/* Typography - Below the Video */}
      <div className="relative z-10 text-center px-4 w-full mt-auto pt-8 pb-16">
        {/* Primary Tagline - Now the Main H1 */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl sm:text-5xl font-bold text-white mb-6 tracking-tighter"
        >
          Never think about how to make a drink again.
        </motion.h1>
        
        {/* Counter Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center justify-center gap-3 text-6xl font-semibold tabular-nums tracking-tight mb-6"
        >
          <motion.span
            layout
            className="inline-block min-w-[4ch] text-right text-slate-900 font-bold"
            style={{
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.2), 0 4px 16px rgba(0, 0, 0, 0.15), 0 0 0 rgba(255, 255, 255, 0.5)',
            }}
          >
            <CountUp
              key={iteration}
              to={999}
              from={0}
              duration={3}
              delay={iteration === 0 ? 0.5 : 0}
              className="text-slate-900 font-bold"
              onEnd={handleCountEnd}
            />
          </motion.span>
          <span className="text-slate-900 text-2xl sm:text-3xl md:text-4xl font-light ml-4 font-bold" style={{
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.2), 0 4px 16px rgba(0, 0, 0, 0.15)',
          }}>
            Endless Ideas, Endless Drinks
          </span>
        </motion.div>

        {/* Get Started Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Button
            onClick={scrollToSearch}
            className="h-14 px-8 rounded-full text-lg font-medium shadow-lg hover:shadow-xl active:shadow-md transition-shadow"
          >
            Get Started
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

