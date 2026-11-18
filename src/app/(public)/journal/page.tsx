import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Star,
  Quote,
  CheckCircle2,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/shared/SectionHeading";

export default function JournalPage() {
  const editorialPress = [
    {
      source: "Vogue Magazine",
      quote: "SalonBook is redefining haute personal care into an architectural art form. The French balayage and 24K caviar facial provide weeks of radiant luminosity.",
      date: "Spring Beauty Issue 2025",
    },
    {
      source: "Architectural Digest",
      quote: "A masterclass in acoustic sanctuary design. Travertine stone and limewash create an environment where stress evaporates the moment you step through the door.",
      date: "Wellness Spaces Edition",
    },
    {
      source: "Harper's Bazaar",
      quote: "Elena Vance and her resident specialists possess a supernatural understanding of facial bone geometry. It is the gold standard of New York salons.",
      date: "Best of Manhattan 2025",
    },
  ];

  const patronStories = [
    {
      author: "Genevieve Dubois",
      role: "Fashion Director, Paris & NYC",
      ritual: "Caviar & 24K Gold Facial",
      specialist: "Dr. Aurelia Chen",
      rating: 5,
      story: "The caviar and oxygen facial was truly transcendental. My skin had an unmistakable glass glow that lasted through three major fashion weeks. The private booth atmosphere is pure luxury.",
      date: "October 2025",
    },
    {
      author: "Camille Laurent",
      role: "Architectural Editor",
      ritual: "Signature French Balayage",
      specialist: "Elena Vance",
      rating: 5,
      story: "I had given up on finding a colorist who understood subtle dimension without damaging my hair texture. Elena's hand-painting technique is pure mastery.",
      date: "November 2025",
    },
    {
      author: "Marcus Vance",
      role: "Private Equity Partner",
      ritual: "Deep Tissue Hot Stone Therapy",
      specialist: "Alexander Wright",
      rating: 5,
      story: "Between transcontinental flights, this 90-minute volcanic stone ritual is non-negotiable. Alexander resets muscular tension with incredible anatomical precision.",
      date: "December 2025",
    },
    {
      author: "Sophia Montgomery",
      role: "Couture Patron",
      ritual: "Russian Gel Manicure & Botanical Spa",
      specialist: "Mia Lindqvist",
      rating: 5,
      story: "Flawless dry e-file apex alignment. My nails have never been healthier. The rose petal arm massage and chilled matcha make the entire afternoon a true pause.",
      date: "January 2026",
    },
    {
      author: "Julian Reynolds",
      role: "Creative Director",
      ritual: "Executive Beard Sculpt & Hot Towel Shave",
      specialist: "Marco Rossi",
      rating: 5,
      story: "Old-world Italian barbering craft combined with contemporary organic sandalwood oils. The eucalyptus hot steam towels are unmatched in Manhattan.",
      date: "February 2026",
    },
    {
      author: "Victoria Stirling",
      role: "Editorial Bride",
      ritual: "Royal Bridal Couture Glamour",
      specialist: "Victoria Sterling",
      rating: 5,
      story: "From the bridal preview session to wedding morning, the entire team treated me like royalty. My hair and airbrush makeup remained immaculate for 14 hours straight.",
      date: "March 2026",
    },
  ];

  return (
    <div className="min-h-screen py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl space-y-20">
        {/* Editorial Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-[0.2em] bg-gold-500/10 border border-gold-500/30 text-gold-700 dark:text-gold-300">
            <Quote className="w-3.5 h-3.5 text-gold-500" />
            The Client Journal
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.15]">
            Reflections & Chronicles of Care
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Read verified impressions from our discerning patrons and international press who trust SalonBook for their essential beauty moments.
          </p>
        </div>

        {/* Press Quotes Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {editorialPress.map((press, i) => (
            <div
              key={i}
              className="p-8 rounded-3xl bg-forest-950 text-white border border-gold-500/20 shadow-xl space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <span className="font-serif text-xl font-bold text-gold-300 block">
                  {press.source}
                </span>
                <p className="text-xs sm:text-sm text-zinc-300 italic leading-relaxed">
                  &ldquo;{press.quote}&rdquo;
                </p>
              </div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 border-t border-forest-900 pt-3">
                {press.date}
              </p>
            </div>
          ))}
        </div>

        {/* Patron Reviews Grid */}
        <div className="space-y-12">
          <SectionHeading
            badge="Patron Chronicles"
            title="Verified Client Experiences"
            subtitle="Authentic reflections following completed sessions at our Madison Avenue sanctuary."
            center
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {patronStories.map((story, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-card border border-gold-500/20 shadow-lg hover:shadow-2xl hover:border-gold-500/40 transition-all flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(story.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                      ))}
                    </div>
                    <Badge variant="outline" className="text-[10px] font-semibold bg-secondary/40">
                      {story.ritual}
                    </Badge>
                  </div>

                  <p className="font-serif text-sm italic leading-relaxed text-foreground">
                    &ldquo;{story.story}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-border/80 flex items-center justify-between">
                  <div>
                    <p className="font-serif font-bold text-sm text-foreground">
                      {story.author}
                    </p>
                    <p className="text-[11px] text-muted-foreground">{story.role}</p>
                  </div>
                  <span className="text-[10px] text-gold-600 dark:text-gold-400 font-semibold">
                    Specialist: {story.specialist}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="text-center p-12 rounded-3xl bg-card border border-gold-500/25 shadow-xl space-y-6 max-w-2xl mx-auto">
          <span className="text-xs uppercase font-bold tracking-[0.2em] text-gold-600 dark:text-gold-400">
            Write Your Own Chapter
          </span>
          <h2 className="font-serif text-3xl font-bold text-foreground">
            Ready to Begin Your Personal Ritual?
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Discover our curated menu of bespoke treatments and reserve your chair with our master resident artists.
          </p>
          <div className="pt-2 flex justify-center">
            <Link href="/services">
              <Button variant="luxury" size="lg" className="rounded-full gap-2 text-xs font-semibold px-8 shadow-lg shadow-gold-500/20">
                <Sparkles className="w-4 h-4" />
                <span>Reserve Appointment Chair</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
