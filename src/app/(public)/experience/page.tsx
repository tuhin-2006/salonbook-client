import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Zap,
  Heart,
  Clock,
  Scissors,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/ui/SafeImage";

export default function ExperiencePage() {
  const steps = [
    {
      num: "01",
      title: "In-Depth Consultation & Diagnostics",
      desc: "Every appointment begins with a one-on-one session. We analyze your hair porosity, skin undertones, lifestyle demands, and styling goals before touching a product.",
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
      highlight: "Personalized Treatment Roadmap",
    },
    {
      num: "02",
      title: "Aromatherapy & Tension Release",
      desc: "Warm steam towels steeped in organic essential oils relax your shoulders and scalp. Complimentary specialty espresso, matcha, or organic herbal infusions are served.",
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
      highlight: "Tranquil Studio Atmosphere",
    },
    {
      num: "03",
      title: "Master Application & Artistry",
      desc: "Our resident specialists apply proprietary formulas, multidimensional balayage foils, or clinical skin peels using precision techniques honed over a decade.",
      image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80",
      highlight: "Uncompromising Master Focus",
    },
    {
      num: "04",
      title: "Signature Styling & Post-Care",
      desc: "Walk out with a red-carpet-worthy blowout or glowing skin. You receive a customized at-home maintenance kit to keep your results fresh for weeks.",
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
      highlight: "Sustained Radiance Routine",
    },
  ];

  return (
    <div className="min-h-screen py-12 sm:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Salon Experience</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            More Than An Appointment.{" "}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              A Personal Ritual.
            </span>
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We designed SalonBook to banish rushed haircuts and impersonal salon visits. Here is what your visit looks like.
          </p>
        </div>

        {/* Hero Visual */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-7 rounded-2xl overflow-hidden border border-border shadow-xl relative aspect-[16/10] bg-muted">
            <SafeImage
              src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=85"
              alt="Salon Interior"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="md:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl border border-border bg-card space-y-2">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <Scissors className="w-4 h-4" />
                <span>Zero Double-Booking</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                When you reserve a chair with SalonBook, that stylist is 100% dedicated to you. No rushed transitions or waiting between stations.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-border bg-card space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>Clean & Pure Formulas</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Every shampoo, glaze, facial masque, and oil used in our salons is free from sulfates, parabens, and micro-plastics.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-border bg-card space-y-2">
              <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400 font-bold text-sm">
                <Zap className="w-4 h-4" />
                <span>Seamless Technology</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Book in 30 seconds, reschedule with one tap, and pay effortlessly with Stripe once your service is confirmed.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Steps */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              Your 4-Stage Studio Journey
            </h2>
            <p className="text-xs text-muted-foreground">
              Predictable, pampering excellence from the moment you step through our doors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="bg-card rounded-2xl border border-border overflow-hidden p-6 space-y-4 shadow-sm hover:shadow-md transition-all"
              >
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-muted">
                  <SafeImage
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 w-8 h-8 rounded-lg bg-slate-900/90 text-white font-extrabold text-xs flex items-center justify-center">
                    {step.num}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                    {step.highlight}
                  </span>
                  <h3 className="text-base font-bold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-12 px-6 rounded-3xl bg-secondary/60 border border-border space-y-4 max-w-xl mx-auto">
          <h3 className="text-xl font-bold text-foreground">
            Ready to experience the difference?
          </h3>
          <p className="text-xs text-muted-foreground">
            Explore our curated menu and reserve your appointment with our master stylists.
          </p>
          <Link href="/services">
            <Button variant="gradient" size="lg" className="rounded-xl text-xs font-bold px-8">
              Explore Services & Book
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
