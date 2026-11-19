"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Home, Sparkles, Scissors, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthHeroVisual } from "@/components/auth/AuthHeroVisual";
import { motion } from "framer-motion";

export default function SignedOutPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] w-full flex flex-col lg:flex-row bg-[#F8F5F0] dark:bg-[#171114] text-[#251C1D] dark:text-[#F7F0E8] transition-colors duration-300">
      {/* Left Column: Signed Out Confirmation Panel */}
      <div className="w-full lg:w-[48%] flex flex-col justify-between px-6 py-8 sm:px-12 md:px-16 lg:px-14 xl:px-20 min-h-[calc(100vh-4rem)]">
        <AuthHeader />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md mx-auto my-auto py-8 space-y-7"
        >
          {/* Atelier Monogram Badge with Gentle Pulse */}
          <div className="relative inline-block">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-16 h-16 rounded-2xl bg-[#251C1D] dark:bg-[#21191D] border border-[rgba(90,65,48,0.2)] dark:border-[rgba(226,198,157,0.25)] flex items-center justify-center shadow-lg relative"
            >
              <Scissors className="w-7 h-7 text-[#C8A879]" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#94704C] dark:bg-[#C8A879] text-[#F8F5F0] dark:text-[#171114] flex items-center justify-center">
                <Check className="w-3 h-3 stroke-[2.5]" />
              </div>
            </motion.div>
          </div>

          {/* Eyebrow & Headline */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#94704C] dark:bg-[#C8A879]" />
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#94704C] dark:text-[#C8A879] font-bold">
                SESSION CONCLUDED
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl xl:text-5xl font-bold text-[#251C1D] dark:text-[#F7F0E8] tracking-tight leading-[1.12]">
              Until We See <br />
              You Again.
            </h1>
            <p className="text-xs sm:text-sm text-[#786C68] dark:text-[#B9AEB0] leading-relaxed font-sans max-w-sm">
              You have successfully signed out of SalonBook. Your next beautiful experience is just one visit away.
            </p>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Link href="/" className="flex-1">
              <Button
                variant="outline"
                className="w-full h-11 text-xs font-semibold rounded-xl border-[rgba(90,65,48,0.2)] dark:border-[rgba(226,198,157,0.2)] hover:bg-[#251C1D] hover:text-[#F8F5F0] dark:hover:bg-[#C8A879] dark:hover:text-[#171114] transition-all"
              >
                <Home className="w-3.5 h-3.5 mr-2" />
                Back to Home
              </Button>
            </Link>

            <Link href="/sign-in" className="flex-1">
              <Button
                className="w-full h-11 text-xs font-bold uppercase tracking-wider rounded-xl bg-[#251C1D] dark:bg-[#C8A879] text-[#F8F5F0] dark:text-[#171114] hover:bg-[#3B2B2D] dark:hover:bg-[#E2C69D] shadow-md transition-all"
              >
                <span>Sign In Again</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5 text-[#C8A879] dark:text-[#171114]" />
              </Button>
            </Link>
          </div>

          {/* Atelier Detail Note */}
          <div className="p-4 rounded-xl border border-[rgba(90,65,48,0.12)] dark:border-[rgba(226,198,157,0.12)] bg-[#FFFFFF]/70 dark:bg-[#21191D]/70 space-y-1.5">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-[#94704C] dark:text-[#C8A879]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Need To Book Ahead?</span>
            </div>
            <p className="text-[11px] text-[#786C68] dark:text-[#B9AEB0] leading-relaxed">
              Appointments open 30 days in advance. Call our SoHo concierge at +1 (646) 892-4410 for urgent reservations.
            </p>
          </div>
        </motion.div>

        <div className="py-2 text-center lg:text-left text-[11px] text-[#786C68]/60 dark:text-[#B9AEB0]/50 tracking-wider">
          © 2026 SalonBook Atelier · 128 Mercer Street, SoHo NYC
        </div>
      </div>

      {/* Right Column: Visual Panel */}
      <AuthHeroVisual
        imageSrc="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1600&q=85"
        imageAlt="SalonBook Styling Sanctuary"
        eyebrow="PRIVATE ATELIER SANCTUARY"
        heading="Beauty Is an Ongoing Ritual."
        description="From bespoke dimensional color to restorative Japanese head spas, we await your return to the chair."
        footerDetail="THE SALONBOOK EXPERIENCE"
        subDetail="SOHO, NEW YORK"
      />
    </div>
  );
}
