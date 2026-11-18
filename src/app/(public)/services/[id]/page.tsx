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
  Check,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookingModal } from "@/components/booking/BookingModal";
import { SafeImage } from "@/components/ui/SafeImage";
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
        setService({
          _id: serviceId,
          title: "Signature Balayage & Silk Glaze",
          slug: "signature-balayage-silk-glaze",
          category: "Hair",
          description:
            "A hand-painted custom French balayage tailored to your unique complexion and bone structure. Finished with a luminous silk shine glaze and luxury botanical blowout that preserves hair integrity while imparting sublime dimension.",
          price: 185,
          durationMinutes: 120,
          images: [
            "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
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
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
            Loading Service Details...
          </p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen py-24 text-center container mx-auto px-4 max-w-md">
        <h2 className="text-2xl font-bold">Service Not Found</h2>
        <p className="text-muted-foreground text-sm mt-2 mb-6">
          The requested service could not be located in our active catalog.
        </p>
        <Link href="/services">
          <Button variant="default" className="rounded-xl">Return to Catalog</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 sm:py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Navigation Back & Share */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-primary" /> Back to Services
          </button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="gap-2 text-xs font-bold rounded-xl"
          >
            <Share2 className="w-3.5 h-3.5 text-primary" /> Share Service
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Visual Gallery & Description */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-border shadow-lg bg-muted relative">
                <SafeImage
                  src={service.images[activeImageIndex] || service.images[0]}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-lg text-xs font-bold bg-background/90 backdrop-blur-md text-foreground border border-border">
                    {service.category}
                  </span>
                </div>
              </div>

              {/* Thumbnail Selector */}
              {service.images.length > 1 && (
                <div className="flex items-center gap-2.5">
                  {service.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        activeImageIndex === idx
                          ? "border-primary shadow-md scale-105"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <SafeImage
                        src={img}
                        alt="Thumbnail"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Protocol Steps */}
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
              <h3 className="text-lg font-bold text-foreground">
                Treatment Experience
              </h3>

              <div className="space-y-4 divide-y divide-border">
                <div className="pt-2 first:pt-0 flex items-start gap-3.5">
                  <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                    1
                  </span>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">
                      Initial Consultation & Diagnostic
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      Detailed consultation assessing your hair or skin porosity, undertone alignment, and specific styling goals.
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex items-start gap-3.5">
                  <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                    2
                  </span>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">
                      Bespoke Application & Processing
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      Custom treatment application using clean, organic botanical formulas tailored specifically to your needs.
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex items-start gap-3.5">
                  <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                    3
                  </span>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">
                      Finishing Styling & Care Regimen
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      Professional signature blowout and a customized home maintenance routine designed by your stylist.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Reservation Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xl space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    {service.category} Service
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified Available
                  </span>
                </div>
                <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
                  {service.title}
                </h1>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Price & Duration */}
              <div className="p-4 rounded-xl bg-secondary/50 border border-border flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Total Investment
                  </span>
                  <div className="text-3xl font-black text-foreground">
                    {formatCurrency(service.price)}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Estimated Time
                  </span>
                  <div className="text-sm font-bold text-foreground flex items-center gap-1.5 justify-end">
                    <Clock className="w-4 h-4 text-primary" /> {service.durationMinutes} mins
                  </div>
                </div>
              </div>

              {/* Assigned Specialists */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Resident Specialists
                </span>
                <div className="space-y-2">
                  {(service.specialists || ["Elena Vance (Master Colorist)", "Chloe Moreau"]).map((spec, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-border bg-background text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                          {spec[0]}
                        </div>
                        <span className="font-semibold text-foreground">{spec}</span>
                      </div>
                      <span className="text-amber-500 font-bold text-[11px]">★ 5.0</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="space-y-3 pt-2">
                <Button
                  variant="gradient"
                  size="lg"
                  onClick={() => setIsModalOpen(true)}
                  className="w-full gap-2 text-sm font-bold rounded-xl h-12 shadow-md shadow-primary/25"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Reserve Appointment</span>
                </Button>
                <p className="text-[11px] text-center text-muted-foreground">
                  Free cancellation up to 24 hours prior. Pay safely with Stripe.
                </p>
              </div>

              {/* Guarantee Badges */}
              <div className="pt-4 border-t border-border space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>100% Satisfaction Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-violet-500 shrink-0" />
                  <span>Instant Booking Confirmation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <BookingModal
          service={service}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
