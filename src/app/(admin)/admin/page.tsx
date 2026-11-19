"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  Scissors,
  Calendar,
  Clock,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Plus,
} from "lucide-react";
import { api } from "@/lib/api";
import { ApiResponse } from "@/types";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface AnalyticsData {
  summary: {
    totalUsers: number;
    totalAppointments: number;
    totalServices: number;
    totalRevenue: number;
  };
  statusCounts: Array<{ _id: string; count: number }>;
  categoryDistribution: Array<{ _id: string; count: number }>;
  monthlyRevenue: Array<{ month: string; revenue: number; bookings: number }>;
}

const LUXURY_PALETTE = [
  "#C6A875", // Champagne Gold
  "#4A2035", // Deep Plum
  "#82977C", // Sage Green
  "#B8756D", // Terracotta
  "#70695F", // Warm Taupe
  "#3B1F2B", // Burgundy Noir
];

export default function AdminOverviewPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = async () => {
    try {
      setRefreshing(true);
      const res = await api.get<ApiResponse<AnalyticsData>>("/admin/analytics");
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.warn("Failed to fetch analytics:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const pendingCount =
    data?.statusCounts.find((s) => s._id === "pending")?.count || 0;
  const confirmedCount =
    data?.statusCounts.find((s) => s._id === "confirmed")?.count || 0;
  const cancelledCount =
    data?.statusCounts.find((s) => s._id === "cancelled")?.count || 0;

  const totalFormulations = useMemo(() => {
    if (!data?.categoryDistribution) return 0;
    return data.categoryDistribution.reduce((acc, curr) => acc + (curr.count || 0), 0);
  }, [data?.categoryDistribution]);

  const statCards = [
    {
      label: "Registered Patrons",
      subtext: "Verified Atelier Clients",
      value: data?.summary.totalUsers || 0,
      icon: Users,
      href: "/admin/customers",
      badge: "Accounts",
      badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    },
    {
      label: "Active Carte Offerings",
      subtext: "Live Service Catalog",
      value: data?.summary.totalServices || 0,
      icon: Scissors,
      href: "/admin/services",
      badge: "Formulations",
      badgeClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    },
    {
      label: "Total Chair Bookings",
      subtext: "All Lifetime Reservations",
      value: data?.summary.totalAppointments || 0,
      icon: Calendar,
      href: "/admin/appointments",
      badge: "Diary",
      badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    },
    {
      label: "Pending Consultations",
      subtext: "Awaiting Confirmation",
      value: pendingCount,
      icon: Clock,
      href: "/admin/appointments?status=pending",
      badge: "Action Req.",
      badgeClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    },
    {
      label: "Confirmed Sessions",
      subtext: "Ready for Checkout",
      value: confirmedCount,
      icon: CheckCircle2,
      href: "/admin/appointments?status=confirmed",
      badge: "Confirmed",
      badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    },
    {
      label: "Stripe Gross Revenue",
      subtext: "Verified Webhook Settlement",
      value: formatCurrency(data?.summary.totalRevenue || 0),
      icon: DollarSign,
      href: "/admin/transactions",
      badge: "Settled",
      badgeClass: "bg-accent/10 text-accent border-accent/30",
    },
  ];

  return (
    <div className="space-y-10">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/80">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-[11px] uppercase tracking-[0.25em] text-accent font-bold">
              Operations &amp; Telemetry
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Direction &amp; Operations Suite
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Real-time atelier operations, chair reservation management, service carte administration, and verified Stripe financial settlements.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAnalytics}
            disabled={refreshing}
            className="rounded-xl text-xs font-semibold tracking-wider gap-2 border-border hover:bg-muted"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-accent" : ""}`} />
            <span>Refresh</span>
          </Button>

          <Link href="/admin/services">
            <Button
              size="sm"
              className="rounded-xl text-xs font-semibold tracking-wider gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-accent" />
              <span>Add New Service</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. 6 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Link key={i} href={card.href} className="group">
              <div className="p-6 rounded-2xl border border-border/80 bg-card hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300 flex flex-col justify-between min-h-[160px]">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                      {card.label}
                    </span>
                    <p className="text-[11px] text-muted-foreground/70">
                      {card.subtext}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-muted/60 text-foreground flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-accent-foreground transition-colors duration-300 shadow-sm">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border/40 flex items-baseline justify-between">
                  <h3 className="font-sans text-3xl font-bold text-foreground tracking-tight tabular-nums">
                    {loading ? (
                      <span className="inline-block w-16 h-8 bg-muted animate-pulse rounded-md" />
                    ) : (
                      card.value
                    )}
                  </h3>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${card.badgeClass}`}>
                    {card.badge}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* 3. Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Trend Area Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-border/80 bg-card p-6 sm:p-7 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] uppercase tracking-[0.25em] text-accent font-bold">
                  Revenue Telemetry
                </span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
                Stripe Monthly Settlements
              </h3>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/60 bg-muted/40 text-[11px] text-muted-foreground self-start sm:self-auto font-medium">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              <span>Webhook Verified Ledger</span>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            {loading ? (
              <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                <div className="w-6 h-6 border-2 border-accent border-t-transparent animate-spin rounded-full mr-2" />
                Loading Dashboard Data...
              </div>
            ) : data?.monthlyRevenue && data.monthlyRevenue.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.monthlyRevenue}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C6A875" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#C6A875" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="month"
                    stroke="currentColor"
                    className="text-[11px] text-muted-foreground"
                    tickLine={false}
                    axisLine={{ stroke: "rgba(128,128,128,0.2)" }}
                  />
                  <YAxis
                    stroke="currentColor"
                    className="text-[11px] text-muted-foreground"
                    tickLine={false}
                    axisLine={{ stroke: "rgba(128,128,128,0.2)" }}
                    tickFormatter={(val) => `$${val}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "12px",
                      fontSize: "12px",
                      color: "hsl(var(--foreground))",
                      boxShadow: "0 10px 25px -5px rgba(0,0,0,0.2)",
                    }}
                    formatter={(val: unknown) => [formatCurrency(Number(val)), "Settled Revenue"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#C6A875"
                    strokeWidth={2.5}
                    fill="url(#revenueGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-2 text-muted-foreground p-6">
                <ShieldCheck className="w-8 h-8 text-muted-foreground/40" />
                <p className="text-xs">No settlements recorded in current billing period.</p>
              </div>
            )}
          </div>
        </div>

        {/* Category Distribution Donut Chart */}
        <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-sm">
          <div className="border-b border-border/60 pb-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-[0.25em] text-accent font-bold block">
                Carte Portfolio
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
                Formulation Distribution
              </h3>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">
              Live Mix
            </span>
          </div>

          <div className="relative h-60 w-full flex items-center justify-center">
            {loading ? (
              <span className="text-xs text-muted-foreground">Analyzing offerings...</span>
            ) : data?.categoryDistribution && data.categoryDistribution.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.categoryDistribution}
                      dataKey="count"
                      nameKey="_id"
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={92}
                      paddingAngle={4}
                    >
                      {data.categoryDistribution.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={LUXURY_PALETTE[index % LUXURY_PALETTE.length]}
                          stroke="hsl(var(--card))"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "12px",
                        fontSize: "12px",
                        color: "hsl(var(--foreground))",
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Ring Telemetry */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="font-sans text-3xl font-bold tracking-tight text-foreground tabular-nums">
                    {totalFormulations}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                    Treatments
                  </span>
                </div>
              </>
            ) : (
              <span className="text-xs text-muted-foreground">No categories indexed.</span>
            )}
          </div>

          {/* Dynamic Category Progress Bars & Distribution List */}
          <div className="pt-4 border-t border-border/60 space-y-2.5">
            {data?.categoryDistribution && data.categoryDistribution.length > 0 ? (
              data.categoryDistribution.slice(0, 5).map((cat, i) => {
                const color = LUXURY_PALETTE[i % LUXURY_PALETTE.length];
                const pct = totalFormulations > 0 ? Math.round((cat.count / totalFormulations) * 100) : 0;
                return (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: color }}
                        />
                        <span className="font-medium text-foreground truncate">
                          {cat._id}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-sans font-semibold text-foreground tabular-nums text-[11px]">
                          {cat.count} {cat.count === 1 ? "offering" : "offerings"}
                        </span>
                        <span className="font-sans text-[10px] font-bold text-muted-foreground tabular-nums px-1.5 py-0.5 rounded bg-muted">
                          {pct}%
                        </span>
                      </div>
                    </div>
                    {/* Micro Progress Bar */}
                    <div className="h-1.5 w-full bg-muted/60 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-2 text-xs text-muted-foreground">
                No carte distribution data available.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Quick Governance & Operations Shortcuts */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
          <div className="space-y-1">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
              Reservation Diary Health
            </h3>
            <p className="text-xs text-muted-foreground">
              Direct pipeline to manage upcoming guest requests and confirm chair openings.
            </p>
          </div>
          <Link href="/admin/appointments">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl text-xs font-semibold gap-1.5 border-border hover:bg-muted"
            >
              <span>View All Appointments</span>
              <ArrowRight className="w-3.5 h-3.5 text-accent" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-border/60 bg-muted/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-semibold text-foreground block">
                  Pending Review
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Awaiting confirmation
                </span>
              </div>
            </div>
            <span className="font-sans text-2xl font-bold tabular-nums text-amber-600 dark:text-amber-400">
              {pendingCount}
            </span>
          </div>

          <div className="p-4 rounded-xl border border-border/60 bg-muted/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-semibold text-foreground block">
                  Confirmed &amp; Ready
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Patron checkout eligible
                </span>
              </div>
            </div>
            <span className="font-sans text-2xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
              {confirmedCount}
            </span>
          </div>

          <div className="p-4 rounded-xl border border-border/60 bg-muted/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-semibold text-foreground block">
                  Cancelled / Released
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Slot freed for booking
                </span>
              </div>
            </div>
            <span className="font-sans text-2xl font-bold tabular-nums text-rose-600 dark:text-rose-400">
              {cancelledCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
