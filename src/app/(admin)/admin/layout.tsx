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
  Sparkles,
  ShieldCheck,
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
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="w-10 h-10 rounded-full border-3 border-primary border-t-transparent animate-spin" />
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
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
      label: "Overview",
      href: "/admin",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "Salon Services",
      href: "/admin/services",
      icon: Scissors,
      exact: false,
    },
    {
      label: "Appointments",
      href: "/admin/appointments",
      icon: Calendar,
      exact: false,
    },
    {
      label: "Client Patrons",
      href: "/admin/customers",
      icon: Users,
      exact: false,
    },
    {
      label: "Stripe Payments",
      href: "/admin/transactions",
      icon: CreditCard,
      exact: false,
    },
    {
      label: "Admin Settings",
      href: "/admin/profile",
      icon: User,
      exact: false,
    },
  ];

  return (
    <div className="min-h-screen bg-secondary/30 dark:bg-background flex flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card p-5 justify-between shrink-0">
        <div className="space-y-6">
          {/* Logo */}
          <Link href="/admin" className="flex items-center gap-2.5 px-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
              <Scissors className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-foreground">
                  SalonBook
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-primary/10 text-primary">
                  Admin
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground block -mt-0.5">
                Studio Management
              </span>
            </div>
          </Link>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="pt-4 border-t border-border space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center">
              {getInitials(user?.name || "Admin")}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-bold text-foreground truncate">
                {user?.name}
              </span>
              <span className="text-[10px] text-muted-foreground truncate">
                {user?.email}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <Link href="/" target="_blank">
              <Button variant="ghost" size="sm" className="w-full text-[11px] h-8 font-bold gap-1">
                <ExternalLink className="w-3 h-3" /> Live Site
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="w-full text-[11px] h-8 font-bold text-destructive hover:bg-destructive/10 gap-1"
            >
              <LogOut className="w-3 h-3" /> Exit
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <div className="lg:hidden bg-card border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold">
            <Scissors className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-sm text-foreground">
            SalonBook Admin
          </span>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 rounded-xl text-foreground hover:bg-secondary border border-border"
        >
          {mobileSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile Sidebar Drawer */}
      {mobileSidebarOpen && (
        <div className="lg:hidden bg-card border-b border-border p-4 space-y-2">
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
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary"
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
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
