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
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-[50vh] space-y-4 bg-[#FAF7F2]">
        <div className="w-8 h-8 border-2 border-[#3B1F2B] border-t-transparent animate-spin rounded-full" />
        <p className="text-xs uppercase tracking-[0.25em] text-[#231C1E]/70 font-semibold">
          Loading Admin Suite...
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
      label: "SERVICES & MENU",
      href: "/admin/services",
      icon: Scissors,
      exact: false,
    },
    {
      label: "APPOINTMENTS",
      href: "/admin/appointments",
      icon: Calendar,
      exact: false,
    },
    {
      label: "CLIENT DIRECTORY",
      href: "/admin/customers",
      icon: Users,
      exact: false,
    },
    {
      label: "TRANSACTIONS",
      href: "/admin/transactions",
      icon: CreditCard,
      exact: false,
    },
    {
      label: "ADMIN PROFILE",
      href: "/admin/profile",
      icon: User,
      exact: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#231C1E] flex flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-[#3B1F2B]/10 bg-[#FFFFFF] p-6 justify-between shrink-0 shadow-sm">
        <div className="space-y-7">
          {/* Logo */}
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#3B1F2B] text-[#FAF7F2] flex items-center justify-center shadow-sm">
              <Scissors className="w-4 h-4 text-[#C5A880]" />
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-tight text-[#231C1E] block leading-none">
                SalonBook
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#C5A880] font-semibold">
                Admin Management
              </span>
            </div>
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
                  className={`flex items-center justify-between px-3.5 py-2.5 text-xs uppercase tracking-wider rounded-xl transition-all ${
                    isActive
                      ? "bg-[#3B1F2B] text-[#FAF7F2] font-semibold shadow-sm"
                      : "text-[#231C1E]/75 hover:bg-[#FAF7F2] hover:text-[#231C1E]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#C5A880]" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="pt-6 border-t border-[#3B1F2B]/10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#3B1F2B] text-[#FAF7F2] font-serif font-bold text-xs flex items-center justify-center shadow-sm">
              {getInitials(user?.name || "Admin")}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-bold text-[#231C1E] truncate">
                {user?.name}
              </span>
              <span className="text-[10px] text-[#231C1E]/60 truncate">
                Salon Administrator
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link href="/" target="_blank">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-[10px] font-semibold uppercase tracking-wider rounded-xl h-8 border-[#3B1F2B]/20 gap-1 hover:bg-[#FAF7F2]"
              >
                <ExternalLink className="w-3 h-3" /> Live Site
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="w-full text-[10px] font-semibold uppercase tracking-wider rounded-xl h-8 border-red-300 text-red-700 hover:bg-red-50 gap-1"
            >
              <LogOut className="w-3 h-3" /> Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <div className="lg:hidden bg-[#FFFFFF] border-b border-[#3B1F2B]/10 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#3B1F2B] text-[#FAF7F2] flex items-center justify-center">
            <Scissors className="w-3.5 h-3.5 text-[#C5A880]" />
          </div>
          <div>
            <span className="font-serif text-base font-bold text-[#231C1E]">
              SalonBook
            </span>
            <span className="text-[9px] uppercase tracking-wider text-[#C5A880] font-semibold block -mt-1">
              Admin Suite
            </span>
          </div>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 rounded-lg border border-[#3B1F2B]/15 text-[#231C1E]"
        >
          {mobileSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile Sidebar Drawer */}
      {mobileSidebarOpen && (
        <div className="lg:hidden bg-[#FFFFFF] border-b border-[#3B1F2B]/10 p-4 space-y-2">
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
                className={`flex items-center gap-2.5 px-3 py-2 text-xs uppercase tracking-wider rounded-xl ${
                  isActive
                    ? "bg-[#3B1F2B] text-[#FAF7F2] font-semibold"
                    : "text-[#231C1E]/75"
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
