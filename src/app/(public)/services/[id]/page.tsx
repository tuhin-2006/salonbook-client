"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Share2,
  Heart,
  Droplets,
  Award,
  Leaf,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookingModal } from "@/components/booking/BookingModal";
import { Service, ApiResponse } from "@/types";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

export default function ServiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params?.id as string;

  const [service, setService] = useState<Service | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!serviceId) return;

    const fetchService = async () => {
      try {
        const res = await api.get<ApiResponse<Service>>(`/services/${serviceId}`);
        setService(res.data.data);
      } catch (err) {
        console.warn("Could not fetch service from API, using fallback details:", err);
        // Fallback service
        setService({
          _id: serviceId,
          title: "Signature French Balayage & Silk Glaze",
          slug: "signature-balayage-silk-glaze",
          category: "Hair",
          description:
            "A hand-painted custom French balayage tailored to your unique complexion and bone structure. Finished with a luminous silk shine glaze and luxury botanical blowout that preserves hair integrity while imparting sublime dimension.",
          price: 185,
          durationMinutes: 120,
          images: [
            "https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=1200&q=85",
            "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=1200&q=85",
            "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?auto=format&fit=crop&w=1200&q=85",
          ],
          isActive: true,
          specialists: ["Céline Laurent (Creative Director)", "Chloe Moreau"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchService();
  }, [serviceId]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Ritual dossier link copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-24 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Sparkles className="w-8 h-8 text-gold-500 animate-spin" />
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
            Loading Bespoke Ritual Dossier...
          </p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen py-24 text-center container mx-auto px-4 max-w-md">
        <h2 className="text-2xl font-serif font-bold">Ritual Not Located</h2>
        <p className="text-muted-foreground text-sm mt-2 mb-6">
          The requested service could not be located in our active atelier catalog.
        </p>
        <Link href="/services">
          <Button variant="luxury" className="rounded-full">Return to Menu</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Navigation Back & Share */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-gold-500" /> Back to Services Menu
          </button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="gap-2 text-xs font-semibold rounded-full"
          >
            <Share2 className="w-3.5 h-3.5 text-gold-500" /> Share Dossier
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Visual Gallery & Detailed Ritual Protocol */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-gold-500/25 shadow-2xl bg-muted relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={service.images[activeImageIndex] || service.images[0]}
                  alt={service.title}
                  className="w-full h-full object-cover transition-all duration-500"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="terracotta" className="text-xs px-3 py-1 shadow-md">
                    {service.category}
                  </Badge>
                </div>
              </div>

              {/* Thumbnail Selector */}
              {service.images.length > 1 && (
                <div className="flex items-center gap-3">
                  {service.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                        activeImageIndex === idx
                          ? "border-gold-500 shadow-md scale-105"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt="Thumbnail"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Protocol Step-by-Step Timeline */}
            <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-gold-600 dark:text-gold-400">
                  Treatment Methodology
                </span>
                <h3 className="font-serif text-2xl font-bold text-foreground">
                  The Protocol Progression
                </h3>
              </div>

              <div className="space-y-4 divide-y divide-border/60">
                <div className="pt-3 first:pt-0 flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-forest-900/10 text-forest-900 dark:text-gold-400 font-serif font-bold text-sm flex items-center justify-center shrink-0 border border-forest-900/20">
                    1
                  </span>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-foreground">
                      Diagnostic & Botanical Formulation
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      Detailed consultation assessing your hair or skin porosity, undertone alignment, and specific lifestyle requirements.
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-forest-900/10 text-forest-900 dark:text-gold-400 font-serif font-bold text-sm flex items-center justify-center shrink-0 border border-forest-900/20">
                    2
                  </span>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-foreground">
                      Sensory Cleansing & Scalp/Skin Prep
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      Eucalyptus steam compresses, ultrasonic skin purification, or pH-balancing botanical wash with gentle acupressure.
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-forest-900/10 text-forest-900 dark:text-gold-400 font-serif font-bold text-sm flex items-center justify-center shrink-0 border border-forest-900/20">
                    3
                  </span>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-foreground">
                      Artisan Execution & Infusion
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      Meticulous application by your resident specialist using imported French balayage clay, 24K colloidal gold, or surgical tools.
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-forest-900/10 text-forest-900 dark:text-gold-400 font-serif font-bold text-sm flex items-center justify-center shrink-0 border border-forest-900/20">
                    4
                  </span>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-foreground">
                      Finish Styling & Post-Care Prescription
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      Signature blowout, mirror reveal in calibrated daylight, accompanied by your personalized home maintenance formula.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Botanical Compounds & Inclusions */}
            <div className="rounded-3xl border border-gold-500/20 bg-secondary/30 dark:bg-card/40 p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 text-gold-600 dark:text-gold-400 text-xs font-bold uppercase tracking-wider">
                <Leaf className="w-4 h-4 text-sage-600" /> Clean Formulation Charter
              </div>
              <h3 className="font-serif text-lg font-bold text-foreground">
                Organic & Botanical Guarantee
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Cruelty-Free & Zero Harsh Sulfates</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Wild-Harvested Rosehip & Argan</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Private Treatment Acoustic Serenity</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Complimentary Organic Tisane Bar</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Pricing & Reservation Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="sticky top-28 rounded-3xl border border-gold-500/30 bg-card p-8 shadow-2xl space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5 font-semibold text-gold-600 dark:text-gold-400">
                    <Clock className="w-4 h-4 text-primary" /> {service.durationMinutes} Minutes Session
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" /> Live Openings Today
                  </span>
                </div>

                <h1 className="text-3xl font-serif font-bold text-foreground leading-tight">
                  {service.title}
                </h1>

                <div className="flex items-baseline gap-2 pt-2">
                  <span className="text-4xl font-serif font-bold text-foreground">
                    {formatCurrency(service.price)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    all-inclusive atelier fee
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-border/80">
                <p className="text-muted-foreground text-xs leading-relaxed font-sans">
                  {service.description}
                </p>
              </div>

              {/* Specialists Assigned */}
              <div className="rounded-2xl bg-secondary/50 p-4 space-y-2 border border-border/60">
                <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                  Resident Artisans
                </p>
                <div className="flex flex-wrap gap-2">
                  {service.specialists.map((spec, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-background border border-gold-500/30 text-foreground"
                    >
                      ✦ {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA Booking Button */}
              <Button
                variant="luxury"
                size="lg"
                onClick={() => setIsModalOpen(true)}
                className="w-full text-sm font-semibold rounded-2xl h-13 gap-2 shadow-xl shadow-forest-950/15"
              >
                <Sparkles className="w-4 h-4" /> Reserve Appointment Chair
              </Button>

              <div className="space-y-2 text-center text-xs text-muted-foreground">
                <p className="flex items-center justify-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  Free cancellation on pending requests
                </p>
                <p className="text-[11px] text-zinc-400">
                  Secured by Stripe Checkout · Gratuity included
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        service={service}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
