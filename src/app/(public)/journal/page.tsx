import React from "react";
import Link from "next/link";
import { ArrowRight, Clock, Star } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";

export default function JournalPage() {
  const articles = [
    {
      title: "The Architecture of French Balayage: Cranial Geometry & Lived-in Color",
      category: "Hair Artistry",
      readTime: "4 MIN READ",
      author: "Elena Vance (Master Colorist)",
      date: "AUTUMN / WINTER 2025",
      image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1200&q=85",
      excerpt:
        "Why bespoke hand-painted highlights must follow skull bone contours to blend organically as hair grows, eliminating harsh regrowth lines for up to 14 weeks.",
    },
    {
      title: "Biological Skin Restoration: Wild Elderberry & Cryo Sculpting",
      category: "Dermo-Biology",
      readTime: "5 MIN READ",
      author: "Sofia Rossi (Aesthetician)",
      date: "AUTUMN / WINTER 2025",
      image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=85",
      excerpt:
        "An exploration of cold sub-zero cryo therapy combined with cold-pressed botanical squalane to reduce inflammation and stimulate cellular collagen synthesis.",
    },
    {
      title: "Precision E-File Cuticle Therapy & Natural Apex Reinforcement",
      category: "Nail Health",
      readTime: "3 MIN READ",
      author: "Mia Lindqvist",
      date: "AUTUMN / WINTER 2025",
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
      title: "Managing Director · Milan",
      service: "Executive Beard & Precision Cut",
    },
    {
      quote:
        "The botanical facial cleared months of persistent dryness in one session. You can immediately feel the quality of their organic European formulas.",
      author: "Genevieve H.",
      title: "Editor · Paris",
      service: "Botanical Recovery Facial",
    },
  ];

  return (
    <div className="min-h-screen py-12 sm:py-20 bg-[#F5F1E8] dark:bg-[#151916] text-[#302821] dark:text-[#F5F1E8]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-20">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#B8755B] font-semibold">
            THE ATELIER JOURNAL
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal leading-tight text-[#302821] dark:text-[#F5F1E8]">
            Essays on Biology, Form &amp; Slow Aesthetics
          </h1>
          <p className="text-xs sm:text-sm text-[#302821]/75 dark:text-[#EAE3D6]/75 leading-relaxed max-w-lg mx-auto">
            Dispatches from our resident master artisans on cranial cutting techniques, botanical skin science, and restorative rituals.
          </p>
        </div>

        {/* Featured Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article, idx) => (
            <div
              key={idx}
              className="bg-[#EAE3D6]/40 dark:bg-[#1a201c] border border-[#302821]/15 dark:border-[#EAE3D6]/15 overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/11] overflow-hidden bg-[#EAE3D6] border-b border-[#302821]/15">
                  <SafeImage
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover grayscale-[10%]"
                  />
                  <div className="absolute top-3 left-3 bg-[#F5F1E8]/90 dark:bg-[#26372D]/90 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-[#302821] dark:text-[#F5F1E8] border border-[#302821]/20">
                    {article.category}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-[10px] text-[#302821]/60 dark:text-[#EAE3D6]/60 uppercase tracking-widest">
                    <span>{article.readTime}</span>
                    <span>•</span>
                    <span>{article.date}</span>
                  </div>

                  <h3 className="font-serif text-xl text-[#302821] dark:text-[#F5F1E8] leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-xs text-[#302821]/75 dark:text-[#EAE3D6]/75 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-[#302821]/10 dark:border-[#EAE3D6]/10 mt-3 flex items-center justify-between text-xs">
                <span className="text-[10px] uppercase tracking-wider text-[#302821]/70 dark:text-[#EAE3D6]/70">
                  {article.author}
                </span>
                <Link href="/services">
                  <span className="text-[11px] uppercase tracking-wider text-[#26372D] dark:text-[#B8755B] font-semibold hover:underline flex items-center gap-1">
                    Reserve <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Patron Reviews */}
        <div className="space-y-8 pt-8 border-t border-[#302821]/15 dark:border-[#EAE3D6]/15">
          <div className="text-center space-y-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#B8755B] font-semibold">
              GUEST CITATIONS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#302821] dark:text-[#F5F1E8]">
              Words from Discerning Patrons
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {citations.map((c, idx) => (
              <div
                key={idx}
                className="bg-[#EAE3D6]/30 dark:bg-[#1a201c] p-8 border border-[#302821]/15 dark:border-[#EAE3D6]/15 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex text-[#B8755B] gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#B8755B]" />
                    ))}
                  </div>
                  <p className="font-serif text-base text-[#302821] dark:text-[#F5F1E8] leading-relaxed">
                    &ldquo;{c.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-[#302821]/10 dark:border-[#EAE3D6]/10 text-[10px] uppercase tracking-wider text-[#302821]/70 dark:text-[#EAE3D6]/70">
                  <p className="font-bold text-[#26372D] dark:text-[#F5F1E8]">{c.author}</p>
                  <p>{c.title}</p>
                  <p className="text-[#B8755B] pt-0.5">{c.service}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
