"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Scissors,
  Calendar,
  Clock,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  CreditCard,
  Crown,
} from "lucide-react";
import { api } from "@/lib/api";
import { ApiResponse } from "@/types";
import { Card } from "@/components/ui/card";
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

const PIE_COLORS = ["#be9643", "#c4755f", "#059669", "#2563EB", "#9333EA", "#D97706"];

export default function AdminOverviewPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await api.get<ApiResponse<AnalyticsData>>("/admin/analytics");
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.warn("Failed to fetch analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const pendingCount =
    data?.statusCounts.find((s) => s._id === "pending")?.count || 0;
  const confirmedCount =
    data?.statusCounts.find((s) => s._id === "confirmed")?.count || 0;

  const statCards = [
    {
      label: "Registered Patrons",
      value: data?.summary.totalUsers || 0,
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-500/10",
      href: "/admin/customers",
    },
    {
      label: "Curated Offerings",
      value: data?.summary.totalServices || 0,
      icon: Scissors,
      color: "text-terracotta-600 dark:text-terracotta-400",
      bg: "bg-terracotta-500/10",
      href: "/admin/services",
    },
    {
      label: "All Reservations",
      value: data?.summary.totalAppointments || 0,
      icon: Calendar,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-500/10",
      href: "/admin/appointments",
    },
    {
      label: "Pending Inquiries",
      value: pendingCount,
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10",
      href: "/admin/appointments?status=pending",
    },
    {
      label: "Confirmed Visits",
      value: confirmedCount,
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
      href: "/admin/appointments?status=confirmed",
    },
    {
      label: "Gross Stripe Volume",
      value: formatCurrency(data?.summary.totalRevenue || 0),
      icon: DollarSign,
      color: "text-gold-600 dark:text-gold-400",
      bg: "bg-gold-500/10",
      href: "/admin/transactions",
      isMoney: true,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-gold-600 dark:text-gold-400 mb-1">
            <Crown className="w-3.5 h-3.5 text-gold-500" />
            <span>Operational Directorate</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Salon Operational Telemetry
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Real-time management across treatment menu, appointment requests, patron ledger, and Stripe payments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/services">
            <Button variant="luxury" size="sm" className="gap-2 rounded-full px-5 text-xs font-semibold shadow-md shadow-gold-500/20">
              <Scissors className="w-3.5 h-3.5" />
              <span>Manage Services Menu</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 6 Key Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Link key={i} href={card.href}>
              <Card className="p-6 bg-card border-gold-500/20 hover:border-gold-500/50 hover:shadow-xl transition-all rounded-3xl group">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {card.label}
                  </span>
                  <div
                    className={`w-11 h-11 rounded-2xl ${card.bg} ${card.color} flex items-center justify-center group-hover:scale-105 transition-transform border border-border/60`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline justify-between">
                  <h3 className="font-serif text-3xl font-bold text-foreground">
                    {loading ? "..." : card.value}
                  </h3>
                  <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-0.5 font-semibold">
                    Inspect <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend Area Chart */}
        <div className="lg:col-span-2 bg-card rounded-3xl border border-gold-500/20 p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl font-bold text-foreground">
                Revenue & Reservation Growth
              </h3>
              <p className="text-xs text-muted-foreground">
                Verified monthly Stripe payment collections.
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Live Telemetry</span>
            </div>
          </div>

          <div className="h-[280px] w-full pt-4">
            {data?.monthlyRevenue && data.monthlyRevenue.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.monthlyRevenue}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#be9643" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#be9643" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#888" fontSize={11} />
                  <YAxis stroke="#888" fontSize={11} tickFormatter={(val) => `$${val}`} />
                  <Tooltip
                    formatter={(val) => [`$${val}`, "Revenue"]}
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      borderColor: "rgba(190, 150, 67, 0.3)",
                      borderRadius: "1rem",
                      fontSize: "12px",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#be9643"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#revenueGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-xs text-muted-foreground">
                <Calendar className="w-8 h-8 opacity-40 mb-2" />
                <span>Collecting monthly transaction telemetry...</span>
              </div>
            )}
          </div>
        </div>

        {/* Category Distribution Pie Chart */}
        <div className="bg-card rounded-3xl border border-gold-500/20 p-6 sm:p-8 space-y-4 shadow-xl">
          <div>
            <h3 className="font-serif text-xl font-bold text-foreground">
              Catalog Category Mix
            </h3>
            <p className="text-xs text-muted-foreground">
              Service offerings distributed across disciplines.
            </p>
          </div>

          <div className="h-[240px] w-full flex items-center justify-center">
            {data?.categoryDistribution && data.categoryDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.categoryDistribution}
                    dataKey="count"
                    nameKey="_id"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={50}
                    paddingAngle={3}
                  >
                    {data.categoryDistribution.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      borderColor: "rgba(190, 150, 67, 0.3)",
                      borderRadius: "1rem",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-muted-foreground">
                No active categories found
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 text-[11px] pt-3 border-t border-border">
            {data?.categoryDistribution?.slice(0, 6).map((cat, idx) => (
              <div key={idx} className="flex items-center gap-2 truncate">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                />
                <span className="truncate text-muted-foreground font-medium">
                  {cat._id} ({cat.count})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
