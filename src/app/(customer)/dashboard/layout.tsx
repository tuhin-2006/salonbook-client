"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Calendar,
  User,
  CreditCard,
  LayoutDashboard,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Crown,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

export default function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/sign-in");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-gold-500 border-t-transparent animate-spin" />
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold animate-pulse">
          Opening Patron Sanctuary Lounge...
        </p>
      </div>
    );
  }

  if (user?.isBlocked) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-lg text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-foreground">
          Patron Account Restricted
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Your account has been temporarily restricted by salon administration.
          Please contact our concierge desk for assistance.
        </p>
        <Button variant="outline" onClick={() => router.push("/")} className="rounded-full">
          Return to Sanctuary Home
        </Button>
      </div>
    );
  }

  const tabs = [
    {
      label: "Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "My Appointments",
      href: "/dashboard/appointments",
      icon: Calendar,
      exact: false,
    },
    {
      label: "Transactions & Invoices",
      href: "/dashboard/transactions",
      icon: CreditCard,
      exact: false,
    },
    {
      label: "Patron Profile",
      href: "/dashboard/profile",
      icon: User,
      exact: false,
    },
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-secondary/30 dark:bg-background">
      {/* Top Banner / Hero Header */}
      <div className="bg-card border-b border-gold-500/15">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-gold-600 dark:text-gold-400">
                <Crown className="w-3.5 h-3.5 text-gold-500" />
                <span>Patron Sanctuary Lounge</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Bonjour, {user?.name || "Esteemed Guest"}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Manage your bespoke appointments, review Stripe payment invoices, and update treatment preferences.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/services">
                <Button variant="luxury" size="sm" className="gap-2 rounded-full px-5 text-xs font-semibold shadow-md shadow-gold-500/20">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Reserve New Ritual</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Navigation Bar Tabs */}
          <div className="flex items-center gap-2 mt-8 overflow-x-auto no-scrollbar border-b border-border/80 -mb-px">
            {tabs.map((tab) => {
              const isActive = tab.exact
                ? pathname === tab.href
                : pathname?.startsWith(tab.href);
              const Icon = tab.icon;

              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                    isActive
                      ? "border-gold-500 text-gold-600 dark:text-gold-400 font-bold"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
