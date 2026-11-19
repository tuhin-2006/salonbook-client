"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { BookingModal } from "@/components/booking/BookingModal";
import { SafeImage } from "@/components/ui/SafeImage";
import { api } from "@/lib/api";
import { Service, ApiResponse } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

// Fullscreen Hero Slideshow Assets (4 Cinematic Views of the Salon Atelier - optimized for instant loading)
const heroSlides = [
  {
    id: 1,
    tag: "01 · SANCTUARY",
    badge: "Flagship Atelier · SoHo, NYC",
    kicker: "EST. 2018 · BESPOKE GROOMING & BEAUTY",
    title: "Elevated Craft.",
    titleAccent: "Unhurried Sanctuary.",
    subtitle:
      "A quiet New York atelier where master barbers, colorists, and dermal estheticians practice their craft with unhurried precision. Transparent pricing, single-guest chairs, and timeless hospitality.",
    nextOpening: "Today at 2:30 PM",
    nextArtist: "Marcus Sterling (Lead Groomer)",
    serviceHighlight: "Executive Straight-Razor Shave & Scalp Detox",
    price: "$85",
    image:
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1400&q=75",
  },
  {
    id: 2,
    tag: "02 · COIFFURE",
    badge: "Hair Architecture & Organic Gloss",
    kicker: "HAUTE COIFFURE & BOTANICAL GLOSS",
    title: "Sculpted Silhouettes.",
    titleAccent: "Luminous Colour.",
    subtitle:
      "Hand-painted dimensional balayage customized to cranial bone structure, bespoke precision cuts, and restorative glossing infusions formulated with organic European botanicals.",
    nextOpening: "Tomorrow at 11:30 AM",
    nextArtist: "Elena Vance (Master Colorist)",
    serviceHighlight: "Signature Balayage & Silk Glossing",
    price: "$195",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1400&q=75",
  },
  {
    id: 3,
    tag: "03 · BARBERING",
    badge: "Traditional Gentlemen's Grooming",
    kicker: "TRADITIONAL GENTLEMEN'S CRAFT",
    title: "Razor-Sharp Precision.",
    titleAccent: "Timeless Rituals.",
    subtitle:
      "Japanese feather blades, eucalyptus-steamed hot towels, badger lathering, and aged sandalwood pre-shave tonics. The quintessential gentleman's grooming ritual executed with absolute mastery.",
    nextOpening: "Today at 3:45 PM",
    nextArtist: "Marcus Sterling (Lead Groomer)",
    serviceHighlight: "Classic Cut & Hot Towel Detailing",
    price: "$65",
    image:
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1400&q=75",
  },
  {
    id: 4,
    tag: "04 · HYDRO-SPA",
    badge: "Holistic Skin & Body Therapy",
    kicker: "HOLISTIC SKIN & HYDRO-SPA SANCTUARY",
    title: "Deep Restoration.",
    titleAccent: "Mind, Body & Skin.",
    subtitle:
      "Heated volcanic basalt river stones, ultrasonic dermabrasion, and thermal hydrotherapy in private soundproof treatment chambers designed for complete sensory renewal.",
    nextOpening: "Daily 9:00 AM – 8:00 PM",
    nextArtist: "Sofia Rossi (Dermal Esthetician)",
    serviceHighlight: "Hydra-Botanical Deep Recovery Facial",
    price: "$155",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1400&q=75",
  },
];

// Curated Fallback Services (Optimized WebP URLs for instant loading)
const curatedServices: Service[] = [
  {
    _id: "srv-1",
    title: "Signature Balayage & Silk Glossing",
    slug: "signature-balayage-gloss",
    category: "Hair",
    description:
      "Hand-painted multidimensional balayage customized to cranial bone structure, organic botanical glossing infusion, and unhurried styling finish.",
    price: 195,
    durationMinutes: 120,
    images: [
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=75",
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
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=75",
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
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=75",
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
      "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=800&q=75",
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
      "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=75",
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
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=75",
    ],
    isActive: true,
    specialists: ["Chloe Moreau", "Liam Thorne"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// The 8 Canonical Category Cards
const canonicalCategories = [
  {
    name: "Hair",
    tagline: "Precision cuts, colour and gloss treatments.",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=75",
    count: "12 Treatments",
  },
  {
    name: "Nails",
    tagline: "Considered manicures and pedicures.",
    image:
      "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=600&q=75",
    count: "6 Treatments",
  },
  {
    name: "Facial & Skin",
    tagline: "Glow-giving facials and skin rituals.",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=75",
    count: "8 Treatments",
  },
  {
    name: "Massage",
    tagline: "Restorative bodywork, tailored to you.",
    image:
      "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=600&q=75",
    count: "7 Treatments",
  },
  {
    name: "Makeup",
    tagline: "Soft glam and occasion-ready artistry.",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=75",
    count: "5 Treatments",
  },
  {
    name: "Barbering",
    tagline: "Classic cuts, fades and beard care.",
    image:
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=75",
    count: "9 Treatments",
  },
  {
    name: "Spa & Wellness",
    tagline: "Slow-down rituals for body and mind.",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=75",
    count: "6 Treatments",
  },
  {
    name: "Waxing",
    tagline: "Gentle, meticulous hair removal.",
    image:
      "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=75",
    count: "4 Treatments",
  },
];

// Resident Artists
const residentBarbers = [
  {
    name: "Marcus Sterling",
    role: "Master Barber & Lead Groomer",
    experience: "14 Years in Soho & London",
    specialty: "Traditional straight-razor hot towel shaves & precision fades",
    image:
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=75",
  },
  {
    name: "Elena Vance",
    role: "Master Colorist & Stylist",
    experience: "Trained in Paris & Florence",
    specialty: "Lived-in multidimensional balayage & organic glossing",
    image:
      "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=600&q=75",
  },
  {
    name: "Sofia Rossi",
    role: "Licensed Dermal Esthetician",
    experience: "Certified Swiss Dermo-Practitioner",
    specialty: "Lymphatic drainage, ultrasound peel & barrier restoration",
    image:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=600&q=75",
  },
  {
    name: "Liam Thorne",
    role: "Senior Neuromuscular Therapist",
    experience: "Stockholm Holistic Institute",
    specialty: "Basalt heated stone therapy & deep postural tension release",
    image:
      "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=600&q=75",
  },
];

// Distinct Client Testimonials (Diverse Real Stories & Profiles)
const clientTestimonials = [
  {
    quote:
      "I traveled in from Connecticut specifically for Elena's cranial contouring and silk gloss. Four months later, my dimensional balayage still looks sun-kissed with zero brassiness or demarcation lines. Having a quiet private suite without five people hovering over me is pure luxury.",
    author: "Genevieve Montgomery",
    badge: "Client since 2021",
    service: "Signature Balayage & Silk Glossing",
    artist: "Elena Vance (Master Colorist)",
    rating: 5,
    location: "Upper East Side, NYC",
    date: "November 2026",
    isSpotlight: true,
  },
  {
    quote:
      "Marcus' straight-razor detailing is hands-down the cleanest cut in Manhattan. Japanese feather blades, real steamed cedarwood towels, and zero awkward lobby waiting. The online booking synced directly to my calendar with instant confirmation.",
    author: "Alexander Wright",
    badge: "Booked 18 times",
    service: "Executive Straight-Razor Shave",
    artist: "Marcus Sterling (Lead Groomer)",
    rating: 5,
    location: "SoHo, NYC",
    date: "October 2026",
    isSpotlight: false,
  },
  {
    quote:
      "Sofia completely restored my compromised moisture barrier in 75 minutes. The cryo-oxygen infusion and ultrasound peel felt like medical-grade therapy in a 5-star hotel. The checkout was whisper-quiet on Stripe without any forced product upsells.",
    author: "Dr. Clara Vance",
    badge: "Verified Member",
    service: "Hydra-Botanical Deep Facial",
    artist: "Sofia Rossi (Dermal Esthetician)",
    rating: 5,
    location: "Brooklyn Heights, NYC",
    date: "November 2026",
    isSpotlight: false,
  },
  {
    quote:
      "After 60-hour corporate desk weeks, Liam's basalt stone therapy is non-negotiable. The meridian alignment and organic cedarwood oils completely melted my posture tension. It feels like an authentic European thermal sanctuary in Midtown.",
    author: "Harrison Reed",
    badge: "Bi-weekly Regular",
    service: "Basalt Stone & Cedarwood Massage",
    artist: "Liam Thorne (Neuromuscular Therapist)",
    rating: 5,
    location: "Tribeca, NYC",
    date: "October 2026",
    isSpotlight: false,
  },
];

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [services, setServices] = useState<Service[]>(curatedServices);
  const [activeTab, setActiveTab] = useState<string>("All");
  const [bookingService, setBookingService] = useState<Service | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Fullscreen Hero Slideshow State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 6500);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  // Preload all hero slideshow images into browser cache immediately on page load
  useEffect(() => {
    if (typeof window !== "undefined") {
      heroSlides.forEach((slide) => {
        const img = new Image();
        img.src = slide.image;
      });
    }
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get<ApiResponse<{ services: Service[] }>>(
          "/services?limit=12&isActive=true"
        );
        if (res.data.success && res.data.data.services.length > 0) {
          setServices(res.data.data.services.filter((s) => s.isActive !== false));
        }
      } catch (err) {
        console.warn("Using curated services fallback:", err);
      }
    };
    fetchServices();
  }, []);

  const handleBookNow = (service: Service) => {
    if (!isAuthenticated) {
      toast.info("Please sign in or create an account to book an appointment.");
      router.push(`/sign-in?redirect=${encodeURIComponent(`/services`)}`);
      return;
    }
    setBookingService(service);
    setModalOpen(true);
  };

  const handleViewDetails = (serviceId: string) => {
    if (!isAuthenticated) {
      toast.info("Please sign in or create an account to view service details.");
      router.push(`/sign-in?redirect=${encodeURIComponent(`/services/${serviceId}`)}`);
      return;
    }
    router.push(`/services/${serviceId}`);
  };

  const filteredServices =
    activeTab === "All"
      ? services.filter((s) => s.isActive !== false).slice(0, 6)
      : services.filter(
          (s) => s.isActive !== false && s.category.toLowerCase() === activeTab.toLowerCase()
        );

  const activeSlideData = heroSlides[currentSlide];

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF7F2] dark:bg-[#170F13] text-[#231C1E] dark:text-[#FAF7F2] transition-colors duration-200">
      {/* 
        =======================================================================
        1. HERO SECTION — FULLSCREEN ANIMATED BACKGROUND (KEN BURNS EFFECT)
        - Preloaded instant-display images with concurrent layer crossfade
        - Zero blank gap or black flicker between transitions
        - Ambient luxury warmth underlay so it never shows cold black void
        - Animated text entrances & manual slide controls
        =======================================================================
      */}
      <section className="relative w-full min-h-[92vh] lg:min-h-screen flex items-center justify-center overflow-hidden">
        {/* Fullscreen Animated Background Slideshow (Persistent Concurrent Layers, Zero Blank Gap) */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#1B1116]">
          {/* Ambient Warm Underlay — visible immediately so it NEVER stays cold black */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#2D1B24] via-[#1E1217] to-[#120A0E] z-0" />

          {/* Persistent Stack of All Slide Images (All loaded concurrently, crossfades seamlessly) */}
          {heroSlides.map((slide, index) => {
            const isActive = index === currentSlide;
            return (
              <div
                key={slide.id}
                aria-hidden={!isActive}
                className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                  isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slide.image}
                  alt={slide.title}
                  loading={index === 0 ? "eager" : "lazy"}
                  // @ts-ignore
                  fetchPriority={index === 0 ? "high" : "low"}
                  decoding="async"
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  className={`w-full h-full object-cover transform transition-transform duration-[7000ms] ease-out will-change-transform ${
                    isActive ? "scale-105" : "scale-100"
                  }`}
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.includes("photo-1560066984")) {
                      target.src =
                        "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1400&q=75";
                    }
                  }}
                />
              </div>
            );
          })}

          {/* Cinematic Multi-Layer Gradient Overlays for High Contrast Readability & Vibrant Atelier Warmth */}
          <div className="absolute inset-0 bg-black/40 z-20 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#170F13] via-transparent to-black/40 z-20 pointer-events-none" />
          <div className="absolute inset-0 bg-radial from-transparent via-black/25 to-black/60 z-20 pointer-events-none" />
        </div>

        {/* Hero Foreground Content Container — Centered Luxury Editorial Atelier */}
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 relative z-30 pt-20 pb-12 lg:pt-28 lg:pb-16 flex flex-col items-center text-center">
          {/* Top Status Pill */}
          <motion.div
            key={`badge-${activeSlideData.id}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-[#FAF7F2] shadow-xl mb-4"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-[11px] sm:text-xs font-semibold tracking-wide uppercase text-white/90">
              {activeSlideData.badge}
            </span>
            <span className="text-white/30">•</span>
            <span className="text-[11px] sm:text-xs font-medium text-[#C5A880]">
              Open Today Until 8:00 PM
            </span>
          </motion.div>

          {/* Kicker Tagline */}
          <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.3em] text-[#C5A880] mb-3">
            {activeSlideData.kicker}
          </p>

          {/* Grand Serif Headline with Italic Accent */}
          <motion.div
            key={`heading-${activeSlideData.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="space-y-4 max-w-4xl mx-auto"
          >
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-bold tracking-tight text-[#FAF7F2] leading-[1.08] drop-shadow-xl">
              <span>{activeSlideData.title}</span>{" "}
              <span className="italic font-normal text-[#E8D9C5] block sm:inline">
                {activeSlideData.titleAccent}
              </span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-[#FAF7F2]/90 leading-relaxed font-normal max-w-2xl mx-auto pt-1 drop-shadow">
              {activeSlideData.subtitle}
            </p>
          </motion.div>

          {/* Interactive Quick-Category Selector Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
            {[
              { label: "Hair & Styling", href: "/services?category=Hair" },
              { label: "Gentlemen's Barbering", href: "/services?category=Barbering" },
              { label: "Dermal Facials", href: "/services?category=Facial%20%26%20Skin" },
              { label: "Basalt Massage", href: "/services?category=Massage" },
              { label: "Nail Therapy", href: "/services?category=Nails" },
            ].map((cat) => (
              <Link key={cat.label} href={cat.href}>
                <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-medium bg-black/35 hover:bg-white/20 text-white/90 border border-white/20 hover:border-[#C5A880] backdrop-blur-md transition-all hover:text-[#C5A880] shadow-sm">
                  ✦ {cat.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Dual Action CTAs */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
            <Button
              size="lg"
              onClick={() => {
                if (!isAuthenticated) {
                  toast.info("Please sign in or create an account to reserve an appointment.");
                  router.push("/sign-in?redirect=/services");
                } else {
                  router.push("/services");
                }
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#C5A880] hover:bg-[#d6bc96] text-[#170F13] font-bold text-sm shadow-2xl transition-all flex items-center justify-center gap-2 group hover:scale-[1.02]"
            >
              <span>Reserve an Appointment</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>

            <Link href="/services" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto px-8 py-4 rounded-xl border border-white/30 text-white bg-black/40 hover:bg-white/20 backdrop-blur-md font-semibold text-sm transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4 text-[#C5A880]" />
                <span>Explore Salon Services</span>
              </Button>
            </Link>
          </div>

          {/* Docked Floating Concierge Bar (Horizontal Atelier Pulse) */}
          <div className="w-full max-w-4xl mx-auto mt-10 rounded-2xl bg-black/50 backdrop-blur-xl border border-white/20 p-4 sm:p-5 shadow-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:divide-x sm:divide-white/15 text-left">
              {/* Live Opening */}
              <div className="space-y-1 sm:pr-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                    Next Available Seat: {activeSlideData.nextOpening}
                  </span>
                </div>
                <p className="text-xs font-bold text-white truncate">
                  {activeSlideData.serviceHighlight}
                </p>
                <p className="text-[11px] text-white/70 truncate flex items-center justify-between">
                  <span>With {activeSlideData.nextArtist}</span>
                  <span className="text-[#C5A880] font-bold font-mono">{activeSlideData.price}</span>
                </p>
              </div>

              {/* Client Acclaim */}
              <div className="space-y-1 sm:px-4">
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-white font-mono">4.98 / 5.0</span>
                </div>
                <p className="text-xs font-semibold text-white/95">
                  Discerning Guest Acclaim
                </p>
                <p className="text-[11px] text-white/70">
                  Based on 2,400+ verified appointments
                </p>
              </div>

              {/* Location & Guarantee */}
              <div className="space-y-1 sm:pl-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-[#C5A880] font-semibold">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>128 Mercer Street · SoHo, NYC</span>
                  </div>
                  <p className="text-[11px] text-white/70 mt-0.5">
                    No waiting · Single-guest chairs
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 mt-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Instant online booking confirmation</span>
                </div>
              </div>
            </div>
          </div>

          {/* Editorial Slide Navigation Tabs & Controls Bar */}
          <div className="w-full max-w-4xl mx-auto mt-6 pt-4 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Named Tab Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full sm:w-auto">
              {heroSlides.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => setCurrentSlide(idx)}
                  className={`px-3 py-2 rounded-xl text-left transition-all ${
                    currentSlide === idx
                      ? "bg-white/20 border border-[#C5A880]/60 text-white shadow-md"
                      : "bg-black/30 hover:bg-white/10 border border-white/10 text-white/60"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono font-bold ${
                        currentSlide === idx ? "text-[#C5A880]" : "text-white/40"
                      }`}
                    >
                      0{idx + 1}
                    </span>
                    <span className="text-xs font-semibold truncate">
                      {slide.tag.split("·")[1]?.trim() || slide.tag}
                    </span>
                  </div>
                  <div className="w-full bg-white/10 h-0.5 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className={`h-full bg-[#C5A880] transition-all duration-300 ${
                        currentSlide === idx ? "w-full" : "w-0"
                      }`}
                    />
                  </div>
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 text-white">
              <button
                onClick={prevSlide}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-colors"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-colors"
                aria-label={isAutoPlaying ? "Pause slideshow" : "Play slideshow"}
                title={isAutoPlaying ? "Pause" : "Play"}
              >
                {isAutoPlaying ? (
                  <Pause className="w-3.5 h-3.5" />
                ) : (
                  <Play className="w-3.5 h-3.5 ml-0.5" />
                )}
              </button>
              <button
                onClick={nextSlide}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-colors"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 
        =======================================================================
        2. ATELIER CRAFT STANDARDS & ASSURANCES (RE-DESIGNED ARCHITECTURAL BENTO)
        =======================================================================
      */}
      <section className="bg-[#FAF7F2] dark:bg-[#150E12] py-12 sm:py-16 border-b border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10 transition-colors">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Subtle Section Kicker */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10">
            <div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#C5A880]">
                UNCOMPROMISED EXCELLENCE
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#231C1E] dark:text-[#FAF7F2] mt-0.5">
                The Four Pillars of SalonBook Care
              </h3>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-[#231C1E]/60 dark:text-[#FAF7F2]/60 font-medium">
              <Sparkles className="w-4 h-4 text-[#C5A880]" />
              <span>Certified European Practice</span>
            </div>
          </div>

          {/* 4 Sculpted Atelier Pillar Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                num: "01",
                badge: "EXCLUSIVITY",
                title: "100% Single-Guest Attention",
                desc: "Zero chair overlapping or apprentice handoffs. Your resident master artisan devotes their undivided craft solely to you.",
                icon: Scissors,
              },
              {
                num: "02",
                badge: "TIMING PRECISION",
                title: "Real-Time Synchronized Slots",
                desc: "Direct live integration with our booking engine. Your session commences promptly at the minute with zero lobby waiting.",
                icon: Clock,
              },
              {
                num: "03",
                badge: "ORGANIC ELEGANCE",
                title: "Clean European Actives",
                desc: "Cruelty-free botanicals, cold-pressed plant squalane, and organic glossing formulations free of petroleum sulfates.",
                icon: ShieldCheck,
              },
              {
                num: "04",
                badge: "TRANSPARENCY",
                title: "Upfront All-Inclusive Pricing",
                desc: "Consultation, wash, hot towels, and precision styling finish included in every quote. Seamless Stripe checkout with zero surprises.",
                icon: CheckCircle2,
              },
            ].map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={pillar.num}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="group relative rounded-2xl p-6 bg-[#FFFFFF] dark:bg-[#1E1317] border border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10 hover:border-[#C5A880]/60 dark:hover:border-[#C5A880]/60 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] dark:bg-[#281820] border border-[#3B1F2B]/15 dark:border-[#FAF7F2]/15 flex items-center justify-center text-[#3B1F2B] dark:text-[#C5A880] group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-mono text-xs font-bold text-[#C5A880] tracking-widest">
                        {pillar.num}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-[#C5A880] block">
                        {pillar.badge}
                      </span>
                      <h4 className="font-serif text-base font-bold text-[#231C1E] dark:text-[#FAF7F2] group-hover:text-[#3B1F2B] dark:group-hover:text-[#C5A880] transition-colors">
                        {pillar.title}
                      </h4>
                      <p className="text-xs text-[#231C1E]/75 dark:text-[#FAF7F2]/70 leading-relaxed pt-1">
                        {pillar.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10 flex items-center justify-between text-[11px] font-semibold text-[#3B1F2B] dark:text-[#C5A880] opacity-80 group-hover:opacity-100 transition-opacity">
                    <span>Atelier Standard</span>
                    <Sparkles className="w-3 h-3" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 
        =======================================================================
        3. CATEGORY GRID ("Find Your Ritual — A category for every kind of pause")
        =======================================================================
      */}
      <section className="py-16 sm:py-24 bg-[#FAF7F2] dark:bg-[#170F13] border-b border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10 transition-colors">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12"
          >
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
          </motion.div>

          {/* 8 Category Cards Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {canonicalCategories.map((cat, idx) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
              >
                <Link
                  href={`/services?category=${encodeURIComponent(cat.name)}`}
                  className="group relative rounded-2xl overflow-hidden bg-[#FFFFFF] dark:bg-[#22161B] border border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10 hover:border-[#3B1F2B]/30 dark:hover:border-[#C5A880]/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#EAE3D6] dark:bg-[#2D1D24]">
                    <SafeImage
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#231C1E]/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                    
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FFFFFF]/90 dark:bg-[#170F13]/90 text-[#231C1E] dark:text-[#FAF7F2] backdrop-blur-md shadow-sm">
                      {cat.name}
                    </span>

                    <span className="absolute bottom-3 right-3 text-[10px] font-medium text-[#FAF7F2] bg-[#231C1E]/60 px-2 py-0.5 rounded-md backdrop-blur-sm">
                      {cat.count}
                    </span>
                  </div>

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
              </motion.div>
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto space-y-3 mb-12"
          >
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
          </motion.div>

          {/* Treatments Cards Grid (3 Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service, idx) => (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group rounded-2xl bg-[#FAF7F2] dark:bg-[#22161B] border border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10 hover:border-[#3B1F2B]/30 dark:hover:border-[#C5A880]/50 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div
                    onClick={() => handleViewDetails(service._id)}
                    className="relative aspect-[16/10] overflow-hidden bg-[#EAE3D6] dark:bg-[#2D1D24] cursor-pointer"
                  >
                    <SafeImage
                      src={
                        service.images && service.images[0]
                          ? service.images[0]
                          : "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80"
                      }
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FFFFFF]/90 dark:bg-[#170F13]/90 backdrop-blur-md text-[#231C1E] dark:text-[#FAF7F2] shadow-sm">
                      {service.category}
                    </span>

                    <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold bg-[#3B1F2B] dark:bg-[#C5A880] text-[#FAF7F2] dark:text-[#170F13] shadow-sm">
                      {formatCurrency(service.price)}
                    </span>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-[#231C1E]/70 dark:text-[#FAF7F2]/70 font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>⏱ {service.durationMinutes} min</span>
                      <span className="text-[#3B1F2B]/30 dark:text-[#FAF7F2]/30">•</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-medium">At the salon</span>
                    </div>

                    <h3
                      onClick={() => handleViewDetails(service._id)}
                      className="font-serif text-lg font-bold text-[#231C1E] dark:text-[#FAF7F2] group-hover:text-[#3B1F2B] dark:group-hover:text-[#C5A880] transition-colors leading-snug cursor-pointer"
                    >
                      {service.title}
                    </h3>

                    <p className="text-xs text-[#231C1E]/75 dark:text-[#FAF7F2]/75 line-clamp-2 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>

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
                    <Button
                      variant="outline"
                      onClick={() => handleViewDetails(service._id)}
                      className="rounded-xl border-[#3B1F2B]/20 dark:border-[#FAF7F2]/20 text-[#231C1E] dark:text-[#FAF7F2] hover:bg-[#FFFFFF] dark:hover:bg-[#2D1D24] text-xs font-medium py-2.5 px-3"
                    >
                      Details ↗
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto space-y-3 mb-14"
          >
            <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#C5A880] block">
              THE SALONBOOK DIFFERENCE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#231C1E] dark:text-[#FAF7F2]">
              Why Clients Choose Our Chairs
            </h2>
            <p className="text-sm text-[#231C1E]/75 dark:text-[#FAF7F2]/75 leading-relaxed">
              We reimagined modern salon booking from the ground up: zero overlapping chairs, true appointment punctuality, and certified master artists.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0 }}
              className="p-6 rounded-2xl bg-[#FFFFFF] dark:bg-[#22161B] border border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10 shadow-sm space-y-3 hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] dark:bg-[#2D1D24] border border-[#3B1F2B]/15 dark:border-[#FAF7F2]/15 flex items-center justify-center text-[#3B1F2B] dark:text-[#C5A880]">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#231C1E] dark:text-[#FAF7F2]">
                Zero Double-Booking
              </h3>
              <p className="text-xs text-[#231C1E]/75 dark:text-[#FAF7F2]/75 leading-relaxed">
                When you reserve a slot, that time belongs strictly to you. No rushed turnarounds, no waiting in line, and no overlapping clients.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-6 rounded-2xl bg-[#FFFFFF] dark:bg-[#22161B] border border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10 shadow-sm space-y-3 hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] dark:bg-[#2D1D24] border border-[#3B1F2B]/15 dark:border-[#FAF7F2]/15 flex items-center justify-center text-[#3B1F2B] dark:text-[#C5A880]">
                <Scissors className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#231C1E] dark:text-[#FAF7F2]">
                12 Master Artisans
              </h3>
              <p className="text-xs text-[#231C1E]/75 dark:text-[#FAF7F2]/75 leading-relaxed">
                Each barber, colorist, and esthetician brings extensive international training, Vidal Sassoon fellowships, and dedicated craft mastery.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-6 rounded-2xl bg-[#FFFFFF] dark:bg-[#22161B] border border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10 shadow-sm space-y-3 hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] dark:bg-[#2D1D24] border border-[#3B1F2B]/15 dark:border-[#FAF7F2]/15 flex items-center justify-center text-[#3B1F2B] dark:text-[#C5A880]">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#231C1E] dark:text-[#FAF7F2]">
                Clean Botanical Care
              </h3>
              <p className="text-xs text-[#231C1E]/75 dark:text-[#FAF7F2]/75 leading-relaxed">
                Cruelty-free, paraben-free European scalp washes, cold-pressed plant squalane, and organic gloss infusions safe for all skin types.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="p-6 rounded-2xl bg-[#FFFFFF] dark:bg-[#22161B] border border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10 shadow-sm space-y-3 hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] dark:bg-[#2D1D24] border border-[#3B1F2B]/15 dark:border-[#FAF7F2]/15 flex items-center justify-center text-[#3B1F2B] dark:text-[#C5A880]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#231C1E] dark:text-[#FAF7F2]">
                Transparent Checkout
              </h3>
              <p className="text-xs text-[#231C1E]/75 dark:text-[#FAF7F2]/75 leading-relaxed">
                Book without upfront lock-in; confirm your reservation first, then complete payment securely via Stripe with automated invoices.
              </p>
            </motion.div>
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12"
          >
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
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {residentBarbers.map((barber, idx) => (
              <motion.div
                key={barber.name}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
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
                    <button
                      onClick={() => {
                        if (!isAuthenticated) {
                          toast.info(`Please sign in or create an account to book with ${barber.name}.`);
                          router.push("/sign-in?redirect=/services");
                        } else {
                          router.push("/services");
                        }
                      }}
                      className="text-xs font-semibold text-[#3B1F2B] dark:text-[#C5A880] hover:underline flex items-center gap-1"
                    >
                      <span>Book with {barber.name.split(" ")[0]}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 
        =======================================================================
        7. PATRON VOICES & CLIENT STORIES (DISTINCT INDIVIDUAL CARDS & SPOTLIGHT)
        =======================================================================
      */}
      <section className="py-16 sm:py-24 bg-[#FAF7F2] dark:bg-[#170F13] border-b border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10 transition-colors">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-xl mx-auto space-y-2 mb-12"
          >
            <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#C5A880] block">
              PATRON EXPERIENCES
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#231C1E] dark:text-[#FAF7F2]">
              Words from Our Discerning Guests
            </h2>
            <div className="flex items-center justify-center gap-1 text-amber-500 pt-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
              <span className="text-xs font-bold text-[#231C1E] dark:text-[#FAF7F2] ml-2">
                4.98 / 5.0 from 2,400+ verified appointments
              </span>
            </div>
          </motion.div>

          {/* Varied & Distinct Client Review Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Featured Spotlight Review (6 Cols) */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6 rounded-3xl p-8 bg-gradient-to-br from-[#2D1621] to-[#1C0D15] text-[#FAF7F2] border border-[#C5A880]/30 shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A880]/10 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider bg-[#C5A880] text-[#170F13] shadow-sm">
                    Featured Patron Story
                  </span>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>

                <p className="font-serif text-lg sm:text-xl text-[#FAF7F2] leading-relaxed italic">
                  &ldquo;{clientTestimonials[0].quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-white/15 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#C5A880] text-[#170F13] font-serif font-bold text-sm flex items-center justify-center shadow-md">
                    GM
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {clientTestimonials[0].author}
                    </h4>
                    <p className="text-xs text-white/70">
                      {clientTestimonials[0].location} · {clientTestimonials[0].badge}
                    </p>
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <span className="text-xs font-semibold text-[#C5A880] block">
                    {clientTestimonials[0].service}
                  </span>
                  <span className="text-[10px] text-white/50">
                    With {clientTestimonials[0].artist}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Right Column: 3 Distinct Companion Reviews (6 Cols) */}
            <div className="lg:col-span-6 space-y-4">
              {clientTestimonials.slice(1).map((review, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  className="p-5 rounded-2xl bg-[#FFFFFF] dark:bg-[#1E1317] border border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10 hover:border-[#C5A880]/50 shadow-sm transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex text-amber-500">
                        {[...Array(review.rating)].map((_, idx) => (
                          <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#C5A880] bg-[#C5A880]/15 dark:bg-[#C5A880]/20 px-2 py-0.5 rounded-full">
                        {review.badge}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#231C1E]/50 dark:text-[#FAF7F2]/50 font-mono">
                      {review.date}
                    </span>
                  </div>

                  <p className="text-xs text-[#231C1E]/85 dark:text-[#FAF7F2]/85 leading-relaxed italic">
                    &ldquo;{review.quote}&rdquo;
                  </p>

                  <div className="pt-2 border-t border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-[#231C1E] dark:text-[#FAF7F2]">
                        {review.author}
                      </span>
                      <span className="text-[#231C1E]/60 dark:text-[#FAF7F2]/60 ml-1.5 text-[11px]">
                        ({review.location})
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-[#3B1F2B] dark:text-[#C5A880] truncate max-w-[200px]">
                      {review.service}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 
        =======================================================================
        8. CALL TO ACTION BANNER (DEEP WINE PALETTE)
        =======================================================================
      */}
      <section className="py-16 sm:py-20 bg-[#3B1F2B] text-[#FAF7F2] relative overflow-hidden">
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
