import React from "react";
import Link from "next/link";
import { Scissors, ShieldCheck, HeartHandshake, Award, ArrowUpRight, Sparkles, Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-card text-foreground transition-colors">
      {/* Modern Newsletter Section */}
      <div className="border-b border-border py-12 px-4 sm:px-6 lg:px-8 bg-secondary/30">
        <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center lg:text-left max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Stay in the Loop
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
              Get Exclusive Offers & Hair Care Tips
            </h3>
            <p className="text-xs text-muted-foreground">
              Subscribe to receive weekly styling advice, seasonal treatment discounts, and VIP event access.
            </p>
          </div>

          <div className="w-full max-w-md flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Enter your email address"
              className="px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 flex-1"
            />
            <button className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Directory */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <Scissors className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-black tracking-tight text-foreground">
                SalonBook
              </span>
            </Link>
            <p className="text-muted-foreground text-xs leading-relaxed max-w-sm">
              The premier online booking platform for high-end salons, independent stylists, and luxury spa therapies. Effortless scheduling and secure Stripe checkout.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20">
                <Award className="w-3.5 h-3.5" />
                #1 Rated Salon SaaS 2025
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/services" className="hover:text-primary transition-colors">
                  All Services
                </Link>
              </li>
              <li>
                <Link href="/services?category=Hair" className="hover:text-primary transition-colors">
                  Hair Styling & Color
                </Link>
              </li>
              <li>
                <Link href="/services?category=Facial%20%26%20Skin" className="hover:text-primary transition-colors">
                  Facials & Skincare
                </Link>
              </li>
              <li>
                <Link href="/services?category=Massage" className="hover:text-primary transition-colors">
                  Therapeutic Massage
                </Link>
              </li>
              <li>
                <Link href="/experience" className="hover:text-primary transition-colors">
                  The Studio Experience
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">
              Company
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/experience" className="hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/journal" className="hover:text-primary transition-colors">
                  Beauty Journal
                </Link>
              </li>
              <li>
                <Link href="/sign-in" className="hover:text-primary transition-colors">
                  Client Sign In
                </Link>
              </li>
              <li>
                <Link href="/sign-up" className="hover:text-primary transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-primary transition-colors">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">
              Flagship Studio
            </h4>
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              450 Madison Avenue, New York, NY
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-primary" />
              +1 (212) 555-0198
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-primary" />
              concierge@salonbook.com
            </p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
              Open 7 Days · 9:00 AM – 8:00 PM
            </p>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} SalonBook Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-foreground cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
