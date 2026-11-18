"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Calendar,
  LogOut,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { getInitials } from "@/lib/utils";

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "ATELIER", href: "/" },
    { label: "TREATMENTS", href: "/services" },
    { label: "THE EXPERIENCE", href: "/experience" },
    { label: "JOURNAL", href: "/journal" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-[#F5F1E8]/95 dark:bg-[#1a201c]/95 backdrop-blur-md border-b border-[#302821]/15 dark:border-[#EAE3D6]/15 shadow-sm py-2.5"
          : "bg-[#F5F1E8] dark:bg-[#1a201c] border-b border-[#302821]/10 dark:border-[#EAE3D6]/10 py-3.5"
      }`}
    >
      {/* Editorial Micro-Header Notice */}
      <div className="hidden lg:block border-b border-[#302821]/10 dark:border-[#EAE3D6]/10 pb-2 mb-2 text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#302821]/70 dark:text-[#EAE3D6]/70">
          PARIS · NEW YORK · MILAN &nbsp;—&nbsp; PRIVATE ATELIER CONSULTATIONS &amp; SLOW RESTORATION
        </p>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Brand Identity: Editorial Serif */}
          <Link href="/" className="flex flex-col group">
            <span className="font-serif text-2xl sm:text-3xl font-normal tracking-[0.22em] text-[#302821] dark:text-[#F5F1E8] group-hover:text-[#26372D] transition-colors">
              SALONBOOK
            </span>
            <span className="text-[9px] uppercase tracking-[0.3em] text-[#302821]/60 dark:text-[#EAE3D6]/60 -mt-0.5">
              Haute Beauté &amp; Botanical Spa
            </span>
          </Link>

          {/* Desktop Navigation Links — Editorial Caps */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[11px] font-medium tracking-[0.2em] uppercase transition-colors relative py-1 ${
                    isActive
                      ? "text-[#26372D] dark:text-[#F5F1E8] font-semibold"
                      : "text-[#302821]/70 dark:text-[#EAE3D6]/70 hover:text-[#26372D] dark:hover:text-white"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#26372D] dark:bg-[#B8755B]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Controls & Auth State */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />

            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                {isAdmin ? (
                  <Link href="/admin">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 border-[#26372D]/30 text-[#26372D] dark:text-[#EAE3D6] dark:border-[#EAE3D6]/30 text-[11px] tracking-[0.16em]"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>ADMIN SUITE</span>
                    </Button>
                  </Link>
                ) : (
                  <Link href="/dashboard">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 border-[#26372D]/30 text-[#26372D] dark:text-[#EAE3D6] dark:border-[#EAE3D6]/30 text-[11px] tracking-[0.16em]"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>RESERVATIONS</span>
                    </Button>
                  </Link>
                )}

                <div className="flex items-center gap-2 pl-3 border-l border-[#302821]/15 dark:border-[#EAE3D6]/15">
                  <div className="w-8 h-8 rounded-none bg-[#26372D] text-[#F5F1E8] font-serif text-xs flex items-center justify-center font-bold tracking-wider">
                    {getInitials(user.name)}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="h-8 px-2 text-[#302821]/70 dark:text-[#EAE3D6]/70 hover:text-red-700"
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
                    className="text-[11px] font-medium tracking-[0.18em] uppercase text-[#302821] dark:text-[#F5F1E8]"
                  >
                    SIGN IN
                  </Button>
                </Link>
                <Link href="/services">
                  <Button
                    variant="default"
                    size="sm"
                    className="gap-2 text-[11px] tracking-[0.18em] uppercase px-4 py-2"
                  >
                    <span>RESERVE</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
              className="p-2 rounded-none text-[#302821] dark:text-[#F5F1E8] hover:bg-[#EAE3D6]/50 border border-[#302821]/20"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-[#26372D]" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#302821]/15 bg-[#F5F1E8] dark:bg-[#1a201c] px-6 py-6 space-y-5">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-xs uppercase tracking-[0.2em] py-2 transition-colors border-b border-[#302821]/10 ${
                    isActive
                      ? "text-[#26372D] font-bold"
                      : "text-[#302821]/70 dark:text-[#EAE3D6]/70"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="pt-2 flex flex-col gap-3">
            {isAuthenticated && user ? (
              <>
                <div className="flex items-center gap-3 p-3 bg-[#EAE3D6]/60 dark:bg-[#26372D]/20">
                  <div className="w-8 h-8 rounded-none bg-[#26372D] text-[#F5F1E8] font-serif text-xs flex items-center justify-center font-bold">
                    {getInitials(user.name)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-[#302821] dark:text-[#F5F1E8]">
                      {user.name}
                    </span>
                    <span className="text-[11px] text-[#302821]/60 dark:text-[#EAE3D6]/60">
                      {user.email}
                    </span>
                  </div>
                </div>

                <Link
                  href={isAdmin ? "/admin" : "/dashboard"}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button variant="default" className="w-full text-xs tracking-[0.16em]">
                    {isAdmin ? "ADMIN SUITE" : "MY RESERVATIONS"}
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-xs text-red-700 tracking-[0.16em]"
                >
                  SIGN OUT
                </Button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full text-xs tracking-[0.16em]">
                    SIGN IN
                  </Button>
                </Link>
                <Link href="/services" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="default" className="w-full text-xs tracking-[0.16em]">
                    RESERVE
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
