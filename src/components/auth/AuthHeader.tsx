"use client";

import React from "react";
import Link from "next/link";
import { Scissors } from "lucide-react";

export const AuthHeader: React.FC = () => {
  return (
    <div className="flex items-center justify-between pb-4">
      {/* Brand Logo with Atelier Badge */}
      <Link
        href="/"
        className="group inline-flex items-center gap-3 transition-opacity hover:opacity-90"
      >
        <div className="w-10 h-10 rounded-xl bg-[#251C1D] dark:bg-[#C8A879] text-[#F7F0E8] dark:text-[#171114] flex items-center justify-center shadow-sm border border-[#C8A879]/30 transition-transform duration-300 group-hover:scale-105">
          <Scissors className="w-4 h-4 text-[#C8A879] dark:text-[#171114]" />
        </div>
        <div>
          <span className="font-serif text-2xl font-bold tracking-tight text-[#251C1D] dark:text-[#F7F0E8] block leading-none">
            SalonBook
          </span>
          <span className="text-[10px] uppercase tracking-[0.22em] text-[#94704C] dark:text-[#C8A879] font-medium block mt-1">
            SoHo Atelier · New York
          </span>
        </div>
      </Link>
    </div>
  );
};
