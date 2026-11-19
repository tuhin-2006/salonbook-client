"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Sparkles,
  Scissors,
  User,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { api } from "@/lib/api";
import { Appointment, ApiResponse } from "@/types";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { SafeImage } from "@/components/ui/SafeImage";

export default function CustomerDashboardOverview() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const res = await api.get<ApiResponse<Appointment[]>>("/appointments/my");
        if (res.data.success) {
          setAppointments(res.data.data);
        }
      } catch (err) {
        console.warn("Could not load appointments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const totalAppointments = appointments.length;
  const pendingAppointments = appointments.filter((a) => a.status === "pending").length;
  const confirmedAppointments = appointments.filter((a) => a.status === "confirmed").length;
  const nextAppointment = appointments.find(
    (a) => a.status === "confirmed" || a.status === "pending"
  );
  const recentAppointments = appointments.slice(0, 4);

  return (
    <div className="space-y-10">
      {/* 1. Hero Next Scheduled Treatment Spotlight Card */}
      <div className="rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-muted/30 p-6 sm:p-9 shadow-sm relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-border/60">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-[11px] uppercase tracking-[0.25em] text-accent font-bold">
                  Next Scheduled Treatment
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                {nextAppointment
                  ? typeof nextAppointment.serviceId === "object"
                    ? nextAppointment.serviceId?.title
                    : "Atelier Appointment"
                  : "No Active Reservations"}
              </h2>
            </div>

            {nextAppointment && (
              <div className="flex items-center gap-3">
                <span
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
                    nextAppointment.status === "confirmed"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                  }`}
                >
                  {nextAppointment.status === "confirmed"
                    ? "✓ Confirmed & Ready"
                    : "⏳ Pending Confirmation"}
                </span>
              </div>
            )}
          </div>

          {nextAppointment ? (
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-accent" />
                  <span>Session Date</span>
                </span>
                <p className="font-serif text-lg font-bold text-foreground">
                  {formatDate(nextAppointment.date || "")}
                </p>
                <span className="text-xs text-muted-foreground">
                  Time Slot: {nextAppointment.timeSlot}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-accent" />
                  <span>Master Specialist</span>
                </span>
                <p className="font-serif text-lg font-bold text-foreground">
                  {nextAppointment.specialist || "Lead Atelier Artist"}
                </p>
                <span className="text-xs text-muted-foreground">
                  Private single-guest station
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-accent" />
                  <span>Fee &amp; Payment</span>
                </span>
                <p className="font-serif text-lg font-bold text-foreground">
                  {formatCurrency(nextAppointment.price || 0)}
                </p>
                <span
                  className={`text-xs font-semibold ${
                    nextAppointment.paymentStatus === "paid"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-amber-600 dark:text-amber-400"
                  }`}
                >
                  {nextAppointment.paymentStatus === "paid"
                    ? "Paid via Stripe"
                    : "Payment Pending"}
                </span>
              </div>

              <div className="flex flex-col justify-end">
                <Link href="/dashboard/appointments">
                  <Button
                    size="sm"
                    className="w-full rounded-xl text-xs font-semibold tracking-wider bg-primary text-primary-foreground hover:bg-primary/90 h-10 gap-1.5 shadow-sm"
                  >
                    <span>Manage Appointment</span>
                    <ArrowRight className="w-3.5 h-3.5 text-accent" />
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-6">
              <p className="text-xs sm:text-sm text-muted-foreground max-w-lg leading-relaxed">
                You currently have no pending or confirmed chair bookings. Indulge in our autumn/winter coiffure and restorative spa formulations.
              </p>
              <Link href="/services">
                <Button
                  size="sm"
                  className="rounded-xl text-xs font-semibold tracking-wider px-5 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm gap-2"
                >
                  <Scissors className="w-3.5 h-3.5 text-accent" />
                  <span>Explore Treatment Carte</span>
                  <ArrowRight className="w-3.5 h-3.5 text-accent" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* 2. 4 Metric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl border border-border/80 bg-card flex flex-col justify-between shadow-sm min-h-[130px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Total Reservations
            </span>
            <div className="w-8 h-8 rounded-lg bg-muted text-foreground flex items-center justify-center">
              <Calendar className="w-4 h-4 text-accent" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-sans text-3xl font-bold text-foreground tabular-nums tracking-tight">
              {loading ? "..." : totalAppointments}
            </span>
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
              Lifetime
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-border/80 bg-card flex flex-col justify-between shadow-sm min-h-[130px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Confirmed Sessions
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-sans text-3xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums tracking-tight">
              {loading ? "..." : confirmedAppointments}
            </span>
            <span className="text-[10px] text-emerald-600/80 uppercase font-bold tracking-wider">
              Ready
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-border/80 bg-card flex flex-col justify-between shadow-sm min-h-[130px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Pending Review
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-sans text-3xl font-bold text-amber-600 dark:text-amber-400 tabular-nums tracking-tight">
              {loading ? "..." : pendingAppointments}
            </span>
            <span className="text-[10px] text-amber-600/80 uppercase font-bold tracking-wider">
              In Review
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-border/80 bg-card flex flex-col justify-between shadow-sm min-h-[130px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Client Status
            </span>
            <div className="w-8 h-8 rounded-lg bg-accent/20 text-accent flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-serif text-xl font-bold text-accent">
              Verified Patron
            </span>
            <span className="text-[10px] text-accent/80 uppercase font-bold tracking-wider">
              Active Tier
            </span>
          </div>
        </div>
      </div>

      {/* 3. Recent Booking Activity Timeline */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
          <div className="space-y-1">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
              Recent Chair Bookings
            </h3>
            <p className="text-xs text-muted-foreground">
              Your recent appointment history and current confirmation states.
            </p>
          </div>
          <Link href="/dashboard/appointments">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl text-xs font-semibold gap-1.5 border-border hover:bg-muted"
            >
              <span>View All Bookings</span>
              <ArrowRight className="w-3.5 h-3.5 text-accent" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs text-muted-foreground">
            <div className="w-6 h-6 border-2 border-accent border-t-transparent animate-spin rounded-full mx-auto mb-2" />
            Loading recent bookings...
          </div>
        ) : recentAppointments.length === 0 ? (
          <div className="py-12 text-center text-xs text-muted-foreground">
            No reservations registered yet. Click &quot;Book New Appointment&quot; to reserve your first chair.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentAppointments.map((app) => {
              const service =
                typeof app.serviceId === "object" ? app.serviceId : null;

              return (
                <div
                  key={app._id}
                  className="p-4 rounded-xl border border-border/60 bg-muted/20 hover:border-accent/40 transition-colors flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-muted overflow-hidden relative shrink-0 border border-border">
                      <SafeImage
                        src={service?.images?.[0] || ""}
                        alt={service?.title || "Service"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <span className="font-serif text-sm font-bold text-foreground block truncate">
                        {service?.title || "Bespoke Treatment"}
                      </span>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <span>{formatDate(app.date || "")}</span>
                        <span>•</span>
                        <span>{app.timeSlot}</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      app.status === "confirmed"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                        : app.status === "pending"
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                        : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
