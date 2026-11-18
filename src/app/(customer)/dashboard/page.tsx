"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Sparkles,
  CreditCard,
  Crown,
  MapPin,
} from "lucide-react";
import { api } from "@/lib/api";
import { Appointment, ApiResponse } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

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
  const nextAppointment = appointments.find((a) => a.status === "confirmed" || a.status === "pending");
  const recentAppointments = appointments.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* 1. Atelier VIP Patron Membership Card & Next Session Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* VIP Digital Membership Card */}
        <div className="lg:col-span-5 rounded-3xl bg-gradient-to-br from-noir-900 via-noir-800 to-zinc-950 p-6 sm:p-8 text-white border border-gold-500/30 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[220px]">
          {/* Subtle Golden Hairline Foil Ornament */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-gold-500/15 via-transparent to-transparent rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-2 right-4 text-[90px] font-serif font-black text-white/[0.03] select-none pointer-events-none">
            SB
          </div>

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gold-500 to-terracotta-500 flex items-center justify-center text-white">
                <Crown className="w-4 h-4" />
              </div>
              <span className="font-serif text-lg font-bold tracking-wider text-gold-300">
                SALONBOOK
              </span>
            </div>
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-gold-500/20 text-gold-300 border border-gold-500/40">
              VIP Atelier Patron
            </span>
          </div>

          <div className="space-y-1 relative z-10 py-6">
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-400">
              Patron Identity
            </span>
            <h3 className="font-serif text-2xl font-bold tracking-tight text-white">
              {user?.name || "Valued Guest"}
            </h3>
            <p className="text-xs text-zinc-400">{user?.email}</p>
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-400 border-t border-gold-500/15 pt-3 relative z-10">
            <span>Privilege Tier: Diamond Society</span>
            <span className="text-gold-400 font-semibold">Madison Flagship</span>
          </div>
        </div>

        {/* Next Scheduled Appointment Spotlight */}
        <div className="lg:col-span-7 rounded-3xl bg-card border border-gold-500/20 p-6 sm:p-8 shadow-xl flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gold-600 dark:text-gold-400 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-gold-500" /> Next Upcoming Treatment
              </span>
              {nextAppointment && (
                <Badge
                  variant={nextAppointment.status === "confirmed" ? "default" : "secondary"}
                  className="capitalize text-[11px]"
                >
                  {nextAppointment.status}
                </Badge>
              )}
            </div>

            {nextAppointment ? (
              <div className="space-y-3 pt-2">
                <h3 className="font-serif text-2xl font-bold text-foreground">
                  {nextAppointment.serviceId?.title || "Bespoke Treatment"}
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5 font-medium text-foreground">
                    <Calendar className="w-4 h-4 text-primary" />
                    {formatDate(nextAppointment.appointmentDate)} at {nextAppointment.timeSlot}
                  </span>
                  <span>•</span>
                  <span>Duration: {nextAppointment.serviceId?.durationMinutes || 60} mins</span>
                  <span>•</span>
                  <span>Fee: {formatCurrency(nextAppointment.serviceId?.price || 0)}</span>
                </div>
              </div>
            ) : (
              <div className="py-6 space-y-2">
                <h3 className="font-serif text-xl font-bold text-foreground">
                  No Upcoming Appointments Scheduled
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your calendar is currently clear. Reserve your next editorial hair styling, caviar facial, or body massage ritual today.
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-border/80">
            {nextAppointment ? (
              <Link href="/dashboard/appointments" className="w-full sm:w-auto">
                <Button variant="luxury" size="sm" className="w-full sm:w-auto rounded-full gap-2 text-xs font-semibold">
                  <span>Manage Reservation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            ) : (
              <Link href="/services" className="w-full sm:w-auto">
                <Button variant="luxury" size="sm" className="w-full sm:w-auto rounded-full gap-2 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Explore Menu & Book</span>
                </Button>
              </Link>
            )}
            <div className="text-xs text-muted-foreground flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-gold-500" />
              <span>450 Madison Avenue, New York</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Three Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="p-6 bg-card border-border/80 hover:border-gold-500/40 hover:shadow-xl transition-all rounded-3xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Appointments
            </span>
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-serif text-3xl font-bold text-foreground">
              {loading ? "..." : totalAppointments}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              All bookings requested at SalonBook
            </p>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border/80 hover:border-gold-500/40 hover:shadow-xl transition-all rounded-3xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gold-600 dark:text-gold-400 uppercase tracking-wider">
              Pending Confirmation
            </span>
            <div className="w-10 h-10 rounded-2xl bg-gold-500/10 flex items-center justify-center text-gold-600 dark:text-gold-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-serif text-3xl font-bold text-foreground">
              {loading ? "..." : pendingAppointments}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting salon specialist confirmation
            </p>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border/80 hover:border-gold-500/40 hover:shadow-xl transition-all rounded-3xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Confirmed Bookings
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-serif text-3xl font-bold text-foreground">
              {loading ? "..." : confirmedAppointments}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Confirmed & ready for salon visit
            </p>
          </div>
        </Card>
      </div>

      {/* 3. Recent Appointments Section */}
      <div className="bg-card rounded-3xl border border-gold-500/20 p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
              Recent Salon Reservations
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Your latest booking requests and specialist appointment statuses.
            </p>
          </div>
          <Link href="/dashboard/appointments">
            <Button variant="ghost" size="sm" className="gap-1 text-xs text-primary hover:text-primary rounded-full">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-muted-foreground text-sm space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-gold-500 border-t-transparent animate-spin mx-auto" />
            <p className="text-xs font-semibold text-muted-foreground">Loading recent reservations...</p>
          </div>
        ) : recentAppointments.length === 0 ? (
          <div className="py-16 text-center space-y-4 max-w-sm mx-auto">
            <div className="w-12 h-12 rounded-full bg-gold-500/10 text-gold-500 mx-auto flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-lg font-bold text-foreground">
              No Appointments Yet
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Experience the pinnacle of editorial hair design and restorative spa rituals.
            </p>
            <Link href="/services">
              <Button variant="luxury" size="sm" className="mt-2 rounded-full text-xs font-semibold">
                Discover Services Menu
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border/80 text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                  <th className="pb-3 pr-4">Service</th>
                  <th className="pb-3 px-4">Date & Time</th>
                  <th className="pb-3 px-4">Session Fee</th>
                  <th className="pb-3 px-4">Booking Status</th>
                  <th className="pb-3 pl-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {recentAppointments.map((app) => {
                  const service = app.serviceId;
                  return (
                    <tr key={app._id} className="hover:bg-muted/40 transition-colors">
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-3">
                          {service?.images?.[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={service.images[0]}
                              alt={service.title}
                              className="w-12 h-12 rounded-xl object-cover border border-border shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-600 font-serif font-bold shrink-0">
                              SB
                            </div>
                          )}
                          <div>
                            <p className="font-serif font-bold text-foreground text-sm leading-tight">
                              {service?.title || "Custom Service"}
                            </p>
                            <span className="text-[11px] text-muted-foreground">
                              {service?.category || "Salon"} · {service?.durationMinutes || 60} mins
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-semibold text-foreground">
                          {formatDate(app.appointmentDate)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {app.timeSlot}
                        </div>
                      </td>

                      <td className="py-4 px-4 font-serif font-bold text-foreground whitespace-nowrap">
                        {formatCurrency(service?.price || 0)}
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <Badge
                          variant={
                            app.status === "confirmed"
                              ? "default"
                              : app.status === "cancelled"
                              ? "destructive"
                              : "secondary"
                          }
                          className="capitalize text-[11px]"
                        >
                          {app.status}
                        </Badge>
                      </td>

                      <td className="py-4 pl-4 text-right whitespace-nowrap">
                        <Link href="/dashboard/appointments">
                          <Button variant="outline" size="sm" className="h-8 text-xs rounded-full border-border/80">
                            Manage
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
