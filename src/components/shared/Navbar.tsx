"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  Menu,
  X,
  User as UserIcon,
  Calendar,
  LogOut,
  ShieldAlert,
  Clock,
  Compass,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { getInitials } from "@/lib/utils";

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Services Menu", href: "/services" },
    { label: "The Atelier Experience", href: "/#experience" },
    { label: "Client Journal", href: "/#reviews" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Top Subtle Haute Utility Bar */}
      <div className="hidden lg:block bg-noir-900 text-champagne-200 text-xs py-1.5 px-6 border-b border-gold-500/15">
        <div className="container mx-auto flex items-center justify-between tracking-wider">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-gold-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Flagship Sanctuary Open: 9:00 AM – 8:00 PM
            </span>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-300">450 Madison Avenue, New York</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-zinc-400">Concierge Desk: +1 (212) 555-0198</span>
            <span className="text-gold-400 font-medium">Bespoke Hair · Skin · Wellness</span>
          </div>
        </div>
      </div>

      {/* Main Glassmorphic Navigation Bar */}
      <div className="glass-luxury border-b border-border/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo & Editorial Typography */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 rounded-full bg-gradient-to-tr from-terracotta-600 via-primary to-gold-400 flex items-center justify-center shadow-lg shadow-gold-500/10 text-white group-hover:scale-105 transition-all duration-300">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
              <div className="absolute inset-0 rounded-full border border-gold-300/40" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                SALONBOOK
              </span>
              <span className="text-[9px] tracking-[0.25em] uppercase text-gold-600 dark:text-gold-400 -mt-1 font-sans font-semibold">
                Haute Wellness & Beauty
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-secondary/60 dark:bg-card/60 p-1.5 rounded-full border border-border/60">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-wider font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/80"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Controls & Auth State */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {isAdmin ? (
                  <Link href="/admin">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 border-gold-500/40 text-gold-700 dark:text-gold-300 hover:bg-gold-500/10 rounded-full px-4 text-xs font-semibold"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      Executive Suite
                    </Button>
                  </Link>
                ) : (
                  <Link href="/dashboard">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 rounded-full px-4 text-xs font-semibold"
                    >
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      Client Lounge
                    </Button>
                  </Link>
                )}

                {/* User Dropdown Badge */}
                <div className="flex items-center gap-2 pl-2 border-l border-border/80">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gold-500/20 to-terracotta-500/20 border border-gold-500/30 flex items-center justify-center text-foreground text-xs font-bold shadow-inner">
                    {user?.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.image}
                        alt={user.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      getInitials(user?.name || "")
                    )}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold text-foreground leading-tight max-w-[110px] truncate">
                      {user?.name}
                    </span>
                    <span className="text-[10px] text-gold-600 dark:text-gold-400 uppercase tracking-widest font-semibold">
                      {isAdmin ? "Director" : "VIP Client"}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={logout}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive rounded-full"
                    title="Log out"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/sign-in">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full px-4 text-xs font-semibold"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/services">
                  <Button
                    variant="luxury"
                    size="sm"
                    className="gap-1.5 rounded-full px-5 text-xs font-semibold shadow-md shadow-primary/20"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Reserve Session
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-border/80"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-card/95 backdrop-blur-xl p-6 space-y-5 animate-in slide-in-from-top-4 shadow-2xl">
          <div className="flex items-center gap-2 text-xs text-gold-600 dark:text-gold-400 font-medium pb-2 border-b border-border/60">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Open Today · 450 Madison Ave, NYC</span>
          </div>

          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-medium py-2 px-3 rounded-lg transition-colors ${
                  pathname === link.href
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pt-4 border-t border-border space-y-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 border border-border">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center">
                    {getInitials(user?.name || "")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                    <span className="text-[10px] text-gold-600 dark:text-gold-400 uppercase font-semibold">
                      {isAdmin ? "System Administrator" : "VIP Member"}
                    </span>
                  </div>
                </div>

                {isAdmin ? (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button className="w-full justify-start gap-2 mb-2 rounded-xl" variant="outline">
                      <ShieldAlert className="w-4 h-4 text-gold-500" />
                      Executive Admin Suite
                    </Button>
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button className="w-full justify-start gap-2 mb-2 rounded-xl" variant="outline">
                      <Calendar className="w-4 h-4 text-primary" />
                      Client Dashboard & Bookings
                    </Button>
                  </Link>
                )}

                <Button
                  variant="destructive"
                  className="w-full justify-start gap-2 rounded-xl"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/sign-in"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full"
                >
                  <Button variant="outline" className="w-full rounded-xl">
                    Sign In
                  </Button>
                </Link>
                <Link
                  href="/services"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full"
                >
                  <Button variant="luxury" className="w-full rounded-xl">
                    Reserve Now
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
