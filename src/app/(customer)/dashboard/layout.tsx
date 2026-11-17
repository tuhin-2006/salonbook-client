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
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <p className="text-sm font-serif text-muted-foreground animate-pulse">
          Preparing your atelier portal...
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
          Account Suspended
        </h2>
        <p className="text-sm text-muted-foreground">
          Your account has been temporarily restricted by salon administration.
          Please contact our concierge desk for assistance.
        </p>
        <Button variant="outline" onClick={() => router.push("/")}>
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
      label: "Transactions",
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

  return (
    <div className="min-h-[calc(100vh-80px)] bg-muted/20">
      {/* Top Banner / Hero Header */}
      <div className="bg-card border-b border-border/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Customer Sanctuary Atelier</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Bonjour, {user?.name || "Valued Guest"}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Review your upcoming beauty appointments, booking status, and treatment receipts.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/services">
                <Button variant="luxury" size="sm" className="gap-2">
                  <span>Explore Rituals</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Navigation Bar Tabs */}
          <div className="flex items-center gap-2 mt-8 overflow-x-auto no-scrollbar border-b border-border -mb-px">
            {tabs.map((tab) => {
              const isActive = tab.exact
                ? pathname === tab.href
                : pathname?.startsWith(tab.href);
              const Icon = tab.icon;

              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                    isActive
                      ? "border-primary text-primary font-semibold"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
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