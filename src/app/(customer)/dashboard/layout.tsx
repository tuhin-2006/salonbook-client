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
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-[50vh] space-y-4 bg-[#FAF7F2]">
        <div className="w-8 h-8 border-2 border-[#3B1F2B] border-t-transparent animate-spin rounded-full" />
        <p className="text-xs uppercase tracking-[0.2em] text-[#231C1E]/70 font-semibold">
          Loading Patron Lounge...
        </p>
      </div>
    );
  }

  if (user?.isBlocked) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-md text-center space-y-6 bg-[#FAF7F2]">
        <div className="w-14 h-14 mx-auto rounded-2xl border border-red-300 bg-red-50 text-red-700 flex items-center justify-center">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#231C1E]">
          Account Restricted
        </h2>
        <p className="text-xs text-[#231C1E]/70 leading-relaxed">
          Your reservation privileges have been temporarily paused by salon management. Please contact concierge for assistance.
        </p>
        <Button
          variant="outline"
          onClick={() => router.push("/")}
          className="rounded-xl text-xs uppercase tracking-wider border-[#3B1F2B]/20"
        >
          Return to Home
        </Button>
      </div>
    );
  }

  const tabs = [
    {
      label: "OVERVIEW",
      href: "/dashboard",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "MY APPOINTMENTS",
      href: "/dashboard/appointments",
      icon: Calendar,
      exact: false,
    },
    {
      label: "INVOICES & RECEIPTS",
      href: "/dashboard/transactions",
      icon: CreditCard,
      exact: false,
    },
    {
      label: "PROFILE SETTINGS",
      href: "/dashboard/profile",
      icon: User,
      exact: false,
    },
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#FAF7F2] text-[#231C1E]">
      {/* Top Banner */}
      <div className="border-b border-[#3B1F2B]/10 bg-[#FFFFFF]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
                <span className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-bold">
                  CUSTOMER LOUNGE
                </span>
              </div>
              <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#231C1E]">
                Welcome, {user?.name || "Valued Patron"}
              </h1>
              <p className="text-xs sm:text-sm text-[#231C1E]/75 leading-relaxed">
                Manage upcoming chair bookings, review treatment regimens, and access verified Stripe receipts.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/services">
                <Button
                  size="sm"
                  className="rounded-xl text-xs font-bold uppercase tracking-wider px-5 py-2.5 bg-[#3B1F2B] text-[#FAF7F2] hover:bg-[#4A2035] shadow-sm"
                >
                  <span>Book New Appointment</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-6 border-t border-[#3B1F2B]/10 mt-6 scrollbar-none">
            {tabs.map((tab) => {
              const isActive = tab.exact
                ? pathname === tab.href
                : pathname.startsWith(tab.href);

              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-[#3B1F2B] text-[#FAF7F2] shadow-sm"
                      : "bg-transparent text-[#231C1E]/75 hover:bg-[#FAF7F2] hover:text-[#231C1E]"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-6xl">
        {children}
      </div>
    </div>
  );
}
