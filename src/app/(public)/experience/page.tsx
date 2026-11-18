import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Leaf,
  Droplets,
  Heart,
  Clock,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/shared/SectionHeading";

export default function ExperiencePage() {
  const sensorySteps = [
    {
      num: "01",
      title: "Bespoke Botanical Diagnostic",
      desc: "Every appointment begins with a slow, contemplative dialogue. Our resident specialists analyze bone structure, hair cuticle porosity, scalp microbiome, and skin undertones under calibrated daylight lamps to tailor personalized elixirs.",
      image: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=1000&q=85",
      highlight: "Custom formulation prescription",
    },
    {
      num: "02",
      title: "Sensory Immersion & Aromatherapy",
      desc: "Warm steam towels steeped in organic French lavender and wild eucalyptus are applied to release muscular tensions. Enjoy complimentary organic herbal tisanes, chilled iced matcha, or artisan roast espresso.",
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=85",
      highlight: "Acoustic tranquility & herbal bar",
    },
    {
      num: "03",
      title: "Artisan Hair & Skin Application",
      desc: "Our artists apply proprietary organic clay Balayage blends, wild caviar peptides, and warm basalt stone therapy using surgical micro-techniques honed across prestigious European academies.",
      image: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=1000&q=85",
      highlight: "Unbroken 1-on-1 master focus",
    },
    {
      num: "04",
      title: "The Daylight Reveal & Post-Care",
      desc: "The ritual concludes with signature architectural styling and daylight review. You receive a bespoke home regimen card and concentrated maintenance elixirs to sustain your luminosity for weeks.",
      image: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=1000&q=85",
      highlight: "Sustained radiance regimen",
    },
  ];

  return (
    <div className="min-h-screen py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl space-y-24">
        {/* Editorial Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-[0.2em] bg-gold-500/10 border border-gold-500/30 text-gold-700 dark:text-gold-300">
            <Leaf className="w-3.5 h-3.5 text-sage-600" />
            The Sanctuary Charter
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.15]">
            Where Slow Craft Meets Mindful Restoration
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            SalonBook was conceived as an antidote to hurried modern grooming. Step inside our Madison Avenue sanctuary and discover a transformative sensory experience.
          </p>
        </div>

        {/* Hero Architectural Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-7 rounded-3xl overflow-hidden border border-gold-500/30 shadow-2xl relative aspect-[16/11]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1629882201977-941d8e12f3bc?auto=format&fit=crop&w=1200&q=85"
              alt="SalonBook Sanctuary Architecture"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950/70 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 text-white space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-gold-300">
                Architectural Sanctuary
              </span>
              <p className="font-serif text-xl font-bold">Madison Avenue Flagship</p>
              <p className="text-xs text-zinc-300">Natural travertine stone, limewash plaster & acoustic stillness</p>
            </div>
          </div>

          <div className="md:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-card border border-border/80 shadow-xl space-y-4">
              <span className="text-xs uppercase font-bold tracking-widest text-gold-600 dark:text-gold-400">
                The Philosophy
              </span>
              <h3 className="font-serif text-2xl font-bold text-foreground">
                Artistry Without Compromise
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                We reject industrial assembly-line salons. Each patron is granted an unhurried, private treatment sanctuary where European master colorists and aesthetic dermatologists dedicate 100% focused attention.
              </p>
              <div className="pt-2 flex items-center gap-3 text-xs text-foreground font-semibold">
                <span className="flex items-center gap-1 text-emerald-600">
                  <ShieldCheck className="w-4 h-4" /> 100% Certified Organic
                </span>
                <span>•</span>
                <span>Cruelty-Free Always</span>
              </div>
            </div>
          </div>
        </div>

        {/* The 4-Step Sensory Timeline */}
        <div className="space-y-16">
          <SectionHeading
            badge="The 4-Step Protocol"
            title="The Sensory Journey Progression"
            subtitle="Every treatment follows our unhurried 4-phase methodology to ensure transformative results."
            center
          />

          <div className="space-y-12">
            {sensorySteps.map((step, idx) => (
              <div
                key={idx}
                className={`grid grid-cols-1 md:grid-cols-12 gap-8 items-center ${
                  idx % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`md:col-span-6 rounded-3xl overflow-hidden border border-gold-500/20 shadow-xl aspect-[16/10] ${
                    idx % 2 === 1 ? "md:order-2" : ""
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>

                <div
                  className={`md:col-span-6 space-y-4 ${
                    idx % 2 === 1 ? "md:order-1" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-4xl font-bold text-gold-500/40">
                      {step.num}
                    </span>
                    <Badge variant="outline" className="text-xs font-semibold bg-secondary/50">
                      {step.highlight}
                    </Badge>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Botanical Elixirs Banner */}
        <div className="rounded-3xl bg-forest-950 text-white p-8 sm:p-12 border border-gold-500/20 shadow-2xl relative overflow-hidden">
          <div className="max-w-xl space-y-4 relative z-10">
            <span className="text-xs uppercase font-bold tracking-[0.2em] text-gold-400">
              Clean Formulation Guarantee
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
              Wild Botanical Compounds From Grasse, France
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed">
              We exclusively formulate with wild-harvested French flora, cold-pressed cold argan oils, 24K colloidal gold, and marine caviar extracts. Free of sulfates, silicones, and parabens.
            </p>
            <div className="pt-2">
              <Link href="/services">
                <Button variant="luxury" size="lg" className="rounded-full gap-2 text-xs font-semibold shadow-lg shadow-gold-500/20">
                  <Sparkles className="w-4 h-4" />
                  <span>Explore Botanical Menu</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
