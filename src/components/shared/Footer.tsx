import React from "react";
import Link from "next/link";
import { Sparkles, MapPin, Phone, Mail, Clock, ShieldCheck, HeartHandshake, Award, ArrowUpRight } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-noir-900 text-champagne-100 dark:bg-card dark:text-foreground transition-colors">
      {/* Editorial Newsletter Strip */}
      <div className="border-b border-gold-500/15 py-12 px-4 sm:px-6 lg:px-8 bg-noir-800/60 dark:bg-card/60">
        <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center lg:text-left max-w-xl">
            <span className="text-[11px] uppercase tracking-[0.25em] text-gold-400 font-semibold">
              The Atelier Society
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white dark:text-foreground">
              Receive Privileged Invitations & Beauty Chronicles
            </h3>
            <p className="text-sm text-zinc-400">
              Curated seasonal wellness editions, master guest residencies, and private salon openings.
            </p>
          </div>

          <div className="w-full max-w-md flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Enter your personal email"
              className="px-4 py-3 rounded-full bg-noir-900/90 border border-gold-500/25 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-gold-400 flex-1"
            />
            <button className="px-6 py-3 rounded-full bg-gradient-to-r from-gold-500 to-terracotta-500 text-white text-xs uppercase tracking-wider font-semibold hover:opacity-95 transition-opacity shadow-lg shadow-gold-500/20 whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Directory */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Philosophy */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-terracotta-600 via-primary to-gold-400 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold tracking-tight text-white dark:text-foreground">
                  SALONBOOK
                </span>
                <span className="text-[9px] tracking-[0.2em] uppercase text-gold-400 font-semibold">
                  Haute Wellness & Beauty
                </span>
              </div>
            </Link>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
              An architectural beauty sanctuary in Manhattan and London. We reframe personal grooming into a slow, transformative ritual using rare botanical elixirs and master European craftsmanship.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-gold-500/10 border border-gold-500/30 text-gold-300">
                <Award className="w-3.5 h-3.5 text-gold-400" />
                Vogue Beauty Award 2025
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                <ShieldCheck className="w-3.5 h-3.5" />
                100% Organic Extracts
              </span>
            </div>
          </div>

          {/* Curated Services Menu */}
          <div className="space-y-4">
            <h4 className="font-serif text-base font-semibold tracking-wide text-white dark:text-foreground uppercase text-xs">
              Signature Rituals
            </h4>
            <ul className="space-y-2.5 text-sm text-zinc-400">
              <li>
                <Link href="/services?category=Hair" className="hover:text-gold-400 transition-colors flex items-center justify-between group">
                  <span>French Balayage & Glaze</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/services?category=Facial & Skin" className="hover:text-gold-400 transition-colors flex items-center justify-between group">
                  <span>Caviar & 24K Radiance</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/services?category=Nails" className="hover:text-gold-400 transition-colors flex items-center justify-between group">
                  <span>Russian Dry Gel & Apex</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/services?category=Massage" className="hover:text-gold-400 transition-colors flex items-center justify-between group">
                  <span>Volcanic Hot Stone Therapy</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/services?category=Makeup" className="hover:text-gold-400 transition-colors flex items-center justify-between group">
                  <span>Haute Bridal Atelier</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Sanctuary Hours */}
          <div className="space-y-4">
            <h4 className="font-serif text-base font-semibold tracking-wide text-white dark:text-foreground uppercase text-xs">
              Atelier Hours
            </h4>
            <div className="space-y-2 text-sm text-zinc-400">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-white dark:text-foreground font-medium">Monday – Friday</p>
                  <p className="text-xs text-zinc-400">9:00 AM – 8:00 PM EST</p>
                </div>
              </div>
              <div className="flex items-start gap-2 pt-1">
                <Clock className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-white dark:text-foreground font-medium">Saturday</p>
                  <p className="text-xs text-zinc-400">8:30 AM – 7:30 PM EST</p>
                </div>
              </div>
              <div className="flex items-start gap-2 pt-1">
                <Clock className="w-4 h-4 text-terracotta-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-white dark:text-foreground font-medium">Sunday</p>
                  <p className="text-xs text-zinc-400">10:00 AM – 6:00 PM (By Appt.)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Concierge */}
          <div className="space-y-4">
            <h4 className="font-serif text-base font-semibold tracking-wide text-white dark:text-foreground uppercase text-xs">
              Concierge Desk
            </h4>
            <div className="space-y-3 text-sm text-zinc-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-1" />
                <div>
                  <p className="text-white dark:text-foreground font-medium">Madison Ave Sanctuary</p>
                  <p className="text-xs text-zinc-400">450 Madison Ave, New York, NY 10022</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <span className="text-xs text-zinc-300">+1 (212) 555-0198</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <span className="text-xs text-zinc-300">concierge@salonbook.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Guarantee */}
        <div className="mt-16 pt-8 border-t border-gold-500/15 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-4">
          <p>© {new Date().getFullYear()} SalonBook Atelier Inc. All rights reserved. Handcrafted editorial wellness experience.</p>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-gold-400 transition-colors">Privacy Charter</Link>
            <Link href="/" className="hover:text-gold-400 transition-colors">Client Terms</Link>
            <Link href="/services" className="hover:text-gold-400 transition-colors">Complete Services Directory</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
