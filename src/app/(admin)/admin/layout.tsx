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
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <p className="text-sm font-serif text-muted-foreground animate-pulse">
          Authenticating administrative credentials...
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
      label: "Manage Services",
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
      label: "Customers",
      href: "/admin/customers",
      icon: Users,
      exact: false,
    },
    {
      label: "Transactions",
      href: "/admin/transactions",
      icon: CreditCard,
      exact: false,
    },
    {
      label: "Admin Profile",
      href: "/admin/profile",
      icon: User,
      exact: false,
    },
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-muted/20 flex flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-border/80 bg-card p-6 space-y-8 shrink-0">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>SalonBook Admin</span>
          </div>
          <h2 className="font-serif text-xl font-bold text-foreground">
            Executive Desk
          </h2>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname?.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary text-white font-semibold shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4" />}
              </Link>
            );
          })}
        </nav>

        {/* Quick Link to Public Store */}
        <div className="pt-4 border-t border-border space-y-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
          >
            <span>Preview Client Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          {/* Admin Profile pill */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border border-border">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                {getInitials(user?.name || "Admin")}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-medium text-foreground max-w-[100px] truncate">
                  {user?.name}
                </span>
                <span className="text-[10px] text-primary uppercase font-semibold">
                  Administrator
                </span>
              </div>
            </div>
            <button
              onClick={logout}
              className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header Bar */}
      <div className="lg:hidden bg-card border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-primary" />
          <span className="font-serif font-bold text-foreground">
            SalonBook Admin
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="lg:hidden bg-card border-b border-border p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname?.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-primary text-white font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}

      {/* Main Content Pane */}
      <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}