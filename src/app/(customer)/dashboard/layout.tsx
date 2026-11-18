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
  Scissors,
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
        <div className="w-10 h-10 rounded-full border-3 border-primary border-t-transparent animate-spin" />
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
          Loading Lounge...
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
        <h2 className="text-2xl font-bold text-foreground">
          Account Suspended
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Your account has been temporarily restricted by salon administration.
          Please contact our concierge desk for assistance.
        </p>
        <Button variant="outline" onClick={() => router.push("/")} className="rounded-xl">
          Return Home
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
      label: "Invoices & Payments",
      href: "/dashboard/transactions",
      icon: CreditCard,
      exact: false,
    },
    {
      label: "My Profile",
      href: "/dashboard/profile",
      icon: User,
      exact: false,
    },
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-secondary/30 dark:bg-background">
      {/* Top Banner / Hero Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Client Lounge</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Welcome back, {user?.name || "Valued Guest"}
              </h1>
              <p className="text-xs text-muted-foreground">
                Manage your appointments, track Stripe payment receipts, and book new services.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <Link href="/services">
                <Button variant="gradient" size="sm" className="gap-2 rounded-xl text-xs font-bold">
                  <Scissors className="w-3.5 h-3.5" />
                  <span>Book New Service</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-6 border-t border-border mt-6 no-scrollbar">
            {tabs.map((tab) => {
              const isActive = tab.exact
                ? pathname === tab.href
                : pathname.startsWith(tab.href);
              const Icon = tab.icon;

              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
}
