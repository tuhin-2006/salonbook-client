"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  ChevronDown,
  ChevronRight,
  Compass,
  MapPin,
  Coffee,
  Leaf,
  Crown,
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
    title: "Signature French Balayage & Silk Glaze",
    slug: "signature-balayage-silk-glaze",
    category: "Hair",
    description:
      "Hand-painted custom French balayage tailored to your bone structure and complexion, finished with a luminous silk shine glaze and botanical blowout.",
    price: 185,
    durationMinutes: 120,
    images: [
      "https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=1200&q=85",
    ],
    isActive: true,
    specialists: ["Céline Laurent (Creative Director)", "Chloe Moreau"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "demo-s2",
    title: "Caviar & 24K Gold Youth Radiance Facial",
    slug: "caviar-gold-youth-radiance-facial",
    category: "Facial & Skin",
    description:
      "An opulent anti-aging journey featuring wild French caviar extract, 24K colloidal gold infusion, micro-current lifting, and cryo oxygen therapy.",
    price: 220,
    durationMinutes: 90,
    images: [
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=85",
    ],
    isActive: true,
    specialists: ["Dr. Mathis Vance (Aesthetician)"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "demo-s3",
    title: "Deep Tissue Volcanic Basalt Stone Ritual",
    slug: "deep-tissue-volcanic-stone-ritual",
    category: "Massage",
    description:
      "Heated basalt stones infused with organic lavender and frankincense essential oils to melt away chronic muscular tension and restore equilibrium.",
    price: 160,
    durationMinutes: 90,
    images: [
      "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=1200&q=85",
    ],
    isActive: true,
    specialists: ["Siobhan O'Connor (RMT)"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "demo-s4",
    title: "Precision Architectural Cut & Silk Blowout",
    slug: "precision-architectural-cut-silk-blowout",
    category: "Hair",
    description:
      "Geometric precision cutting tailored to hair density and growth direction, scalp detox massage, and signature organic botanical blowout.",
    price: 110,
    durationMinutes: 60,
    images: [
      "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=1200&q=85",
    ],
    isActive: true,
    specialists: ["Céline Laurent"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "demo-s5",
    title: "Russian Gel Manicure & Botanical Spa",
    slug: "russian-gel-manicure-botanical-spa",
    category: "Nails",
    description:
      "Flawless dry e-file cuticle work, structural apex gel reinforcement, organic rose petal hand soak, and cold-pressed argan oil massage.",
    price: 75,
    durationMinutes: 75,
    images: [
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1200&q=85",
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
      "Traditional straight razor precision line work, eucalyptus steam towels, sandalwood pre-shave oil massage, and organic beard conditioning balm.",
    price: 65,
    durationMinutes: 45,
    images: [
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=85",
    ],
    isActive: true,
    specialists: ["Kenzo Takahashi"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const categoriesData = [
  {
    name: "Hair Architecture",
    desc: "Precision French cuts, dimensional balayage and silk glazes.",
    icon: Scissors,
    image: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=800&q=80",
    count: "4 Rituals",
  },
  {
    name: "Facial Radiance",
    desc: "24K colloidal gold, marine caviar and cryo contour lifting.",
    icon: Smile,
    image: "https://images.unsplash.com/photo-1512290900672-1f41d996d926?auto=format&fit=crop&w=800&q=80",
    count: "3 Rituals",
  },
  {
    name: "Restorative Body Spa",
    desc: "Volcanic basalt stones and organic herbal aromatherapy.",
    icon: Flower2,
    image: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=800&q=80",
    count: "2 Rituals",
  },
  {
    name: "Haute Nails",
    desc: "Russian dry e-file apex gel & botanical rose soaks.",
    icon: Sparkles,
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80",
    count: "3 Rituals",
  },
  {
    name: "Couture Makeup",
    desc: "Editorial HD airbrush & bespoke wedding day artistry.",
    icon: Sparkles,
    image: "https://images.unsplash.com/photo-1516914943479-89db7d9ae7f2?auto=format&fit=crop&w=800&q=80",
    count: "2 Rituals",
  },
  {
    name: "Executive Barbering",
    desc: "Traditional straight razor work, steam towels & beard care.",
    icon: Scissors,
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80",
    count: "2 Rituals",
  },
];

const residentMasters = [
  {
    name: "Céline Laurent",
    role: "Creative Director of Hair Architecture",
    origin: "Paris & NYC Atelier Fellow",
    specialty: "French Balayage & Dimensional Silk Gloss",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=85",
    years: "14 yrs experience",
  },
  {
    name: "Dr. Mathis Vance",
    role: "Senior Botanical Aesthetician",
    origin: "Zurich Dermatology Fellow",
    specialty: "Caviar Peptides & Cryo Sculpt",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=85",
    years: "12 yrs experience",
  },
  {
    name: "Siobhan O'Connor",
    role: "Neuromuscular & Spa Therapist",
    origin: "London Institute of Bodywork",
    specialty: "Basalt Stone & Deep Nervous Reset",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=85",
    years: "10 yrs experience",
  },
  {
    name: "Kenzo Takahashi",
    role: "Master Barber & Sculptor",
    origin: "Tokyo & Milan Academy",
    specialty: "Straight Razor Precision & Hot Shave",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=85",
    years: "11 yrs experience",
  },
];

const testimonials = [
  {
    quote:
      "The caviar facial is simply transcendental. The sanctuary feels like a private townhouse on the Seine, and my skin retained an unmistakable glass glow for weeks.",
    author: "Genevieve Dubois",
    role: "Fashion Director, Vogue",
    rating: 5,
    tag: "Caviar & Gold Facial",
  },
  {
    quote:
      "Booking through SalonBook was effortless. Stripe checkout was completely frictionless, and Céline delivered the most natural, dimensional balayage I've had in Manhattan.",
    author: "Camille Laurent",
    role: "Senior Architecture Editor",
    rating: 5,
    tag: "French Balayage",
  },
  {
    quote:
      "The volcanic basalt stone massage is pure therapeutic art. The specialists are master practitioners who listen to your body and tailor every stroke.",
    author: "Marcus Vance",
    role: "Private Equity Partner",
    rating: 5,
    tag: "Hot Stone Therapy",
  },
];

const faqData = [
  {
    q: "How far in advance should I reserve my atelier appointment?",
    a: "We recommend booking 3 to 7 days in advance for weekday appointments and 2 weeks in advance for weekend sessions or bridal packages to secure your preferred resident specialist.",
  },
  {
    q: "How does the Stripe checkout payment work?",
    a: "When you book, your reservation request is registered with zero upfront charge. Once our master artist verifies the schedule and marks it confirmed, a secure Stripe checkout button becomes active in your Patron Lounge.",
  },
  {
    q: "What is your appointment cancellation charter?",
    a: "You may cancel any pending appointment directly through your dashboard with one click. For confirmed sessions, we respectfully request at least 24 hours notice through our concierge desk.",
  },
  {
    q: "Can I request a completely silent or sensory-tailored appointment?",
    a: "Yes, absolutely. During the booking step, you can specify sensory preferences such as silent service, organic tisane refreshments, or specific room temperature.",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Quick Concierge Search States
  const [quickCategory, setQuickCategory] = useState("Hair");
  const [quickTimeWindow, setQuickTimeWindow] = useState("Afternoon");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleOpenBooking = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleQuickConciergeSearch = () => {
    router.push(`/services?category=${encodeURIComponent(quickCategory)}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Architectural Botanical Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 md:pt-16 md:pb-32 bg-gradient-to-b from-secondary/60 via-background to-background">
        {/* Subtle Ambient Background Aura */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-tr from-sage-500/10 via-gold-500/10 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Editorial Typography & Concierge Search */}
            <div className="lg:col-span-7 space-y-6">
              {/* Flagship Atelier Pill */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-forest-900/20 bg-forest-950/5 dark:bg-forest-950/40 text-forest-900 dark:text-sage-300 text-xs font-semibold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Madison Avenue Flagship</span>
                <span className="opacity-40">|</span>
                <span className="text-[11px] uppercase tracking-wider text-gold-600 dark:text-gold-400">Open Today</span>
              </div>

              {/* Grand Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold tracking-tight text-foreground leading-[1.12]">
                Artistry for the Hair. <br />
                <span className="text-gradient-gold">Rest for the Soul.</span>
              </h1>

              {/* Editorial Subtitle */}
              <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
                An architectural beauty sanctuary where European precision meets mindful restoration. Explore bespoke botanical treatments, view real-time artist openings, and reserve your chair in seconds.
              </p>

              {/* Interactive Hero Concierge Search Widget */}
              <div className="p-4 sm:p-5 rounded-3xl bg-card border border-gold-500/25 shadow-2xl space-y-4 max-w-xl">
                <div className="flex items-center justify-between pb-3 border-b border-border/80">
                  <span className="text-xs uppercase font-bold tracking-widest text-gold-600 dark:text-gold-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-gold-500" /> Instant Atelier Concierge
                  </span>
                  <span className="text-[11px] text-muted-foreground">Select Treatment & Timing</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Category Selector */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Desired Ritual
                    </label>
                    <select
                      value={quickCategory}
                      onChange={(e) => setQuickCategory(e.target.value)}
                      className="w-full h-11 px-3 rounded-2xl border border-input bg-background text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                    >
                      <option value="Hair">Hair Styling & Balayage</option>
                      <option value="Facial & Skin">Caviar & 24K Gold Facial</option>
                      <option value="Massage">Volcanic Basalt Stone Therapy</option>
                      <option value="Nails">Russian Apex Gel Manicure</option>
                      <option value="Makeup">Royal Bridal Artistry</option>
                      <option value="Barbering">Executive Beard Sculpt</option>
                    </select>
                  </div>

                  {/* Time Window Selector */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Preferred Time
                    </label>
                    <select
                      value={quickTimeWindow}
                      onChange={(e) => setQuickTimeWindow(e.target.value)}
                      className="w-full h-11 px-3 rounded-2xl border border-input bg-background text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                    >
                      <option value="Morning">Morning (9:00 AM – 12:00 PM)</option>
                      <option value="Afternoon">Afternoon (12:00 PM – 5:00 PM)</option>
                      <option value="Evening">Evening (5:00 PM – 8:00 PM)</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                  <Button
                    onClick={handleQuickConciergeSearch}
                    variant="luxury"
                    className="w-full sm:flex-1 gap-2 rounded-2xl h-12 text-xs font-semibold shadow-md shadow-forest-950/10"
                  >
                    <span>Check Open Appointments</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                  <Link href="/services" className="w-full sm:w-auto">
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto rounded-2xl h-12 text-xs font-semibold border-border/80"
                    >
                      Browse Full Menu
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Trust Metrics */}
              <div className="pt-4 flex flex-wrap items-center gap-6 sm:gap-10 text-xs text-muted-foreground border-t border-border/80">
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                    ))}
                  </div>
                  <span className="font-semibold text-foreground">4.98 / 5</span>
                  <span>(500+ Discerning Patrons)</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Stripe Protected Bookings</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-gold-500" />
                  <span>Paris & London Trained Masters</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Centerpiece with Floating Cards */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Hero Visual: Minimalist Architectural Salon Interior */}
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-gold-500/25">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1629882201977-941d8e12f3bc?auto=format&fit=crop&w=1200&q=85"
                    alt="SalonBook Madison Avenue Sanctuary"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-transparent to-transparent" />

                  {/* Overlaid Bottom Title */}
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-gold-300">
                      Private Salon Suite 04
                    </span>
                    <h3 className="font-serif text-xl font-bold">Madison Avenue Sanctuary</h3>
                    <p className="text-xs text-zinc-300">Travertine stone, limewash & botanical hair spa</p>
                  </div>
                </div>

                {/* Overlaid Floating Card 1: Next Opening */}
                <div className="absolute -top-5 -right-4 sm:-right-6 rounded-2xl glass-luxury p-3.5 shadow-2xl max-w-xs animate-in fade-in slide-in-from-top-4 border-gold-500/30">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[9px] uppercase font-bold tracking-widest text-emerald-600 dark:text-emerald-400">
                        NEXT CURATED OPENING
                      </p>
                      <p className="font-serif text-xs font-bold text-foreground">
                        Today · 2:30 PM with Céline Laurent
                      </p>
                    </div>
                  </div>
                </div>

                {/* Overlaid Floating Card 2: Scent & Hospitality */}
                <div className="absolute -bottom-6 -left-4 sm:-left-6 rounded-2xl glass-luxury p-3.5 shadow-2xl max-w-xs animate-in fade-in slide-in-from-bottom-4 border-gold-500/30">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gold-500/15 text-gold-600 dark:text-gold-400 flex items-center justify-center shrink-0">
                      <Coffee className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[9px] uppercase font-bold tracking-widest text-gold-600 dark:text-gold-400">
                        ATELIER HOSPITALITY
                      </p>
                      <p className="font-serif text-xs font-bold text-foreground">
                        Complimentary Iced Matcha & Espresso
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. The Three Botanical Pillars of Distinction */}
      <section className="py-8 bg-card border-y border-forest-900/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-sage-500/15 text-sage-700 dark:text-sage-300 flex items-center justify-center shrink-0 border border-sage-500/20">
                <Leaf className="w-5 h-5 text-sage-600 dark:text-sage-400" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif font-bold text-sm text-foreground">
                  Wild Botanical Compounds
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Every product is free of harsh sulfates, parabens, and synthetic silicones. Pure organic extracts imported from Grasse, France.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gold-500/15 text-gold-700 dark:text-gold-300 flex items-center justify-center shrink-0 border border-gold-500/20">
                <Award className="w-5 h-5 text-gold-600 dark:text-gold-400" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif font-bold text-sm text-foreground">
                  Master Resident Artisans
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Our specialists hold senior credentials from Paris, Zurich, and London academies, dedicating 100% focused attention to one patron at a time.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                <Heart className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif font-bold text-sm text-foreground">
                  Zero-Stress Reservation & Care
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Instant scheduling with real-time slot checking, flexible cancellations on pending requests, and secure Stripe payment upon approval.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Category Grid ("Find Your Essential Ritual") */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="The Curated Disciplines"
            title="Choose Your Essential Ritual"
            subtitle="Explore our specialized departments. Each discipline is curated with proprietary organic elixirs and dedicated private suites."
            center
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {categoriesData.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={i}
                  href={`/services?category=${encodeURIComponent(cat.name)}`}
                  className="group rounded-3xl border border-border/80 bg-card overflow-hidden hover:border-gold-500/50 hover:shadow-2xl transition-all duration-300 flex flex-col relative"
                >
                  <div className="relative aspect-[16/11] overflow-hidden bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-forest-950/30 to-transparent" />
                    
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-gold-300 border border-gold-500/20">
                        {cat.count}
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gold-500/20 backdrop-blur-sm flex items-center justify-center text-gold-300 border border-gold-400/30">
                          <Icon className="w-4 h-4" />
                        </div>
                        <h4 className="font-serif text-xl font-bold">{cat.name}</h4>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white group-hover:bg-gold-500 group-hover:text-black transition-colors">
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {cat.desc}
                    </p>
                    <span className="text-xs font-semibold text-primary pt-2 inline-flex items-center gap-1 group-hover:underline">
                      Explore offerings →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Asymmetric Editorial Bento Grid ("Atelier Masterpieces") */}
      <section className="py-24 bg-secondary/30 dark:bg-card/40 border-y border-forest-900/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <SectionHeading
              badge="Haute Carte"
              title="Signature Masterpieces"
              subtitle="Award-winning transformations favored by our discerning clientele. Experience true artisan dedication."
            />
            <Link href="/services" className="mb-12">
              <Button variant="outline" className="gap-2 rounded-full border-gold-500/40 hover:bg-gold-500/10">
                View Complete Menu ({curatedFeaturedServices.length}+) <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {curatedFeaturedServices.map((service) => (
              <div
                key={service._id}
                className="group rounded-3xl border border-border/80 bg-card overflow-hidden shadow-sm hover:shadow-2xl hover:border-gold-500/40 transition-all duration-300 flex flex-col"
              >
                {/* Visual Area */}
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={service.images[0]}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="terracotta" className="backdrop-blur-md shadow-md">
                      {service.category}
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 right-3 px-3.5 py-1.5 rounded-full bg-forest-950/85 backdrop-blur-md text-white font-serif font-bold text-sm border border-gold-500/25">
                    {formatCurrency(service.price)}
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gold-600 dark:text-gold-400 font-semibold">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{service.durationMinutes} Minutes</span>
                      <span>•</span>
                      <span>{service.specialists?.[0] || "Master Specialist"}</span>
                    </div>
                    <h3 className="font-serif text-xl font-bold group-hover:text-primary transition-colors line-clamp-1">
                      {service.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border/70 flex items-center justify-between gap-3">
                    <Link
                      href={`/services/${service._id}`}
                      className="text-xs font-semibold text-muted-foreground hover:text-foreground underline underline-offset-4"
                    >
                      Protocol Dossier
                    </Link>
                    <Button
                      variant="luxury"
                      size="sm"
                      onClick={() => handleOpenBooking(service)}
                      className="gap-1.5 rounded-full px-4 text-xs font-semibold shadow-md shadow-forest-950/10"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Reserve Chair
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. The Atelier Experience (4-Step Sensory Timeline) */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="The Process"
            title="The 4-Step Sensory Journey"
            subtitle="Every visit is an unhurried editorial pause designed to renew your personal aesthetic."
            center
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-14 relative">
            <div className="p-6 rounded-3xl bg-card border border-border/80 space-y-4 relative group hover:border-gold-500/40 transition-colors">
              <span className="font-serif text-5xl font-bold text-gold-500/25 group-hover:text-gold-500/40 transition-colors">
                01
              </span>
              <h4 className="font-serif text-lg font-bold text-foreground">
                Bespoke Diagnostic
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                An intimate consultation evaluating skin undertones, hair porosity, bone structure, and lifestyle cadence.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-card border border-border/80 space-y-4 relative group hover:border-gold-500/40 transition-colors">
              <span className="font-serif text-5xl font-bold text-gold-500/25 group-hover:text-gold-500/40 transition-colors">
                02
              </span>
              <h4 className="font-serif text-lg font-bold text-foreground">
                Sensory Immersion
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Warm eucalyptus compresses, artisanal organic tisanes, and custom acoustic frequencies to quiet the senses.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-card border border-border/80 space-y-4 relative group hover:border-gold-500/40 transition-colors">
              <span className="font-serif text-5xl font-bold text-gold-500/25 group-hover:text-gold-500/40 transition-colors">
                03
              </span>
              <h4 className="font-serif text-lg font-bold text-foreground">
                Master Artistry
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Application of hand-mixed botanical elixirs, surgical razor precision, and French painting techniques.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-card border border-border/80 space-y-4 relative group hover:border-gold-500/40 transition-colors">
              <span className="font-serif text-5xl font-bold text-gold-500/25 group-hover:text-gold-500/40 transition-colors">
                04
              </span>
              <h4 className="font-serif text-lg font-bold text-foreground">
                The Radiant Reveal
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Natural daylight styling review, custom aftercare prescription, and sustained home maintenance guidance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Meet the Resident Masters */}
      <section className="py-24 bg-card/60 border-y border-forest-900/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Resident Artists"
            title="The Masters Behind Your Transformation"
            subtitle="Each artist brings international editorial acclaim and dedicated craftsmanship to your session."
            center
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {residentMasters.map((master, idx) => (
              <div
                key={idx}
                className="group rounded-3xl border border-border/80 bg-card overflow-hidden shadow-sm hover:shadow-xl hover:border-gold-500/40 transition-all flex flex-col"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={master.image}
                    alt={master.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-gold-400">
                      {master.origin}
                    </span>
                    <h4 className="font-serif text-lg font-bold">{master.name}</h4>
                    <p className="text-xs text-zinc-300">{master.role}</p>
                  </div>
                </div>

                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-gold-600 dark:text-gold-400 block">
                      Specialty Focus
                    </span>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {master.specialty}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{master.years}</span>
                    <Link
                      href="/services"
                      className="text-primary font-semibold hover:underline"
                    >
                      Book With Artist →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Client Reflections & Press Testimonials */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="The Client Journal"
            title="Cherished Reflections"
            subtitle="Read reflections from patrons who make SalonBook their dedicated sanctuary."
            center
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {testimonials.map((item, i) => (
              <div
                key={i}
                className="p-8 rounded-3xl border border-gold-500/20 bg-card space-y-5 shadow-sm hover:shadow-xl transition-shadow flex flex-col justify-between relative"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(item.rating)].map((_, idx) => (
                        <Star key={idx} className="w-4 h-4 fill-amber-500" />
                      ))}
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-secondary text-muted-foreground">
                      {item.tag}
                    </span>
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

      {/* 8. VIP FAQ Accordion */}
      <section className="py-20 bg-card/40 border-t border-forest-900/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <SectionHeading
            badge="Guest Guidance"
            title="Frequently Asked Inquiries"
            subtitle="Details on reserving, arrival etiquette, and appointment security."
            center
          />

          <div className="space-y-4 mt-10">
            {faqData.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-border bg-card overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between font-serif text-base font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-gold-500 transition-transform duration-200 shrink-0 ml-4 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed animate-in fade-in">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. Cinematic CTA Banner */}
      <section className="py-20 bg-forest-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold-500/15 via-transparent to-transparent" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-2xl relative space-y-6">
          <span className="text-[11px] uppercase tracking-[0.25em] text-gold-400 font-semibold">
            Reserve Your Pause
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.2]">
            Experience the Art of Slow, Editorial Care.
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans">
            Our Madison Avenue sanctuary welcomes you for hair architecture, radiant facial elixirs, and neuromuscular restoration.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link href="/services">
              <Button
                variant="luxury"
                size="lg"
                className="gap-2 rounded-full px-8 text-sm font-semibold shadow-xl shadow-gold-500/20"
              >
                <Sparkles className="w-4 h-4" /> Reserve Your Chair Now
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-8 text-sm font-semibold border-gold-400/40 text-white hover:bg-white/10"
              >
                Join Atelier Society
              </Button>
            </Link>
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
