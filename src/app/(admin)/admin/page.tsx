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
  ArrowUpRight,
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

const PIE_COLORS = ["#26372D", "#B8755B", "#343D2E", "#A4AA91", "#302821", "#7E856E"];

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
      label: "REGISTERED PATRONS",
      value: data?.summary.totalUsers || 0,
      icon: Users,
      href: "/admin/customers",
    },
    {
      label: "ACTIVE CARTE OFFERINGS",
      value: data?.summary.totalServices || 0,
      icon: Scissors,
      href: "/admin/services",
    },
    {
      label: "TOTAL CHAIR BOOKINGS",
      value: data?.summary.totalAppointments || 0,
      icon: Calendar,
      href: "/admin/appointments",
    },
    {
      label: "PENDING CONSULTATIONS",
      value: pendingCount,
      icon: Clock,
      href: "/admin/appointments?status=pending",
    },
    {
      label: "CONFIRMED SESSIONS",
      value: confirmedCount,
      icon: CheckCircle2,
      href: "/admin/appointments?status=confirmed",
    },
    {
      label: "STRIPE GROSS REVENUE",
      value: formatCurrency(data?.summary.totalRevenue || 0),
      icon: DollarSign,
      href: "/admin/transactions",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 pb-6 border-b border-[#302821]/15">
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#B8755B] font-semibold block">
            ATELIER TELEMETRY
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#302821] dark:text-[#F5F1E8]">
            Direction &amp; Operations Suite
          </h1>
          <p className="text-xs text-[#302821]/70 dark:text-[#EAE3D6]/70 max-w-xl leading-relaxed">
            Real-time governance across treatment carte offerings, reservation diary approvals, and verified Stripe financial settlements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/services">
            <Button
              variant="default"
              size="sm"
              className="rounded-none text-xs uppercase tracking-wider px-5 py-2.5 bg-[#26372D] text-[#F5F1E8] hover:bg-[#343D2E]"
            >
              <Scissors className="w-3.5 h-3.5 mr-2" />
              <span>MANAGE CARTE</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 6 Key Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Link key={i} href={card.href}>
              <div className="p-6 border border-[#302821]/15 dark:border-[#EAE3D6]/15 bg-[#EAE3D6]/40 dark:bg-[#1a201c] hover:border-[#26372D] transition-colors group flex flex-col justify-between min-h-[140px]">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-[#302821]/60 dark:text-[#EAE3D6]/60">
                    {card.label}
                  </span>
                  <div className="w-8 h-8 bg-[#26372D] text-[#F5F1E8] flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className="mt-4 flex items-baseline justify-between">
                  <h3 className="font-serif text-3xl text-[#26372D] dark:text-[#F5F1E8]">
                    {loading ? "..." : card.value}
                  </h3>
                  <span className="text-[10px] uppercase tracking-wider text-[#302821]/60 group-hover:text-[#26372D] flex items-center gap-0.5">
                    DETAILS <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Trend Area Chart */}
        <div className="lg:col-span-2 border border-[#302821]/15 dark:border-[#EAE3D6]/15 bg-[#EAE3D6]/30 dark:bg-[#1a201c] p-7 space-y-4">
          <div className="flex items-center justify-between border-b border-[#302821]/10 pb-4">
            <div>
              <span className="text-[9px] uppercase tracking-[0.2em] text-[#B8755B] font-semibold block">
                MONTHLY REVENUE
              </span>
              <h3 className="font-serif text-xl text-[#302821] dark:text-[#F5F1E8]">
                Stripe Settlement Trajectory
              </h3>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] uppercase tracking-wider bg-[#26372D] text-[#F5F1E8]">
              <TrendingUp className="w-3 h-3" />
              <span>Verified Webhook</span>
            </div>
          </div>

          <div className="h-64 w-full pt-4">
            {loading ? (
              <div className="h-full flex items-center justify-center text-xs text-[#302821]/60">
                Loading revenue telemetry...
              </div>
            ) : data?.monthlyRevenue && data.monthlyRevenue.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.monthlyRevenue}>
                  <XAxis
                    dataKey="month"
                    stroke="#7E856E"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#7E856E"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `$${val}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#F5F1E8",
                      borderRadius: "0px",
                      border: "1px solid #302821",
                      fontSize: "11px",
                      color: "#302821",
                      textTransform: "uppercase",
                    }}
                    formatter={(val: unknown) => [formatCurrency(Number(val)), "Revenue"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#26372D"
                    strokeWidth={2}
                    fill="#343D2E"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-[#302821]/60">
                No revenue records recorded in this billing cycle.
              </div>
            )}
          </div>
        </div>

        {/* Category Distribution Pie Chart */}
        <div className="border border-[#302821]/15 dark:border-[#EAE3D6]/15 bg-[#EAE3D6]/30 dark:bg-[#1a201c] p-7 space-y-4 flex flex-col justify-between">
          <div className="border-b border-[#302821]/10 pb-4">
            <span className="text-[9px] uppercase tracking-[0.2em] text-[#B8755B] font-semibold block">
              CARTE DISTRIBUTION
            </span>
            <h3 className="font-serif text-xl text-[#302821] dark:text-[#F5F1E8]">
              Formulations by Specialty
            </h3>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            {loading ? (
              <span className="text-xs text-[#302821]/60">Analyzing offerings...</span>
            ) : data?.categoryDistribution && data.categoryDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.categoryDistribution}
                    dataKey="count"
                    nameKey="_id"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={2}
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
                      backgroundColor: "#F5F1E8",
                      borderRadius: "0px",
                      border: "1px solid #302821",
                      fontSize: "11px",
                      color: "#302821",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <span className="text-xs text-[#302821]/60">No categories indexed</span>
            )}
          </div>

          <div className="pt-2 border-t border-[#302821]/10 flex flex-wrap items-center justify-center gap-3 text-[10px] uppercase tracking-wider text-[#302821]/70">
            {data?.categoryDistribution.slice(0, 4).map((cat, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2"
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
