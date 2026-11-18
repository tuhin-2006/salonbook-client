import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Clock, Scissors, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/ui/SafeImage";

export default function ExperiencePage() {
  const steps = [
    {
      num: "1",
      title: "One-on-One Personalized Consultation",
      desc: "Every appointment begins with an unhurried diagnostic dialogue. We analyze your hair porosity, cranial bone structure, facial symmetry, and daily lifestyle before touching scissors or formulation.",
      image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1200&q=85",
      highlight: "BESPOKE ARCHITECTURAL BLUEPRINT",
    },
    {
      num: "2",
      title: "Aromatherapy Preparation & Acoustic Serenity",
      desc: "Steamed linen towels infused with wild cedarwood, lavender, and eucalyptus soothe cranial tension in our quiet washroom. Complimentary single-estate matcha or herbal infusions are prepared.",
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85",
      highlight: "DECOMPRESSION SANCTUARY",
    },
    {
      num: "3",
      title: "Master Scissor Craft & Clean Actives",
      desc: "Our resident artisans execute your tailored service with singular, unhurried focus. No junior apprentices, no station cycling. Hand-painted balayage, clean European formulations, and precision straight-razor detailing.",
      image: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=1200&q=85",
      highlight: "UNCOMPROMISED ARTISAN DEDICATION",
    },
    {
      num: "4",
      title: "Refined Natural Finish & Home Care Regimen",
      desc: "Walk out with radiant hair that retains its architectural shape for months. You receive an at-home botanical maintenance dossier with organic micro-batch care recommendations.",
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=85",
      highlight: "SUSTAINED BIOLOGICAL RADIANCE",
    },
  ];

  return (
    <div className="min-h-screen py-10 sm:py-20 bg-[#FAF7F2] dark:bg-[#170F13] text-[#231C1E] dark:text-[#FAF7F2] transition-colors duration-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-16 sm:space-y-20">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-bold">
            THE BOUTIQUE PHILOSOPHY
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold leading-tight text-[#231C1E] dark:text-[#FAF7F2]">
            More Than an Appointment. Grooming Done Properly.
          </h1>
          <p className="text-sm text-[#231C1E]/75 dark:text-[#FAF7F2]/75 leading-relaxed max-w-xl mx-auto">
            SalonBook was created to banish conveyor-belt salons. We cultivate quiet spaces where certified master practitioners devote their undivided artistry to your chair.
          </p>
        </div>

        {/* Hero Visual & 3 Tenets */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 overflow-hidden rounded-3xl border-4 border-[#FFFFFF] dark:border-[#22161B] bg-[#EAE3D6] dark:bg-[#2D1D24] relative aspect-[4/3] shadow-xl">
            <SafeImage
              src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=85"
              alt="Salon Interior Sanctuary"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 inset-x-0 p-4 bg-[#231C1E]/90 text-[#FAF7F2] backdrop-blur-md border-t border-[#FAF7F2]/10 flex items-center justify-between text-xs">
              <span className="font-serif font-bold">Madison Avenue Atelier · Suite 4</span>
              <span className="text-[10px] uppercase tracking-wider text-[#C5A880] font-semibold">Dedicated Chair Studio</span>
            </div>
          </div>

          <div className="md:col-span-5 space-y-4">
            <div className="p-6 rounded-2xl border border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10 bg-[#FFFFFF] dark:bg-[#22161B] shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-[#3B1F2B] dark:text-[#C5A880] font-bold text-xs uppercase tracking-wider">
                <Scissors className="w-4 h-4 text-[#C5A880]" />
                <span>Zero Chair Overlapping</span>
              </div>
              <p className="text-xs text-[#231C1E]/75 dark:text-[#FAF7F2]/75 leading-relaxed">
                When you reserve an experience, your practitioner is 100% focused on you. No leaving you under a dryer to rush to another station.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10 bg-[#FFFFFF] dark:bg-[#22161B] shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-[#3B1F2B] dark:text-[#C5A880] font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>100% Clean European Actives</span>
              </div>
              <p className="text-xs text-[#231C1E]/75 dark:text-[#FAF7F2]/75 leading-relaxed">
                Formulations free of synthetic parabens, petroleum sulfates, and artificial perfumes. Cold-pressed botanical extracts only.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10 bg-[#FFFFFF] dark:bg-[#22161B] shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-[#3B1F2B] dark:text-[#C5A880] font-bold text-xs uppercase tracking-wider">
                <Clock className="w-4 h-4 text-[#C5A880]" />
                <span>Honored Time Precision</span>
              </div>
              <p className="text-xs text-[#231C1E]/75 dark:text-[#FAF7F2]/75 leading-relaxed">
                Your appointment begins on time. Quiet checkout and seamless Stripe payment once services are concluded.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Steps */}
        <div className="space-y-10 pt-8 border-t border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-bold">
              THE 4-PHASE JOURNEY
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#231C1E] dark:text-[#FAF7F2]">
              From Diagnostic to Lasting Form
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="bg-[#FFFFFF] dark:bg-[#22161B] border border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#EAE3D6] dark:bg-[#2D1D24]">
                    <SafeImage
                      src={step.image}
                      alt={step.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 w-8 h-8 rounded-xl bg-[#3B1F2B] dark:bg-[#C5A880] text-[#FAF7F2] dark:text-[#170F13] font-serif font-bold text-xs flex items-center justify-center shadow-sm">
                      {step.num}
                    </div>
                  </div>

                  <div className="p-6 space-y-2">
                    <span className="text-[10px] uppercase tracking-wider text-[#C5A880] block font-bold">
                      {step.highlight}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-[#231C1E] dark:text-[#FAF7F2]">
                      {step.title}
                    </h3>
                    <p className="text-xs text-[#231C1E]/75 dark:text-[#FAF7F2]/75 leading-relaxed pt-1">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Concierge CTA */}
        <div className="text-center py-12 px-8 rounded-3xl bg-[#3B1F2B] text-[#FAF7F2] space-y-5 max-w-2xl mx-auto shadow-xl">
          <span className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-bold">
            PRIVATE CHAIR RESERVATIONS
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#FAF7F2]">
            Experience Unhurried Restorative Beauty
          </h3>
          <p className="text-xs sm:text-sm text-[#FAF7F2]/80 leading-relaxed max-w-md mx-auto">
            Reserve your consultation with our master practitioners. Availability is strictly curated.
          </p>
          <div className="pt-2">
            <Link href="/services">
              <Button
                size="lg"
                className="rounded-xl text-xs font-bold uppercase tracking-wider px-8 py-3.5 bg-[#C5A880] text-[#231C1E] hover:bg-[#d6bc96] shadow-md"
              >
                <span>Explore Menu &amp; Reserve</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
