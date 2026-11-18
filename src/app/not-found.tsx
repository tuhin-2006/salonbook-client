import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Compass, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-20 relative overflow-hidden bg-background">
      {/* Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-lg w-full text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-700 dark:text-gold-300 text-xs font-semibold">
          <Compass className="w-3.5 h-3.5 text-gold-500" />
          <span>Sanctuary Directory Notice</span>
        </div>

        <div className="space-y-2">
          <span className="font-serif text-8xl font-black text-gold-500/20 block select-none">
            404
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground -mt-6">
            Chamber Not Located
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            The page or ritual you are seeking has either moved or belongs to an unlisted wing of our Madison Avenue sanctuary.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link href="/">
            <Button variant="luxury" className="gap-2 rounded-full px-6 text-xs font-semibold shadow-lg shadow-gold-500/20">
              <Home className="w-4 h-4" />
              <span>Return to Atelier Home</span>
            </Button>
          </Link>
          <Link href="/services">
            <Button variant="outline" className="gap-2 rounded-full px-6 text-xs font-semibold border-border/80">
              <Sparkles className="w-4 h-4 text-gold-500" />
              <span>Browse Services Menu</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
