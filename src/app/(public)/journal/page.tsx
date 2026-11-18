import React from "react";
import Link from "next/link";
import { ArrowRight, Clock, Star, MapPin, Phone, Mail, Navigation, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/ui/SafeImage";

export default function JournalPage() {
  const articles = [
    {
      title: "The Architecture of French Balayage: Cranial Geometry & Lived-in Color",
      category: "Hair Artistry",
      readTime: "4 MIN READ",
      author: "Elena Vance (Master Colorist)",
      date: "AUTUMN / WINTER 2026",
      image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1200&q=85",
      excerpt:
        "Why bespoke hand-painted highlights must follow skull bone contours to blend organically as hair grows, eliminating harsh regrowth lines for up to 14 weeks.",
    },
    {
      title: "Biological Skin Restoration: Wild Elderberry & Cryo Sculpting",
      category: "Dermo-Biology",
      readTime: "5 MIN READ",
      author: "Sofia Rossi (Aesthetician)",
      date: "AUTUMN / WINTER 2026",
      image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=85",
      excerpt:
        "An exploration of cold sub-zero cryo therapy combined with cold-pressed botanical squalane to reduce inflammation and stimulate cellular collagen synthesis.",
    },
    {
      title: "Precision E-File Cuticle Therapy & Natural Apex Reinforcement",
      category: "Nail Health",
      readTime: "3 MIN READ",
      author: "Mia Lindqvist",
      date: "AUTUMN / WINTER 2026",
      image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1200&q=85",
      excerpt:
        "The anatomical science of dry diamond cuticle work that preserves the delicate eponychium while allowing organic builder gels to bond without lifting.",
    },
  ];

  const citations = [
    {
      quote:
        "The balayage by Elena is unmatched anywhere in Manhattan. Subtle, multidimensional, and my hair feels significantly healthier than before.",
      author: "Clara Vandermeer",
      title: "Architectural Designer · New York",
      service: "Signature Balayage & Glaze",
    },
    {
      quote:
        "A quiet, civilized experience. No phone chatter, no blaring pop music, no waiting 40 minutes past your reservation. Just master-level craft.",
      author: "Julian Mercer",
      title: "Managing Director · New York",
      service: "Executive Beard & Precision Cut",
    },
    {
      quote:
        "The botanical facial cleared months of persistent dryness in one session. You can immediately feel the quality of their organic European formulas.",
      author: "Genevieve H.",
      title: "Editor · Paris & NYC",
      service: "Botanical Recovery Facial",
    },
  ];

  return (
    <div className="min-h-screen py-10 sm:py-20 bg-[#FAF7F2] dark:bg-[#170F13] text-[#231C1E] dark:text-[#FAF7F2] transition-colors duration-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-16 sm:space-y-20">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-bold">
            VISIT US &amp; EDITORIAL JOURNAL
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold leading-tight text-[#231C1E] dark:text-[#FAF7F2]">
            Flagship Studio &amp; Insights
          </h1>
          <p className="text-sm text-[#231C1E]/75 dark:text-[#FAF7F2]/75 leading-relaxed max-w-lg mx-auto">
            Find directions to our Madison Avenue sanctuary and explore essays on hair architecture, botanical skincare, and grooming rituals.
          </p>
        </div>

        {/* Flagship Location Card */}
        <div className="rounded-3xl bg-[#FFFFFF] dark:bg-[#22161B] border border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10 p-8 sm:p-10 shadow-lg grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-5">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-bold block">
                FLAGSHIP LOCATION
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#231C1E] dark:text-[#FAF7F2] mt-1">
                Madison Avenue Studio
              </h2>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-[#231C1E]/80 dark:text-[#FAF7F2]/80">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C5A880] mt-1 shrink-0" />
                <span>450 Madison Avenue, 4th Floor<br />New York, NY 10022</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#C5A880] shrink-0" />
                <span>Daily · 9:00 AM – 8:00 PM EST</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#C5A880] shrink-0" />
                <span>+1 (212) 555-0198</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#C5A880] shrink-0" />
                <span>concierge@salonbook.com</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link href="/services">
                <Button className="rounded-xl text-xs font-bold uppercase tracking-wider bg-[#3B1F2B] dark:bg-[#C5A880] text-[#FAF7F2] dark:text-[#170F13] hover:bg-[#4A2035] dark:hover:bg-[#d6bc96]">
                  <Calendar className="w-3.5 h-3.5 mr-2" />
                  <span>Reserve a Chair</span>
                </Button>
              </Link>
            </div>
          </div>

          <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10 bg-[#EAE3D6] dark:bg-[#2D1D24] relative shadow-md">
            <SafeImage
              src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=85"
              alt="Madison Avenue Salon Entrance"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Featured Articles Grid */}
        <div className="space-y-8">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-bold">
              THE SALONBOOK JOURNAL
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#231C1E] dark:text-[#FAF7F2]">
              Essays &amp; Care Guidance
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.map((article, idx) => (
              <div
                key={idx}
                className="bg-[#FFFFFF] dark:bg-[#22161B] border border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/11] overflow-hidden bg-[#EAE3D6] dark:bg-[#2D1D24]">
                    <SafeImage
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-[#FFFFFF]/90 dark:bg-[#170F13]/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#231C1E] dark:text-[#FAF7F2] shadow-sm">
                      {article.category}
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-[10px] text-[#231C1E]/60 dark:text-[#FAF7F2]/60 uppercase tracking-widest font-semibold">
                      <span>{article.readTime}</span>
                      <span>•</span>
                      <span>{article.date}</span>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-[#231C1E] dark:text-[#FAF7F2] leading-snug">
                      {article.title}
                    </h3>

                    <p className="text-xs text-[#231C1E]/75 dark:text-[#FAF7F2]/75 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10 mt-3 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[#231C1E]/70 dark:text-[#FAF7F2]/70 font-medium">
                    {article.author}
                  </span>
                  <Link href="/services">
                    <span className="text-xs uppercase tracking-wider text-[#3B1F2B] dark:text-[#C5A880] font-bold hover:underline flex items-center gap-1">
                      Book Now <ArrowRight className="w-3 h-3" />
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Patron Reviews */}
        <div className="space-y-8 pt-8 border-t border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-bold">
              GUEST CITATIONS
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#231C1E] dark:text-[#FAF7F2]">
              Words from Discerning Patrons
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {citations.map((c, idx) => (
              <div
                key={idx}
                className="bg-[#FFFFFF] dark:bg-[#22161B] p-6 rounded-2xl border border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex text-amber-500 gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-[#231C1E]/80 dark:text-[#FAF7F2]/80 leading-relaxed italic">
                    &ldquo;{c.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-3 border-t border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10 text-xs text-[#231C1E]/70 dark:text-[#FAF7F2]/70">
                  <p className="font-bold text-[#231C1E] dark:text-[#FAF7F2]">{c.author}</p>
                  <p className="text-[11px] text-[#231C1E]/60 dark:text-[#FAF7F2]/60">{c.title}</p>
                  <p className="text-[#3B1F2B] dark:text-[#C5A880] font-semibold pt-1">{c.service}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
