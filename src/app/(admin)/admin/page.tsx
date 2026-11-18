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

const PIE_COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#14b8a6", "#3b82f6", "#f59e0b"];

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
      label: "Total Registered Patrons",
      value: data?.summary.totalUsers || 0,
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-500/10",
      href: "/admin/customers",
    },
    {
      label: "Active Services",
      value: data?.summary.totalServices || 0,
      icon: Scissors,
      color: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-500/10",
      href: "/admin/services",
    },
    {
      label: "Total Reservations",
      value: data?.summary.totalAppointments || 0,
      icon: Calendar,
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-500/10",
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
      label: "Stripe Revenue",
      value: formatCurrency(data?.summary.totalRevenue || 0),
      icon: DollarSign,
      color: "text-pink-600 dark:text-pink-400",
      bg: "bg-pink-500/10",
      href: "/admin/transactions",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Salon Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Executive Telemetry & Metrics
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Real-time management across salon catalog, client appointments, and Stripe revenue.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/admin/services">
            <Button variant="gradient" size="sm" className="gap-2 rounded-xl text-xs font-bold">
              <Scissors className="w-3.5 h-3.5" />
              <span>Manage Services</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 6 Key Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Link key={i} href={card.href}>
              <Card className="p-5 bg-card border-border hover:border-primary/50 hover:shadow-lg transition-all rounded-2xl group">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    {card.label}
                  </span>
                  <div
                    className={`w-10 h-10 rounded-xl ${card.bg} ${card.color} flex items-center justify-center group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline justify-between">
                  <h3 className="text-2xl font-black text-foreground">
                    {loading ? "..." : card.value}
                  </h3>
                  <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-0.5 font-bold">
                    View <ArrowUpRight className="w-3.5 h-3.5" />
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
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground">
                Revenue & Appointment Growth
              </h3>
              <p className="text-xs text-muted-foreground">
                Monthly verified Stripe payment collections.
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.4% MoM</span>
            </div>
          </div>

          <div className="h-64 w-full pt-4">
            {loading ? (
              <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                Loading revenue telemetry...
              </div>
            ) : data?.monthlyRevenue && data.monthlyRevenue.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.monthlyRevenue}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="month"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `$${val}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.95)",
                      borderRadius: "12px",
                      border: "1px solid rgba(99, 102, 241, 0.3)",
                      fontSize: "12px",
                      color: "#fff",
                    }}
                    formatter={(val: unknown) => [formatCurrency(Number(val)), "Revenue"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#revenueGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                No revenue records available yet.
              </div>
            )}
          </div>
        </div>

        {/* Category Distribution Pie Chart */}
        <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground">
              Services by Category
            </h3>
            <p className="text-xs text-muted-foreground">
              Catalog breakdown across salon specialties.
            </p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            {loading ? (
              <span className="text-xs text-muted-foreground">Analyzing offerings...</span>
            ) : data?.categoryDistribution && data.categoryDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.categoryDistribution}
                    dataKey="count"
                    nameKey="_id"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {data.categoryDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.95)",
                      borderRadius: "12px",
                      border: "1px solid rgba(99, 102, 241, 0.3)",
                      fontSize: "12px",
                      color: "#fff",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <span className="text-xs text-muted-foreground">No categories defined yet</span>
            )}
          </div>

          <div className="pt-2 border-t border-border flex flex-wrap items-center justify-center gap-3 text-[11px] text-muted-foreground">
            {data?.categoryDistribution.slice(0, 4).map((cat, i) => (
              <div key={i} className="flex items-center gap-1.5 font-medium">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                />
                <span>{cat._id} ({cat.count})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
