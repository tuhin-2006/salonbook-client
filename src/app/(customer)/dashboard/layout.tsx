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
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-[50vh] space-y-4 bg-[#F5F1E8] dark:bg-[#151916]">
        <div className="w-8 h-8 border-2 border-[#26372D] border-t-transparent animate-spin" />
        <p className="text-xs uppercase tracking-[0.25em] text-[#302821]/70">
          Loading Patron Lounge...
        </p>
      </div>
    );
  }

  if (user?.isBlocked) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-md text-center space-y-6 bg-[#F5F1E8] dark:bg-[#151916]">
        <div className="w-14 h-14 mx-auto border border-red-300 bg-red-50 text-red-700 flex items-center justify-center">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="font-serif text-2xl text-[#302821] dark:text-[#F5F1E8]">
          Patron Profile Restricted
        </h2>
        <p className="text-xs text-[#302821]/70 leading-relaxed">
          Your reservation privileges have been temporarily paused by atelier management. Please contact concierge for assistance.
        </p>
        <Button
          variant="outline"
          onClick={() => router.push("/")}
          className="rounded-none text-xs uppercase tracking-wider border-[#302821]/20"
        >
          Return to Atelier
        </Button>
      </div>
    );
  }

  const tabs = [
    {
      label: "PATRON OVERVIEW",
      href: "/dashboard",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "RESERVATIONS",
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
      label: "PROFILE DOSSIER",
      href: "/dashboard/profile",
      icon: User,
      exact: false,
    },
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#F5F1E8] dark:bg-[#151916] text-[#302821] dark:text-[#F5F1E8]">
      {/* Top Banner: Quiet Editorial Header */}
      <div className="border-b border-[#302821]/15 dark:border-[#EAE3D6]/15 bg-[#EAE3D6]/40 dark:bg-[#1a201c]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#B8755B] font-semibold block">
                PATRON PRIVATE SUITE
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#302821] dark:text-[#F5F1E8]">
                Welcome, {user?.name || "Valued Patron"}
              </h1>
              <p className="text-xs text-[#302821]/70 dark:text-[#EAE3D6]/70 leading-relaxed">
                Manage upcoming chair bookings, review treatment regimens, and access verified Stripe receipts.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/services">
                <Button
                  variant="default"
                  size="sm"
                  className="rounded-none text-[11px] uppercase tracking-[0.18em] px-5 py-2.5 bg-[#26372D] text-[#F5F1E8] hover:bg-[#343D2E]"
                >
                  <span>RESERVE TREATMENT</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Navigation Tabs: Editorial Caps */}
          <div className="flex items-center gap-3 overflow-x-auto pt-8 border-t border-[#302821]/10 dark:border-[#EAE3D6]/10 mt-8 scrollbar-none">
            {tabs.map((tab) => {
              const isActive = tab.exact
                ? pathname === tab.href
                : pathname.startsWith(tab.href);

              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`px-4 py-2 text-[11px] uppercase tracking-[0.18em] whitespace-nowrap transition-all rounded-none border ${
                    isActive
                      ? "bg-[#26372D] text-[#F5F1E8] border-[#26372D] font-medium"
                      : "bg-transparent text-[#302821]/70 dark:text-[#EAE3D6]/70 border-transparent hover:border-[#302821]/20 hover:text-[#302821]"
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
