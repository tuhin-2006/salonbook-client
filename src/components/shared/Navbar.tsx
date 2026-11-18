"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Scissors,
  Menu,
  X,
  Calendar,
  LogOut,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { SafeImage } from "@/components/ui/SafeImage";
import { getInitials } from "@/lib/utils";

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Browse Services", href: "/services" },
    { label: "Why SalonBook", href: "/experience" },
    { label: "Visit Us", href: "/journal" },
  ];

  const isAuthRoute =
    pathname === "/sign-in" ||
    pathname === "/sign-up" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password" ||
    pathname === "/signed-out";
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAuthRoute || isAdminRoute) {
    return null;
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-[#FAF7F2]/95 dark:bg-[#1E1619]/95 backdrop-blur-md border-b border-[#E8E2D8] dark:border-[#343132] shadow-sm py-2.5"
          : "bg-[#FAF7F2] dark:bg-[#1E1619] border-b border-[#E8E2D8]/60 dark:border-[#343132]/60 py-3.5"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Brand Logo (Star/Scissors icon + SalonBook) */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-[#3B1F2B] text-[#FAF7F2] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Scissors className="w-5 h-5 text-[#C5A880]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-2xl font-bold tracking-tight text-[#231C1E] dark:text-[#FAF7F2] group-hover:text-[#3B1F2B] transition-colors">
                  SalonBook
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-[#C5A880]/20 text-[#3B1F2B] dark:text-[#C5A880] uppercase tracking-wider">
                  Salon &amp; Spa
                </span>
              </div>
              <span className="text-[10px] text-[#231C1E]/60 dark:text-[#FAF7F2]/60 -mt-1 hidden sm:inline">
                SoHo Atelier, NYC
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#F5EFEB] dark:bg-[#281F23] px-3 py-1.5 rounded-full border border-[#E8E2D8] dark:border-[#3E3338]">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-[#3B1F2B] text-[#FAF7F2] shadow-sm"
                      : "text-[#231C1E]/70 dark:text-[#FAF7F2]/70 hover:text-[#3B1F2B] dark:hover:text-white"
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

            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                {isAdmin ? (
                  <Link href="/admin">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 border-[#3B1F2B]/30 text-[#3B1F2B] dark:text-[#FAF7F2] rounded-xl text-xs"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>Admin Suite</span>
                    </Button>
                  </Link>
                ) : (
                  <Link href="/dashboard">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 border-[#3B1F2B]/30 text-[#3B1F2B] dark:text-[#FAF7F2] rounded-xl text-xs"
                    >
                      <Calendar className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>My Lounge</span>
                    </Button>
                  </Link>
                )}

                <div className="flex items-center gap-2 pl-2 border-l border-[#E8E2D8] dark:border-[#38252E]">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-[#C5A880]/30 bg-[#3B1F2B] dark:bg-[#C5A880] text-[#FAF7F2] dark:text-[#170F13] font-serif text-xs font-bold flex items-center justify-center shrink-0">
                    {user.image ? (
                      <SafeImage src={user.image} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      getInitials(user.name)
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="h-8 px-2 text-[#231C1E]/70 dark:text-[#FAF7F2]/70 hover:text-red-700 dark:hover:text-red-400 rounded-lg"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/sign-in">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs font-semibold text-[#231C1E] dark:text-[#FAF7F2]"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href={isAuthenticated ? "/services" : "/sign-in?redirect=/services"}>
                  <Button
                    variant="default"
                    size="sm"
                    className="gap-1.5 text-xs font-bold px-4 py-2 bg-[#3B1F2B] text-[#FAF7F2] hover:bg-[#4A2035] rounded-xl shadow-sm"
                  >
                    <span>Book now</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C5A880]" />
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#231C1E] dark:text-[#FAF7F2] hover:bg-[#F5EFEB] dark:hover:bg-[#251B20] border border-[#E8E2D8] dark:border-[#38252E]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-[#3B1F2B] dark:text-[#C5A880]" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E8E2D8] dark:border-[#38252E] bg-[#FAF7F2] dark:bg-[#1E1619] px-6 py-5 space-y-4">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-xs font-semibold py-2.5 px-3 rounded-xl transition-colors ${
                    isActive
                      ? "bg-[#3B1F2B] text-[#FAF7F2]"
                      : "text-[#231C1E]/80 dark:text-[#FAF7F2]/80 hover:bg-[#F5EFEB] dark:hover:bg-[#251B20]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-[#E8E2D8] dark:border-[#38252E] flex flex-col gap-2.5">
            {isAuthenticated && user ? (
              <>
                <div className="flex items-center gap-3 p-3 bg-[#F5EFEB] dark:bg-[#251B20] rounded-xl border border-[#E8E2D8] dark:border-[#38252E]">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-[#C5A880]/30 bg-[#3B1F2B] dark:bg-[#C5A880] text-[#FAF7F2] dark:text-[#170F13] font-serif text-xs font-bold flex items-center justify-center shrink-0">
                    {user.image ? (
                      <SafeImage src={user.image} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      getInitials(user.name)
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#231C1E] dark:text-[#FAF7F2]">
                      {user.name}
                    </span>
                    <span className="text-[11px] text-[#231C1E]/60 dark:text-[#FAF7F2]/60">
                      {user.email}
                    </span>
                  </div>
                </div>

                <Link
                  href={isAdmin ? "/admin" : "/dashboard"}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button variant="default" className="w-full text-xs font-bold rounded-xl bg-[#3B1F2B]">
                    {isAdmin ? "Admin Suite" : "My Lounge"}
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-xs text-red-700 rounded-xl"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full text-xs font-bold rounded-xl">
                    Sign In
                  </Button>
                </Link>
                <Link href={isAuthenticated ? "/services" : "/sign-in?redirect=/services"} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="default" className="w-full text-xs font-bold rounded-xl bg-[#3B1F2B] text-[#FAF7F2]">
                    Book now
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
