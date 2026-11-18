import React from "react";
import { Sparkles } from "lucide-react";

export default function RootLoading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div className="w-14 h-14 rounded-full border-2 border-gold-500/20 border-t-gold-500 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-gold-500 animate-pulse" />
        </div>
      </div>
      <p className="font-serif text-sm tracking-widest uppercase text-muted-foreground animate-pulse">
        L&apos;Étoile Atelier & Sanctuary
      </p>
    </div>
  );
}
