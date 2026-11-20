"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Scissors,
  Menu,
  X,
  LogOut,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  ChevronDown,
  LayoutDashboard,
  User as UserIcon,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { SafeImage } from "@/components/ui/SafeImage";
import { getInitials } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Browse Services", href: "/services" },
    { label: "Why SalonBook", href: "/experience" },
    { label: "Visit Us", href: "/journal" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-[#FAF7F2]/95 dark:bg-[#1E1619]/95 backdrop-blur-md border-b border-[#E8E2D8] dark:border-[#343132] shadow-sm py-2.5"
          : "bg-[#FAF7F2] dark:bg-[#1E1619] border-b border-[#E8E2D8]/60 dark:border-[#343132]/60 py-3.5"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-[#251C1D] dark:bg-[#C8A879] text-[#FAF7F2] dark:text-[#170F13] flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-105">
              <Scissors className="w-4 h-4 text-[#C8A879] dark:text-[#170F13]" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl font-bold tracking-tight text-[#231C1E] dark:text-[#FAF7F2] block leading-none">
                SalonBook
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#94704C] dark:text-[#C8A879] font-medium leading-none mt-1">
                SoHo Atelier, NYC
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#F5EFEB] dark:bg-[#281F23] px-3 py-1.5 rounded-full border border-[#E8E2D8] dark:border-[#3E3338]">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                    isActive
                      ? "bg-[#251C1D] text-[#FAF7F2] dark:bg-[#C8A879] dark:text-[#170F13]"
                      : "text-[#231C1E]/70 dark:text-[#FAF7F2]/70 hover:text-[#231C1E] dark:hover:text-[#FAF7F2]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Side / Profile Trigger */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />

            {!mounted ? (
              <div className="w-24 h-8 rounded-full bg-black/5 dark:bg-white/5 animate-pulse" />
            ) : isAuthenticated && user ? (
              <div className="relative" ref={profileDropdownRef}>
                {/* Profile Trigger Button: Icon + Name + Chevron */}
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className={`flex items-center gap-2.5 p-1 pl-1.5 pr-3 rounded-full border transition-all duration-200 shadow-xs group focus:outline-none ${
                    profileDropdownOpen
                      ? "border-[#94704C] dark:border-[#C8A879] bg-[#FFFFFF] dark:bg-[#261D22] ring-2 ring-[#C8A879]/20"
                      : "border-[rgba(90,65,48,0.2)] dark:border-[rgba(200,168,121,0.25)] bg-[#FFFFFF]/90 dark:bg-[#251A20]/90 hover:bg-[#F5EFEB] dark:hover:bg-[#2E1E26]"
                  }`}
                >
                  {/* User Profile Avatar with Gold Border */}
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-[#C5A880]/50 bg-[#251C1D] dark:bg-[#C8A879] text-[#FAF7F2] dark:text-[#170F13] font-sans text-xs font-bold flex items-center justify-center shrink-0">
                    {user.image ? (
                      <SafeImage
                        src={user.image}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      getInitials(user.name)
                    )}
                  </div>

                  {/* User Name */}
                  <span className="text-xs font-bold text-[#251C1D] dark:text-[#FAF7F2] max-w-[120px] truncate leading-none">
                    {user.name}
                  </span>

                  {/* Dropdown Chevron */}
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-[#94704C] dark:text-[#C8A879] transition-transform duration-200 ${
                      profileDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#FFFFFF] dark:bg-[#1E1519] border border-[rgba(90,65,48,0.18)] dark:border-[rgba(200,168,121,0.25)] shadow-xl p-2 z-50 space-y-1 backdrop-blur-xl"
                    >
                      {/* 1. User Header with Name, Email & Role Badge */}
                      <div className="p-2.5 rounded-xl bg-[#F8F5F0] dark:bg-[#261C22] border border-[rgba(90,65,48,0.1)] dark:border-[rgba(200,168,121,0.15)] flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full overflow-hidden border border-[#C5A880]/60 bg-[#251C1D] dark:bg-[#C8A879] text-[#FAF7F2] dark:text-[#170F13] font-sans text-xs font-bold flex items-center justify-center shrink-0 shadow-xs">
                          {user.image ? (
                            <SafeImage
                              src={user.image}
                              alt={user.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            getInitials(user.name)
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-[#251C1D] dark:text-[#FAF7F2] truncate">
                            {user.name}
                          </span>
                          <span className="text-[10px] text-[#786C68] dark:text-[#B9AEB0] truncate font-mono">
                            {user.email}
                          </span>
                          <span className="inline-block mt-0.5 text-[9px] uppercase tracking-wider font-semibold text-[#94704C] dark:text-[#C8A879]">
                            {isAdmin ? "✦ Administrator" : "● Patron Client"}
                          </span>
                        </div>
                      </div>

                      {/* Hairline Divider */}
                      <div className="h-px bg-[rgba(90,65,48,0.1)] dark:bg-[rgba(200,168,121,0.15)] my-1" />

                      {/* 2. Dashboard Link */}
                      <Link
                        href={isAdmin ? "/admin" : "/dashboard"}
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl text-[#251C1D] dark:text-[#FAF7F2] hover:bg-[#F5EFEB] dark:hover:bg-[#281D23] transition-colors group"
                      >
                        <div className="flex items-center gap-2.5">
                          <LayoutDashboard className="w-4 h-4 text-[#94704C] dark:text-[#C8A879]" />
                          <span>Dashboard</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[#786C68]/50 dark:text-[#B9AEB0]/50 transition-transform duration-150 group-hover:translate-x-0.5" />
                      </Link>

                      {/* Profile Settings Link */}
                      <Link
                        href={isAdmin ? "/admin/profile" : "/dashboard/profile"}
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl text-[#251C1D] dark:text-[#FAF7F2] hover:bg-[#F5EFEB] dark:hover:bg-[#281D23] transition-colors group"
                      >
                        <div className="flex items-center gap-2.5">
                          <UserIcon className="w-4 h-4 text-[#94704C] dark:text-[#C8A879]" />
                          <span>My Profile</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[#786C68]/50 dark:text-[#B9AEB0]/50 transition-transform duration-150 group-hover:translate-x-0.5" />
                      </Link>

                      {/* Hairline Divider */}
                      <div className="h-px bg-[rgba(90,65,48,0.1)] dark:bg-[rgba(200,168,121,0.15)] my-1" />

                      {/* 3. Logout Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link href="/sign-in">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs font-semibold text-[#231C1E] dark:text-[#FAF7F2] hover:bg-[#F5EFEB] dark:hover:bg-[#281D23] rounded-xl px-3.5"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button
                    variant="default"
                    size="sm"
                    className="gap-1.5 text-xs font-bold px-4 py-2 bg-[#251C1D] dark:bg-[#C8A879] text-[#FAF7F2] dark:text-[#170F13] hover:bg-[#3B2B2D] dark:hover:bg-[#E2C69D] rounded-xl shadow-sm transition-all"
                  >
                    <span>Sign Up</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C8A879] dark:text-[#170F13]" />
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            {mounted && isAuthenticated && user && (
              <Link
                href={isAdmin ? "/admin" : "/dashboard"}
                className="w-7 h-7 rounded-full overflow-hidden border border-[#C5A880]/50 bg-[#251C1D] dark:bg-[#C8A879] text-[#FAF7F2] dark:text-[#170F13] font-sans text-[10px] font-bold flex items-center justify-center shrink-0 shadow-xs"
                title="Go to Dashboard"
              >
                {user.image ? (
                  <SafeImage
                    src={user.image}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  getInitials(user.name)
                )}
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#231C1E] dark:text-[#FAF7F2] hover:bg-[#F5EFEB] dark:hover:bg-[#281F23] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-[#251C1D] dark:text-[#C8A879]" />
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
                      ? "bg-[#251C1D] text-[#FAF7F2] dark:bg-[#C8A879] dark:text-[#170F13]"
                      : "text-[#231C1E]/80 dark:text-[#FAF7F2]/80 hover:bg-[#F5EFEB] dark:hover:bg-[#251B20]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-[#E8E2D8] dark:border-[#38252E] flex flex-col gap-2.5">
            {!mounted ? (
              <div className="w-full h-10 rounded-xl bg-black/5 dark:bg-white/5 animate-pulse" />
            ) : isAuthenticated && user ? (
              <>
                {/* User Info Card in Mobile */}
                <div className="flex items-center gap-3 p-3 bg-[#F5EFEB] dark:bg-[#251B20] rounded-xl border border-[#E8E2D8] dark:border-[#38252E]">
                  <div className="w-9 h-9 rounded-full overflow-hidden border border-[#C5A880]/50 bg-[#251C1D] dark:bg-[#C8A879] text-[#FAF7F2] dark:text-[#170F13] font-sans text-xs font-bold flex items-center justify-center shrink-0">
                    {user.image ? (
                      <SafeImage
                        src={user.image}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      getInitials(user.name)
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-[#231C1E] dark:text-[#FAF7F2] truncate">
                      {user.name}
                    </span>
                    <span className="text-[11px] text-[#231C1E]/60 dark:text-[#FAF7F2]/60 truncate font-mono">
                      {user.email}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider font-semibold text-[#94704C] dark:text-[#C8A879]">
                      {isAdmin ? "✦ Administrator" : "● Patron Client"}
                    </span>
                  </div>
                </div>

                <Link
                  href={isAdmin ? "/admin" : "/dashboard"}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button variant="default" className="w-full text-xs font-bold rounded-xl bg-[#251C1D] dark:bg-[#C8A879] text-[#FAF7F2] dark:text-[#170F13]">
                    <LayoutDashboard className="w-3.5 h-3.5 mr-2" />
                    Dashboard
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-xs text-red-600 dark:text-red-400 rounded-xl border-red-500/20 hover:bg-red-500/10"
                >
                  <LogOut className="w-3.5 h-3.5 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full text-xs font-bold rounded-xl border-[#E8E2D8] dark:border-[#38252E] text-[#231C1E] dark:text-[#FAF7F2]"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="default"
                    className="w-full text-xs font-bold rounded-xl bg-[#251C1D] dark:bg-[#C8A879] text-[#FAF7F2] dark:text-[#170F13]"
                  >
                    Sign Up
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
