import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Star,
  Quote,
  Clock,
  ArrowRight,
  BookOpen,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/ui/SafeImage";

export default function JournalPage() {
  const articles = [
    {
      title: "The Ultimate Guide to French Balayage: Technique & Maintenance",
      category: "Hair Artistry",
      readTime: "4 min read",
      author: "Elena Vance (Master Colorist)",
      date: "Nov 12, 2025",
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
      excerpt:
        "Learn why customized hand-painted highlights blend seamlessly with your natural regrowth and how botanical glossing extends vibrancy for up to 12 weeks.",
    },
    {
      title: "Why Caviar & Microcurrent Are Replacing Invasive Facials",
      category: "Skincare Science",
      readTime: "5 min read",
      author: "Sofia Rossi (Aesthetician)",
      date: "Nov 05, 2025",
      image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
      excerpt:
        "Explore how wild caviar peptides stimulate collagen regeneration when combined with low-voltage electrical microcurrents for immediate facial contouring.",
    },
    {
      title: "Russian Gel Manicures: Why The Precision Technique Lasts 4+ Weeks",
      category: "Nail Health",
      readTime: "3 min read",
      author: "Mia Lindqvist",
      date: "Oct 28, 2025",
      image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80",
      excerpt:
        "Discover the dry e-file methodology that cleanses the nail bed without cuticle tearing, allowing structural builder gel to adhere without lifting.",
    },
  ];

  const testimonials = [
    {
      quote:
        "The balayage service was hands down the best color transformation I have had in New York. Zero brassiness, and the blowout lasted four full days.",
      author: "Sarah K.",
      role: "Verified Patron",
      service: "Signature Balayage",
      rating: 5,
    },
    {
      quote:
        "Booking is so refreshingly fast compared to calling salons and leaving voicemails. The instant confirmation and Stripe checkout made it effortless.",
      author: "Michael T.",
      role: "Verified Patron",
      service: "Executive Beard & Cut",
      rating: 5,
    },
    {
      quote:
        "The deep tissue massage and cryo facial combination is pure rejuvenation. The studio environment is quiet, clean, and luxurious.",
      author: "Jessica R.",
      role: "Verified Patron",
      service: "Deep Tissue & Facial",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen py-12 sm:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary">
            <BookOpen className="w-3.5 h-3.5" />
            <span>The Salon Journal</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Beauty Chronicles & Expert Insights
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Professional hair care advice, skincare science, and patron transformations curated by our resident master stylists.
          </p>
        </div>

        {/* Featured Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article, idx) => (
            <div
              key={idx}
              className="bg-card rounded-2xl border border-border overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-primary/50 transition-all duration-300"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  <SafeImage
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-background/90 backdrop-blur-md text-foreground border border-border">
                      {article.category}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <Clock className="w-3 h-3 text-primary" />
                    <span>{article.readTime}</span>
                    <span>•</span>
                    <span>{article.date}</span>
                  </div>

                  <h3 className="text-base font-bold text-foreground line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-border/50 mt-3 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-muted-foreground">
                  By {article.author}
                </span>
                <Link href="/services">
                  <span className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                    Book Service <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Patron Reviews */}
        <div className="space-y-6 pt-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-bold text-foreground">
              What Our Patrons Say
            </h2>
            <p className="text-xs text-muted-foreground">
              Real verified reviews from clients across Manhattan and beyond.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex text-amber-500">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500" />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-foreground block">
                      {t.author}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {t.service}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                    Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
