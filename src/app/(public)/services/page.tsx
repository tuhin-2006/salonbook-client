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
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { BookingModal } from "@/components/booking/BookingModal";
import { Service, ApiResponse } from "@/types";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

const fallbackServices: Service[] = [
  {
    _id: "s1",
    title: "Signature French Balayage & Silk Glaze",
    slug: "signature-balayage-silk-glaze",
    category: "Hair",
    description:
      "Hand-painted custom French balayage tailored to your complexion and bone structure, finished with a luminous silk shine glaze and luxury botanical blowout.",
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
    _id: "s2",
    title: "Precision Architectural Cut & Silk Blowout",
    slug: "precision-architectural-cut-silk-blowout",
    category: "Hair",
    description:
      "Geometric precision cutting tailored to hair density and growth direction, scalp detox massage, customized deep conditioning masque, and signature blowout.",
    price: 110,
    durationMinutes: 60,
    images: [
      "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=1200&q=85",
    ],
    isActive: true,
    specialists: ["Céline Laurent", "David Rossi"],
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
    specialists: ["Dr. Mathis Vance (Aesthetician)"],
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
      "https://images.unsplash.com/photo-1512290900672-1f41d996d926?auto=format&fit=crop&w=1200&q=85",
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
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1200&q=85",
    ],
    isActive: true,
    specialists: ["Mia Lindqvist"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "s6",
    title: "Deep Tissue Volcanic Basalt Stone Ritual",
    slug: "deep-tissue-volcanic-stone-ritual",
    category: "Massage",
    description:
      "Heated basalt stones infused with organic lavender and frankincense essential oils to melt away chronic muscular tension and restore nervous equilibrium.",
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
    _id: "s7",
    title: "Royal Bridal Couture Glamour Package",
    slug: "royal-bridal-couture-glamour-package",
    category: "Makeup",
    description:
      "The definitive bridal transformation featuring high-definition airbrush makeup, couture hair updo, veil positioning, and luxury mink lash application.",
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
  "Barbering",
  "Spa & Wellness",
  "Massage",
  "Nails",
  "Facial & Skin",
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

  // Client-side filtering & price tier
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
    <div className="min-h-screen py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <SectionHeading
            badge="Haute Carte Catalog"
            title="Curated Services & Master Rituals"
            subtitle="Browse our comprehensive menu of botanical treatments. Filter by department, price tier, or search specific techniques."
          />

          {/* View Switcher Controls */}
          <div className="flex items-center gap-2 bg-secondary/80 dark:bg-card p-1 rounded-2xl border border-border/80 self-start md:self-end">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                viewMode === "grid"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Gallery Grid
            </button>
            <button
              type="button"
              onClick={() => setViewMode("menu")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                viewMode === "menu"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <List className="w-3.5 h-3.5" />
              Editorial Carte
            </button>
          </div>
        </div>

        {/* Search & Filter Toolbar Suite */}
        <div className="rounded-3xl border border-gold-500/20 bg-card p-6 shadow-xl mb-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="md:col-span-8 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search rituals by keyword, technique, or specialist (e.g. Balayage, Caviar, Hot Stone)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-12 bg-background rounded-2xl border-input focus:border-gold-500/50 text-sm"
              />
            </div>

            {/* Sort Price Dropdown */}
            <div className="md:col-span-4 flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-muted-foreground shrink-0" />
              <select
                value={sortPrice}
                onChange={(e) => setSortPrice(e.target.value as "none" | "asc" | "desc")}
                className="w-full h-12 rounded-2xl border border-input bg-background px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gold-500/50"
              >
                <option value="none">Sort: Recommended Order</option>
                <option value="asc">Price: Low to High</option>
                <option value="desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Quick Price Tier Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border/60">
            <span className="text-[11px] uppercase font-bold tracking-wider text-muted-foreground mr-1">
              Price Tier:
            </span>
            <button
              type="button"
              onClick={() => setPriceTier("all")}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                priceTier === "all"
                  ? "bg-gold-500/20 border border-gold-500 text-gold-700 dark:text-gold-300"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80"
              }`}
            >
              All Tiers
            </button>
            <button
              type="button"
              onClick={() => setPriceTier("under100")}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                priceTier === "under100"
                  ? "bg-gold-500/20 border border-gold-500 text-gold-700 dark:text-gold-300"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80"
              }`}
            >
              Essential (&lt; $100)
            </button>
            <button
              type="button"
              onClick={() => setPriceTier("100to200")}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                priceTier === "100to200"
                  ? "bg-gold-500/20 border border-gold-500 text-gold-700 dark:text-gold-300"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80"
              }`}
            >
              Signature ($100 – $200)
            </button>
            <button
              type="button"
              onClick={() => setPriceTier("over200")}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                priceTier === "over200"
                  ? "bg-gold-500/20 border border-gold-500 text-gold-700 dark:text-gold-300"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80"
              }`}
            >
              Haute Couture ($200+)
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
            <SlidersHorizontal className="w-4 h-4 text-gold-500 shrink-0 mr-1" />
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                    isSelected
                      ? "bg-gradient-to-r from-forest-900 to-forest-800 text-white shadow-md dark:from-gold-500 dark:to-terracotta-500"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-transparent"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter & Active Filters Bar */}
        <div className="flex items-center justify-between mb-8 text-sm text-muted-foreground">
          <p>
            Curated <span className="font-semibold text-foreground">{filteredServices.length}</span> ritual{filteredServices.length !== 1 ? "s" : ""} in atelier
          </p>
          {(search || selectedCategory !== "All" || sortPrice !== "none" || priceTier !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="gap-1.5 text-xs text-muted-foreground hover:text-foreground rounded-full"
            >
              <FilterX className="w-3.5 h-3.5 text-primary" /> Reset active filters
            </Button>
          )}
        </div>

        {/* Services View Rendering */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-gold-500/30 rounded-3xl bg-card/40 space-y-4 max-w-md mx-auto">
            <Sparkles className="w-10 h-10 text-gold-500 mx-auto animate-pulse" />
            <h3 className="font-serif text-2xl font-bold text-foreground">No Rituals Match Your Search</h3>
            <p className="text-muted-foreground text-xs leading-relaxed">
              We couldn&apos;t find an offering matching your criteria. Try adjusting your search keywords or switching price tiers.
            </p>
            <Button variant="outline" onClick={handleResetFilters} className="rounded-full text-xs">
              View All Services
            </Button>
          </div>
        ) : viewMode === "grid" ? (
          /* 1. Gallery Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <div
                key={service._id}
                className="group rounded-3xl border border-border/80 bg-card overflow-hidden shadow-sm hover:shadow-2xl hover:border-gold-500/40 transition-all duration-300 flex flex-col"
              >
                {/* Service Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={service.images[0] || "https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=1200&q=85"}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="terracotta" className="backdrop-blur-md shadow-md">
                      {service.category}
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 right-3 px-3.5 py-1 rounded-full bg-forest-950/85 backdrop-blur-md text-white font-serif font-bold text-sm border border-gold-500/25">
                    {formatCurrency(service.price)}
                  </div>
                </div>

                {/* Service Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gold-600 dark:text-gold-400 font-semibold">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{service.durationMinutes} Minutes</span>
                      <span>•</span>
                      <span>{service.specialists?.[0] || "Master Stylist"}</span>
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
        ) : (
          /* 2. Haute Carte / Editorial Spa Menu View */
          <div className="rounded-3xl border border-gold-500/20 bg-card p-6 sm:p-10 shadow-xl divide-y divide-border/60">
            {filteredServices.map((service) => (
              <div
                key={service._id}
                className="py-6 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-6 group"
              >
                <div className="flex items-start gap-5 flex-1">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 hidden sm:block border border-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={service.images[0]}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-serif text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                        {service.title}
                      </h4>
                      <Badge variant="terracotta" className="text-[10px] py-0 px-2">
                        {service.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
                      {service.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gold-600 dark:text-gold-400 font-medium pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {service.durationMinutes} Minutes
                      </span>
                      <span>Resident: {service.specialists?.[0] || "Master Artist"}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:flex-col md:items-end gap-3 shrink-0">
                  <span className="font-serif text-2xl font-bold text-foreground">
                    {formatCurrency(service.price)}
                  </span>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/services/${service._id}`}
                      className="text-xs text-muted-foreground hover:text-foreground font-semibold px-2 py-1"
                    >
                      Details
                    </Link>
                    <Button
                      variant="luxury"
                      size="sm"
                      onClick={() => handleOpenBooking(service)}
                      className="gap-1.5 rounded-full px-4 text-xs font-semibold shadow-md shadow-forest-950/10"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Reserve
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <BookingModal
        service={selectedService}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen py-24 flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent animate-spin rounded-full" />
        </div>
      }
    >
      <ServicesContent />
    </Suspense>
  );
}
