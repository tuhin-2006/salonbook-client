"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  ShieldCheck,
  Share2,
  Calendar,
  Check,
  MapPin,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingModal } from "@/components/booking/BookingModal";
import { SafeImage } from "@/components/ui/SafeImage";
import { Service, ApiResponse } from "@/types";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function ServiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params?.id as string;
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [service, setService] = useState<Service | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Auth Guard: Require login to view service details
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.info("Please sign in or create an account to view treatment details.");
      router.push(`/sign-in?redirect=${encodeURIComponent(`/services/${serviceId}`)}`);
    }
  }, [authLoading, isAuthenticated, router, serviceId]);

  useEffect(() => {
    if (!serviceId) return;

    const fetchService = async () => {
      try {
        const res = await api.get<ApiResponse<Service>>(`/services/${serviceId}`);
        setService(res.data.data);
      } catch (err) {
        console.warn("Using fallback service dossier:", err);
        setService({
          _id: serviceId,
          title: "Signature Balayage & Silk Glaze",
          slug: "signature-balayage-silk-glaze",
          category: "Hair",
          description:
            "A hand-painted custom French balayage tailored to your cranial bone structure and natural growth fall. Finished with a luminous silk shine glaze and botanical blowout that preserves hair fiber integrity while imparting sublime, multidimensional depth.",
          price: 195,
          durationMinutes: 120,
          images: [
            "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1200&q=85",
            "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=1200&q=85",
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
      toast.success("Treatment link copied to clipboard.");
    }
  };

  if (isLoading || authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen py-24 flex items-center justify-center bg-[#FAF7F2] dark:bg-[#170F13]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#3B1F2B] dark:border-[#C5A880] border-t-transparent animate-spin rounded-full" />
          <p className="text-xs uppercase tracking-[0.2em] text-[#231C1E]/70 dark:text-[#FAF7F2]/70 font-semibold">
            {!isAuthenticated && !authLoading ? "Redirecting to Sign In..." : "Loading Ritual Dossier..."}
          </p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen py-24 text-center container mx-auto px-4 max-w-md bg-[#FAF7F2] dark:bg-[#170F13]">
        <h2 className="font-serif text-3xl font-bold text-[#231C1E] dark:text-[#FAF7F2]">Service Not Found</h2>
        <p className="text-[#231C1E]/70 dark:text-[#FAF7F2]/70 text-xs mt-2 mb-6">
          The requested treatment could not be found or has been retired from the active menu.
        </p>
        <Link href="/services">
          <Button variant="default" className="rounded-xl text-xs uppercase tracking-wider bg-[#3B1F2B] text-[#FAF7F2]">
            Return to Menu
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 sm:py-16 bg-[#FAF7F2] dark:bg-[#170F13] text-[#231C1E] dark:text-[#FAF7F2] transition-colors duration-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Navigation Back & Share */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#231C1E]/70 dark:text-[#FAF7F2]/70 hover:text-[#3B1F2B] dark:hover:text-[#C5A880] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to services</span>
          </button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="gap-2 text-xs font-semibold rounded-xl border-[#3B1F2B]/20 dark:border-[#FAF7F2]/20 hover:bg-[#FFFFFF] dark:hover:bg-[#22161B] text-[#231C1E] dark:text-[#FAF7F2]"
          >
            <Share2 className="w-3.5 h-3.5 text-[#3B1F2B] dark:text-[#C5A880]" />
            <span>Share</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Left Column: Visual Gallery & Protocol */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <div className="aspect-[4/3] overflow-hidden rounded-3xl border-2 border-[#FFFFFF] dark:border-[#22161B] bg-[#EAE3D6] dark:bg-[#2D1D24] relative shadow-lg">
                <SafeImage
                  src={service.images[activeImageIndex] || service.images[0]}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-[#FFFFFF]/90 dark:bg-[#170F13]/90 backdrop-blur-md px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#231C1E] dark:text-[#FAF7F2] rounded-full shadow-sm">
                  {service.category}
                </div>
              </div>

              {/* Thumbnail Selector */}
              {service.images.length > 1 && (
                <div className="flex items-center gap-3">
                  {service.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-20 h-20 overflow-hidden rounded-2xl border-2 transition-all ${
                        activeImageIndex === idx
                          ? "border-[#3B1F2B] dark:border-[#C5A880] shadow-md"
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

            {/* Protocol Steps / Experience Journey */}
            <div className="rounded-2xl border border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10 bg-[#FFFFFF] dark:bg-[#22161B] p-8 space-y-6 shadow-sm">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C5A880]" />
                <span className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-bold">
                  APPOINTMENT JOURNEY
                </span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#231C1E] dark:text-[#FAF7F2]">
                What to Expect During Your Session
              </h3>

              <div className="space-y-6 divide-y divide-[#3B1F2B]/10 dark:divide-[#FAF7F2]/10">
                <div className="pt-4 first:pt-0 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-base font-bold text-[#3B1F2B] dark:text-[#C5A880]">1.</span>
                    <h4 className="font-serif text-base font-bold text-[#231C1E] dark:text-[#FAF7F2]">
                      One-on-One Personalized Consultation
                    </h4>
                  </div>
                  <p className="text-xs text-[#231C1E]/75 dark:text-[#FAF7F2]/75 leading-relaxed pl-5">
                    We assess hair fiber integrity, cranial structure, skin undertones, or muscle tension points to tailor the ritual precisely to your goals.
                  </p>
                </div>

                <div className="pt-5 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-base font-bold text-[#3B1F2B] dark:text-[#C5A880]">2.</span>
                    <h4 className="font-serif text-base font-bold text-[#231C1E] dark:text-[#FAF7F2]">
                      European Botanical Formulations &amp; Technique
                    </h4>
                  </div>
                  <p className="text-xs text-[#231C1E]/75 dark:text-[#FAF7F2]/75 leading-relaxed pl-5">
                    Clean organic actives, silk amino acids, and plant lipids applied with unhurried care in our quiet treatment spaces.
                  </p>
                </div>

                <div className="pt-5 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-base font-bold text-[#3B1F2B] dark:text-[#C5A880]">3.</span>
                    <h4 className="font-serif text-base font-bold text-[#231C1E] dark:text-[#FAF7F2]">
                      Styling Finish &amp; Regimen Guidance
                    </h4>
                  </div>
                  <p className="text-xs text-[#231C1E]/75 dark:text-[#FAF7F2]/75 leading-relaxed pl-5">
                    Unhurried finish, tailored shaping, and expert recommendations for sustaining salon-fresh vitality between visits.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Reservation Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <div className="sticky top-28 rounded-2xl border border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10 bg-[#FFFFFF] dark:bg-[#22161B] p-8 space-y-6 shadow-sm">
              <div className="space-y-3">
                <span className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-bold block">
                  SERVICE OVERVIEW
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#231C1E] dark:text-[#FAF7F2] leading-tight">
                  {service.title}
                </h1>
                <p className="text-xs sm:text-sm text-[#231C1E]/75 dark:text-[#FAF7F2]/75 leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Price & Duration Box */}
              <div className="p-5 rounded-2xl border border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10 bg-[#FAF7F2] dark:bg-[#2D1D24] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#231C1E]/60 dark:text-[#FAF7F2]/60 font-semibold block">
                    PRICE
                  </span>
                  <div className="font-serif text-3xl font-bold text-[#3B1F2B] dark:text-[#C5A880]">
                    {formatCurrency(service.price)}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-wider text-[#231C1E]/60 dark:text-[#FAF7F2]/60 font-semibold block">
                    SESSION DURATION
                  </span>
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#231C1E] dark:text-[#FAF7F2] flex items-center gap-1.5 justify-end mt-1">
                    <Clock className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>⏱ {service.durationMinutes} MIN</span>
                  </div>
                </div>
              </div>

              {/* Assigned Specialists */}
              <div className="space-y-3">
                <span className="text-xs uppercase tracking-wider text-[#231C1E]/70 dark:text-[#FAF7F2]/70 block font-semibold">
                  RESIDENT SPECIALISTS
                </span>
                <div className="space-y-2">
                  {(service.specialists || ["Elena Vance (Master Colorist)", "Chloe Moreau"]).map((spec, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-xl border border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10 bg-[#FAF7F2] dark:bg-[#2D1D24] text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-[#3B1F2B] dark:bg-[#C5A880] text-[#FAF7F2] dark:text-[#170F13] font-serif font-bold text-xs flex items-center justify-center">
                          {spec[0]}
                        </div>
                        <span className="font-medium text-[#231C1E] dark:text-[#FAF7F2]">{spec}</span>
                      </div>
                      <span className="text-[11px] font-semibold text-[#C5A880]">Specialist</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="space-y-3 pt-2">
                <Button
                  size="lg"
                  onClick={() => {
                    if (!isAuthenticated) {
                      toast.info("Please sign in to reserve an appointment.");
                      router.push(`/sign-in?redirect=${encodeURIComponent(`/services/${serviceId}`)}`);
                      return;
                    }
                    setIsModalOpen(true);
                  }}
                  className="w-full h-12 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#3B1F2B] dark:bg-[#C5A880] hover:bg-[#4A2035] dark:hover:bg-[#d6bc96] text-[#FAF7F2] dark:text-[#170F13] shadow-md"
                >
                  <Calendar className="w-4 h-4 mr-2 text-[#C5A880] dark:text-[#170F13]" />
                  <span>Book Appointment Now</span>
                </Button>
                <p className="text-[11px] text-center text-[#231C1E]/60 dark:text-[#FAF7F2]/60">
                  Instant confirmation · Complimentary cancellation up to 24 hours prior.
                </p>
              </div>

              {/* Guarantees */}
              <div className="pt-4 border-t border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10 space-y-2.5 text-xs text-[#231C1E]/75 dark:text-[#FAF7F2]/75">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Single-guest dedicated chair duration</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>100% Certified organic &amp; cruelty-free formulas</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-[#C5A880] shrink-0" />
                  <span>450 Madison Avenue, New York, NY</span>
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
