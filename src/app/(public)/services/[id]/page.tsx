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
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
      toast.success("Treatment dossier URL copied to clipboard.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-24 flex items-center justify-center bg-[#F5F1E8] dark:bg-[#151916]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#26372D] border-t-transparent animate-spin" />
          <p className="text-xs uppercase tracking-[0.2em] text-[#302821]/70">
            Accessing Treatment Dossier...
          </p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen py-24 text-center container mx-auto px-4 max-w-md bg-[#F5F1E8] dark:bg-[#151916]">
        <h2 className="font-serif text-3xl text-[#302821] dark:text-[#F5F1E8]">Treatment Not Located</h2>
        <p className="text-[#302821]/70 text-xs mt-2 mb-6">
          The requested formulation could not be located in the current atelier carte.
        </p>
        <Link href="/services">
          <Button variant="default" className="rounded-none text-xs uppercase tracking-wider bg-[#26372D] text-[#F5F1E8]">
            Return to Carte
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 sm:py-20 bg-[#F5F1E8] dark:bg-[#151916] text-[#302821] dark:text-[#F5F1E8]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Navigation Back & Share */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#302821]/15 dark:border-[#EAE3D6]/15">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#302821]/70 dark:text-[#EAE3D6]/70 hover:text-[#26372D] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>RETURN TO CARTE</span>
          </button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="gap-2 text-[10px] tracking-[0.2em] uppercase rounded-none border-[#302821]/20 hover:bg-[#EAE3D6]/50"
          >
            <Share2 className="w-3 h-3 text-[#26372D]" />
            <span>SHARE DOSSIER</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Visual Gallery & Clinical Protocol */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <div className="aspect-[4/3] overflow-hidden border border-[#302821]/15 bg-[#EAE3D6] relative">
                <SafeImage
                  src={service.images[activeImageIndex] || service.images[0]}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-[#F5F1E8]/90 dark:bg-[#26372D]/90 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[#302821] dark:text-[#F5F1E8] border border-[#302821]/20">
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
                      className={`w-20 h-20 overflow-hidden border transition-all ${
                        activeImageIndex === idx
                          ? "border-[#26372D] ring-1 ring-[#26372D]"
                          : "border-[#302821]/20 opacity-60 hover:opacity-100"
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

            {/* Protocol Steps: Editorial Roman Numerals */}
            <div className="border border-[#302821]/15 dark:border-[#EAE3D6]/15 bg-[#EAE3D6]/30 dark:bg-[#1a201c] p-8 space-y-6">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#B8755B] font-semibold block">
                LE PROTOCOLE DE SOIN
              </span>
              <h3 className="font-serif text-2xl text-[#302821] dark:text-[#F5F1E8]">
                The Three-Phase Treatment Journey
              </h3>

              <div className="space-y-6 divide-y divide-[#302821]/10 dark:divide-[#EAE3D6]/10">
                <div className="pt-4 first:pt-0 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-lg font-bold text-[#26372D] dark:text-[#A4AA91]">I.</span>
                    <h4 className="font-serif text-lg text-[#302821] dark:text-[#F5F1E8]">
                      Cranial Diagnostic &amp; Texture Mapping
                    </h4>
                  </div>
                  <p className="text-xs text-[#302821]/75 dark:text-[#EAE3D6]/75 leading-relaxed pl-5">
                    Microscopic assessment of scalp barrier lipid balance, hair strand tensile strength, and facial symmetry mapping to establish bespoke geometric parameters.
                  </p>
                </div>

                <div className="pt-6 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-lg font-bold text-[#26372D] dark:text-[#A4AA91]">II.</span>
                    <h4 className="font-serif text-lg text-[#302821] dark:text-[#F5F1E8]">
                      Cold-Pressed Botanical Formulation &amp; Infusion
                    </h4>
                  </div>
                  <p className="text-xs text-[#302821]/75 dark:text-[#EAE3D6]/75 leading-relaxed pl-5">
                    Hand-crafted blending of clean organic actives, silk amino acids, and pure plant lipids applied with intentional unhurried technique in our quiet washing sanctuary.
                  </p>
                </div>

                <div className="pt-6 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-lg font-bold text-[#26372D] dark:text-[#A4AA91]">III.</span>
                    <h4 className="font-serif text-lg text-[#302821] dark:text-[#F5F1E8]">
                      Precision Structural Finish &amp; Regimen Dossier
                    </h4>
                  </div>
                  <p className="text-xs text-[#302821]/75 dark:text-[#EAE3D6]/75 leading-relaxed pl-5">
                    Unhurried structural drying, tailored thermal shaping, and the preparation of your personalized home maintenance formula guidelines.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Reservation Dossier Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <div className="sticky top-28 border border-[#302821]/15 dark:border-[#EAE3D6]/15 bg-[#EAE3D6]/40 dark:bg-[#1a201c] p-8 space-y-6">
              <div className="space-y-3">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#B8755B] font-semibold block">
                  APPOINTMENT DOSSIER
                </span>
                <h1 className="font-serif text-3xl font-normal text-[#302821] dark:text-[#F5F1E8] leading-tight">
                  {service.title}
                </h1>
                <p className="text-xs text-[#302821]/75 dark:text-[#EAE3D6]/75 leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Price & Duration Box */}
              <div className="p-5 border border-[#302821]/15 dark:border-[#EAE3D6]/15 bg-[#F5F1E8] dark:bg-[#151916] flex items-center justify-between">
                <div>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#302821]/60 dark:text-[#EAE3D6]/60 block">
                    TOTAL INVESTMENT
                  </span>
                  <div className="font-serif text-3xl font-medium text-[#26372D] dark:text-[#F5F1E8]">
                    {formatCurrency(service.price)}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#302821]/60 dark:text-[#EAE3D6]/60 block">
                    DURATION
                  </span>
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#302821] dark:text-[#F5F1E8] flex items-center gap-1.5 justify-end mt-1">
                    <Clock className="w-3.5 h-3.5 text-[#26372D] dark:text-[#A4AA91]" />
                    <span>{service.durationMinutes} MIN</span>
                  </div>
                </div>
              </div>

              {/* Assigned Specialists */}
              <div className="space-y-3">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#302821]/70 dark:text-[#EAE3D6]/70 block font-semibold">
                  RESIDENT MASTER PRACTITIONERS
                </span>
                <div className="space-y-2">
                  {(service.specialists || ["Elena Vance (Master Colorist)", "Chloe Moreau"]).map((spec, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 border border-[#302821]/15 bg-[#F5F1E8] dark:bg-[#151916] text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 bg-[#26372D] text-[#F5F1E8] font-serif font-bold text-xs flex items-center justify-center">
                          {spec[0]}
                        </div>
                        <span className="font-medium text-[#302821] dark:text-[#F5F1E8]">{spec}</span>
                      </div>
                      <span className="text-[10px] uppercase tracking-wider text-[#B8755B]">Master</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="space-y-3 pt-2">
                <Button
                  variant="default"
                  size="lg"
                  onClick={() => setIsModalOpen(true)}
                  className="w-full h-12 rounded-none text-xs uppercase tracking-[0.2em] bg-[#26372D] text-[#F5F1E8] hover:bg-[#343D2E]"
                >
                  <Calendar className="w-3.5 h-3.5 mr-2" />
                  <span>RESERVE TREATMENT</span>
                </Button>
                <p className="text-[10px] text-center text-[#302821]/60 dark:text-[#EAE3D6]/60 uppercase tracking-wider">
                  Unhurried chair reservation · Complimentary cancellation up to 24 hours prior.
                </p>
              </div>

              {/* Guarantees */}
              <div className="pt-4 border-t border-[#302821]/10 dark:border-[#EAE3D6]/10 space-y-2 text-xs text-[#302821]/70 dark:text-[#EAE3D6]/70">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#26372D] dark:text-[#A4AA91] shrink-0" />
                  <span>Single-guest dedicated chair duration</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#26372D] dark:text-[#A4AA91] shrink-0" />
                  <span>100% Certified organic &amp; cruelty-free formulations</span>
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
