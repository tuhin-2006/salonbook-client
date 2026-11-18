"use client";

import React, { useState, useEffect } from "react";
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
  Zap,
  Award,
  ChevronRight,
  MapPin,
  Flame,
  Check,
  Search,
  Users,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { BookingModal } from "@/components/booking/BookingModal";
import { SafeImage } from "@/components/ui/SafeImage";
import { api } from "@/lib/api";
import { Service, ApiResponse } from "@/types";

const fallbackServices: Service[] = [
  {
    _id: "demo-1",
    title: "Signature Balayage & Gloss Treatment",
    slug: "signature-balayage-gloss",
    category: "Hair",
    description:
      "Custom hand-painted multidimensional balayage, deep conditioning gloss treatment, and signature runway blowout.",
    price: 185,
    durationMinutes: 120,
    images: [
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
    ],
    isActive: true,
    specialists: ["Elena Vance", "Chloe Moreau"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "demo-2",
    title: "Hydra-Luxe Glow Radiance Facial",
    slug: "hydra-luxe-glow-facial",
    category: "Facial & Skin",
    description:
      "Deep pore ultrasonic cleansing, customized fruit enzyme peel, hyaluronic infusion, and cooling cryo-globe massage.",
    price: 145,
    durationMinutes: 75,
    images: [
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
    ],
    isActive: true,
    specialists: ["Sofia Rossi"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "demo-3",
    title: "Precision Cut & Texturizing Styling",
    slug: "precision-cut-styling",
    category: "Hair",
    description:
      "Consultation-driven precision haircut, organic scalp detox, strengthening mask, and signature heat styling.",
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
    _id: "demo-4",
    title: "Aromatherapy Deep Muscle Massage",
    slug: "aromatherapy-deep-muscle-massage",
    category: "Massage",
    description:
      "Therapeutic tension-release massage using organic lavender and eucalyptus warm oils, hot stone compressions.",
    price: 160,
    durationMinutes: 90,
    images: [
      "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=800&q=80",
    ],
    isActive: true,
    specialists: ["Liam Thorne"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "demo-5",
    title: "Russian Gel Manicure & Hand Therapy",
    slug: "russian-gel-manicure",
    category: "Nails",
    description:
      "Flawless dry e-file cuticle detailing, long-lasting builder gel apex overlay, scrub and nourishing botanical massage.",
    price: 75,
    durationMinutes: 60,
    images: [
      "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80",
    ],
    isActive: true,
    specialists: ["Mia Lindqvist"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "demo-6",
    title: "Executive Hot Towel Beard & Haircut",
    slug: "executive-beard-haircut",
    category: "Barbering",
    description:
      "Tailored modern fade, hot cedarwood steam towel treatment, straight razor contouring, and cold towel finish.",
    price: 80,
    durationMinutes: 50,
    images: [
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80",
    ],
    isActive: true,
    specialists: ["Marcus Sterling"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const categories = [
  { name: "All", count: "30+ Services", icon: Scissors },
  { name: "Hair", count: "12 Services", icon: Flame },
  { name: "Facial & Skin", count: "8 Services", icon: Sparkles },
  { name: "Massage", count: "5 Services", icon: Heart },
  { name: "Nails", count: "6 Services", icon: Star },
  { name: "Barbering", count: "4 Services", icon: Award },
];

export default function HomePage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>(fallbackServices);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [bookingService, setBookingService] = useState<Service | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Quick hero search state
  const [searchCategory, setSearchCategory] = useState("Hair");
  const [searchDate, setSearchDate] = useState("today");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get<ApiResponse<{ services: Service[] }>>(
          "/services?limit=8&isActive=true"
        );
        if (res.data.success && res.data.data.services.length > 0) {
          setServices(res.data.data.services);
        }
      } catch (err) {
        console.warn("Using curated fallback services:", err);
      }
    };
    fetchServices();
  }, []);

  const handleBookNow = (service: Service) => {
    setBookingService(service);
    setModalOpen(true);
  };

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/services?category=${encodeURIComponent(searchCategory)}`);
  };

  const filteredServices =
    selectedCategory === "All"
      ? services
      : services.filter((s) => s.category === selectedCategory);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION: Modern, Dynamic, High-Tech Studio Aesthetic */}
      <section className="relative overflow-hidden pt-8 pb-16 sm:py-20 lg:py-24 bg-gradient-to-b from-primary/5 via-background to-background">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-violet-500/20 via-indigo-500/20 to-pink-500/20 blur-[130px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Beauty & Wellness Booking</span>
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
              </div>

              {/* Punchy Modern Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-foreground">
                Look & Feel Your Best.{" "}
                <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-pink-500 bg-clip-text text-transparent">
                  Booked in 30 Seconds.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Discover top-tier hair artistry, restorative skin therapies, and
                luxury spa treatments. Real-time availability, instant confirmation,
                and seamless Stripe payments.
              </p>

              {/* Interactive Quick-Booking Bar */}
              <div className="pt-2">
                <form
                  onSubmit={handleHeroSearch}
                  className="bg-card/90 backdrop-blur-xl border border-border p-3 rounded-2xl shadow-xl shadow-indigo-500/5 max-w-xl mx-auto lg:mx-0 flex flex-col sm:flex-row gap-3"
                >
                  <div className="flex-1 px-3 py-2 bg-secondary/50 rounded-xl text-left">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Service Category
                    </label>
                    <select
                      value={searchCategory}
                      onChange={(e) => setSearchCategory(e.target.value)}
                      className="w-full bg-transparent text-sm font-semibold text-foreground focus:outline-none cursor-pointer"
                    >
                      <option value="Hair">Hair Styling & Color</option>
                      <option value="Facial & Skin">Facial & Skin Radiance</option>
                      <option value="Massage">Therapeutic Massage</option>
                      <option value="Nails">Gel & Manicure</option>
                      <option value="Barbering">Men&apos;s Grooming</option>
                    </select>
                  </div>

                  <div className="flex-1 px-3 py-2 bg-secondary/50 rounded-xl text-left">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      When
                    </label>
                    <select
                      value={searchDate}
                      onChange={(e) => setSearchDate(e.target.value)}
                      className="w-full bg-transparent text-sm font-semibold text-foreground focus:outline-none cursor-pointer"
                    >
                      <option value="today">Today · Instant Slots</option>
                      <option value="tomorrow">Tomorrow</option>
                      <option value="weekend">This Weekend</option>
                      <option value="next_week">Next Week</option>
                    </select>
                  </div>

                  <Button
                    type="submit"
                    variant="gradient"
                    size="lg"
                    className="gap-2 sm:self-center w-full sm:w-auto h-12 rounded-xl text-sm font-bold"
                  >
                    <Search className="w-4 h-4" />
                    <span>Find Slots</span>
                  </Button>
                </form>
              </div>

              {/* Social Proof & Metrics */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-muted-foreground font-medium">
                <div className="flex items-center gap-1.5">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500" />
                    ))}
                  </div>
                  <span className="font-bold text-foreground">4.9 / 5</span>
                  <span>(2,800+ reviews)</span>
                </div>
                <div className="h-4 w-px bg-border hidden sm:block" />
                <div className="flex items-center gap-1.5 text-foreground font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>100% Verified Stylists</span>
                </div>
                <div className="h-4 w-px bg-border hidden sm:block" />
                <div className="flex items-center gap-1.5 text-foreground font-semibold">
                  <Zap className="w-4 h-4 text-violet-500" />
                  <span>Instant Confirmation</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Visual Card Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Hero Image with SafeImage */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border/80 aspect-[4/5] bg-card">
                  <SafeImage
                    src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=85"
                    alt="Luxury Salon Styling"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  {/* Bottom Image Overlay Card */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-background/90 backdrop-blur-xl border border-border/70 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-primary">
                        Featured Treatment
                      </span>
                      <h4 className="text-sm font-bold text-foreground">
                        Balayage & Runway Blowout
                      </h4>
                      <p className="text-xs text-muted-foreground">$185 · 120 mins</p>
                    </div>
                    <Button
                      variant="gradient"
                      size="sm"
                      onClick={() => handleBookNow(fallbackServices[0])}
                      className="text-xs font-bold rounded-lg"
                    >
                      Book
                    </Button>
                  </div>
                </div>

                {/* Floating Badge 1 (Top Right) */}
                <div className="absolute -top-4 -right-4 bg-card/95 backdrop-blur-xl border border-border p-3 rounded-2xl shadow-xl flex items-center gap-3 animate-float hidden sm:flex">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Slot Confirmed</p>
                    <p className="text-[11px] text-muted-foreground">Today at 3:00 PM</p>
                  </div>
                </div>

                {/* Floating Badge 2 (Bottom Left) */}
                <div className="absolute -bottom-4 -left-4 bg-card/95 backdrop-blur-xl border border-border p-3 rounded-2xl shadow-xl flex items-center gap-3 hidden sm:flex">
                  <div className="w-9 h-9 rounded-xl bg-violet-500/10 text-violet-600 flex items-center justify-center font-bold">
                    <Star className="w-5 h-5 fill-violet-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Elena Vance</p>
                    <p className="text-[11px] text-muted-foreground">Master Colorist ★ 5.0</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY PILLS BAR */}
      <section className="py-8 border-y border-border bg-card/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 border ${
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20 scale-105"
                      : "bg-card text-muted-foreground hover:text-foreground border-border hover:border-primary/40"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. FEATURED SERVICES SHOWCASE */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-primary">
                Curated Menu
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground mt-1">
                Explore Popular Treatments
              </h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                Choose from our most requested transformations, each performed by
                certified master stylists with organic, high-performance formulations.
              </p>
            </div>
            <Link href="/services">
              <Button variant="outline" className="gap-2 font-bold text-xs rounded-xl">
                <span>View Full Menu</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.slice(0, 6).map((service) => (
              <div
                key={service._id}
                className="group bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Image with SafeImage */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    <SafeImage
                      src={
                        service.images?.[0] ||
                        "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80"
                      }
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-background/90 backdrop-blur-md text-foreground border border-border/80">
                        {service.category}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-primary text-primary-foreground shadow-sm">
                        {formatCurrency(service.price)}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      <span>{service.durationMinutes} mins</span>
                      <span>•</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        Instant Slots
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
                <div className="p-5 pt-0 border-t border-border/50 mt-4 flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      {service.specialists?.[0] || "Master Stylist"}
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
                      onClick={() => handleBookNow(service)}
                      className="text-xs font-bold rounded-xl"
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHY SALONBOOK IS BETTER (Modern Bento Feature Grid) */}
      <section className="py-16 sm:py-24 bg-secondary/30 border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-primary">
              The SalonBook Advantage
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Built for Discerning Clients & Top Salons
            </h2>
            <p className="text-sm text-muted-foreground">
              We eliminated phone tag, double bookings, and confusing salon pricing
              with our state-of-the-art platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:border-primary/40 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-600 flex items-center justify-center font-bold">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-foreground">Instant Real-Time Slots</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Live sync directly with stylist schedules. Pick your exact time without
                back-and-forth confirmation delays.
              </p>
            </div>

            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:border-primary/40 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-foreground">Verified Master Artists</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Every practitioner is certified, background-checked, and maintains an
                exceptional average client rating.
              </p>
            </div>

            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:border-primary/40 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-bold">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-foreground">Clean & Non-Toxic Formulas</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We only use sulfate-free, cruelty-free, and dermatologically tested
                products from top European labs.
              </p>
            </div>

            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:border-primary/40 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 text-pink-600 flex items-center justify-center font-bold">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-foreground">Secure Stripe Checkout</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Transparent flat pricing with no hidden charges. Pay safely with any
                major credit card once confirmed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS (3 Simple Steps) */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-primary">
              Seamless Experience
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              How SalonBook Works
            </h2>
            <p className="text-sm text-muted-foreground">
              From discovering treatments to leaving with confidence, in 3 effortless steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="bg-card p-8 rounded-2xl border border-border relative space-y-4">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground font-black text-sm flex items-center justify-center shadow-md shadow-primary/20">
                1
              </div>
              <h3 className="text-lg font-bold text-foreground">Select Your Treatment</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Browse our curated menu across Hair, Skin, Nails, and Wellness. Read
                full descriptions, ingredient dossiers, and specialist bios.
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border relative space-y-4">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground font-black text-sm flex items-center justify-center shadow-md shadow-primary/20">
                2
              </div>
              <h3 className="text-lg font-bold text-foreground">Choose Date & Stylist</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Select your preferred day, time slot, and resident specialist. Our
                system reserves your chair immediately.
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border relative space-y-4">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground font-black text-sm flex items-center justify-center shadow-md shadow-primary/20">
                3
              </div>
              <h3 className="text-lg font-bold text-foreground">Arrive & Glow</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Enjoy your personalized pampering session in our tranquil studio. Pay
                seamlessly via Stripe when confirmed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="py-16 bg-gradient-to-r from-violet-600 via-indigo-600 to-indigo-700 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6 max-w-2xl">
          <span className="px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-white/10 border border-white/20 inline-block">
            Reserve Your Glow Up
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Ready to Transform Your Look?
          </h2>
          <p className="text-sm text-indigo-100 leading-relaxed">
            Join thousands of satisfied patrons who book their wellness rituals with
            SalonBook every month. Appointments fill up fast.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/services">
              <Button
                variant="secondary"
                size="lg"
                className="font-bold text-sm rounded-xl px-8 shadow-lg hover:scale-105 transition-all text-slate-900 bg-white"
              >
                Browse All Services
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button
                variant="outline"
                size="lg"
                className="font-bold text-sm rounded-xl px-8 border-white/30 text-white hover:bg-white/10"
              >
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
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
