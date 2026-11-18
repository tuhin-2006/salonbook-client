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
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isAdmin, isLoading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-[50vh] space-y-4 bg-[#F5F1E8] dark:bg-[#151916]">
        <div className="w-8 h-8 border-2 border-[#26372D] border-t-transparent animate-spin" />
        <p className="text-xs uppercase tracking-[0.25em] text-[#302821]/70">
          Loading Atelier Direction...
        </p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const navItems = [
    {
      label: "OVERVIEW",
      href: "/admin",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "CARTE & SERVICES",
      href: "/admin/services",
      icon: Scissors,
      exact: false,
    },
    {
      label: "RESERVATIONS DIARY",
      href: "/admin/appointments",
      icon: Calendar,
      exact: false,
    },
    {
      label: "PATRON REGISTRY",
      href: "/admin/customers",
      icon: Users,
      exact: false,
    },
    {
      label: "STRIPE LEDGER",
      href: "/admin/transactions",
      icon: CreditCard,
      exact: false,
    },
    {
      label: "ATELIER SETTINGS",
      href: "/admin/profile",
      icon: User,
      exact: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F1E8] dark:bg-[#151916] text-[#302821] dark:text-[#F5F1E8] flex flex-col lg:flex-row">
      {/* Desktop Architectural Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-[#302821]/15 dark:border-[#EAE3D6]/15 bg-[#EAE3D6]/60 dark:bg-[#1a201c] p-6 justify-between shrink-0">
        <div className="space-y-8">
          {/* Logo */}
          <Link href="/admin" className="flex flex-col">
            <span className="font-serif text-2xl font-normal tracking-[0.22em] text-[#26372D] dark:text-[#F5F1E8]">
              SALONBOOK
            </span>
            <span className="text-[9px] uppercase tracking-[0.3em] text-[#B8755B] font-semibold -mt-0.5">
              Direction &amp; Governance
            </span>
          </Link>

          {/* Navigation Items */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 text-[11px] uppercase tracking-[0.16em] transition-all rounded-none border ${
                    isActive
                      ? "bg-[#26372D] text-[#F5F1E8] border-[#26372D] font-medium"
                      : "text-[#302821]/70 dark:text-[#EAE3D6]/70 border-transparent hover:border-[#302821]/15 hover:text-[#302821] hover:bg-[#EAE3D6]/50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3 h-3 text-[#B8755B]" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="pt-6 border-t border-[#302821]/15 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#26372D] text-[#F5F1E8] font-serif font-bold text-xs flex items-center justify-center">
              {getInitials(user?.name || "Admin")}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-semibold text-[#302821] dark:text-[#F5F1E8] truncate">
                {user?.name}
              </span>
              <span className="text-[10px] text-[#302821]/60 dark:text-[#EAE3D6]/60 truncate">
                Executive Director
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link href="/" target="_blank">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-[10px] uppercase tracking-wider rounded-none h-8 border-[#302821]/20 gap-1"
              >
                <ExternalLink className="w-3 h-3" /> ATELIER
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="w-full text-[10px] uppercase tracking-wider rounded-none h-8 border-red-300 text-red-700 hover:bg-red-50 gap-1"
            >
              <LogOut className="w-3 h-3" /> EXIT
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <div className="lg:hidden bg-[#EAE3D6] border-b border-[#302821]/15 p-4 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="font-serif text-lg font-normal tracking-[0.2em] text-[#26372D]">
            SALONBOOK
          </span>
          <span className="text-[8px] uppercase tracking-[0.25em] text-[#B8755B]">
            Direction
          </span>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 border border-[#302821]/20 text-[#302821]"
        >
          {mobileSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile Sidebar Drawer */}
      {mobileSidebarOpen && (
        <div className="lg:hidden bg-[#EAE3D6] border-b border-[#302821]/15 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileSidebarOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 text-xs uppercase tracking-wider rounded-none ${
                  isActive
                    ? "bg-[#26372D] text-[#F5F1E8]"
                    : "text-[#302821]/70"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}

      {/* Main Admin Content */}
      <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
