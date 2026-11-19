"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Calendar,
  User,
  CreditCard,
  LayoutDashboard,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Scissors,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const CUSTOMER_TABS = [
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
    label: "Invoices & Receipts",
    href: "/dashboard/transactions",
    icon: CreditCard,
    exact: false,
  },
  {
    label: "Profile Settings",
    href: "/dashboard/profile",
    icon: User,
    exact: false,
  },
];

export default function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/sign-in");
      } else if (user?.role === "admin") {
        router.push("/admin");
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent animate-spin rounded-full" />
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground font-semibold">
          Entering Patron Lounge...
        </p>
      </div>
    );
  }

  if (user?.role === "admin") {
    return null;
  }

  if (user?.isBlocked) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-2xl border border-destructive/30 bg-card p-8 text-center space-y-5 shadow-lg">
          <div className="w-14 h-14 mx-auto rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive flex items-center justify-center">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-foreground">
            Account Privileges Paused
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your chair booking privileges have been temporarily paused by atelier management. For assistance and reinstatement, please contact our concierge desk.
          </p>
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="rounded-xl text-xs uppercase tracking-wider border-border"
          >
            Return to Atelier Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-background text-foreground transition-colors duration-200">
      {/* 1. Top Customer Executive Banner */}
      <div className="border-b border-border/70 bg-card/70 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span className="text-[11px] uppercase tracking-[0.25em] text-accent font-bold">
                  Patron Lounge &amp; Concierge
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Welcome, {user?.name || "Valued Patron"}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
                Review your upcoming chair reservations, explore personalized treatment formulations, and access verified Stripe receipts.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start md:self-auto">
              <Link href="/services">
                <Button
                  size="sm"
                  className="rounded-xl text-xs font-semibold tracking-wider px-5 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm gap-2"
                >
                  <Scissors className="w-3.5 h-3.5 text-accent" />
                  <span>Book New Appointment</span>
                  <ArrowRight className="w-3.5 h-3.5 text-accent" />
                </Button>
              </Link>
            </div>
          </div>

          {/* 2. Horizontal Navigation Tabs (Responsive with smooth touch scroll) */}
          <div className="flex items-center gap-2 overflow-x-auto pt-4 pb-1 border-t border-border/50 no-scrollbar">
            {CUSTOMER_TABS.map((tab) => {
              const isActive = tab.exact
                ? pathname === tab.href
                : pathname.startsWith(tab.href);
              const Icon = tab.icon;

              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/10 font-bold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-accent" : "text-muted-foreground"}`} />
                  <span>{tab.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Main Customer Content Area */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 max-w-6xl">
        {children}
      </div>
    </div>
  );
}
