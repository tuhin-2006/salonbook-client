"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import {
  Search,
  Clock,
  ArrowUpDown,
  FilterX,
  ArrowRight,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles,
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
      "Hand-painted custom French balayage tailored to cranial bone structure, finished with a luminous silk shine glaze and luxury blowout.",
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
    _id: "s2",
    title: "Precision Haircut & Scalp Detox",
    slug: "precision-haircut-scalp-detox",
    category: "Hair",
    description:
      "Geometric precision cutting tailored to hair density and natural fall, rosemary scalp detox massage, customized masque, and natural diffuse finish.",
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
    title: "Caviar & Gold Youth Radiance Facial",
    slug: "caviar-gold-youth-radiance-facial",
    category: "Facial & Skin",
    description:
      "Opulent anti-aging journey featuring wild French caviar extract, 24K colloidal gold infusion, micro-current lifting, and cryo oxygen therapy.",
    price: 220,
    durationMinutes: 90,
    images: [
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=85",
    ],
    isActive: true,
    specialists: ["Sofia Rossi"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "s4",
    title: "Hydra-Botanical Deep Cleanse & Extraction",
    slug: "hydra-botanical-deep-cleanse-extraction",
    category: "Facial & Skin",
    description:
      "Vortex-fusion medical grade hydration, sonic extractions, clarifying botanical peel, and antioxidant LED light therapy.",
    price: 145,
    durationMinutes: 60,
    images: [
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=85",
    ],
    isActive: true,
    specialists: ["Sofia Rossi"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "s5",
    title: "Restorative Gel Manicure & Hand Therapy",
    slug: "restorative-gel-manicure",
    category: "Nails",
    description:
      "Dry e-file diamond cuticle therapy, natural builder strengthening treatment, warm jojoba compress, and clean nontoxic lacquer.",
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
    _id: "s6",
    title: "Volcanic Basalt Stone & Cedarwood Massage",
    slug: "volcanic-stone-massage",
    category: "Massage",
    description:
      "Heated basalt river stones aligned along meridian points, Mediterranean cedar and lavender oils, releasing deep postural tension.",
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
    _id: "s7",
    title: "Deep Neuromuscular Myofascial Therapy",
    slug: "deep-neuromuscular-myofascial-therapy",
    category: "Massage",
    description:
      "Targeted trigger-point therapy and slow myofascial release designed to alleviate chronic neck, shoulder, and spinal stiffness.",
    price: 140,
    durationMinutes: 60,
    images: [
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1200&q=85",
    ],
    isActive: true,
    specialists: ["Liam Thorne"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "s8",
    title: "Executive Straight-Razor Shave & Steam",
    slug: "executive-straight-razor-shave-steam",
    category: "Barbering",
    description:
      "Eucalyptus hot towel preparation, badger lathering, Japanese feather blade detailing, and chilled botanical rosemary tonic.",
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
    title: "Aromatherapy Spa Ritual & Hydro-Thermal Soak",
    slug: "aromatherapy-spa-ritual",
    category: "Spa & Wellness",
    description:
      "Complete hydro-detox experience featuring steam hydrotherapy, mineral-rich thermal salt soak, lymphatic dry brushing, and restorative herbal tea.",
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
      "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=1200&q=85",
    ],
    isActive: true,
    specialists: ["Sofia Rossi"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const categoriesList = [
  "All categories",
  "Hair",
  "Barbering",
  "Spa & Wellness",
  "Massage",
  "Nails",
  "Facial & Skin",
  "Makeup",
  "Waxing",
];

const ITEMS_PER_PAGE = 9;

function ServicesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const initialCategoryParam = searchParams.get("category");

  const [services, setServices] = useState<Service[]>(fallbackServices);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategoryParam || "All categories"
  );
  const [sortOption, setSortOption] = useState<string>("newest");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (initialCategoryParam) {
      const matched = categoriesList.find(
        (c) => c.toLowerCase() === initialCategoryParam.toLowerCase()
      );
      if (matched) setSelectedCategory(matched);
      else setSelectedCategory(initialCategoryParam);
    }
  }, [initialCategoryParam]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get<ApiResponse<{ services: Service[] }>>(
          "/services?limit=50&isActive=true"
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
    if (!isAuthenticated) {
      toast.info("Please sign in or create an account to book an appointment.");
      router.push(`/sign-in?redirect=${encodeURIComponent(`/services`)}`);
      return;
    }
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleViewDetails = (serviceId: string) => {
    if (!isAuthenticated) {
      toast.info("Please sign in or create an account to view service details.");
      router.push(`/sign-in?redirect=${encodeURIComponent(`/services/${serviceId}`)}`);
      return;
    }
    router.push(`/services/${serviceId}`);
  };

  const handleResetFilters = () => {
    setSearch("");
    setSelectedCategory("All categories");
    setSortOption("newest");
    setCurrentPage(1);
  };

  const filteredServices = useMemo(() => {
    return services
      .filter((service) => {
        const matchesCategory =
          selectedCategory === "All categories" ||
          service.category.toLowerCase() === selectedCategory.toLowerCase();

        const matchesSearch =
          service.title.toLowerCase().includes(search.toLowerCase()) ||
          service.description.toLowerCase().includes(search.toLowerCase()) ||
          service.specialists?.some((s) =>
            s.toLowerCase().includes(search.toLowerCase())
          );

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortOption === "price-asc") return a.price - b.price;
        if (sortOption === "price-desc") return b.price - a.price;
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
  }, [services, selectedCategory, search, sortOption]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory, sortOption]);

  const totalItems = filteredServices.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const paginatedServices = filteredServices.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen py-10 sm:py-16 bg-[#FAF7F2] dark:bg-[#170F13] text-[#231C1E] dark:text-[#FAF7F2] transition-colors duration-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#C5A880]">
                MENU &amp; RESERVATIONS
              </span>
              <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-[#3B1F2B] dark:bg-[#C5A880] text-[#FAF7F2] dark:text-[#170F13]">
                {totalItems} services available
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#231C1E] dark:text-[#FAF7F2]">
              Find your next ritual
            </h1>
            <p className="text-sm text-[#231C1E]/75 dark:text-[#FAF7F2]/75 max-w-xl leading-relaxed">
              Explore our curated menu of precision haircuts, clean botanical skincare, restorative massages, and traditional straight-razor barbering.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-[#231C1E]/70 dark:text-[#FAF7F2]/70 bg-[#FFFFFF] dark:bg-[#22161B] px-3.5 py-2 rounded-xl border border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10 shadow-sm self-start md:self-end">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Instant Slot Locking · Zero Double-Booking</span>
          </div>
        </div>

        {/* Interactive Controls Bar */}
        <div className="bg-[#FFFFFF] dark:bg-[#22161B] border border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10 rounded-2xl p-5 mb-8 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* 1. Search Input */}
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#231C1E]/50 dark:text-[#FAF7F2]/40" />
              <Input
                placeholder="Search services by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-11 bg-[#FAF7F2] dark:bg-[#2D1D24] rounded-xl border-[#3B1F2B]/15 dark:border-[#FAF7F2]/15 text-xs text-[#231C1E] dark:text-[#FAF7F2] placeholder:text-[#231C1E]/50 dark:placeholder:text-[#FAF7F2]/40 focus-visible:ring-1 focus-visible:ring-[#3B1F2B] dark:focus-visible:ring-[#C5A880]"
              />
            </div>

            {/* 2. Category Dropdown */}
            <div className="md:col-span-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full h-11 rounded-xl border border-[#3B1F2B]/15 dark:border-[#FAF7F2]/15 bg-[#FAF7F2] dark:bg-[#2D1D24] px-3 text-xs font-medium text-[#231C1E] dark:text-[#FAF7F2] focus:outline-none focus:ring-1 focus:ring-[#3B1F2B] dark:focus:ring-[#C5A880]"
              >
                {categoriesList.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Sort Dropdown */}
            <div className="md:col-span-3 flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-[#231C1E]/60 dark:text-[#FAF7F2]/60 shrink-0" />
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full h-11 rounded-xl border border-[#3B1F2B]/15 dark:border-[#FAF7F2]/15 bg-[#FAF7F2] dark:bg-[#2D1D24] px-3 text-xs font-medium text-[#231C1E] dark:text-[#FAF7F2] focus:outline-none focus:ring-1 focus:ring-[#3B1F2B] dark:focus:ring-[#C5A880]"
              >
                <option value="newest">Newest first</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category Quick Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 border-t border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10 no-scrollbar">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#3B1F2B] dark:text-[#C5A880] shrink-0 mr-1" />
            {categoriesList.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? "bg-[#3B1F2B] dark:bg-[#C5A880] text-[#FAF7F2] dark:text-[#170F13] shadow-sm"
                      : "bg-[#FAF7F2] dark:bg-[#2D1D24] text-[#231C1E]/75 dark:text-[#FAF7F2]/75 hover:bg-[#F5EFEB] dark:hover:bg-[#38252E]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Counter & Active Filter Badge */}
        <div className="flex items-center justify-between mb-6 text-xs text-[#231C1E]/70 dark:text-[#FAF7F2]/70">
          <p>
            Showing <span className="font-semibold text-[#231C1E] dark:text-[#FAF7F2]">{startIndex + 1}</span>–
            <span className="font-semibold text-[#231C1E] dark:text-[#FAF7F2]">{endIndex}</span> of{" "}
            <span className="font-semibold text-[#231C1E] dark:text-[#FAF7F2]">{totalItems}</span> rituals
          </p>
          {(search || selectedCategory !== "All categories" || sortOption !== "newest") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="gap-1 text-xs text-[#B8755B] dark:text-[#C5A880] hover:bg-transparent hover:underline h-7 px-2 font-medium"
            >
              <FilterX className="w-3.5 h-3.5" /> Reset all filters
            </Button>
          )}
        </div>

        {/* Service Cards (3 Columns) */}
        {paginatedServices.length === 0 ? (
          <div className="text-center py-20 bg-[#FFFFFF] dark:bg-[#22161B] rounded-2xl border border-dashed border-[#3B1F2B]/20 dark:border-[#FAF7F2]/20 p-8 space-y-4 max-w-md mx-auto">
            <h3 className="font-serif text-xl font-bold text-[#231C1E] dark:text-[#FAF7F2]">No Rituals Found</h3>
            <p className="text-[#231C1E]/70 dark:text-[#FAF7F2]/70 text-xs leading-relaxed">
              We couldn&apos;t find any treatment matching your filter criteria. Try searching with different keywords or reset filters.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetFilters}
              className="rounded-xl text-xs font-semibold border-[#3B1F2B]/30 dark:border-[#FAF7F2]/30"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedServices.map((service) => (
              <div
                key={service._id}
                className="group rounded-2xl bg-[#FFFFFF] dark:bg-[#22161B] border border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10 hover:border-[#3B1F2B]/30 dark:hover:border-[#C5A880]/50 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Service Image with Category Pill Badge Overlay */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#EAE3D6] dark:bg-[#2D1D24]">
                    <SafeImage
                      src={
                        service.images && service.images[0]
                          ? service.images[0]
                          : "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=85"
                      }
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Category Pill Badge Overlay */}
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FFFFFF]/95 dark:bg-[#170F13]/95 backdrop-blur-md text-[#231C1E] dark:text-[#FAF7F2] shadow-sm">
                      {service.category}
                    </span>

                    {/* Price Overlay */}
                    <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold bg-[#3B1F2B] dark:bg-[#C5A880] text-[#FAF7F2] dark:text-[#170F13] shadow-sm">
                      {formatCurrency(service.price)}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between text-xs text-[#231C1E]/70 dark:text-[#FAF7F2]/70 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#C5A880]" />
                        ⏱ {service.durationMinutes} min
                      </span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                        At the salon
                      </span>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-[#231C1E] dark:text-[#FAF7F2] group-hover:text-[#3B1F2B] dark:group-hover:text-[#C5A880] transition-colors leading-snug">
                      {service.title}
                    </h3>

                    <p className="text-xs text-[#231C1E]/75 dark:text-[#FAF7F2]/75 leading-relaxed line-clamp-2">
                      {service.description}
                    </p>

                    {service.specialists && service.specialists.length > 0 && (
                      <p className="text-[11px] text-[#231C1E]/60 dark:text-[#FAF7F2]/60 pt-1">
                        Specialists: {service.specialists.join(", ")}
                      </p>
                    )}
                  </div>
                </div>

                {/* Bottom Row: Details ↗ & Book Now Button */}
                <div className="p-6 pt-0 border-t border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10 mt-2 flex items-center justify-between gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(service._id)}
                    className="flex-1 rounded-xl border-[#3B1F2B]/20 dark:border-[#FAF7F2]/20 text-[#231C1E] dark:text-[#FAF7F2] hover:bg-[#FAF7F2] dark:hover:bg-[#2D1D24] text-xs font-medium"
                  >
                    View details ↗
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => handleOpenBooking(service)}
                    className="flex-1 rounded-xl bg-[#3B1F2B] dark:bg-[#C5A880] hover:bg-[#4A2035] dark:hover:bg-[#d6bc96] text-[#FAF7F2] dark:text-[#170F13] text-xs font-semibold shadow-sm"
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 pt-6 border-t border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#231C1E]/70 dark:text-[#FAF7F2]/70 font-medium">
              Showing {startIndex + 1}–{endIndex} of {totalItems}
            </p>

            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="w-9 h-9 p-0 rounded-xl border-[#3B1F2B]/20 dark:border-[#FAF7F2]/20 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                const isActive = pageNum === currentPage;
                return (
                  <Button
                    key={pageNum}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-9 h-9 p-0 rounded-xl text-xs font-semibold ${
                      isActive
                        ? "bg-[#3B1F2B] dark:bg-[#C5A880] text-[#FAF7F2] dark:text-[#170F13]"
                        : "border-[#3B1F2B]/20 dark:border-[#FAF7F2]/20 text-[#231C1E] dark:text-[#FAF7F2] hover:bg-[#FAF7F2] dark:hover:bg-[#22161B]"
                    }`}
                  >
                    {pageNum}
                  </Button>
                );
              })}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-9 h-9 p-0 rounded-xl border-[#3B1F2B]/20 dark:border-[#FAF7F2]/20 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Booking Modal */}
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
          <div className="w-8 h-8 border-2 border-[#3B1F2B] border-t-transparent animate-spin mx-auto rounded-full" />
          <p className="text-xs text-[#231C1E]/70 dark:text-[#FAF7F2]/70 mt-3 uppercase tracking-wider font-semibold">
            Loading Services...
          </p>
        </div>
      }
    >
      <ServicesContent />
    </Suspense>
  );
}
