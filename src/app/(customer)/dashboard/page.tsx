"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  CreditCard,
  Scissors,
  Check,
} from "lucide-react";
import { api } from "@/lib/api";
import { Appointment, ApiResponse } from "@/types";
import { Card } from "@/components/ui/card";
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
      {/* 1. Client Digital Pass & Next Upcoming Session */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Digital Membership Pass */}
        <div className="lg:col-span-5 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 p-6 sm:p-7 text-white border border-indigo-500/30 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[220px]">
          <div className="absolute top-0 right-0 w-44 h-44 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                <Scissors className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white">
                SalonBook
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-violet-500/20 text-violet-300 border border-violet-500/40">
              Verified Patron
            </span>
          </div>

          <div className="space-y-1 relative z-10 py-5">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
              Patron Name
            </span>
            <h3 className="text-2xl font-black tracking-tight text-white">
              {user?.name || "Valued Guest"}
            </h3>
            <p className="text-xs text-slate-400">{user?.email}</p>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-3 relative z-10">
            <span>Membership: Standard</span>
            <span className="text-indigo-300 font-bold">Madison Flagship</span>
          </div>
        </div>

        {/* Next Scheduled Appointment Spotlight */}
        <div className="lg:col-span-7 rounded-2xl bg-card border border-border p-6 sm:p-7 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Next Scheduled Visit
              </span>
              {nextAppointment && (
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    nextAppointment.status === "confirmed"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                  }`}
                >
                  {nextAppointment.status}
                </span>
              )}
            </div>

            {loading ? (
              <div className="py-6 flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                <span className="text-xs text-muted-foreground">Checking next booking...</span>
              </div>
            ) : nextAppointment ? (
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-foreground">
                  {typeof nextAppointment.serviceId === "object"
                    ? (nextAppointment.serviceId as { title?: string }).title || "Salon Treatment"
                    : "Salon Treatment"}
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1 font-semibold text-foreground">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    {formatDate(nextAppointment.appointmentDate || nextAppointment.date || "")}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    {nextAppointment.timeSlot}
                  </span>
                  <span>•</span>
                  <span className="font-bold text-foreground">
                    {formatCurrency(nextAppointment.price || nextAppointment.servicePrice || 0)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="py-4 space-y-1">
                <h3 className="text-base font-bold text-foreground">
                  No Upcoming Appointments
                </h3>
                <p className="text-xs text-muted-foreground">
                  You do not have any pending or confirmed bookings at the moment.
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-between mt-4">
            <Link
              href="/dashboard/appointments"
              className="text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              View All Appointments <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {nextAppointment?.status === "confirmed" && nextAppointment?.paymentStatus === "unpaid" ? (
              <Link href="/dashboard/appointments">
                <Button variant="gradient" size="sm" className="text-xs font-bold rounded-xl gap-1.5">
                  <CreditCard className="w-3.5 h-3.5" />
                  Pay with Stripe
                </Button>
              </Link>
            ) : (
              <Link href="/services">
                <Button variant="outline" size="sm" className="text-xs font-bold rounded-xl gap-1.5">
                  <Scissors className="w-3.5 h-3.5" />
                  Browse Menu
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="p-5 bg-card border-border shadow-sm rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Total Bookings
            </span>
            <div className="text-2xl font-black text-foreground">
              {loading ? "..." : totalAppointments}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
            <Calendar className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-5 bg-card border-border shadow-sm rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Pending Requests
            </span>
            <div className="text-2xl font-black text-foreground">
              {loading ? "..." : pendingAppointments}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-5 bg-card border-border shadow-sm rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Confirmed Visits
            </span>
            <div className="text-2xl font-black text-foreground">
              {loading ? "..." : confirmedAppointments}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* 3. Recent Bookings Table */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground">
              Recent Activity
            </h3>
            <p className="text-xs text-muted-foreground">
              Your latest salon appointments and service statuses.
            </p>
          </div>
          <Link href="/dashboard/appointments">
            <Button variant="ghost" size="sm" className="text-xs font-bold text-primary">
              View All
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-muted-foreground">
            Loading recent visits...
          </div>
        ) : recentAppointments.length === 0 ? (
          <div className="py-10 text-center space-y-2">
            <Scissors className="w-8 h-8 text-muted-foreground mx-auto opacity-50" />
            <p className="text-xs text-muted-foreground">
              No bookings yet. Ready for your first appointment?
            </p>
            <Link href="/services">
              <Button variant="gradient" size="sm" className="text-xs font-bold rounded-xl mt-2">
                Explore Services
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
                  <th className="pb-3 pr-4">Service</th>
                  <th className="pb-3 px-4">Date & Time</th>
                  <th className="pb-3 px-4">Price</th>
                  <th className="pb-3 px-4">Status</th>
                  <th className="pb-3 pl-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentAppointments.map((app) => {
                  const serviceTitle =
                    typeof app.serviceId === "object"
                      ? (app.serviceId as { title?: string }).title || "Salon Service"
                      : "Salon Service";

                  return (
                    <tr key={app._id} className="hover:bg-secondary/40 transition-colors">
                      <td className="py-3.5 pr-4 font-bold text-foreground">
                        {serviceTitle}
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground">
                        {formatDate(app.appointmentDate || app.date || "")} at {app.timeSlot}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-foreground">
                        {formatCurrency(app.price || app.servicePrice || 0)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            app.status === "confirmed"
                              ? "bg-emerald-500/10 text-emerald-600"
                              : app.status === "pending"
                              ? "bg-amber-500/10 text-amber-600"
                              : "bg-slate-500/10 text-slate-600"
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3.5 pl-4 text-right">
                        <Link href="/dashboard/appointments">
                          <Button variant="ghost" size="sm" className="text-xs font-bold h-7 px-2 text-primary">
                            Details
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
