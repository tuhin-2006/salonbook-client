import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Clock, Scissors, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/ui/SafeImage";

export default function ExperiencePage() {
  const steps = [
    {
      num: "I",
      title: "Cranial Diagnostic & Bone Structure Mapping",
      desc: "Every appointment begins with a diagnostic dialogue. We analyze your hair porosity, natural fall direction, face symmetry, and daily lifestyle before touching scissors or formulation.",
      image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1200&q=85",
      highlight: "BESPOKE ARCHITECTURAL BLUEPRINT",
    },
    {
      num: "II",
      title: "Botanical Aromatherapy & Acoustic Serenity",
      desc: "Steamed linen towels infused with wild cedarwood, lavender, and eucalyptus soothe cranial tension in our acoustic washroom. Complimentary single-estate matcha or herbal infusions are prepared.",
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85",
      highlight: "DECOMPRESSION SANCTUARY",
    },
    {
      num: "III",
      title: "Master Scissor Architecture & Clean Actives",
      desc: "Our resident artisans execute your tailored service with singular, unhurried focus. No junior apprentices, no station cycling. Hand-painted balayage and clean European formulations.",
      image: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=1200&q=85",
      highlight: "UNCOMPROMISED ARTISAN DEDICATION",
    },
    {
      num: "IV",
      title: "Natural Diffuse Finish & Botanical Regimen",
      desc: "Walk out with radiant hair that retains its architectural shape for months. You receive an at-home botanical maintenance dossier with organic micro-batch care recommendations.",
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=85",
      highlight: "SUSTAINED BIOLOGICAL RADIANCE",
    },
  ];

  return (
    <div className="min-h-screen py-12 sm:py-20 bg-[#F5F1E8] dark:bg-[#151916] text-[#302821] dark:text-[#F5F1E8]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-20">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#B8755B] font-semibold">
            THE ATELIER PHILOSOPHY
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal leading-tight text-[#302821] dark:text-[#F5F1E8]">
            More Than an Appointment. An Unhurried Ritual.
          </h1>
          <p className="text-xs sm:text-sm text-[#302821]/75 dark:text-[#EAE3D6]/75 leading-relaxed max-w-xl mx-auto">
            SalonBook was created to banish conveyor-belt salons. We cultivate quiet spaces where certified master practitioners devote their undivided artistry to your chair.
          </p>
        </div>

        {/* Hero Visual & 3 Tenets */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 overflow-hidden border border-[#302821]/15 bg-[#EAE3D6] relative aspect-[4/3]">
            <SafeImage
              src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=85"
              alt="Salon Interior Sanctuary"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 inset-x-0 p-4 bg-[#26372D]/90 text-[#F5F1E8] backdrop-blur-sm border-t border-[#F5F1E8]/20 flex items-center justify-between text-xs">
              <span className="font-serif tracking-wide">Madison Avenue Atelier · Suite 4</span>
              <span className="text-[9px] uppercase tracking-widest text-[#A4AA91]">Single-Chair Studio</span>
            </div>
          </div>

          <div className="md:col-span-5 space-y-4">
            <div className="p-6 border border-[#302821]/15 dark:border-[#EAE3D6]/15 bg-[#EAE3D6]/40 dark:bg-[#1a201c] space-y-2">
              <div className="flex items-center gap-2 text-[#26372D] dark:text-[#A4AA91] font-semibold text-xs uppercase tracking-wider">
                <Scissors className="w-3.5 h-3.5" />
                <span>Zero Chair Overlapping</span>
              </div>
              <p className="text-xs text-[#302821]/75 dark:text-[#EAE3D6]/75 leading-relaxed">
                When you reserve an experience, your practitioner is 100% focused on you. No leaving you under a dryer to rush to another station.
              </p>
            </div>

            <div className="p-6 border border-[#302821]/15 dark:border-[#EAE3D6]/15 bg-[#EAE3D6]/40 dark:bg-[#1a201c] space-y-2">
              <div className="flex items-center gap-2 text-[#26372D] dark:text-[#A4AA91] font-semibold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% Clean European Actives</span>
              </div>
              <p className="text-xs text-[#302821]/75 dark:text-[#EAE3D6]/75 leading-relaxed">
                Formulations free of synthetic parabens, petroleum sulfates, and artificial perfumes. Cold-pressed botanical extracts only.
              </p>
            </div>

            <div className="p-6 border border-[#302821]/15 dark:border-[#EAE3D6]/15 bg-[#EAE3D6]/40 dark:bg-[#1a201c] space-y-2">
              <div className="flex items-center gap-2 text-[#26372D] dark:text-[#A4AA91] font-semibold text-xs uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5" />
                <span>Honored Time Precision</span>
              </div>
              <p className="text-xs text-[#302821]/75 dark:text-[#EAE3D6]/75 leading-relaxed">
                Your appointment begins on time. Quiet checkout and seamless Stripe payment once services are concluded.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Steps: Architectural Editorial Cards */}
        <div className="space-y-10 pt-8 border-t border-[#302821]/15 dark:border-[#EAE3D6]/15">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#B8755B] font-semibold">
              THE 4-PHASE JOURNEY
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#302821] dark:text-[#F5F1E8]">
              From Diagnostic to Lasting Form
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="bg-[#EAE3D6]/40 dark:bg-[#1a201c] border border-[#302821]/15 dark:border-[#EAE3D6]/15 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#EAE3D6] border-b border-[#302821]/15">
                    <SafeImage
                      src={step.image}
                      alt={step.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 w-8 h-8 bg-[#26372D] text-[#F5F1E8] font-serif font-bold text-xs flex items-center justify-center">
                      {step.num}
                    </div>
                  </div>

                  <div className="p-6 space-y-2">
                    <span className="text-[9px] uppercase tracking-[0.25em] text-[#B8755B] block font-semibold">
                      {step.highlight}
                    </span>
                    <h3 className="font-serif text-xl text-[#302821] dark:text-[#F5F1E8]">
                      {step.title}
                    </h3>
                    <p className="text-xs text-[#302821]/75 dark:text-[#EAE3D6]/75 leading-relaxed pt-1">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Concierge CTA */}
        <div className="text-center py-14 px-8 border border-[#302821]/15 dark:border-[#EAE3D6]/15 bg-[#26372D] text-[#F5F1E8] space-y-5 max-w-2xl mx-auto">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#A4AA91] font-semibold">
            PRIVATE CHAIR RESERVATIONS
          </span>
          <h3 className="font-serif text-3xl font-normal text-[#F5F1E8]">
            Experience Unhurried Restorative Beauty
          </h3>
          <p className="text-xs text-[#EAE3D6]/75 leading-relaxed max-w-md mx-auto">
            Reserve your consultation with our master practitioners. Availability is strictly curated.
          </p>
          <div className="pt-2">
            <Link href="/services">
              <Button
                variant="default"
                size="lg"
                className="rounded-none text-xs uppercase tracking-[0.2em] px-8 py-3.5 bg-[#B8755B] text-[#F5F1E8] hover:bg-[#a0624a]"
              >
                <span>EXPLORE CARTE &amp; RESERVE</span>
                <ArrowRight className="w-3.5 h-3.5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
