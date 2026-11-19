"use client";

import React from "react";
import { motion } from "framer-motion";
import { SafeImage } from "@/components/ui/SafeImage";

interface AuthHeroVisualProps {
  imageSrc: string;
  imageAlt: string;
  eyebrow: string;
  heading: string;
  description: string;
  footerDetail?: string;
  subDetail?: string;
}

export const AuthHeroVisual: React.FC<AuthHeroVisualProps> = ({
  imageSrc,
  imageAlt,
  eyebrow,
  heading,
  description,
  footerDetail = "THE SALONBOOK EXPERIENCE",
  subDetail = "128 MERCER STREET · SOHO, NYC",
}) => {
  return (
    <div className="hidden lg:flex lg:flex-1 relative min-h-full bg-[#F8F5F0] dark:bg-[#150F13] overflow-hidden border-l border-[rgba(90,65,48,0.14)] dark:border-[#C8A879]/20 select-none transition-colors duration-300">
      {/* Background Photography with gentle zoom motion */}
      <motion.div
        initial={{ scale: 1.06, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 w-full h-full"
      >
        <SafeImage
          src={imageSrc}
          alt={imageAlt}
          className="w-full h-full object-cover object-center opacity-85 dark:opacity-60 transition-opacity duration-300"
        />
      </motion.div>

      {/* Atmospheric Multi-layer Gradient Overlay: Harmonizes with Light and Dark themes */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#F8F5F0] via-[#F8F5F0]/70 to-[#F8F5F0]/35 dark:from-[#150F13] dark:via-[#150F13]/75 dark:to-[#150F13]/40 transition-colors duration-300" />
      <div className="absolute inset-0 bg-[#EFE8DF]/40 dark:bg-[#21191D]/40 mix-blend-multiply transition-colors duration-300" />
      <div className="absolute inset-0 bg-radial-vignette opacity-40 dark:opacity-70 transition-opacity duration-300" />

      {/* Subtle Grain Overlay for Editorial Depth */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #000000 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Architectural Hairline Frame */}
      <div className="absolute inset-8 border border-[rgba(90,65,48,0.18)] dark:border-[#C8A879]/20 pointer-events-none rounded-2xl transition-colors duration-300" />

      {/* Editorial Content Container */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between p-12 xl:p-16 text-[#251C1D] dark:text-[#F7F0E8] transition-colors duration-300">
        {/* Top Atelier Coordinates */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#94704C] dark:bg-[#C8A879] animate-pulse" />
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#94704C] dark:text-[#E2C69D] font-bold font-sans">
              NEW YORK ATELIER
            </span>
          </div>
          <span className="text-[10px] tracking-[0.2em] uppercase text-[#786C68] dark:text-[#F7F0E8]/50 font-sans font-semibold">
            EST. 2021
          </span>
        </motion.div>

        {/* Center / Lower Editorial Typography */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35 }}
          className="space-y-5 max-w-xl my-auto"
        >
          <span className="inline-block text-[11px] font-bold tracking-[0.3em] uppercase text-[#94704C] dark:text-[#C8A879]">
            {eyebrow}
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl xl:text-5xl font-bold tracking-tight text-[#251C1D] dark:text-[#F7F0E8] leading-[1.15]">
            {heading}
          </h2>

          <div className="w-12 h-0.5 bg-[#94704C] dark:bg-[#C8A879]" />

          <p className="text-sm xl:text-base text-[#5C4F4A] dark:text-[#F7F0E8]/85 leading-relaxed font-sans max-w-md font-normal">
            {description}
          </p>
        </motion.div>

        {/* Bottom Signature Detail */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="pt-6 border-t border-[rgba(90,65,48,0.16)] dark:border-[#E2C69D]/15 flex items-center justify-between text-xs text-[#5C4F4A] dark:text-[#F7F0E8]/70 font-sans"
        >
          <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#94704C] dark:text-[#E2C69D]">
            {footerDetail}
          </span>
          <span className="text-[10px] tracking-[0.18em] uppercase text-[#786C68] dark:text-[#F7F0E8]/60 font-semibold">
            {subDetail}
          </span>
        </motion.div>
      </div>
    </div>
  );
};
