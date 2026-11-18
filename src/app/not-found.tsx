import React from "react";
import Link from "next/link";
import { Sparkles, Home, Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-20 relative overflow-hidden bg-background">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center font-bold">
          <Scissors className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-7xl font-black text-primary/20 block select-none">
            404
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground -mt-4">
            Page Not Found
          </h1>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
            The page you are looking for doesn&apos;t exist or has been moved. Explore our services or return home.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/">
            <Button variant="gradient" className="gap-2 rounded-xl px-6 text-xs font-bold">
              <Home className="w-4 h-4" />
              <span>Return Home</span>
            </Button>
          </Link>
          <Link href="/services">
            <Button variant="outline" className="gap-2 rounded-xl px-6 text-xs font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Browse Services</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
