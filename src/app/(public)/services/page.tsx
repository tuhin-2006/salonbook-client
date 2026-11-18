"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  Clock,
  Sparkles,
  ArrowUpDown,
  FilterX,
  LayoutGrid,
  List,
  ArrowRight,
  ShieldCheck,
  Check,
  Scissors,
  Flame,
  Heart,
  Star,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
    _id: "s2",
    title: "Precision Cut & Silk Blowout",
    slug: "precision-cut-silk-blowout",
    category: "Hair",
    description:
      "Geometric precision cutting tailored to hair density and growth direction, scalp detox massage, customized deep conditioning masque, and signature blowout.",
    price: 95,
    durationMinutes: 60,
    images: [
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80",
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
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
    ],
    isActive: true,
    specialists: ["Sofia Rossi (Aesthetician)"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "s4",
    title: "Hydra-Luxe Deep Cleanse & Extraction",
    slug: "hydra-luxe-deep-cleanse-extraction",
    category: "Facial & Skin",
    description:
      "Vortex-fusion medical grade hydration, sonic extractions, clarifying botanical peel, and antioxidant LED light therapy to unveil glass-like luminosity.",
    price: 140,
    durationMinutes: 60,
    images: [
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80",
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
    _id: "s6",
    title: "Deep Tissue Volcanic Basalt Stone Massage",
    slug: "deep-tissue-volcanic-stone-massage",
    category: "Massage",
    description:
      "Heated basalt stones infused with organic lavender and frankincense essential oils to melt away chronic muscular tension and restore nervous equilibrium.",
    price: 160,
    durationMinutes: 90,
    images: [
      "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=800&q=80",
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
      "https://images.unsplash.com/photo-1516914943479-89db7d9ae7f2?auto=format&fit=crop&w=800&q=80",
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
    price: 65,
    durationMinutes: 45,
    images: [
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80",
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
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80",
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
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=800&q=80",
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
        const queryParams = new URLSearchParams();
        if (selectedCategory !== "All") queryParams.append("category", selectedCategory);
        if (search) queryParams.append("search", search);
        if (sortPrice !== "none") queryParams.append("sortPrice", sortPrice);

        const res = await api.get<ApiResponse<{ services: Service[] }>>(
          `/services?${queryParams.toString()}`
        );
        if (res.data.data.services && res.data.data.services.length > 0) {
          setServices(res.data.data.services);
        }
      } catch (err) {
        console.warn("Using curated client fallback for services:", err);
      }
    };

    fetchServices();
  }, [selectedCategory, search, sortPrice]);

  const filteredServices = useMemo(() => {
    return services
      .filter((s) => {
        const matchesCategory =
          selectedCategory === "All" ||
          s.category === selectedCategory ||
          s.category.toLowerCase().includes(selectedCategory.toLowerCase());

        const matchesSearch =
          s.title.toLowerCase().includes(search.toLowerCase()) ||
          s.description.toLowerCase().includes(search.toLowerCase());

        let matchesPriceTier = true;
        if (priceTier === "under100") matchesPriceTier = s.price < 100;
        else if (priceTier === "100to200") matchesPriceTier = s.price >= 100 && s.price <= 200;
        else if (priceTier === "over200") matchesPriceTier = s.price > 200;

        return matchesCategory && matchesSearch && matchesPriceTier;
      })
      .sort((a, b) => {
        if (sortPrice === "asc") return a.price - b.price;
        if (sortPrice === "desc") return b.price - a.price;
        return 0;
      });
  }, [services, selectedCategory, search, sortPrice, priceTier]);

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

  return (
    <div className="min-h-screen py-10 sm:py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Service Catalog</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Services & Treatments
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-xl">
              Choose from our curated salon offerings. Filter by category, price, or search for your favorite stylist.
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1.5 bg-secondary/80 dark:bg-card p-1 rounded-xl border border-border self-start md:self-end">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === "grid"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid View</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("menu")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === "menu"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List View</span>
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="md:col-span-8 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search treatments by title or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-11 bg-background rounded-xl border-input text-sm"
              />
            </div>

            {/* Price Sort */}
            <div className="md:col-span-4 flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-muted-foreground shrink-0" />
              <select
                value={sortPrice}
                onChange={(e) => setSortPrice(e.target.value as "none" | "asc" | "desc")}
                className="w-full h-11 rounded-xl border border-input bg-background px-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="none">Sort: Default Order</option>
                <option value="asc">Price: Low to High</option>
                <option value="desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Price Tier Filters */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mr-1">
              Price Range:
            </span>
            <button
              type="button"
              onClick={() => setPriceTier("all")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                priceTier === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              All Prices
            </button>
            <button
              type="button"
              onClick={() => setPriceTier("under100")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                priceTier === "under100"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              Under $100
            </button>
            <button
              type="button"
              onClick={() => setPriceTier("100to200")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                priceTier === "100to200"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              $100 – $200
            </button>
            <button
              type="button"
              onClick={() => setPriceTier("over200")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                priceTier === "over200"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              $200+
            </button>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
            <SlidersHorizontal className="w-3.5 h-3.5 text-primary shrink-0 mr-1" />
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 border ${
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20"
                      : "bg-background text-muted-foreground hover:text-foreground border-border hover:border-primary/40"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6 text-xs text-muted-foreground font-medium">
          <p>
            Showing <span className="font-bold text-foreground">{filteredServices.length}</span> services
          </p>
          {(search || selectedCategory !== "All" || sortPrice !== "none" || priceTier !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="gap-1 text-xs text-primary font-bold hover:bg-primary/10 h-7 px-2"
            >
              <FilterX className="w-3.5 h-3.5" /> Reset Filters
            </Button>
          )}
        </div>

        {/* Service Cards Render */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-2xl bg-card p-8 space-y-3 max-w-md mx-auto">
            <Sparkles className="w-8 h-8 text-primary mx-auto" />
            <h3 className="text-lg font-bold text-foreground">No Services Found</h3>
            <p className="text-muted-foreground text-xs leading-relaxed">
              We couldn&apos;t find any service matching your filter criteria. Try clearing some filters.
            </p>
            <Button variant="outline" size="sm" onClick={handleResetFilters} className="rounded-xl text-xs font-bold">
              Clear All Filters
            </Button>
          </div>
        ) : viewMode === "grid" ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service._id}
                className="group rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/50 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Service Image with SafeImage */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    <SafeImage
                      src={service.images[0] || "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80"}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-background/90 backdrop-blur-md text-foreground border border-border">
                        {service.category}
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-slate-900/90 backdrop-blur-md text-white font-extrabold text-sm border border-slate-700">
                      {formatCurrency(service.price)}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      <span>{service.durationMinutes} mins</span>
                      <span>•</span>
                      <span className="font-semibold text-foreground">
                        {service.specialists?.[0] || "Master Stylist"}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {service.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-5 pt-0 border-t border-border/60 mt-4 flex items-center justify-between gap-3">
                  <Link
                    href={`/services/${service._id}`}
                    className="text-xs font-bold text-muted-foreground hover:text-foreground underline underline-offset-4"
                  >
                    View Details
                  </Link>
                  <Button
                    variant="gradient"
                    size="sm"
                    onClick={() => handleOpenBooking(service)}
                    className="gap-1.5 rounded-xl px-4 text-xs font-bold"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Book Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm divide-y divide-border">
            {filteredServices.map((service) => (
              <div
                key={service._id}
                className="py-5 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 hidden sm:block border border-border">
                    <SafeImage
                      src={service.images[0] || "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80"}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                        {service.title}
                      </h4>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-primary/10 text-primary">
                        {service.category}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {service.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 font-semibold text-foreground">
                        <Clock className="w-3 h-3 text-primary" /> {service.durationMinutes} mins
                      </span>
                      <span>•</span>
                      <span>{service.specialists?.[0] || "Master Stylist"}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-border">
                  <div className="text-right">
                    <span className="text-lg font-black text-foreground">
                      {formatCurrency(service.price)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/services/${service._id}`}>
                      <Button variant="ghost" size="sm" className="text-xs font-bold">
                        Details
                      </Button>
                    </Link>
                    <Button
                      variant="gradient"
                      size="sm"
                      onClick={() => handleOpenBooking(service)}
                      className="text-xs font-bold rounded-xl"
                    >
                      Book Now
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
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-muted-foreground mt-3 font-semibold">
            Loading Services...
          </p>
        </div>
      }
    >
      <ServicesContent />
    </Suspense>
  );
}
