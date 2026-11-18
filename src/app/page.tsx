"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Clock,
  Star,
  CheckCircle2,
  Calendar,
  Sparkles,
  MapPin,
  ShieldCheck,
  Heart,
  Scissors,
  Check,
  ChevronRight,
  ChevronDown,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { BookingModal } from "@/components/booking/BookingModal";
import { SafeImage } from "@/components/ui/SafeImage";
import { api } from "@/lib/api";
import { Service, ApiResponse } from "@/types";

// Curated Fallback Services conforming to the specification
const curatedServices: Service[] = [
  {
    _id: "srv-1",
    title: "Signature Balayage & Silk Glossing",
    slug: "signature-balayage-gloss",
    category: "Hair",
    description:
      "Hand-painted multidimensional balayage customized to face architecture, organic botanical glossing infusion, and unhurried styling finish.",
    price: 195,
    durationMinutes: 120,
    images: [
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1200&q=85",
    ],
    isActive: true,
    specialists: ["Elena Vance", "Chloe Moreau"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "srv-2",
    title: "Executive Straight-Razor Shave & Scalp Detox",
    slug: "executive-shave-scalp-detox",
    category: "Barbering",
    description:
      "Eucalyptus hot towel preparation, badger lathering, Japanese feather blade detailing, and botanical rosemary chilled tonic.",
    price: 85,
    durationMinutes: 50,
    images: [
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=85",
    ],
    isActive: true,
    specialists: ["Marcus Sterling"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "srv-3",
    title: "Hydra-Botanical Deep Recovery Facial",
    slug: "hydra-botanical-facial",
    category: "Facial & Skin",
    description:
      "Ultrasonic micro-cleansing, fruit enzyme exfoliation, cold-pressed plant squalane infusion, and cryo-sculpting lifting massage.",
    price: 155,
    durationMinutes: 75,
    images: [
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=85",
    ],
    isActive: true,
    specialists: ["Sofia Rossi"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "srv-4",
    title: "Warm Basalt Stone & Cedarwood Massage",
    slug: "basalt-stone-massage",
    category: "Massage",
    description:
      "Warm basalt river stones aligned along meridian points, Mediterranean cedarwood and lavender oils, relieving deep muscle tension.",
    price: 165,
    durationMinutes: 90,
    images: [
      "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=1200&q=85",
    ],
    isActive: true,
    specialists: ["Liam Thorne"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "srv-5",
    title: "Botanical Restorative Manicure & Hand Therapy",
    slug: "botanical-restorative-manicure",
    category: "Nails",
    description:
      "Dry diamond e-file cuticle therapy, natural builder strengthening treatment, warm jojoba compress, and clean nontoxic lacquer.",
    price: 85,
    durationMinutes: 60,
    images: [
      "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1200&q=85",
    ],
    isActive: true,
    specialists: ["Mia Lindqvist"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "srv-6",
    title: "Aromatherapy Hydro-Thermal Spa Ritual",
    slug: "aromatherapy-spa-ritual",
    category: "Spa & Wellness",
    description:
      "Full body mineral exfoliation followed by lavender and eucalyptus steam hydrotherapy, herbal scalp oil wrap, and peaceful resting tea.",
    price: 150,
    durationMinutes: 90,
    images: [
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85",
    ],
    isActive: true,
    specialists: ["Chloe Moreau", "Liam Thorne"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// The 8 Canonical Category Cards as explicitly instructed in the A9 Specification
const canonicalCategories = [
  {
    name: "Hair",
    tagline: "Precision cuts, colour and gloss treatments.",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
    count: "12 Treatments",
  },
  {
    name: "Nails",
    tagline: "Considered manicures and pedicures.",
    image:
      "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80",
    count: "6 Treatments",
  },
  {
    name: "Facial & Skin",
    tagline: "Glow-giving facials and skin rituals.",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
    count: "8 Treatments",
  },
  {
    name: "Massage",
    tagline: "Restorative bodywork, tailored to you.",
    image:
      "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=800&q=80",
    count: "7 Treatments",
  },
  {
    name: "Makeup",
    tagline: "Soft glam and occasion-ready artistry.",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80",
    count: "5 Treatments",
  },
  {
    name: "Barbering",
    tagline: "Classic cuts, fades and beard care.",
    image:
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80",
    count: "9 Treatments",
  },
  {
    name: "Spa & Wellness",
    tagline: "Slow-down rituals for body and mind.",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    count: "6 Treatments",
  },
  {
    name: "Waxing",
    tagline: "Gentle, meticulous hair removal.",
    image:
      "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80",
    count: "4 Treatments",
  },
];

// Resident Artists / Specialists
const residentBarbers = [
  {
    name: "Marcus Sterling",
    role: "Master Barber & Lead Groomer",
    experience: "14 Years in Soho & London",
    specialty: "Traditional straight-razor hot towel shaves & precision fades",
    image:
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Elena Vance",
    role: "Master Colorist & Stylist",
    experience: "Trained in Paris & Florence",
    specialty: "Lived-in multidimensional balayage & organic glossing",
    image:
      "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Sofia Rossi",
    role: "Licensed Dermal Esthetician",
    experience: "Certified Swiss Dermo-Practitioner",
    specialty: "Lymphatic drainage, ultrasound peel & barrier restoration",
    image:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Liam Thorne",
    role: "Senior Neuromuscular Therapist",
    experience: "Stockholm Holistic Institute",
    specialty: "Basalt heated stone therapy & deep postural tension release",
    image:
      "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=800&q=80",
  },
];

// Client Testimonials
const clientTestimonials = [
  {
    quote:
      "Marcus gave me the sharpest cut and cleanest shave I've had in New York. The atmosphere is warm, calm, and zero rush. SalonBook is a breath of fresh air.",
    author: "Julian Reynolds",
    service: "Executive Straight-Razor Shave",
    rating: 5,
    location: "Tribeca, NYC",
  },
  {
    quote:
      "Elena understands colour like a true painter. The balayage grew out seamlessly over 4 months with zero brassiness. The booking system was instant and effortless.",
    author: "Camille Laurent",
    service: "Signature Balayage & Gloss",
    rating: 5,
    location: "Upper East Side, NYC",
  },
  {
    quote:
      "The basalt stone massage melted away months of corporate desk stiffness. Spotlessly clean, peaceful treatment rooms, and completely transparent pricing.",
    author: "David Vance",
    service: "Basalt Stone & Cedarwood Massage",
    rating: 5,
    location: "Midtown Manhattan",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>(curatedServices);
  const [activeTab, setActiveTab] = useState<string>("All");
  const [bookingService, setBookingService] = useState<Service | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get<ApiResponse<{ services: Service[] }>>(
          "/services?limit=12&isActive=true"
        );
        if (res.data.success && res.data.data.services.length > 0) {
          setServices(res.data.data.services);
        }
      } catch (err) {
        console.warn("Using curated services fallback:", err);
      }
    };
    fetchServices();
  }, []);

  const handleBookNow = (service: Service) => {
    setBookingService(service);
    setModalOpen(true);
  };

  const filteredServices =
    activeTab === "All"
      ? services.slice(0, 6)
      : services.filter((s) => s.category.toLowerCase() === activeTab.toLowerCase());

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF7F2] dark:bg-[#170F13] text-[#231C1E] dark:text-[#FAF7F2] transition-colors duration-200">
      {/* 
        =======================================================================
        1. HERO SECTION (Exactly per Specification):
        - Status pill: 🟢 Open today until 8:00 PM | 📍 Madison Avenue, NYC
        - Headline: "Grooming, done properly." (Serif font)
        - Subtitle: "A neighbourhood barbershop for hair, skin, nails and spa rituals..."
        - CTA Buttons: Explore services → & Create an account (outline with calendar icon)
        - Social proof: 4.9/5 rating, 8k+ Appointments, 12 Salon barbers
        - Hero Visual: Modern salon interior with overlaid mobile preview card
        =======================================================================
      */}
      <section className="relative pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10 overflow-hidden bg-gradient-to-b from-[#FAF7F2] via-[#FAF7F2] to-[#F5EFEB]/50 dark:from-[#170F13] dark:via-[#170F13] dark:to-[#22161B]">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Typography & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Status Pill */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#FFFFFF] dark:bg-[#22161B] border border-[#3B1F2B]/15 dark:border-[#FAF7F2]/15 shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-semibold text-[#231C1E] dark:text-[#FAF7F2] tracking-tight">
                  Open today until 8:00 PM
                </span>
                <span className="text-[#3B1F2B]/30 dark:text-[#FAF7F2]/30">•</span>
                <span className="text-xs text-[#231C1E]/75 dark:text-[#FAF7F2]/75 flex items-center gap-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#C5A880]" />
                  Madison Avenue, NYC
                </span>
              </div>

              {/* Serif Headline */}
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#231C1E] dark:text-[#FAF7F2] leading-[1.12]">
                Grooming, done properly.
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-[#231C1E]/80 dark:text-[#FAF7F2]/75 leading-relaxed font-normal max-w-xl">
                A neighbourhood barbershop for hair, skin, nails and spa rituals.
                Browse our menu, request a time that suits you, and let our barbers take care of the rest.
              </p>

              {/* CTA Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <Link href="/services">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#3B1F2B] dark:bg-[#C5A880] hover:bg-[#4A2035] dark:hover:bg-[#d6bc96] text-[#FAF7F2] dark:text-[#170F13] font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 group"
                  >
                    <span>Explore services</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>

                <Link href="/sign-up">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto px-7 py-3.5 rounded-xl border border-[#3B1F2B]/25 dark:border-[#FAF7F2]/20 text-[#231C1E] dark:text-[#FAF7F2] bg-[#FFFFFF]/70 dark:bg-[#22161B] hover:bg-[#FFFFFF] dark:hover:bg-[#2D1D24] font-semibold text-sm transition-all flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4 text-[#C5A880]" />
                    <span>Create an account</span>
                  </Button>
                </Link>
              </div>

              {/* Social Proof / Stats Bar */}
              <div className="pt-6 border-t border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10 grid grid-cols-3 gap-4 max-w-lg">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-serif text-2xl font-bold text-[#231C1E] dark:text-[#FAF7F2]">4.9/5</span>
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-[#231C1E]/70 dark:text-[#FAF7F2]/70 font-medium mt-0.5">
                    Client rating
                  </p>
                </div>

                <div>
                  <span className="font-serif text-2xl font-bold text-[#231C1E] dark:text-[#FAF7F2] block">
                    8k+
                  </span>
                  <p className="text-xs text-[#231C1E]/70 dark:text-[#FAF7F2]/70 font-medium mt-0.5">
                    Appointments
                  </p>
                </div>

                <div>
                  <span className="font-serif text-2xl font-bold text-[#231C1E] dark:text-[#FAF7F2] block">
                    12
                  </span>
                  <p className="text-xs text-[#231C1E]/70 dark:text-[#FAF7F2]/70 font-medium mt-0.5">
                    Salon barbers
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual with Overlaid Mobile Preview Card */}
            <div className="lg:col-span-5 relative">
              {/* Outer decorative card frame */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-[#FFFFFF] dark:border-[#22161B] bg-[#EAE3D6] dark:bg-[#1E1317] aspect-[4/5] sm:aspect-[5/6] lg:aspect-[4/5]">
                <SafeImage
                  src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1400&q=85"
                  alt="Modern boutique barbershop and salon interior"
                  className="w-full h-full object-cover scale-[1.02] hover:scale-105 transition-transform duration-700"
                />

                {/* Subtle warm gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#231C1E]/70 via-transparent to-transparent pointer-events-none" />

                {/* Overlaid Badge Top Right */}
                <div className="absolute top-4 right-4 bg-[#FFFFFF]/90 dark:bg-[#1E1317]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#FAF7F2]/20 text-[11px] font-semibold text-[#231C1E] dark:text-[#FAF7F2] shadow-sm flex items-center gap-1.5">
                  <Scissors className="w-3.5 h-3.5 text-[#3B1F2B] dark:text-[#C5A880]" />
                  <span>Est. 2018 · NYC</span>
                </div>

                {/* Overlaid Mobile Preview Card showing "NEXT OPENING: Today · 2:30 PM" */}
                <div className="absolute bottom-5 left-5 right-5 bg-[#FFFFFF]/95 dark:bg-[#22161B]/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-[#FAF7F2]/20 shadow-xl text-[#231C1E] dark:text-[#FAF7F2] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                        NEXT OPENING: Today · 2:30 PM
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-[#C5A880] bg-[#C5A880]/15 px-2 py-0.5 rounded-md">
                      Chair 02
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-serif text-base font-bold text-[#231C1E] dark:text-[#FAF7F2]">
                        Classic Cut &amp; Straight-Razor Detailing
                      </h4>
                      <p className="text-xs text-[#231C1E]/70 dark:text-[#FAF7F2]/70">
                        Marcus Sterling · 45 mins
                      </p>
                    </div>
                    <span className="font-serif text-base font-bold text-[#3B1F2B] dark:text-[#C5A880]">
                      $65
                    </span>
                  </div>

                  <div className="pt-1 flex items-center justify-between gap-3 border-t border-[#231C1E]/10 dark:border-[#FAF7F2]/10">
                    <div className="flex items-center gap-1.5 text-xs text-[#231C1E]/80 dark:text-[#FAF7F2]/80">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Instant confirmation</span>
                    </div>
                    <Link href="/services">
                      <span className="text-xs font-semibold text-[#3B1F2B] dark:text-[#C5A880] hover:underline flex items-center gap-1">
                        Reserve Slot <ArrowRight className="w-3 h-3" />
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 
        =======================================================================
        2. TRUST INDICATORS BAR (Exactly per Specification)
        - 🛡️ Secure booking: Your details stay private
        - ⏱️ Thoughtful timing: Real openings, no guesswork
        - 🤍 Personal care: One artist, all your attention
        =======================================================================
      */}
      <section className="bg-[#FFFFFF] dark:bg-[#1E1317] border-b border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10 py-7 transition-colors">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Indicator 1 */}
            <div className="flex items-center gap-3.5 px-3 py-2">
              <div className="w-11 h-11 rounded-xl bg-[#FAF7F2] dark:bg-[#2D1D24] border border-[#3B1F2B]/15 dark:border-[#FAF7F2]/15 flex items-center justify-center shrink-0 text-[#3B1F2B] dark:text-[#C5A880] shadow-sm">
                <ShieldCheck className="w-5 h-5 text-[#3B1F2B] dark:text-[#C5A880]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#231C1E] dark:text-[#FAF7F2] tracking-tight">
                  Secure booking
                </h4>
                <p className="text-xs text-[#231C1E]/70 dark:text-[#FAF7F2]/70 font-normal">
                  Your details stay private
                </p>
              </div>
            </div>

            {/* Indicator 2 */}
            <div className="flex items-center gap-3.5 px-3 py-2 border-t md:border-t-0 md:border-l border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10">
              <div className="w-11 h-11 rounded-xl bg-[#FAF7F2] dark:bg-[#2D1D24] border border-[#3B1F2B]/15 dark:border-[#FAF7F2]/15 flex items-center justify-center shrink-0 text-[#3B1F2B] dark:text-[#C5A880] shadow-sm">
                <Clock className="w-5 h-5 text-[#3B1F2B] dark:text-[#C5A880]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#231C1E] dark:text-[#FAF7F2] tracking-tight">
                  Thoughtful timing
                </h4>
                <p className="text-xs text-[#231C1E]/70 dark:text-[#FAF7F2]/70 font-normal">
                  Real openings, no guesswork
                </p>
              </div>
            </div>

            {/* Indicator 3 */}
            <div className="flex items-center gap-3.5 px-3 py-2 border-t md:border-t-0 md:border-l border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10">
              <div className="w-11 h-11 rounded-xl bg-[#FAF7F2] dark:bg-[#2D1D24] border border-[#3B1F2B]/15 dark:border-[#FAF7F2]/15 flex items-center justify-center shrink-0 text-[#3B1F2B] dark:text-[#C5A880] shadow-sm">
                <Heart className="w-5 h-5 text-[#3B1F2B] dark:text-[#C5A880]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#231C1E] dark:text-[#FAF7F2] tracking-tight">
                  Personal care
                </h4>
                <p className="text-xs text-[#231C1E]/70 dark:text-[#FAF7F2]/70 font-normal">
                  One artist, all your attention
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 
        =======================================================================
        3. CATEGORY GRID ("Find Your Ritual — A category for every kind of pause")
        8 Interactive Category Cards
        =======================================================================
      */}
      <section className="py-16 sm:py-24 bg-[#FAF7F2] dark:bg-[#170F13] border-b border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10 transition-colors">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#C5A880] block">
                EXPLORE BY CATEGORY
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#231C1E] dark:text-[#FAF7F2]">
                Find Your Ritual
              </h2>
              <p className="text-sm text-[#231C1E]/75 dark:text-[#FAF7F2]/75 max-w-lg">
                A category for every kind of pause. Select a ritual below to explore treatments, transparent durations, and pricing.
              </p>
            </div>

            <Link href="/services">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-[#3B1F2B]/20 dark:border-[#FAF7F2]/20 text-[#231C1E] dark:text-[#FAF7F2] hover:bg-[#FFFFFF] dark:hover:bg-[#22161B] text-xs font-semibold"
              >
                <span>View all treatments</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>

          {/* 8 Category Cards Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {canonicalCategories.map((cat) => (
              <Link
                key={cat.name}
                href={`/services?category=${encodeURIComponent(cat.name)}`}
                className="group relative rounded-2xl overflow-hidden bg-[#FFFFFF] dark:bg-[#22161B] border border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10 hover:border-[#3B1F2B]/30 dark:hover:border-[#C5A880]/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Visual Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#EAE3D6] dark:bg-[#2D1D24]">
                  <SafeImage
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#231C1E]/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  
                  {/* Category Pill Tag */}
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FFFFFF]/90 dark:bg-[#170F13]/90 text-[#231C1E] dark:text-[#FAF7F2] backdrop-blur-md shadow-sm">
                    {cat.name}
                  </span>

                  {/* Count indicator */}
                  <span className="absolute bottom-3 right-3 text-[10px] font-medium text-[#FAF7F2] bg-[#231C1E]/60 px-2 py-0.5 rounded-md backdrop-blur-sm">
                    {cat.count}
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#231C1E] dark:text-[#FAF7F2] group-hover:text-[#3B1F2B] dark:group-hover:text-[#C5A880] transition-colors flex items-center justify-between">
                      <span>{cat.name}</span>
                      <ArrowRight className="w-4 h-4 text-[#C5A880] opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                    </h3>
                    <p className="text-xs text-[#231C1E]/70 dark:text-[#FAF7F2]/70 leading-relaxed mt-1">
                      {cat.tagline}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10 flex items-center justify-between text-xs font-semibold text-[#3B1F2B] dark:text-[#C5A880]">
                    <span>Browse Rituals</span>
                    <span className="text-[11px] text-[#C5A880]">Book →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 
        =======================================================================
        4. FEATURED SIGNATURE TREATMENTS (Popular Menu with 1-Click Booking)
        =======================================================================
      */}
      <section className="py-16 sm:py-24 bg-[#FFFFFF] dark:bg-[#1E1317] border-b border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10 transition-colors">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#C5A880] block">
              MOST REQUESTED RITUALS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#231C1E] dark:text-[#FAF7F2]">
              Featured Salon Menu
            </h2>
            <p className="text-sm text-[#231C1E]/75 dark:text-[#FAF7F2]/75 leading-relaxed">
              Every appointment includes an unhurried consultation, cruelty-free botanical formulas, and private dedicated chair time.
            </p>

            {/* Filter Tabs */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-2">
              {["All", "Hair", "Barbering", "Facial & Skin", "Massage", "Spa & Wellness"].map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      activeTab === tab
                        ? "bg-[#3B1F2B] dark:bg-[#C5A880] text-[#FAF7F2] dark:text-[#170F13] shadow-sm"
                        : "bg-[#FAF7F2] dark:bg-[#2D1D24] text-[#231C1E]/75 dark:text-[#FAF7F2]/75 hover:bg-[#F5EFEB] dark:hover:bg-[#38252E]"
                    }`}
                  >
                    {tab}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Treatments Cards Grid (3 Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <div
                key={service._id}
                className="group rounded-2xl bg-[#FAF7F2] dark:bg-[#22161B] border border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10 hover:border-[#3B1F2B]/30 dark:hover:border-[#C5A880]/50 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Image Container with Category Badge */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#EAE3D6] dark:bg-[#2D1D24]">
                    <SafeImage
                      src={
                        service.images && service.images[0]
                          ? service.images[0]
                          : "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80"
                      }
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Category Pill Overlay */}
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FFFFFF]/90 dark:bg-[#170F13]/90 backdrop-blur-md text-[#231C1E] dark:text-[#FAF7F2] shadow-sm">
                      {service.category}
                    </span>

                    {/* Price Tag Overlay */}
                    <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold bg-[#3B1F2B] dark:bg-[#C5A880] text-[#FAF7F2] dark:text-[#170F13] shadow-sm">
                      {formatCurrency(service.price)}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-[#231C1E]/70 dark:text-[#FAF7F2]/70 font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>⏱ {service.durationMinutes} min</span>
                      <span className="text-[#3B1F2B]/30 dark:text-[#FAF7F2]/30">•</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-medium">At the salon</span>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-[#231C1E] dark:text-[#FAF7F2] group-hover:text-[#3B1F2B] dark:group-hover:text-[#C5A880] transition-colors leading-snug">
                      {service.title}
                    </h3>

                    <p className="text-xs text-[#231C1E]/75 dark:text-[#FAF7F2]/75 line-clamp-2 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* Specialists & Actions */}
                <div className="p-6 pt-0 space-y-3">
                  {service.specialists && service.specialists.length > 0 && (
                    <p className="text-[11px] text-[#231C1E]/70 dark:text-[#FAF7F2]/60 font-medium border-t border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10 pt-3">
                      By {service.specialists.join(", ")}
                    </p>
                  )}

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleBookNow(service)}
                      className="flex-1 rounded-xl bg-[#3B1F2B] dark:bg-[#C5A880] hover:bg-[#4A2035] dark:hover:bg-[#d6bc96] text-[#FAF7F2] dark:text-[#170F13] text-xs font-semibold py-2.5 shadow-sm"
                    >
                      Book Now
                    </Button>
                    <Link href={`/services/${service._id}`}>
                      <Button
                        variant="outline"
                        className="rounded-xl border-[#3B1F2B]/20 dark:border-[#FAF7F2]/20 text-[#231C1E] dark:text-[#FAF7F2] hover:bg-[#FFFFFF] dark:hover:bg-[#2D1D24] text-xs font-medium py-2.5 px-3"
                      >
                        Details ↗
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View Complete Menu Link */}
          <div className="mt-12 text-center">
            <Link href="/services">
              <Button
                variant="outline"
                size="lg"
                className="rounded-xl border-[#3B1F2B]/25 dark:border-[#FAF7F2]/20 text-[#231C1E] dark:text-[#FAF7F2] hover:bg-[#FAF7F2] dark:hover:bg-[#22161B] font-semibold text-xs uppercase tracking-wider px-8"
              >
                <span>View Complete Service Menu (30+ Offerings)</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 
        =======================================================================
        5. WHY SALONBOOK / THE BOUTIQUE STANDARDS (BENTO GRID)
        =======================================================================
      */}
      <section className="py-16 sm:py-24 bg-[#FAF7F2] dark:bg-[#170F13] border-b border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10 transition-colors">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#C5A880] block">
              THE SALONBOOK DIFFERENCE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#231C1E] dark:text-[#FAF7F2]">
              Why Clients Choose Our Chairs
            </h2>
            <p className="text-sm text-[#231C1E]/75 dark:text-[#FAF7F2]/75 leading-relaxed">
              We reimagined modern salon booking from the ground up: zero overlapping chairs, true appointment punctuality, and certified master artists.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Bento 1: Zero double-booking */}
            <div className="p-6 rounded-2xl bg-[#FFFFFF] dark:bg-[#22161B] border border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] dark:bg-[#2D1D24] border border-[#3B1F2B]/15 dark:border-[#FAF7F2]/15 flex items-center justify-center text-[#3B1F2B] dark:text-[#C5A880]">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#231C1E] dark:text-[#FAF7F2]">
                Zero Double-Booking
              </h3>
              <p className="text-xs text-[#231C1E]/75 dark:text-[#FAF7F2]/75 leading-relaxed">
                When you reserve a slot, that time belongs strictly to you. No rushed turnarounds, no waiting in line, and no overlapping clients.
              </p>
            </div>

            {/* Bento 2: Hand-selected specialists */}
            <div className="p-6 rounded-2xl bg-[#FFFFFF] dark:bg-[#22161B] border border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] dark:bg-[#2D1D24] border border-[#3B1F2B]/15 dark:border-[#FAF7F2]/15 flex items-center justify-center text-[#3B1F2B] dark:text-[#C5A880]">
                <Scissors className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#231C1E] dark:text-[#FAF7F2]">
                12 Master Artisans
              </h3>
              <p className="text-xs text-[#231C1E]/75 dark:text-[#FAF7F2]/75 leading-relaxed">
                Each barber, colorist, and esthetician brings extensive international training, Vidal Sassoon fellowships, and dedicated craft mastery.
              </p>
            </div>

            {/* Bento 3: Clean & non-toxic formulas */}
            <div className="p-6 rounded-2xl bg-[#FFFFFF] dark:bg-[#22161B] border border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] dark:bg-[#2D1D24] border border-[#3B1F2B]/15 dark:border-[#FAF7F2]/15 flex items-center justify-center text-[#3B1F2B] dark:text-[#C5A880]">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#231C1E] dark:text-[#FAF7F2]">
                Clean Botanical Care
              </h3>
              <p className="text-xs text-[#231C1E]/75 dark:text-[#FAF7F2]/75 leading-relaxed">
                Cruelty-free, paraben-free European scalp washes, cold-pressed plant squalane, and organic gloss infusions safe for all skin types.
              </p>
            </div>

            {/* Bento 4: Stripe transparent payments */}
            <div className="p-6 rounded-2xl bg-[#FFFFFF] dark:bg-[#22161B] border border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] dark:bg-[#2D1D24] border border-[#3B1F2B]/15 dark:border-[#FAF7F2]/15 flex items-center justify-center text-[#3B1F2B] dark:text-[#C5A880]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#231C1E] dark:text-[#FAF7F2]">
                Transparent Checkout
              </h3>
              <p className="text-xs text-[#231C1E]/75 dark:text-[#FAF7F2]/75 leading-relaxed">
                Book without upfront lock-in; confirm your reservation first, then complete payment securely via Stripe with automated invoices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 
        =======================================================================
        6. RESIDENT ARTISTS / SPECIALISTS
        =======================================================================
      */}
      <section className="py-16 sm:py-24 bg-[#FFFFFF] dark:bg-[#1E1317] border-b border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10 transition-colors">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#C5A880] block">
                THE TEAM
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#231C1E] dark:text-[#FAF7F2]">
                Resident Barbers &amp; Specialists
              </h2>
              <p className="text-sm text-[#231C1E]/75 dark:text-[#FAF7F2]/75 max-w-lg">
                Meet the licensed artisans who bring years of precision cutting, custom hair coloring, and clinical skincare mastery to Madison Avenue.
              </p>
            </div>

            <Link href="/experience">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-[#3B1F2B]/20 dark:border-[#FAF7F2]/20 text-[#231C1E] dark:text-[#FAF7F2] hover:bg-[#FAF7F2] dark:hover:bg-[#22161B] text-xs font-semibold"
              >
                <span>Read artist biographies</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {residentBarbers.map((barber) => (
              <div
                key={barber.name}
                className="rounded-2xl bg-[#FAF7F2] dark:bg-[#22161B] border border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10 overflow-hidden shadow-sm hover:shadow-md transition-all group"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-[#EAE3D6] dark:bg-[#2D1D24]">
                  <SafeImage
                    src={barber.image}
                    alt={barber.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#231C1E]/70 via-transparent to-transparent opacity-70" />
                  <div className="absolute bottom-3 left-3 right-3 text-[#FAF7F2]">
                    <span className="text-[10px] uppercase tracking-wider text-[#C5A880] font-semibold block">
                      {barber.experience}
                    </span>
                    <h3 className="font-serif text-base font-bold">
                      {barber.name}
                    </h3>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <p className="text-xs font-semibold text-[#3B1F2B] dark:text-[#C5A880]">
                    {barber.role}
                  </p>
                  <p className="text-xs text-[#231C1E]/70 dark:text-[#FAF7F2]/70 leading-relaxed">
                    {barber.specialty}
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/services"
                      className="text-xs font-semibold text-[#3B1F2B] dark:text-[#C5A880] hover:underline flex items-center gap-1"
                    >
                      <span>Book with {barber.name.split(" ")[0]}</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 
        =======================================================================
        7. CLIENT STORIES & TESTIMONIALS
        =======================================================================
      */}
      <section className="py-16 sm:py-24 bg-[#FAF7F2] dark:bg-[#170F13] border-b border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10 transition-colors">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto space-y-2 mb-12">
            <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#C5A880] block">
              PATRON REVIEWS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#231C1E] dark:text-[#FAF7F2]">
              What Our Clients Say
            </h2>
            <div className="flex items-center justify-center gap-1 text-amber-500 pt-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
              <span className="text-xs font-bold text-[#231C1E] dark:text-[#FAF7F2] ml-2">
                4.9 / 5 from over 8,000 appointments
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {clientTestimonials.map((review, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-[#FFFFFF] dark:bg-[#22161B] border border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex text-amber-500">
                    {[...Array(review.rating)].map((_, idx) => (
                      <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-[#231C1E]/80 dark:text-[#FAF7F2]/80 leading-relaxed italic">
                    &ldquo;{review.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-3 border-t border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[#231C1E] dark:text-[#FAF7F2]">
                      {review.author}
                    </h4>
                    <p className="text-[11px] text-[#231C1E]/60 dark:text-[#FAF7F2]/60">
                      {review.location}
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-[#3B1F2B] dark:text-[#C5A880] bg-[#FAF7F2] dark:bg-[#2D1D24] px-2.5 py-1 rounded-full border border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10">
                    {review.service}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 
        =======================================================================
        8. CALL TO ACTION BANNER (DEEP WINE PALETTE)
        =======================================================================
      */}
      <section className="py-16 sm:py-20 bg-[#3B1F2B] text-[#FAF7F2] relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#4A2035] opacity-50 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#2D1621] opacity-50 blur-3xl pointer-events-none" />

        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <span className="inline-block px-3.5 py-1 rounded-full text-xs uppercase font-semibold tracking-widest bg-[#FAF7F2]/10 text-[#C5A880] border border-[#FAF7F2]/20">
            APPOINTMENTS NOW OPEN
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#FAF7F2] leading-tight">
            Ready for your next ritual?
          </h2>

          <p className="text-sm sm:text-base text-[#FAF7F2]/80 max-w-xl mx-auto leading-relaxed">
            Reserve your chair online in under two minutes with no upfront fees.
            Select your preferred specialist and experience grooming done properly.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/services">
              <Button
                size="lg"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#C5A880] hover:bg-[#d6bc96] text-[#231C1E] font-bold text-sm shadow-lg transition-all"
              >
                <span>Browse All Services</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>

            <Link href="/sign-up">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-[#FAF7F2]/30 text-[#FAF7F2] hover:bg-[#FAF7F2]/10 font-semibold text-sm transition-all"
              >
                <Calendar className="w-4 h-4 mr-2 text-[#C5A880]" />
                <span>Create an Account</span>
              </Button>
            </Link>
          </div>

          <p className="text-[11px] text-[#FAF7F2]/60 pt-2">
            Demo Accounts: admin@salonbook.com (Admin) · customer@salonbook.com (Customer) · Password: Password123!
          </p>
        </div>
      </section>

      {/* Booking Modal */}
      {bookingService && (
        <BookingModal
          service={bookingService}
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setBookingService(null);
          }}
        />
      )}
    </div>
  );
}
