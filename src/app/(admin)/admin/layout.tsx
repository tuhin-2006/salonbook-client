"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Scissors,
  Calendar,
  Users,
  CreditCard,
  User,
  Menu,
  X,
  LogOut,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Sun,
  Moon,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { getInitials } from "@/lib/utils";

const NAV_ITEMS = [
  {
    label: "Overview",
    badge: "Telemetry",
    href: "/admin",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "Services & Menu",
    badge: "Carte",
    href: "/admin/services",
    icon: Scissors,
    exact: false,
  },
  {
    label: "Appointments",
    badge: "Diary",
    href: "/admin/appointments",
    icon: Calendar,
    exact: false,
  },
  {
    label: "Client Directory",
    badge: "Patrons",
    href: "/admin/customers",
    icon: Users,
    exact: false,
  },
  {
    label: "Transactions",
    badge: "Stripe",
    href: "/admin/transactions",
    icon: CreditCard,
    exact: false,
  },
  {
    label: "Admin Profile",
    badge: "Settings",
    href: "/admin/profile",
    icon: User,
    exact: false,
  },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isAdmin, isLoading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/sign-in");
      } else if (!isAdmin) {
        router.push("/dashboard");
      }
    }
  }, [isLoading, isAuthenticated, isAdmin, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent animate-spin rounded-full" />
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground font-semibold">
          Authenticating Executive Session...
        </p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const currentNav = NAV_ITEMS.find((item) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href)
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background text-foreground flex flex-col lg:flex-row antialiased selection:bg-accent/30 selection:text-foreground">
      {/* 1. Desktop Executive Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 shrink-0 border-r border-border/70 bg-card/60 backdrop-blur-xl justify-between p-6 shadow-sm sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="space-y-8">
          {/* Brand Monogram */}
          <Link
            href="/admin"
            className="flex items-center gap-3 group px-2 py-1 transition-all"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#251C1D] dark:bg-[#C8A879] text-[#FAF7F2] dark:text-[#170F13] flex items-center justify-center shadow-md shadow-primary/10 transition-transform duration-300 group-hover:scale-105">
              <Scissors className="w-5 h-5 text-[#C8A879] dark:text-[#170F13]" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl font-bold tracking-tight text-foreground block leading-none">
                SalonBook
              </span>
              <span className="text-[10px] uppercase tracking-[0.22em] text-accent font-semibold mt-1">
                Executive Atelier
              </span>
            </div>
          </Link>

          {/* Quick Status Pill */}
          <div className="px-3 py-2 rounded-xl border border-border/50 bg-muted/40 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-muted-foreground font-medium">Session Active</span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-accent px-2 py-0.5 rounded-md bg-accent/10">
              Admin
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5" aria-label="Admin Navigation">
            <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/80 font-bold px-3 block mb-2">
              Management Suite
            </span>
            {NAV_ITEMS.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center justify-between px-3.5 py-3 rounded-xl text-xs tracking-wide transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                        isActive
                          ? "text-accent dark:text-primary-foreground"
                          : "text-muted-foreground group-hover:text-foreground"
                      }`}
                    />
                    <span className="text-xs">{item.label}</span>
                  </div>
                  {isActive ? (
                    <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-accent/20 dark:bg-primary-foreground/20 text-accent dark:text-primary-foreground font-bold">
                      {item.badge}
                    </span>
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Executive Controls */}
        <div className="pt-6 border-t border-border/70 space-y-4">
          {/* User Profile Summary */}
          <div className="flex items-center justify-between p-2.5 rounded-xl border border-border/50 bg-muted/30">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-accent text-accent-foreground font-sans font-bold text-xs flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
                {user?.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "Admin"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  getInitials(user?.name || "Admin")
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-foreground truncate">
                  {user?.name || "Executive Admin"}
                </span>
                <span className="text-[10px] text-muted-foreground truncate">
                  {user?.email || "admin@salonbook.com"}
                </span>
              </div>
            </div>
            <ThemeToggle />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Link href="/" target="_blank" className="w-full">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-[11px] font-semibold tracking-wider rounded-xl h-9 gap-1.5 border-border hover:bg-muted hover:text-foreground"
              >
                <ExternalLink className="w-3.5 h-3.5 text-accent" />
                <span>Live Site</span>
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="w-full text-[11px] font-semibold tracking-wider rounded-xl h-9 gap-1.5 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* 2. Main Executive Workspace */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header Bar */}
        <header className="sticky top-16 z-30 border-b border-border/70 bg-card/80 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex items-center justify-between">
          {/* Breadcrumb / Title */}
          <div className="flex items-center gap-3">
            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-border text-foreground hover:bg-muted transition-colors"
              aria-label="Toggle Navigation Drawer"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-block text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">
                Admin
              </span>
              <span className="hidden sm:inline-block text-muted-foreground/40 font-light">/</span>
              <h1 className="font-serif text-lg sm:text-xl font-bold text-foreground">
                {currentNav?.label || "Overview"}
              </h1>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/60 bg-muted/30 text-[11px] text-muted-foreground">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>SalonBook Enterprise Edition</span>
            </div>
            <div className="lg:hidden">
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-border bg-card p-4 space-y-2 animate-in slide-in-from-top duration-200">
            {NAV_ITEMS.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-2.5 text-xs font-semibold rounded-xl transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? "text-accent dark:text-primary-foreground" : "text-muted-foreground"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {item.badge}
                  </span>
                </Link>
              );
            })}
            <div className="pt-3 border-t border-border flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{user?.email}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-xs text-destructive hover:bg-destructive/10"
              >
                Sign Out
              </Button>
            </div>
          </div>
        )}

        {/* Content Body (Optimized for small mobile, tablet, and executive desktop) */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
