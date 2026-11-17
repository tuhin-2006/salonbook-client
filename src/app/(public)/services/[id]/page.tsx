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
          title: "Signature Balayage & Silk Glaze",
          slug: "signature-balayage-silk-glaze",
          category: "Hair Styling & Cut",
          description:
            "A hand-painted custom French balayage tailored to your unique complexion and bone structure. Finished with a luminous silk shine glaze and luxury botanical blowout that preserves hair integrity while imparting sublime dimension.",
          price: 185,
          durationMinutes: 120,
          images: [
            "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=85",
            "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=85",
          ],
          isActive: true,
          specialists: ["Elena Vance (Master Colorist)", "Chloe Moreau"],
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
      toast.success("Service link copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-24 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Sparkles className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">Loading bespoke ritual details...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen py-24 text-center container mx-auto px-4">
        <h2 className="text-2xl font-serif">Service Not Found</h2>
        <p className="text-muted-foreground mt-2 mb-6">
          The requested service could not be located in our atelier catalog.
        </p>
        <Link href="/services">
          <Button variant="luxury">Return to Catalog</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Navigation Back */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Services
          </button>
          <Button variant="ghost" size="sm" onClick={handleShare} className="gap-2 text-xs">
            <Share2 className="w-3.5 h-3.5" /> Share Ritual
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Visual Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-border shadow-md bg-muted relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={service.images[activeImageIndex] || service.images[0]}
                alt={service.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <Badge variant="terracotta" className="text-xs">
                  {service.category}
                </Badge>
              </div>
            </div>

            {/* Thumbnail Row */}
            {service.images.length > 1 && (
              <div className="flex items-center gap-3">
                {service.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImageIndex === idx
                        ? "border-primary shadow-sm"
                        : "border-transparent opacity-70 hover:opacity-100"
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

            {/* Atelier Inclusions */}
            <div className="rounded-2xl border border-border bg-card p-6 mt-8 space-y-4">
              <h3 className="font-serif text-lg font-semibold">What is Included</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>One-on-one Master Artist Consultation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Aromatherapy Hot Towel Compress</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Complimentary Organic Herb Infusion</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Personalized Post-Treatment Regimen</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Booking Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl border border-border bg-card p-8 shadow-sm space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-primary" /> {service.durationMinutes} Minutes Duration
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Instant Confirmation
                  </span>
                </div>

                <h1 className="text-3xl font-serif font-semibold text-foreground">
                  {service.title}
                </h1>

                <div className="flex items-baseline gap-2 pt-2">
                  <span className="text-3xl font-serif font-bold text-foreground">
                    {formatCurrency(service.price)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    all-inclusive atelier fee
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Specialists Card */}
              <div className="rounded-xl bg-secondary/50 p-4 space-y-2 border border-border">
                <p className="text-xs uppercase font-semibold tracking-wider text-muted-foreground">
                  Assigned Specialists
                </p>
                <div className="flex flex-wrap gap-2">
                  {service.specialists.map((spec, i) => (
                    <Badge key={i} variant="outline" className="bg-background">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* CTA Booking Button */}
              <Button
                variant="luxury"
                size="lg"
                onClick={() => setIsModalOpen(true)}
                className="w-full text-base gap-2 shadow-lg shadow-terracotta-600/20"
              >
                <Calendar className="w-4 h-4" /> Book Appointment Now
              </Button>

              <div className="text-center text-xs text-muted-foreground">
                Free cancellation up to 24 hours prior to appointment time.
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
