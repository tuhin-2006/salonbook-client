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
  Crown,
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
        <div className="w-12 h-12 rounded-full border-4 border-gold-500 border-t-transparent animate-spin" />
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold animate-pulse">
          Authenticating Executive Desk Credentials...
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
      label: "Appointments Dispatch",
      href: "/admin/appointments",
      icon: Calendar,
      exact: false,
    },
    {
      label: "Client Registry",
      href: "/admin/customers",
      icon: Users,
      exact: false,
    },
    {
      label: "Stripe Transactions",
      href: "/admin/transactions",
      icon: CreditCard,
      exact: false,
    },
    {
      label: "Executive Profile",
      href: "/admin/profile",
      icon: User,
      exact: false,
    },
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-secondary/30 dark:bg-background flex flex-col lg:flex-row">
      {/* Desktop Executive Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col border-r border-gold-500/15 bg-card p-6 space-y-8 shrink-0 shadow-lg">
        <div className="space-y-1 pb-4 border-b border-border/80">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-gold-600 dark:text-gold-400">
            <Crown className="w-4 h-4 text-gold-500" />
            <span>Executive Directorate</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-foreground">
            Atelier Control
          </h2>
          <p className="text-[11px] text-muted-foreground">Madison Ave Flagship Operations</p>
        </div>

        <nav className="flex-1 space-y-1.5">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname?.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-gold-500 to-terracotta-500 text-white shadow-md shadow-gold-500/20 font-bold"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
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

        {/* Quick Link to Public Sanctuary */}
        <div className="pt-4 border-t border-border/80 space-y-3">
          <Link href="/services">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-between text-xs rounded-xl border-gold-500/30 hover:bg-gold-500/10 font-semibold"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-gold-500" />
                Live Client Menu
              </span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </Button>
          </Link>

          {/* User Signout */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gold-500/15 border border-gold-500/30 flex items-center justify-center text-xs font-bold text-foreground">
                {getInitials(user?.name || "Admin")}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-foreground truncate max-w-[120px]">
                  {user?.name}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-gold-600 dark:text-gold-400 font-semibold">
                  Managing Director
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="h-8 w-8 text-muted-foreground hover:text-destructive rounded-full"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Top Navbar for Admin */}
      <div className="lg:hidden bg-card border-b border-gold-500/15 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold-600 dark:text-gold-400">
          <ShieldCheck className="w-4 h-4 text-gold-500" />
          <span>Executive Desk</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full border-border/80"
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        >
          {mobileSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          <span className="ml-2 text-xs font-semibold">Menu</span>
        </Button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileSidebarOpen && (
        <div className="lg:hidden bg-card border-b border-border p-4 space-y-2 animate-in slide-in-from-top-2">
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
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold ${
                  isActive
                    ? "bg-gold-500 text-white font-bold"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}

      {/* Main Administrative Viewport */}
      <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
