import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-24 bg-[#F5F1E8] dark:bg-[#151916] text-[#302821] dark:text-[#F5F1E8]">
      <div className="max-w-md w-full text-center space-y-6">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#B8755B] font-semibold block">
          404 — DOSSIER UNLOCATED
        </span>

        <h1 className="font-serif text-4xl sm:text-5xl font-normal leading-tight">
          Page Not Located
        </h1>

        <p className="text-xs text-[#302821]/70 dark:text-[#EAE3D6]/70 max-w-sm mx-auto leading-relaxed">
          The requested page or treatment archive does not exist or has been relocated in the atelier directory.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/">
            <Button
              variant="default"
              className="rounded-none px-6 text-xs uppercase tracking-wider bg-[#26372D] text-[#F5F1E8] hover:bg-[#343D2E]"
            >
              <span>RETURN TO ATELIER</span>
              <ArrowRight className="w-3.5 h-3.5 ml-2" />
            </Button>
          </Link>
          <Link href="/services">
            <Button
              variant="outline"
              className="rounded-none px-6 text-xs uppercase tracking-wider border-[#302821]/20"
            >
              BROWSE CARTE
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
