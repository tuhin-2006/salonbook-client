"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  Menu,
  X,
  User as UserIcon,
  Calendar,
  LogOut,
  ShieldCheck,
  ChevronDown,
  ArrowRight,
  Scissors,
  Search,
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
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Experience", href: "/experience" },
    { label: "Journal", href: "/journal" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-xl border-b border-border shadow-sm py-2"
          : "bg-background/70 backdrop-blur-md border-b border-border/50 py-3"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-all">
              <Scissors className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-sans text-xl font-extrabold tracking-tight text-foreground group-hover:text-primary transition-colors">
                  SalonBook
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-primary/10 text-primary uppercase tracking-wide">
                  Pro
                </span>
              </div>
              <span className="text-[11px] text-muted-foreground font-medium -mt-1 hidden sm:inline">
                Modern Salon & Wellness
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-secondary/60 dark:bg-card/60 p-1.5 rounded-full border border-border/60 backdrop-blur-sm">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/70"
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
              <div className="flex items-center gap-2.5">
                {isAdmin ? (
                  <Link href="/admin">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 border-indigo-500/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Admin Suite</span>
                    </Button>
                  </Link>
                ) : (
                  <Link href="/dashboard">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 border-indigo-500/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>My Lounge</span>
                    </Button>
                  </Link>
                )}

                <div className="flex items-center gap-2 pl-2 border-l border-border">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                    {getInitials(user.name)}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="h-8 px-2 text-muted-foreground hover:text-destructive"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link href="/sign-in">
                  <Button variant="ghost" size="sm" className="font-semibold text-xs">
                    Sign In
                  </Button>
                </Link>
                <Link href="/services">
                  <Button
                    variant="gradient"
                    size="sm"
                    className="gap-1.5 rounded-full px-4 text-xs font-bold"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Book Now</span>
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
              className="p-2 rounded-xl text-foreground hover:bg-secondary border border-border"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-primary" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background/95 backdrop-blur-xl px-4 py-5 space-y-4">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-border flex flex-col gap-2.5">
            {isAuthenticated && user ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2 bg-secondary/50 rounded-xl">
                  <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center">
                    {getInitials(user.name)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-foreground">
                      {user.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </div>

                <Link
                  href={isAdmin ? "/admin" : "/dashboard"}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button variant="default" className="w-full gap-2 text-xs">
                    {isAdmin ? (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Admin Dashboard</span>
                      </>
                    ) : (
                      <>
                        <Calendar className="w-4 h-4" />
                        <span>My Appointments</span>
                      </>
                    )}
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full gap-2 text-xs text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </Button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full text-xs">
                    Sign In
                  </Button>
                </Link>
                <Link href="/services" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="gradient" className="w-full text-xs">
                    Book Now
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
