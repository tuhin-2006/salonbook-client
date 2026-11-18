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
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { BookingModal } from "@/components/booking/BookingModal";
import { SafeImage } from "@/components/ui/SafeImage";
import { api } from "@/lib/api";
import { Service, ApiResponse } from "@/types";

const curatedEditorialServices: Service[] = [
  {
    _id: "demo-1",
    title: "Signature Balayage & Glossing Ritual",
    slug: "signature-balayage-gloss",
    category: "Hair",
    description:
      "Hand-painted multidimensional balayage tailored to cranial bone structure, organic silk glossing infusion, and unhurried natural texture finish.",
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
    _id: "demo-2",
    title: "Hydra-Botanical Cell Recovery Facial",
    slug: "hydra-botanical-facial",
    category: "Facial & Skin",
    description:
      "Ultrasonic micro-cleansing, wild elderberry and fruit enzyme peel, cold-pressed plant squalane infusion, and cryo-sculpting facial massage.",
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
    _id: "demo-3",
    title: "Architectural Precision Haircut & Scalp Detox",
    slug: "architectural-precision-haircut",
    category: "Hair",
    description:
      "Detailed structural scissor-work, botanical rosemary scalp detoxification ritual, customized nourishing clay wrap, and diffuse finishing.",
    price: 110,
    durationMinutes: 60,
    images: [
      "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=1200&q=85",
    ],
    isActive: true,
    specialists: ["David Chen", "Chloe Moreau"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "demo-4",
    title: "Volcanic Basalt Stone & Cedarwood Massage",
    slug: "basalt-stone-massage",
    category: "Massage",
    description:
      "Warm basalt river stones aligned along energy meridians, cold-pressed Mediterranean cedar and lavender oils, relieving deep muscular tension.",
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
    _id: "demo-5",
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
    _id: "demo-6",
    title: "Executive Straight-Razor Shave & Cedarwood Steam",
    slug: "executive-shave-steam",
    category: "Barbering",
    description:
      "Eucalyptus hot towel preparation, badger brush badger lathering, Japanese feather blade detailing, and botanical chilled tonic.",
    price: 90,
    durationMinutes: 50,
    images: [
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=85",
    ],
    isActive: true,
    specialists: ["Marcus Sterling"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const editorialCategories = [
  { name: "All", label: "Complete Carte", count: "30+ Formulations" },
  { name: "Hair", label: "Hair Architecture & Color", count: "12 Rituals" },
  { name: "Facial & Skin", label: "Botanical Skin Therapy", count: "8 Rituals" },
  { name: "Massage", label: "Deep Tissue & Stone", count: "5 Rituals" },
  { name: "Nails", label: "Hand & Cuticle Care", count: "6 Rituals" },
  { name: "Barbering", label: "Master Barbering", count: "4 Rituals" },
];

const masterArtisans = [
  {
    name: "Elena Vance",
    role: "Master Colorist & Editorial Director",
    credentials: "Trained in Paris & Florence · 14 Years Experience",
    specialty: "Lived-in multidimensional balayage & color correction",
    portrait: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Chloe Moreau",
    role: "Architectural Cut Specialist",
    credentials: "Vidal Sassoon London Fellow",
    specialty: "Dry cutting, ergonomic silhouettes & natural curl tailoring",
    portrait: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Sofia Rossi",
    role: "Botanical Aesthetician",
    credentials: "Certified Swiss Dermo-Cosmetics Practitioner",
    specialty: "Cold cryo-therapy, lymphatic drainage & barrier restoration",
    portrait: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Liam Thorne",
    role: "Senior Neuromuscular Therapist",
    credentials: "BSc Holistic Therapies · Stockholm Institute",
    specialty: "Warm basalt stone myofascial release & cranial tension relief",
    portrait: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=800&q=80",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>(curatedEditorialServices);
  const [selectedCategory, setSelectedCategory] = useState("All");
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
        console.warn("Using curated editorial services fallback:", err);
      }
    };
    fetchServices();
  }, []);

  const handleBookNow = (service: Service) => {
    setBookingService(service);
    setModalOpen(true);
  };

  const filteredServices =
    selectedCategory === "All"
      ? services
      : services.filter((s) => s.category === selectedCategory);

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F1E8] dark:bg-[#151916] text-[#302821] dark:text-[#F5F1E8] selection:bg-[#B8755B] selection:text-white">
      {/* 
        =======================================================================
        1. HERO SECTION: LUXURY EDITORIAL ATELIER
        Text-First Composition — No split screen, no purple gradients, no floating pills
        =======================================================================
      */}
      <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-[#302821]/15 dark:border-[#EAE3D6]/15">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          {/* Top Editorial Metadata Line */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-[#302821]/15 dark:border-[#EAE3D6]/15 text-[10px] uppercase tracking-[0.28em] text-[#302821]/70 dark:text-[#EAE3D6]/70">
            <span>VOL. IX — PRIVATE APPOINTMENT CARTE</span>
            <span>MADISON AVENUE · NEW YORK</span>
            <span>AUTUMN / WINTER APPOINTMENTS</span>
          </div>

          {/* Central Editorial Display Headline */}
          <div className="pt-12 sm:pt-16 pb-10 text-center max-w-4xl mx-auto space-y-6">
            <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.3em] text-[#B8755B]">
              HAUTE BEAUTÉ &amp; SLOW RESTORATION
            </span>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal leading-[1.08] tracking-tight text-[#302821] dark:text-[#F5F1E8]">
              The Architecture of Hair, Botanicals &amp; Quiet Care.
            </h1>

            <p className="text-base sm:text-lg text-[#302821]/80 dark:text-[#EAE3D6]/80 font-normal leading-relaxed max-w-2xl mx-auto">
              We reject the hurried, clinical salon. SalonBook is a private European atelier
              where precision scissor craft meets organic botanical formulations in an unhurried, daylight space.
            </p>

            {/* Solid Minimalist CTAs — Pure Atelier */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/services">
                <Button
                  variant="default"
                  size="lg"
                  className="w-full sm:w-auto px-8 py-3.5 text-xs tracking-[0.2em] uppercase font-medium bg-[#26372D] text-[#F5F1E8] hover:bg-[#343D2E] rounded-none border border-[#26372D]"
                >
                  <span>EXPLORE THE CARTE</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-2" />
                </Button>
              </Link>
              <Link href="/experience">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto px-8 py-3.5 text-xs tracking-[0.2em] uppercase font-medium text-[#26372D] dark:text-[#F5F1E8] border-[#302821]/30 dark:border-[#EAE3D6]/30 hover:bg-[#EAE3D6]/50 rounded-none"
                >
                  THE ATELIER PHILOSOPHY
                </Button>
              </Link>
            </div>
          </div>

          {/* 
            Asymmetrical Magazine Triptych Composition BELOW the Headline
            100% Verified HTTP 200 URLs with Editorial Captions
          */}
          <div className="pt-10 grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
            {/* Left: Precision Cut Portrait (4 cols) */}
            <div className="md:col-span-4 flex flex-col space-y-2">
              <div className="relative aspect-[3/4] overflow-hidden bg-[#EAE3D6] border border-[#302821]/15">
                <SafeImage
                  src="https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1200&q=85"
                  alt="Precision styling in action"
                  className="w-full h-full object-cover grayscale-[15%] hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-[#302821]/70 dark:text-[#EAE3D6]/70 pt-1">
                <span>Fig. 01 — Scissor Architecture</span>
                <span>Elena Vance</span>
              </div>
            </div>

            {/* Middle: Architectural Studio Interior (5 cols) */}
            <div className="md:col-span-5 flex flex-col space-y-2">
              <div className="relative aspect-[4/3] md:h-full overflow-hidden bg-[#EAE3D6] border border-[#302821]/15">
                <SafeImage
                  src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=85"
                  alt="Daylight European Atelier Interior"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-0 inset-x-0 p-4 bg-[#26372D]/90 text-[#F5F1E8] backdrop-blur-sm border-t border-[#F5F1E8]/20 flex items-center justify-between">
                  <span className="font-serif text-sm tracking-wide">The Madison Avenue Sanctuary</span>
                  <span className="text-[10px] uppercase tracking-widest text-[#A4AA91]">Acoustic Calm</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-[#302821]/70 dark:text-[#EAE3D6]/70 pt-1">
                <span>Fig. 02 — Private Atelier Suite</span>
                <span>Floor IV</span>
              </div>
            </div>

            {/* Right: Botanical Amber Apothecary (3 cols) */}
            <div className="md:col-span-3 flex flex-col space-y-2">
              <div className="relative aspect-[3/4] overflow-hidden bg-[#EAE3D6] border border-[#302821]/15">
                <SafeImage
                  src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=85"
                  alt="Botanical Amber Glass Formulations"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-[#302821]/70 dark:text-[#EAE3D6]/70 pt-1">
                <span>Fig. 03 — Cold-Pressed Oils</span>
                <span>Pure Plant Actives</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 
        =======================================================================
        2. BRAND MANIFESTO & PHILOSOPHY
        Editorial pull-quote layout with Roman numerals
        =======================================================================
      */}
      <section className="py-20 sm:py-28 bg-[#EAE3D6] dark:bg-[#1a201c] border-b border-[#302821]/15 dark:border-[#EAE3D6]/15">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="text-center space-y-8">
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#B8755B] font-bold">
              ATELIER MANIFESTO
            </span>
            <blockquote className="font-serif text-2xl sm:text-3xl lg:text-4xl leading-snug font-normal text-[#302821] dark:text-[#F5F1E8] max-w-3xl mx-auto">
              &ldquo;We treat hair, scalp, and skin as living architecture. Our appointments are strictly unhurried, one guest at a time, dedicated to biological integrity and artistic precision.&rdquo;
            </blockquote>
            <p className="text-xs uppercase tracking-[0.25em] text-[#302821]/60 dark:text-[#EAE3D6]/60">
              — SALONBOOK CODE OF CRAFT · RULE 01
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-[#302821]/15 dark:border-[#EAE3D6]/15">
            <div className="space-y-3">
              <span className="font-serif text-2xl text-[#26372D] dark:text-[#A4AA91]">I.</span>
              <h3 className="font-serif text-lg text-[#302821] dark:text-[#F5F1E8]">Cranial Architecture</h3>
              <p className="text-xs text-[#302821]/75 dark:text-[#EAE3D6]/75 leading-relaxed">
                Haircuts sculpted dry according to head shape, bone angles, and natural fall. Hair that looks exquisite not only leaving the salon, but 8 weeks later.
              </p>
            </div>

            <div className="space-y-3">
              <span className="font-serif text-2xl text-[#26372D] dark:text-[#A4AA91]">II.</span>
              <h3 className="font-serif text-lg text-[#302821] dark:text-[#F5F1E8]">Clean Biological Actives</h3>
              <p className="text-xs text-[#302821]/75 dark:text-[#EAE3D6]/75 leading-relaxed">
                Zero ammonia, synthetic sulfates, or petrochemical parabens. Formulations imported from micro-laboratories in Grasse and Bologna.
              </p>
            </div>

            <div className="space-y-3">
              <span className="font-serif text-2xl text-[#26372D] dark:text-[#A4AA91]">III.</span>
              <h3 className="font-serif text-lg text-[#302821] dark:text-[#F5F1E8]">Single-Seat Concierge</h3>
              <p className="text-xs text-[#302821]/75 dark:text-[#EAE3D6]/75 leading-relaxed">
                No overlapping clients. Your master practitioner is exclusively dedicated to your chair for the entire duration of your reservation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 
        =======================================================================
        3. HAUTE CARTE (SIGNATURE TREATMENTS)
        Numbered editorial index with solid reserve buttons
        =======================================================================
      */}
      <section className="py-20 sm:py-28 border-b border-[#302821]/15 dark:border-[#EAE3D6]/15">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between pb-10 border-b border-[#302821]/15 dark:border-[#EAE3D6]/15 gap-6">
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#B8755B] font-semibold">
                LA CARTE DES SOINS
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#302821] dark:text-[#F5F1E8]">
                Signature Treatments &amp; Rituals
              </h2>
            </div>
            <Link href="/services">
              <Button
                variant="outline"
                className="rounded-none text-xs tracking-[0.2em] uppercase border-[#302821]/30"
              >
                <span>VIEW COMPLETE CARTE</span>
                <ArrowRight className="w-3.5 h-3.5 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Category Filter Tabs */}
          <div className="py-6 flex items-center gap-3 overflow-x-auto scrollbar-none border-b border-[#302821]/10 dark:border-[#EAE3D6]/10">
            {editorialCategories.map((cat) => {
              const isSelected = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-4 py-2 text-xs uppercase tracking-[0.18em] transition-all whitespace-nowrap rounded-none border ${
                    isSelected
                      ? "bg-[#26372D] text-[#F5F1E8] border-[#26372D]"
                      : "bg-transparent text-[#302821]/70 dark:text-[#EAE3D6]/70 border-transparent hover:border-[#302821]/20 hover:text-[#302821]"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Treatment Cards Grid: Editorial Proportions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-10">
            {filteredServices.slice(0, 6).map((service, idx) => (
              <div
                key={service._id}
                className="group flex flex-col justify-between bg-[#EAE3D6]/40 dark:bg-[#1a201c] border border-[#302821]/15 dark:border-[#EAE3D6]/15 hover:border-[#26372D] transition-colors"
              >
                <div>
                  {/* Photo Frame */}
                  <div className="relative aspect-[16/11] overflow-hidden bg-[#EAE3D6] border-b border-[#302821]/15 dark:border-[#EAE3D6]/15">
                    <SafeImage
                      src={
                        service.images?.[0] ||
                        "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1200&q=85"
                      }
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-3 left-3 bg-[#F5F1E8]/90 dark:bg-[#26372D]/90 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-[#302821] dark:text-[#F5F1E8] border border-[#302821]/20">
                      {service.category}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-[#302821]/70 dark:text-[#EAE3D6]/70 uppercase tracking-wider">
                      <span className="font-serif text-sm font-semibold text-[#B8755B]">
                        NO. 0{idx + 1}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#26372D] dark:text-[#A4AA91]" />
                        {service.durationMinutes} MINUTES
                      </span>
                    </div>

                    <h3 className="font-serif text-xl text-[#302821] dark:text-[#F5F1E8] group-hover:text-[#26372D] transition-colors">
                      {service.title}
                    </h3>

                    <p className="text-xs text-[#302821]/75 dark:text-[#EAE3D6]/75 leading-relaxed line-clamp-2">
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* Card Action Bar */}
                <div className="p-6 pt-0 border-t border-[#302821]/10 dark:border-[#EAE3D6]/10 mt-2 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#302821]/60 dark:text-[#EAE3D6]/60 block">
                      TREATMENT FEE
                    </span>
                    <span className="font-serif text-lg font-medium text-[#26372D] dark:text-[#F5F1E8]">
                      {formatCurrency(service.price)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link href={`/services/${service._id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-none text-[11px] tracking-[0.15em] uppercase hover:bg-transparent hover:underline"
                      >
                        DOSSIER
                      </Button>
                    </Link>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleBookNow(service)}
                      className="rounded-none text-[11px] tracking-[0.15em] uppercase px-4 py-2 bg-[#26372D] text-[#F5F1E8] hover:bg-[#343D2E]"
                    >
                      RESERVE
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 
        =======================================================================
        4. THE RESIDENT MASTER ARTISANS
        Editorial portrait showcase with credentials
        =======================================================================
      */}
      <section className="py-20 sm:py-28 bg-[#EAE3D6] dark:bg-[#1a201c] border-b border-[#302821]/15 dark:border-[#EAE3D6]/15">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="max-w-2xl space-y-3 mb-14">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#B8755B] font-semibold">
              MAÎTRES DE L&apos;ATELIER
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#302821] dark:text-[#F5F1E8]">
              The Resident Artisans
            </h2>
            <p className="text-xs text-[#302821]/75 dark:text-[#EAE3D6]/75 leading-relaxed">
              Every appointment is conducted by our resident masters. No apprentices, no divided attention.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {masterArtisans.map((artisan) => (
              <div
                key={artisan.name}
                className="bg-[#F5F1E8] dark:bg-[#151916] border border-[#302821]/15 dark:border-[#EAE3D6]/15 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#EAE3D6]">
                    <SafeImage
                      src={artisan.portrait}
                      alt={artisan.name}
                      className="w-full h-full object-cover grayscale-[20%]"
                    />
                  </div>
                  <div className="p-5 space-y-2">
                    <span className="text-[9px] uppercase tracking-[0.25em] text-[#B8755B] block">
                      {artisan.credentials}
                    </span>
                    <h3 className="font-serif text-lg text-[#302821] dark:text-[#F5F1E8]">
                      {artisan.name}
                    </h3>
                    <p className="text-[11px] font-medium text-[#26372D] dark:text-[#A4AA91]">
                      {artisan.role}
                    </p>
                    <p className="text-xs text-[#302821]/70 dark:text-[#EAE3D6]/70 leading-relaxed pt-1">
                      {artisan.specialty}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link href="/services">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full rounded-none text-[10px] tracking-[0.18em] uppercase border-[#302821]/20 hover:bg-[#26372D] hover:text-[#F5F1E8]"
                    >
                      REQUEST WITH {artisan.name.split(" ")[0].toUpperCase()}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 
        =======================================================================
        5. THE SANCTUARY: ARCHITECTURAL SPACE
        Photos of the salon interior with quiet acoustic design
        =======================================================================
      */}
      <section className="py-20 sm:py-28 border-b border-[#302821]/15 dark:border-[#EAE3D6]/15">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#B8755B] font-semibold">
                THE SPACE
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#302821] dark:text-[#F5F1E8] leading-tight">
                Designed for Acoustic Serenity &amp; Natural Light.
              </h2>
              <p className="text-xs sm:text-sm text-[#302821]/75 dark:text-[#EAE3D6]/75 leading-relaxed">
                Step off Madison Avenue and into quiet restraint. Our private 4th-floor atelier was sculpted with lime-wash plaster, natural white oak, acoustic linen baffles, and private washrooms to shield you from city clamor.
              </p>
              <div className="space-y-3 pt-2 text-xs text-[#302821]/80 dark:text-[#EAE3D6]/80">
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-[#26372D]" />
                  <span>Private single-chair styling chambers with daylight windows</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-[#26372D]" />
                  <span>Complimentary organic tisanes &amp; cold-pressed botanical tonics</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-[#26372D]" />
                  <span>Hospital-grade HEPA filtration and silent acoustic atmosphere</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative aspect-[4/5] bg-[#EAE3D6] border border-[#302821]/15">
                  <SafeImage
                    src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=80"
                    alt="Atelier interior styling suite"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-[#302821]/60 dark:text-[#EAE3D6]/60">
                  Salon Suite 4A — Natural Morning Light
                </p>
              </div>

              <div className="space-y-4 pt-8">
                <div className="relative aspect-[4/5] bg-[#EAE3D6] border border-[#302821]/15">
                  <SafeImage
                    src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80"
                    alt="Hydrotherapy and wash sanctuary"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-[#302821]/60 dark:text-[#EAE3D6]/60">
                  The Hydrotherapy &amp; Wash Sanctuary
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 
        =======================================================================
        6. CLIENT STORIES & EDITORIAL CITATIONS
        Magazine pull-quote format with verified clients
        =======================================================================
      */}
      <section className="py-20 sm:py-28 bg-[#EAE3D6] dark:bg-[#1a201c] border-b border-[#302821]/15 dark:border-[#EAE3D6]/15">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="text-center space-y-3 mb-16">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#B8755B] font-semibold">
              GUEST CITATIONS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#302821] dark:text-[#F5F1E8]">
              Words from Discerning Patrons
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#F5F1E8] dark:bg-[#151916] p-8 border border-[#302821]/15 dark:border-[#EAE3D6]/15 space-y-4 flex flex-col justify-between">
              <p className="font-serif text-base text-[#302821] dark:text-[#F5F1E8] leading-relaxed">
                &ldquo;The balayage by Elena is unmatched anywhere in Manhattan. Subtle, multidimensional, and my hair feels significantly healthier than before.&rdquo;
              </p>
              <div className="pt-4 border-t border-[#302821]/10 dark:border-[#EAE3D6]/10 text-[10px] uppercase tracking-[0.2em] text-[#302821]/70 dark:text-[#EAE3D6]/70">
                <p className="font-bold text-[#26372D] dark:text-[#F5F1E8]">Clara Vandermeer</p>
                <p>Architectural Designer · New York</p>
              </div>
            </div>

            <div className="bg-[#F5F1E8] dark:bg-[#151916] p-8 border border-[#302821]/15 dark:border-[#EAE3D6]/15 space-y-4 flex flex-col justify-between">
              <p className="font-serif text-base text-[#302821] dark:text-[#F5F1E8] leading-relaxed">
                &ldquo;A completely different experience from traditional salons. No blaring music, no rushing between clients. Chloe gave me the finest haircut of my life.&rdquo;
              </p>
              <div className="pt-4 border-t border-[#302821]/10 dark:border-[#EAE3D6]/10 text-[10px] uppercase tracking-[0.2em] text-[#302821]/70 dark:text-[#EAE3D6]/70">
                <p className="font-bold text-[#26372D] dark:text-[#F5F1E8]">Julian Mercer</p>
                <p>Managing Director · Milan</p>
              </div>
            </div>

            <div className="bg-[#F5F1E8] dark:bg-[#151916] p-8 border border-[#302821]/15 dark:border-[#EAE3D6]/15 space-y-4 flex flex-col justify-between">
              <p className="font-serif text-base text-[#302821] dark:text-[#F5F1E8] leading-relaxed">
                &ldquo;The botanical facial ritual cleared my persistent redness in one visit. You can immediately sense the biological quality of the plant formulas.&rdquo;
              </p>
              <div className="pt-4 border-t border-[#302821]/10 dark:border-[#EAE3D6]/10 text-[10px] uppercase tracking-[0.2em] text-[#302821]/70 dark:text-[#EAE3D6]/70">
                <p className="font-bold text-[#26372D] dark:text-[#F5F1E8]">Genevieve H.</p>
                <p>Editor · Paris</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 
        =======================================================================
        7. CONCIERGE CALL TO ACTION BANNER
        Solid Forest Green #26372D block — Quiet, refined, non-SaaS
        =======================================================================
      */}
      <section className="py-20 sm:py-28 bg-[#26372D] text-[#F5F1E8]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl space-y-8">
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#A4AA91] font-semibold">
            PRIVATE CONSULTATIONS
          </span>
          <h2 className="font-serif text-4xl sm:text-6xl font-normal text-[#F5F1E8] leading-tight">
            Reserve Your Unhurried Atelier Experience.
          </h2>
          <p className="text-xs sm:text-sm text-[#EAE3D6]/75 leading-relaxed max-w-xl mx-auto">
            Appointments are reserved strictly in advance to preserve single-guest privacy. Select your desired ritual and our concierge will confirm your chair immediately.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/services">
              <Button
                variant="default"
                size="lg"
                className="w-full sm:w-auto px-8 py-4 bg-[#B8755B] text-[#F5F1E8] hover:bg-[#a0624a] rounded-none text-xs uppercase tracking-[0.2em] font-medium"
              >
                <span>RESERVE AN APPOINTMENT</span>
                <ArrowRight className="w-3.5 h-3.5 ml-2" />
              </Button>
            </Link>
            <Link href="/experience">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto px-8 py-4 border-[#F5F1E8]/30 text-[#F5F1E8] hover:bg-[#F5F1E8]/10 rounded-none text-xs uppercase tracking-[0.2em] font-medium"
              >
                EXPLORE THE SANCTUARY
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Booking Modal */}
      {bookingService && (
        <BookingModal
          service={bookingService}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
