"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Clock,
  ArrowUpDown,
  FilterX,
  LayoutGrid,
  List,
  ArrowRight,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookingModal } from "@/components/booking/BookingModal";
import { SafeImage } from "@/components/ui/SafeImage";
import { Service, ApiResponse } from "@/types";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

const fallbackServices: Service[] = [
  {
    _id: "s1",
    title: "Signature Balayage & Silk Glaze",
    slug: "signature-balayage-silk-glaze",
    category: "Hair",
    description:
      "Hand-painted custom French balayage tailored to your cranial bone structure, finished with a luminous silk shine glaze and luxury botanical blowout.",
    price: 195,
    durationMinutes: 120,
    images: [
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1200&q=85",
    ],
    isActive: true,
    specialists: ["Elena Vance (Master Colorist)", "Chloe Moreau"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "s2",
    title: "Precision Cut & Silk Blowout",
    slug: "precision-cut-silk-blowout",
    category: "Hair",
    description:
      "Geometric precision cutting tailored to hair density and natural fall, rosemary scalp detox massage, customized deep conditioning masque, and natural diffuse finish.",
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
    _id: "s3",
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
    specialists: ["Sofia Rossi (Aesthetician)"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "s4",
    title: "Hydra-Botanical Deep Cleanse & Extraction",
    slug: "hydra-botanical-deep-cleanse-extraction",
    category: "Facial & Skin",
    description:
      "Vortex-fusion medical grade hydration, sonic extractions, clarifying botanical peel, and antioxidant LED light therapy to unveil glass-like luminosity.",
    price: 145,
    durationMinutes: 60,
    images: [
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=85",
    ],
    isActive: true,
    specialists: ["Sarah Jenkins"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "s5",
    title: "Russian Gel Manicure & Botanical Spa",
    slug: "russian-gel-manicure-botanical-spa",
    category: "Nails",
    description:
      "Flawless dry e-file cuticle work, structural apex gel reinforcement, nourishing organic rose petal soak, and organic argan oil arm massage.",
    price: 85,
    durationMinutes: 75,
    images: [
      "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1200&q=85",
    ],
    isActive: true,
    specialists: ["Mia Lindqvist"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "s6",
    title: "Deep Tissue Volcanic Basalt Stone Massage",
    slug: "deep-tissue-volcanic-stone-massage",
    category: "Massage",
    description:
      "Heated basalt stones infused with organic lavender and frankincense essential oils to melt away chronic muscular tension and restore nervous equilibrium.",
    price: 165,
    durationMinutes: 90,
    images: [
      "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=1200&q=85",
    ],
    isActive: true,
    specialists: ["Liam Thorne (RMT)"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "s7",
    title: "Royal Bridal Couture Glamour Package",
    slug: "royal-bridal-couture-glamour-package",
    category: "Makeup",
    description:
      "The definitive bridal transformation featuring high-definition airbrush makeup, couture hair updo, veil positioning, and luxury lash application.",
    price: 320,
    durationMinutes: 150,
    images: [
      "https://images.unsplash.com/photo-1516914943479-89db7d9ae7f2?auto=format&fit=crop&w=1200&q=85",
    ],
    isActive: true,
    specialists: ["Victoria Sterling (Bridal Director)"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "s8",
    title: "Executive Beard Sculpt & Hot Towel Shave",
    slug: "executive-beard-sculpt-hot-towel-shave",
    category: "Barbering",
    description:
      "Traditional straight razor precision line work, eucalyptus steam towels, sandalwood pre-shave oil massage, and organic cold-pressed beard conditioning balm.",
    price: 75,
    durationMinutes: 45,
    images: [
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=85",
    ],
    isActive: true,
    specialists: ["Marcus Sterling"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "s9",
    title: "Aromatherapy Thermal Spa & Hydro-Detox",
    slug: "aromatherapy-thermal-spa-hydro-detox",
    category: "Spa & Wellness",
    description:
      "A complete hydro-detox experience featuring steam inhalation, mineral-rich thermal salt soak, lymphatic dry brushing, and restorative herbal tea ceremony.",
    price: 150,
    durationMinutes: 90,
    images: [
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=85",
    ],
    isActive: true,
    specialists: ["Camilla Dubois"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "s10",
    title: "Gentle Botanical Full Body Waxing",
    slug: "gentle-botanical-full-body-waxing",
    category: "Waxing",
    description:
      "Hypoallergenic organic chamomile hard wax treatment designed for sensitive skin, followed by soothing lavender and tea tree calming serum.",
    price: 110,
    durationMinutes: 60,
    images: [
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1200&q=85",
    ],
    isActive: true,
    specialists: ["Chloe Moreau"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const categories = [
  "All",
  "Hair",
  "Facial & Skin",
  "Massage",
  "Nails",
  "Barbering",
  "Spa & Wellness",
  "Makeup",
  "Waxing",
];

function ServicesContent() {
  const searchParams = useSearchParams();
  const initialCategoryParam = searchParams.get("category");

  const [services, setServices] = useState<Service[]>(fallbackServices);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    initialCategoryParam || "All"
  );
  const [sortPrice, setSortPrice] = useState<"none" | "asc" | "desc">("none");
  const [priceTier, setPriceTier] = useState<"all" | "under100" | "100to200" | "over200">("all");
  const [viewMode, setViewMode] = useState<"grid" | "menu">("grid");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (initialCategoryParam) {
      setSelectedCategory(initialCategoryParam);
    }
  }, [initialCategoryParam]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get<ApiResponse<{ services: Service[] }>>(
          "/services?limit=40&isActive=true"
        );
        if (res.data.success && res.data.data.services.length > 0) {
          setServices(res.data.data.services);
        }
      } catch (err) {
        console.warn("Using curated fallback treatments:", err);
      }
    };
    fetchServices();
  }, []);

  const handleOpenBooking = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleResetFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setSortPrice("none");
    setPriceTier("all");
  };

  const filteredServices = useMemo(() => {
    return services
      .filter((service) => {
        const matchesCategory =
          selectedCategory === "All" || service.category === selectedCategory;
        const matchesSearch =
          service.title.toLowerCase().includes(search.toLowerCase()) ||
          service.description.toLowerCase().includes(search.toLowerCase()) ||
          service.specialists?.some((s) =>
            s.toLowerCase().includes(search.toLowerCase())
          );

        let matchesPriceTier = true;
        if (priceTier === "under100") matchesPriceTier = service.price < 100;
        else if (priceTier === "100to200")
          matchesPriceTier = service.price >= 100 && service.price <= 200;
        else if (priceTier === "over200") matchesPriceTier = service.price > 200;

        return matchesCategory && matchesSearch && matchesPriceTier;
      })
      .sort((a, b) => {
        if (sortPrice === "asc") return a.price - b.price;
        if (sortPrice === "desc") return b.price - a.price;
        return 0;
      });
  }, [services, selectedCategory, search, priceTier, sortPrice]);

  return (
    <div className="min-h-screen py-12 sm:py-20 bg-[#F5F1E8] dark:bg-[#151916] text-[#302821] dark:text-[#F5F1E8]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Top Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-8 border-b border-[#302821]/15 dark:border-[#EAE3D6]/15">
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#B8755B] font-semibold">
              LA CARTE GÉNÉRALE DES SOINS
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#302821] dark:text-[#F5F1E8]">
              Curated Treatments &amp; Rituals
            </h1>
            <p className="text-xs sm:text-sm text-[#302821]/75 dark:text-[#EAE3D6]/75 max-w-xl leading-relaxed">
              Formulated with wild botanical extracts, cold-pressed seed oils, and cranial scissor architecture. Select your treatment to review the clinical dossier and reserve your chair.
            </p>
          </div>

          {/* View Mode Toggle: Grid vs Classic Carte */}
          <div className="flex items-center gap-1 border border-[#302821]/20 dark:border-[#EAE3D6]/20 bg-[#EAE3D6]/50 dark:bg-[#1a201c] p-1 self-start md:self-end">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] font-medium transition-all ${
                viewMode === "grid"
                  ? "bg-[#26372D] text-[#F5F1E8]"
                  : "text-[#302821]/70 dark:text-[#EAE3D6]/70 hover:text-[#302821]"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>GALLERY</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("menu")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] font-medium transition-all ${
                viewMode === "menu"
                  ? "bg-[#26372D] text-[#F5F1E8]"
                  : "text-[#302821]/70 dark:text-[#EAE3D6]/70 hover:text-[#302821]"
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>CARTE</span>
            </button>
          </div>
        </div>

        {/* Filter and Search Bar: Architectural Surface */}
        <div className="border border-[#302821]/15 dark:border-[#EAE3D6]/15 bg-[#EAE3D6]/40 dark:bg-[#1a201c] p-6 mb-10 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="md:col-span-8 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#302821]/50 dark:text-[#EAE3D6]/50" />
              <Input
                placeholder="Search treatments by title, botanical ingredient, or master stylist..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-11 bg-[#F5F1E8] dark:bg-[#151916] rounded-none border-[#302821]/20 dark:border-[#EAE3D6]/20 text-xs text-[#302821] dark:text-[#F5F1E8] placeholder:text-[#302821]/50 focus-visible:ring-1 focus-visible:ring-[#26372D]"
              />
            </div>

            {/* Price Sort */}
            <div className="md:col-span-4 flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-[#302821]/60 shrink-0" />
              <select
                value={sortPrice}
                onChange={(e) => setSortPrice(e.target.value as "none" | "asc" | "desc")}
                className="w-full h-11 rounded-none border border-[#302821]/20 dark:border-[#EAE3D6]/20 bg-[#F5F1E8] dark:bg-[#151916] px-3 text-xs uppercase tracking-wider text-[#302821] dark:text-[#F5F1E8] focus:outline-none"
              >
                <option value="none">SORT: ATELIER ORDER</option>
                <option value="asc">PRICE: LOWEST FIRST</option>
                <option value="desc">PRICE: HIGHEST FIRST</option>
              </select>
            </div>
          </div>

          {/* Price Tier Filters */}
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[#302821]/10 dark:border-[#EAE3D6]/10">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#302821]/60 dark:text-[#EAE3D6]/60 mr-2">
              PRICE TIER:
            </span>
            <button
              type="button"
              onClick={() => setPriceTier("all")}
              className={`px-3 py-1 text-[11px] uppercase tracking-wider transition-all rounded-none border ${
                priceTier === "all"
                  ? "bg-[#26372D] text-[#F5F1E8] border-[#26372D]"
                  : "bg-transparent text-[#302821]/70 dark:text-[#EAE3D6]/70 border-transparent hover:border-[#302821]/20"
              }`}
            >
              ALL TIERS
            </button>
            <button
              type="button"
              onClick={() => setPriceTier("under100")}
              className={`px-3 py-1 text-[11px] uppercase tracking-wider transition-all rounded-none border ${
                priceTier === "under100"
                  ? "bg-[#26372D] text-[#F5F1E8] border-[#26372D]"
                  : "bg-transparent text-[#302821]/70 dark:text-[#EAE3D6]/70 border-transparent hover:border-[#302821]/20"
              }`}
            >
              UNDER $100
            </button>
            <button
              type="button"
              onClick={() => setPriceTier("100to200")}
              className={`px-3 py-1 text-[11px] uppercase tracking-wider transition-all rounded-none border ${
                priceTier === "100to200"
                  ? "bg-[#26372D] text-[#F5F1E8] border-[#26372D]"
                  : "bg-transparent text-[#302821]/70 dark:text-[#EAE3D6]/70 border-transparent hover:border-[#302821]/20"
              }`}
            >
              $100 — $200
            </button>
            <button
              type="button"
              onClick={() => setPriceTier("over200")}
              className={`px-3 py-1 text-[11px] uppercase tracking-wider transition-all rounded-none border ${
                priceTier === "over200"
                  ? "bg-[#26372D] text-[#F5F1E8] border-[#26372D]"
                  : "bg-transparent text-[#302821]/70 dark:text-[#EAE3D6]/70 border-transparent hover:border-[#302821]/20"
              }`}
            >
              $200+
            </button>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none border-t border-[#302821]/10 dark:border-[#EAE3D6]/10">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#26372D] dark:text-[#A4AA91] shrink-0 mr-1" />
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] whitespace-nowrap transition-all rounded-none border ${
                    isSelected
                      ? "bg-[#26372D] text-[#F5F1E8] border-[#26372D]"
                      : "bg-[#F5F1E8] dark:bg-[#151916] text-[#302821]/70 dark:text-[#EAE3D6]/70 border-[#302821]/15 hover:border-[#302821]/40"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter & Reset */}
        <div className="flex items-center justify-between mb-8 text-xs text-[#302821]/70 dark:text-[#EAE3D6]/70 uppercase tracking-wider">
          <p>
            INDEXING <span className="font-semibold text-[#26372D] dark:text-[#F5F1E8]">{filteredServices.length}</span> TREATMENTS
          </p>
          {(search || selectedCategory !== "All" || sortPrice !== "none" || priceTier !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="gap-1 text-[11px] uppercase tracking-wider text-[#B8755B] hover:bg-transparent hover:underline h-7 px-2"
            >
              <FilterX className="w-3.5 h-3.5" /> RESET FILTERS
            </Button>
          )}
        </div>

        {/* Service Cards Render */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-[#302821]/20 bg-[#EAE3D6]/30 p-8 space-y-4 max-w-md mx-auto">
            <h3 className="font-serif text-xl text-[#302821] dark:text-[#F5F1E8]">No Treatments Found</h3>
            <p className="text-[#302821]/70 dark:text-[#EAE3D6]/70 text-xs leading-relaxed">
              We could not find any treatment matching your criteria. Reset filters to review the full atelier carte.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetFilters}
              className="rounded-none text-xs uppercase tracking-wider border-[#302821]/30"
            >
              Clear Filters
            </Button>
          </div>
        ) : viewMode === "grid" ? (
          /* Gallery Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service, idx) => (
              <div
                key={service._id}
                className="group flex flex-col justify-between bg-[#EAE3D6]/40 dark:bg-[#1a201c] border border-[#302821]/15 dark:border-[#EAE3D6]/15 hover:border-[#26372D] transition-colors"
              >
                <div>
                  {/* Photo Frame */}
                  <div className="relative aspect-[16/11] overflow-hidden bg-[#EAE3D6] border-b border-[#302821]/15 dark:border-[#EAE3D6]/15">
                    <SafeImage
                      src={
                        service.images[0] ||
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
                        {service.durationMinutes} MIN
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
                <div className="p-6 pt-0 border-t border-[#302821]/10 dark:border-[#EAE3D6]/10 mt-3 flex items-center justify-between">
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
                      onClick={() => handleOpenBooking(service)}
                      className="rounded-none text-[11px] tracking-[0.15em] uppercase px-4 py-2 bg-[#26372D] text-[#F5F1E8] hover:bg-[#343D2E]"
                    >
                      RESERVE
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Classic Editorial Carte (List View) */
          <div className="border border-[#302821]/15 dark:border-[#EAE3D6]/15 bg-[#EAE3D6]/40 dark:bg-[#1a201c] divide-y divide-[#302821]/10 dark:divide-[#EAE3D6]/10">
            {filteredServices.map((service, idx) => (
              <div
                key={service._id}
                className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-[#EAE3D6]/70 transition-colors"
              >
                <div className="flex items-start gap-5 flex-1">
                  <div className="relative w-24 h-24 overflow-hidden shrink-0 hidden sm:block border border-[#302821]/15">
                    <SafeImage
                      src={
                        service.images[0] ||
                        "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1200&q=85"
                      }
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-serif text-sm font-semibold text-[#B8755B]">
                        0{idx + 1}
                      </span>
                      <h3 className="font-serif text-xl text-[#302821] dark:text-[#F5F1E8]">
                        {service.title}
                      </h3>
                      <span className="text-[10px] uppercase tracking-wider text-[#A4AA91] border border-[#A4AA91]/40 px-2 py-0.5">
                        {service.category}
                      </span>
                    </div>

                    <p className="text-xs text-[#302821]/75 dark:text-[#EAE3D6]/75 leading-relaxed line-clamp-2 max-w-2xl">
                      {service.description}
                    </p>

                    <div className="flex items-center gap-4 text-[11px] text-[#302821]/60 dark:text-[#EAE3D6]/60 uppercase tracking-wider pt-1">
                      <span>DURATION: {service.durationMinutes} MIN</span>
                      <span>•</span>
                      <span>SPECIALIST: {service.specialists?.[0] || "RESIDENT MASTER"}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-[#302821]/10">
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-wider text-[#302821]/60 block">
                      FEE
                    </span>
                    <span className="font-serif text-xl font-medium text-[#26372D] dark:text-[#F5F1E8]">
                      {formatCurrency(service.price)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link href={`/services/${service._id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-none text-[11px] tracking-[0.15em] uppercase hover:underline"
                      >
                        DOSSIER
                      </Button>
                    </Link>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleOpenBooking(service)}
                      className="rounded-none text-[11px] tracking-[0.15em] uppercase px-4 py-2 bg-[#26372D] text-[#F5F1E8] hover:bg-[#343D2E]"
                    >
                      RESERVE
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedService && (
        <BookingModal
          service={selectedService}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center">
          <div className="w-8 h-8 border-2 border-[#26372D] border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-[#302821]/70 mt-3 uppercase tracking-wider">
            Loading Atelier Carte...
          </p>
        </div>
      }
    >
      <ServicesContent />
    </Suspense>
  );
}
