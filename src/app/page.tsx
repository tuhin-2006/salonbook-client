"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Star,
  Clock,
  Heart,
  Calendar,
  CheckCircle2,
  Scissors,
  Smile,
  Flower2,
  Flame,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { formatCurrency } from "@/lib/utils";
import { BookingModal } from "@/components/booking/BookingModal";
import { Service } from "@/types";

const curatedFeaturedServices: Service[] = [
  {
    _id: "demo-s1",
    title: "Signature Balayage & Silk Glaze",
    slug: "signature-balayage-silk-glaze",
    category: "Hair",
    description:
      "Hand-painted custom French balayage tailored to your complexion and bone structure, finished with a luminous silk shine glaze and luxury botanical blowout.",
    price: 185,
    durationMinutes: 120,
    images: [
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
    ],
    isActive: true,
    specialists: ["Elena Vance (Master Colorist)", "Chloe Moreau"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "demo-s2",
    title: "Caviar & 24K Gold Youth Radiance Facial",
    slug: "caviar-gold-youth-radiance-facial",
    category: "Facial & Skin",
    description:
      "An opulent anti-aging journey featuring wild French caviar extract, 24K colloidal gold infusion, micro-current contour lifting, and cryo oxygen therapy.",
    price: 220,
    durationMinutes: 90,
    images: [
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
    ],
    isActive: true,
    specialists: ["Dr. Aurelia Chen (Aesthetician)"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "demo-s3",
    title: "Deep Tissue Aromatherapy Hot Stone Ritual",
    slug: "deep-tissue-aromatherapy-hot-stone-ritual",
    category: "Massage",
    description:
      "Heated basalt stones infused with organic lavender and frankincense essential oils to melt away chronic muscular tension and restore nervous balance.",
    price: 160,
    durationMinutes: 90,
    images: [
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80",
    ],
    isActive: true,
    specialists: ["Alexander Wright (RMT)"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "demo-s4",
    title: "Royal Bridal Couture Glamour Package",
    slug: "royal-bridal-couture-glamour-package",
    category: "Makeup",
    description:
      "The definitive bridal transformation featuring high-definition airbrush makeup, couture hair styling, veil positioning, and luxury mink lash application.",
    price: 320,
    durationMinutes: 150,
    images: [
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80",
    ],
    isActive: true,
    specialists: ["Victoria Sterling (Bridal Director)"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "demo-s5",
    title: "Russian Gel Manicure & Botanical Spa",
    slug: "russian-gel-manicure-botanical-spa",
    category: "Nails",
    description:
      "Flawless dry e-file cuticle work, structural apex gel reinforcement, nourishing organic rose petal soak, and organic argan oil arm massage.",
    price: 75,
    durationMinutes: 75,
    images: [
      "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80",
    ],
    isActive: true,
    specialists: ["Mia Lindqvist"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "demo-s6",
    title: "Executive Beard Sculpt & Hot Towel Shave",
    slug: "executive-beard-sculpt-hot-towel-shave",
    category: "Barbering",
    description:
      "Traditional straight razor precision line work, eucalyptus steam towels, sandalwood pre-shave oil massage, and organic cold-pressed beard balm.",
    price: 65,
    durationMinutes: 45,
    images: [
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80",
    ],
    isActive: true,
    specialists: ["Marco Rossi"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const categoriesData = [
  {
    name: "Hair",
    desc: "Precision cuts, colour and gloss treatments.",
    icon: Scissors,
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Nails",
    desc: "Considered manicures and pedicures.",
    icon: Sparkles,
    image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Facial & Skin",
    desc: "Glow-giving facials and skin rituals.",
    icon: Smile,
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Massage",
    desc: "Restorative bodywork, tailored to you.",
    icon: Flower2,
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Makeup",
    desc: "Soft glam and occasion-ready artistry.",
    icon: Sparkles,
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Barbering",
    desc: "Classic cuts, fades and beard care.",
    icon: Scissors,
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Spa & Wellness",
    desc: "Slow-down rituals for body and mind.",
    icon: Flame,
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Waxing",
    desc: "Gentle, meticulous hair removal.",
    icon: Sparkles,
    image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80",
  },
];

const testimonials = [
  {
    quote:
      "The caviar facial is simply unmatched. The ambiance feels like a private Parisian townhouse, and my skin had a radiant glass glow for weeks.",
    author: "Genevieve Dubois",
    role: "Fashion Director, Vogue",
    rating: 5,
  },
  {
    quote:
      "Booking through SalonBook was effortless. Stripe checkout was instant, and Elena delivered the best balayage I've had in New York.",
    author: "Camille Laurent",
    role: "Architectural Digest Editor",
    rating: 5,
  },
  {
    quote:
      "The hot stone massage is pure transcendental relief. The specialists are master practitioners who listen to your body.",
    author: "Marcus Vance",
    role: "Private Equity Partner",
    rating: 5,
  },
];

export default function HomePage() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenBooking = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section (Strictly matching Assignment 9 specification) */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28 bg-gradient-to-b from-secondary/40 via-background to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Hero Text */}
            <div className="lg:col-span-7 space-y-6">
              {/* Status Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Open today until 8:00 PM</span>
                <span className="opacity-40">|</span>
                <span>📍 Madison Avenue, NYC</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-foreground leading-[1.15]">
                Grooming, done properly.
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
                A neighbourhood barbershop for hair, skin, nails and spa rituals. Browse our menu, request a time that suits you, and let our barbers take care of the rest.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link href="/services">
                  <Button variant="luxury" size="lg" className="gap-2 text-base px-8 shadow-lg shadow-terracotta-600/20">
                    Explore services <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button variant="outline" size="lg" className="text-base px-6 gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    Create an account
                  </Button>
                </Link>
              </div>

              {/* Social Proof Stats */}
              <div className="pt-6 border-t border-border/80 grid grid-cols-3 gap-6 max-w-md">
                <div>
                  <div className="flex items-center gap-1 font-serif text-2xl font-bold text-foreground">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>4.9/5</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">Client rating</p>
                </div>
                <div>
                  <p className="font-serif text-2xl font-bold text-foreground">8k+</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Appointments</p>
                </div>
                <div>
                  <p className="font-serif text-2xl font-bold text-foreground">12</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Salon barbers</p>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual with Mobile Preview Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=85"
                    alt="SalonBook Interior"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>

                {/* Overlaid Mobile Preview Card */}
                <div className="absolute -bottom-6 -left-4 sm:-left-6 rounded-2xl bg-card border border-border p-4 shadow-2xl max-w-xs animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-widest text-emerald-600">
                        NEXT OPENING
                      </p>
                      <p className="font-serif text-sm font-semibold text-foreground">
                        Today · 2:30 PM
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Master Stylist Available
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Trust Indicators Bar (3 Pillars) */}
      <section className="py-6 bg-card border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-serif font-bold text-sm text-foreground">Secure booking</p>
                <p className="text-xs text-muted-foreground">Your details stay private</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gold-500/10 text-gold-600 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="font-serif font-bold text-sm text-foreground">Thoughtful timing</p>
                <p className="text-xs text-muted-foreground">Real openings, no guesswork</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-10 h-10 rounded-full bg-terracotta-500/10 text-terracotta-600 flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <p className="font-serif font-bold text-sm text-foreground">Personal care</p>
                <p className="text-xs text-muted-foreground">One artist, all your attention</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Category Grid ("Find Your Ritual — A category for every kind of pause") */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Curated Catalog"
            title="Find Your Ritual"
            subtitle="A category for every kind of pause. Click any ritual to explore artisan treatments."
            center
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {categoriesData.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={i}
                  href={`/services?category=${encodeURIComponent(cat.name)}`}
                  className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/50 hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-gold-400" />
                        <h4 className="font-serif text-lg font-bold">{cat.name}</h4>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gold-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {cat.desc}
                    </p>
                    <span className="text-[11px] font-semibold text-primary pt-3 inline-flex items-center gap-1 group-hover:underline">
                      Explore rituals →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Featured Treatments Section */}
      <section className="py-24 bg-card/50 border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <SectionHeading
              badge="Signature Services"
              title="Atelier Masterpieces"
              subtitle="Every treatment is tailored to rejuvenate your personal essence using the world's most luxurious botanical compounds."
            />
            <Link href="/services" className="mb-12">
              <Button variant="outline" className="gap-2">
                View Full Catalog ({curatedFeaturedServices.length}+) <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {curatedFeaturedServices.map((service) => (
              <div
                key={service._id}
                className="group rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/40 transition-all flex flex-col"
              >
                {/* Service Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={service.images[0]}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="terracotta" className="backdrop-blur-sm">
                      {service.category}
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white font-semibold text-sm">
                    {formatCurrency(service.price)}
                  </div>
                </div>

                {/* Service Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{service.durationMinutes} Minutes</span>
                      <span>•</span>
                      <span>{service.specialists?.[0] || "Master Specialist"}</span>
                    </div>
                    <h3 className="font-serif text-xl font-semibold group-hover:text-primary transition-colors line-clamp-1">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border flex items-center justify-between gap-3">
                    <Link
                      href={`/services/${service._id}`}
                      className="text-xs font-semibold text-muted-foreground hover:text-foreground underline underline-offset-4"
                    >
                      View Details
                    </Link>
                    <Button
                      variant="luxury"
                      size="sm"
                      onClick={() => handleOpenBooking(service)}
                      className="gap-1.5"
                    >
                      Book Appointment
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Client Testimonials */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Guest Stories"
            title="Cherished Reflections"
            subtitle="Read experiences from our discerning clientele who trust SalonBook for their essential beauty moments."
            center
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {testimonials.map((item, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl border border-border bg-card space-y-4 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(item.rating)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-amber-500" />
                    ))}
                  </div>
                  <p className="font-serif text-base italic leading-relaxed text-foreground">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>
                <div className="pt-4 border-t border-border/60">
                  <p className="font-semibold text-sm text-foreground">{item.author}</p>
                  <p className="text-xs text-muted-foreground">{item.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal
        service={selectedService}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}