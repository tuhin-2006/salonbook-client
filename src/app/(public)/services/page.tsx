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
    title: "Precision Editorial Cut & Blowout",
    slug: "precision-editorial-cut-blowout",
    category: "Hair",
    description:
      "A bespoke precision haircut tailored to your hair texture, scalp detox ritual, customized deep conditioning masque, and signature blowout.",
    price: 95,
    durationMinutes: 60,
    images: [
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80",
    ],
    isActive: true,
    specialists: ["Chloe Moreau", "David Rossi"],
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
    specialists: ["Dr. Aurelia Chen (Aesthetician)"],
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
      "https://images.unsplash.com/photo-1512290900672-1f41d996d926?auto=format&fit=crop&w=800&q=80",
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
    title: "Deep Tissue Aromatherapy Hot Stone Ritual",
    slug: "deep-tissue-aromatherapy-hot-stone-ritual",
    category: "Massage",
    description:
      "Heated basalt stones infused with organic lavender and frankincense essential oils to melt away chronic muscular tension and restore nervous equilibrium.",
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
    _id: "s7",
    title: "Royal Bridal Couture Glamour Package",
    slug: "royal-bridal-couture-glamour-package",
    category: "Makeup",
    description:
      "The definitive bridal transformation featuring high-definition airbrush makeup, couture hair updo, veil positioning, and luxury mink lash application.",
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
    specialists: ["Marco Rossi"],
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
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
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
      "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80",
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

  // Client-side filtering guarantee
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
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortPrice === "asc") return a.price - b.price;
        if (sortPrice === "desc") return b.price - a.price;
        return 0;
      });
  }, [services, selectedCategory, search, sortPrice]);

  const handleOpenBooking = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleResetFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setSortPrice("none");
  };

  return (
    <div className="min-h-screen py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Atelier Catalog"
          title="Bespoke Care & Rituals"
          subtitle="Discover and reserve master treatments designed to elevate and renew."
        />

        {/* Search & Filter Toolbar */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm mb-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="md:col-span-8 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search services by keyword, technique, or ritual name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-11 bg-background"
              />
            </div>

            {/* Sort Price Dropdown */}
            <div className="md:col-span-4 flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-muted-foreground shrink-0" />
              <select
                value={sortPrice}
                onChange={(e) => setSortPrice(e.target.value as "none" | "asc" | "desc")}
                className="w-full h-11 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="none">Sort: Recommended</option>
                <option value="asc">Price: Low to High</option>
                <option value="desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground shrink-0 mr-1" />
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter & Active Filters Bar */}
        <div className="flex items-center justify-between mb-6 text-sm text-muted-foreground">
          <p>
            Showing <span className="font-semibold text-foreground">{filteredServices.length}</span> ritual{filteredServices.length !== 1 ? "s" : ""}
          </p>
          {(search || selectedCategory !== "All" || sortPrice !== "none") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <FilterX className="w-3.5 h-3.5" /> Clear filters
            </Button>
          )}
        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-2xl bg-card/40 space-y-4">
            <Sparkles className="w-10 h-10 text-muted-foreground mx-auto" />
            <h3 className="font-serif text-2xl font-semibold">No services found</h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              We couldn&apos;t find any ritual matching your search criteria. Try adjusting your filters.
            </p>
            <Button variant="outline" onClick={handleResetFilters}>
              Reset All Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <div
                key={service._id}
                className="group rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/40 transition-all flex flex-col"
              >
                {/* Service Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={service.images[0] || "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80"}
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
                      <span>{service.specialists?.[0] || "Master Stylist"}</span>
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