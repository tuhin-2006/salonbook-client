"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Scissors,
  MapPin,
  Phone,
  Mail,
  Clock,
  Instagram,
  Facebook,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-[#2D1621] text-[#FAF7F2] border-t border-[#4A2035]">
      {/* Concierge Newsletter / VIP Notice */}
      <div className="border-b border-[#FAF7F2]/10 py-10 px-4 sm:px-6 lg:px-8 bg-[#231019]">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A880]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Priority Appointments &amp; Seasonal Care</span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl text-[#FAF7F2] font-normal">
              Join the SalonBook Private Guestlist
            </h3>
            <p className="text-xs text-[#FAF7F2]/70 max-w-md">
              Receive seasonal styling journals, first access to holiday openings, and master artist feature notes.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Thank you for joining our guestlist!");
            }}
            className="w-full md:w-auto flex flex-col sm:flex-row gap-2 max-w-md"
          >
            <input
              type="email"
              required
              placeholder="Enter your email address"
              className="px-4 py-2.5 rounded-xl bg-[#3B1F2B] border border-[#FAF7F2]/20 text-xs text-[#FAF7F2] placeholder:text-[#FAF7F2]/50 focus:outline-none focus:border-[#C5A880] min-w-[260px]"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#C5A880] text-[#231C1E] font-medium text-xs uppercase tracking-wider hover:bg-[#d6bc96] transition-colors whitespace-nowrap flex items-center justify-center gap-1.5"
            >
              <span>Join</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Main Directory */}
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-[#C5A880] text-[#231C1E] flex items-center justify-center shadow-md">
                <Scissors className="w-4 h-4" />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight text-[#FAF7F2] block leading-none">
                  SalonBook
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A880]">
                  SoHo Atelier · New York
                </span>
              </div>
            </Link>

            <p className="text-xs text-[#FAF7F2]/75 leading-relaxed max-w-sm">
              A neighbourhood sanctuary for hair, skin, nails and restorative spa rituals.
              Curated master barbers, transparent real-time scheduling, and uncompromised individual care.
            </p>

            {/* Social Icons */}
            <div className="pt-2 flex items-center gap-3 text-[#FAF7F2]/80">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-lg bg-[#3B1F2B] border border-[#FAF7F2]/10 flex items-center justify-center hover:text-[#C5A880] hover:border-[#C5A880]/50 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-lg bg-[#3B1F2B] border border-[#FAF7F2]/10 flex items-center justify-center hover:text-[#C5A880] hover:border-[#C5A880]/50 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Pinterest"
                className="w-8 h-8 rounded-lg bg-[#3B1F2B] border border-[#FAF7F2]/10 flex items-center justify-center hover:text-[#C5A880] hover:border-[#C5A880]/50 transition-colors text-xs font-bold"
              >
                P
              </a>
            </div>

            <div className="pt-1 flex items-center gap-2 text-[11px] text-[#C5A880]">
              <ShieldCheck className="w-4 h-4" />
              <span>Certified Clean Practices &amp; Verified Specialists</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#C5A880] mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs text-[#FAF7F2]/80">
              <li>
                <Link href="/" className="hover:text-[#FAF7F2] hover:underline underline-offset-4 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-[#FAF7F2] hover:underline underline-offset-4 transition-colors">
                  Browse Services
                </Link>
              </li>
              <li>
                <Link href="/experience" className="hover:text-[#FAF7F2] hover:underline underline-offset-4 transition-colors">
                  Why SalonBook
                </Link>
              </li>
              <li>
                <Link href="/sign-in" className="hover:text-[#FAF7F2] hover:underline underline-offset-4 transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/sign-up" className="hover:text-[#FAF7F2] hover:underline underline-offset-4 transition-colors">
                  Create an account
                </Link>
              </li>
              <li>
                <Link href="/journal" className="hover:text-[#FAF7F2] hover:underline underline-offset-4 transition-colors">
                  Visit Us &amp; Studio Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Treatments Directory */}
          <div>
            <h4 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#C5A880] mb-4">
              Treatments
            </h4>
            <ul className="space-y-2.5 text-xs text-[#FAF7F2]/80">
              <li>
                <Link href="/services?category=Hair" className="hover:text-[#FAF7F2] hover:underline underline-offset-4 transition-colors">
                  Hair Styling &amp; Color
                </Link>
              </li>
              <li>
                <Link href="/services?category=Barbering" className="hover:text-[#FAF7F2] hover:underline underline-offset-4 transition-colors">
                  Classic Barbering &amp; Beard
                </Link>
              </li>
              <li>
                <Link href="/services?category=Facial%20%26%20Skin" className="hover:text-[#FAF7F2] hover:underline underline-offset-4 transition-colors">
                  Facial &amp; Skin Rituals
                </Link>
              </li>
              <li>
                <Link href="/services?category=Massage" className="hover:text-[#FAF7F2] hover:underline underline-offset-4 transition-colors">
                  Restorative Massage
                </Link>
              </li>
              <li>
                <Link href="/services?category=Nails" className="hover:text-[#FAF7F2] hover:underline underline-offset-4 transition-colors">
                  Manicures &amp; Pedicures
                </Link>
              </li>
              <li>
                <Link href="/services?category=Spa%20%26%20Wellness" className="hover:text-[#FAF7F2] hover:underline underline-offset-4 transition-colors">
                  Spa &amp; Wellness
                </Link>
              </li>
            </ul>
          </div>

          {/* Flagship Coordinates */}
          <div className="space-y-3">
            <h4 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#C5A880] mb-4">
              Flagship Studio
            </h4>
            <p className="text-xs text-[#FAF7F2]/80 flex items-start gap-2 leading-relaxed">
              <MapPin className="w-3.5 h-3.5 text-[#C5A880] mt-0.5 shrink-0" />
              <span>128 Mercer Street, Suite 4B<br />SoHo, New York, NY 10012</span>
            </p>
            <p className="text-xs text-[#FAF7F2]/80 flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
              <span>+1 (646) 892-4410</span>
            </p>
            <p className="text-xs text-[#FAF7F2]/80 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
              <span>care@salonbook-atelier.com</span>
            </p>
            <p className="text-xs text-[#FAF7F2]/80 flex items-center gap-2 pt-1">
              <Clock className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
              <span>Mon – Sat: 9:00 AM – 8:30 PM | Sun: 10:00 AM – 6:00 PM</span>
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[#FAF7F2]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FAF7F2]/60">
          <p>© 2026 SalonBook. All rights reserved.</p>
          <div className="flex items-center gap-6 text-[11px]">
            <Link href="/experience" className="hover:text-[#FAF7F2] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/experience" className="hover:text-[#FAF7F2] transition-colors">
              Terms of Service
            </Link>
            <Link href="/admin" className="hover:text-[#C5A880] transition-colors">
              Staff Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
