"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";

export const AuthHeader: React.FC = () => {
  return (
    <div className="flex items-center justify-between pb-3">
      <Link
        href="/"
        className="group inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
        <span>Return to Atelier Home</span>
      </Link>
      <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold text-accent px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20">
        <ShieldCheck className="w-3 h-3 text-accent" />
        <span>256-Bit TLS Security</span>
      </div>
    </div>
  );
};
