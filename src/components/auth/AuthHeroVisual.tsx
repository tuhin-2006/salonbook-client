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
    <div className="hidden lg:flex lg:flex-1 relative min-h-full bg-[#171114] overflow-hidden border-l border-[#E2C69D]/15 select-none">
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
          className="w-full h-full object-cover object-center"
        />
      </motion.div>

      {/* Atmospheric Multi-layer Gradient Overlay: Deep Burgundy & Charcoal Tones */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#171114] via-[#171114]/55 to-[#171114]/40" />
      <div className="absolute inset-0 bg-[#21191D]/30 mix-blend-multiply" />
      <div className="absolute inset-0 bg-radial-vignette opacity-60" />

      {/* Subtle Grain Overlay for Editorial Depth */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Architectural Hairline Frame */}
      <div className="absolute inset-8 border border-[#E2C69D]/15 pointer-events-none rounded-2xl" />

      {/* Editorial Content Container */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between p-12 xl:p-16 text-[#F7F0E8]">
        {/* Top Atelier Coordinates */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C8A879] animate-pulse" />
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#E2C69D]/90 font-medium font-sans">
              NEW YORK ATELIER
            </span>
          </div>
          <span className="text-[10px] tracking-[0.2em] uppercase text-[#F7F0E8]/50 font-sans">
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
          <span className="inline-block text-[11px] font-semibold tracking-[0.3em] uppercase text-[#C8A879]">
            {eyebrow}
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl xl:text-5xl font-normal tracking-tight text-[#F7F0E8] leading-[1.15]">
            {heading}
          </h2>

          <div className="w-12 h-px bg-[#C8A879]/50" />

          <p className="text-sm xl:text-base text-[#F7F0E8]/80 leading-relaxed font-sans max-w-md font-light">
            {description}
          </p>
        </motion.div>

        {/* Bottom Signature Detail */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="pt-6 border-t border-[#E2C69D]/15 flex items-center justify-between text-xs text-[#F7F0E8]/70 font-sans"
        >
          <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#E2C69D]/90">
            {footerDetail}
          </span>
          <span className="text-[10px] tracking-[0.18em] uppercase text-[#F7F0E8]/50">
            {subDetail}
          </span>
        </motion.div>
      </div>
    </div>
  );
};
