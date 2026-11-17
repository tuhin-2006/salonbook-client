import React from "react";
import Link from "next/link";
import { Sparkles, MapPin, Phone, Mail, Clock } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-card text-card-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-terracotta-600 to-gold-400 flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-serif text-2xl font-semibold tracking-tight">
                SALONBOOK
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Elevating personal care into an art form. An editorial sanctuary
              for hair architecture, facial radiance rituals, and bespoke body therapies.
            </p>
          </div>

          {/* Quick Nav */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-semibold tracking-tight">
              Curated Services
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/services?category=Hair Styling & Cut" className="hover:text-primary transition-colors">
                  Hair Styling & French Balayage
                </Link>
              </li>
              <li>
                <Link href="/services?category=Facial & Skincare" className="hover:text-primary transition-colors">
                  Caviar & Gold Facials
                </Link>
              </li>
              <li>
                <Link href="/services?category=Nails & Manicure" className="hover:text-primary transition-colors">
                  Russian Manicure & Apex Gel
                </Link>
              </li>
              <li>
                <Link href="/services?category=Massage & Body Spa" className="hover:text-primary transition-colors">
                  Aromatherapy Hot Stone Rituals
                </Link>
              </li>
              <li>
                <Link href="/services?category=Bridal & Makeup" className="hover:text-primary transition-colors">
                  Couture Bridal Packages
                </Link>
              </li>
            </ul>
          </div>

          {/* Working Hours */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-semibold tracking-tight">
              Salon Atelier Hours
            </h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-terracotta-500 shrink-0" />
                <span>Monday – Friday: 9:00 AM – 8:00 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-terracotta-500 shrink-0" />
                <span>Saturday: 8:30 AM – 7:30 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gold-500 shrink-0" />
                <span>Sunday: 10:00 AM – 6:00 PM (By Appointment)</span>
              </div>
            </div>
          </div>

          {/* Atelier Contact */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-semibold tracking-tight">
              Sanctuary Contact
            </h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-terracotta-500 shrink-0" />
                <span>450 Madison Avenue, New York, NY 10022</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-terracotta-500 shrink-0" />
                <span>+1 (212) 555-0198</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-terracotta-500 shrink-0" />
                <span>atelier@salonbook.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>© {new Date().getFullYear()} SalonBook. All rights reserved. Handcrafted with modern editorial aesthetics.</p>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-foreground">Privacy Policy</Link>
            <Link href="/" className="hover:text-foreground">Terms of Service</Link>
            <Link href="/services" className="hover:text-foreground">Browse Services</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
