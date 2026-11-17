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
} from "lucide-react";
import { api } from "@/lib/api";
import { Appointment, ApiResponse } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function CustomerDashboardOverview() {
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
  const recentAppointments = appointments.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* 3 Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="p-6 bg-card border-border/70 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Appointments
            </span>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
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

        <Card className="p-6 bg-card border-border/70 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gold-600 dark:text-gold-400 uppercase tracking-wider">
              Pending Confirmation
            </span>
            <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-600 dark:text-gold-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-serif text-3xl font-bold text-foreground">
              {loading ? "..." : pendingAppointments}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting salon artist confirmation
            </p>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border/70 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Confirmed Bookings
            </span>
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
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

      {/* Recent Appointments Section */}
      <div className="bg-card rounded-2xl border border-border/70 p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
              Recent Appointments
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Your latest booking requests and salon treatment statuses.
            </p>
          </div>
          <Link href="/dashboard/appointments">
            <Button variant="ghost" size="sm" className="gap-1 text-xs text-primary hover:text-primary">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-muted-foreground text-sm">
            Loading recent appointments...
          </div>
        ) : recentAppointments.length === 0 ? (
          <div className="py-16 text-center space-y-4 max-w-sm mx-auto">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-lg font-semibold text-foreground">
              No Appointments Yet
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Experience the pinnacle of editorial hair design and restorative spa rituals.
            </p>
            <Link href="/services">
              <Button variant="luxury" size="sm" className="mt-2">
                Discover Services
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
                  <th className="pb-3 px-4">Price</th>
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
                              className="w-12 h-12 rounded-lg object-cover border border-border shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                              SB
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-foreground text-sm leading-tight">
                              {service?.title || "Custom Service"}
                            </p>
                            <span className="text-[11px] text-muted-foreground">
                              {service?.category || "Salon"}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-medium text-foreground">
                          {formatDate(app.appointmentDate)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {app.timeSlot}
                        </div>
                      </td>

                      <td className="py-4 px-4 font-semibold text-foreground whitespace-nowrap">
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
                          <Button variant="outline" size="sm" className="h-8 text-xs">
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