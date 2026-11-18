import React from "react";
import Link from "next/link";
import { ArrowUpRight, MapPin, Phone, Mail } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-[#26372D] text-[#F5F1E8] border-t border-[#302821]/20">
      {/* Editorial Gazette Dispatch Bar */}
      <div className="border-b border-[#F5F1E8]/10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-xl space-y-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#A4AA91]">
              The Seasonal Dispatch
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-normal tracking-wide text-[#F5F1E8]">
              Essays on Slow Restoration, Formulation &amp; Hair Architecture
            </h3>
            <p className="text-xs text-[#EAE3D6]/70 leading-relaxed">
              Curated notes delivered fortnightly. Formulations, seasonal rituals, and private appointment priority.
            </p>
          </div>

          <div className="w-full max-w-md flex flex-col sm:flex-row gap-0 border border-[#F5F1E8]/20 bg-[#343D2E]/50">
            <input
              type="email"
              placeholder="Your email address"
              className="px-4 py-3 bg-transparent text-xs text-[#F5F1E8] placeholder:text-[#A4AA91] focus:outline-none flex-1 border-b sm:border-b-0 sm:border-r border-[#F5F1E8]/20"
            />
            <button className="px-6 py-3 bg-[#B8755B] text-[#F5F1E8] text-[11px] uppercase tracking-[0.2em] font-medium hover:bg-[#a0624a] transition-colors whitespace-nowrap">
              SUBSCRIBE
            </button>
          </div>
        </div>
      </div>

      {/* Main Editorial Directory */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Manifesto Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col">
              <span className="font-serif text-3xl tracking-[0.25em] font-normal text-[#F5F1E8]">
                SALONBOOK
              </span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#A4AA91] mt-1">
                Atelier de Haute Beauté
              </span>
            </div>
            <p className="text-[#EAE3D6]/75 text-xs leading-relaxed max-w-sm">
              An architectural beauty atelier dedicated to restorative hair artistry, botanical skin therapy, and quiet ritual. Grounded in craft, intentionality, and biological care.
            </p>
            <div className="pt-2 text-[11px] text-[#A4AA91] tracking-wider uppercase">
              Member · Fédération de la Beauté &amp; de l&apos;Élégance
            </div>
          </div>

          {/* Treatments Navigation */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.25em] text-[#A4AA91] mb-4">
              Treatments
            </h4>
            <ul className="space-y-2.5 text-xs text-[#EAE3D6]/80">
              <li>
                <Link href="/services?category=Hair" className="hover:text-[#F5F1E8] transition-colors">
                  Architectural Haircut &amp; Styling
                </Link>
              </li>
              <li>
                <Link href="/services?category=Color" className="hover:text-[#F5F1E8] transition-colors">
                  Organic Balayage &amp; Tint
                </Link>
              </li>
              <li>
                <Link href="/services?category=Facial%20%26%20Skin" className="hover:text-[#F5F1E8] transition-colors">
                  Botanical Facial Therapy
                </Link>
              </li>
              <li>
                <Link href="/services?category=Massage" className="hover:text-[#F5F1E8] transition-colors">
                  Basalt Stone &amp; Herbal Massage
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-[#F5F1E8] transition-colors inline-flex items-center gap-1">
                  Complete Carte <ArrowUpRight className="w-3 h-3 text-[#A4AA91]" />
                </Link>
              </li>
            </ul>
          </div>

          {/* The Atelier Navigation */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.25em] text-[#A4AA91] mb-4">
              The Atelier
            </h4>
            <ul className="space-y-2.5 text-xs text-[#EAE3D6]/80">
              <li>
                <Link href="/experience" className="hover:text-[#F5F1E8] transition-colors">
                  Philosophy &amp; Space
                </Link>
              </li>
              <li>
                <Link href="/journal" className="hover:text-[#F5F1E8] transition-colors">
                  The Atelier Journal
                </Link>
              </li>
              <li>
                <Link href="/sign-in" className="hover:text-[#F5F1E8] transition-colors">
                  Guest Consultation Access
                </Link>
              </li>
              <li>
                <Link href="/sign-up" className="hover:text-[#F5F1E8] transition-colors">
                  Create Private Profile
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#F5F1E8] transition-colors">
                  Staff &amp; Master Artist Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Flagship Locations */}
          <div className="space-y-3">
            <h4 className="text-[10px] uppercase tracking-[0.25em] text-[#A4AA91] mb-4">
              Flagship Studio
            </h4>
            <p className="text-xs text-[#EAE3D6]/80 flex items-start gap-2 leading-relaxed">
              <MapPin className="w-3.5 h-3.5 text-[#B8755B] mt-0.5 shrink-0" />
              <span>450 Madison Avenue, 4th Floor<br />New York, NY 10022</span>
            </p>
            <p className="text-xs text-[#EAE3D6]/80 flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#B8755B] shrink-0" />
              <span>+1 (212) 555-0198</span>
            </p>
            <p className="text-xs text-[#EAE3D6]/80 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#B8755B] shrink-0" />
              <span>concierge@salonbook.com</span>
            </p>
            <div className="pt-2 text-[10px] uppercase tracking-[0.2em] text-[#A4AA91]">
              Daily · 09:00 — 20:00 EST
            </div>
          </div>
        </div>

        {/* Bottom hairline & legal */}
        <div className="mt-14 pt-8 border-t border-[#F5F1E8]/10 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-[#A4AA91]">
          <p>© 2025 SALONBOOK ATELIER. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-6 uppercase tracking-[0.16em] text-[10px]">
            <span>TERMS OF SERVICE</span>
            <span>PRIVACY DISCLOSURE</span>
            <span>HYGIENE STANDARDS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
