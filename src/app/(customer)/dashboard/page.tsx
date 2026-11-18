"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  CreditCard,
} from "lucide-react";
import { api } from "@/lib/api";
import { Appointment, ApiResponse } from "@/types";
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
  const nextAppointment = appointments.find(
    (a) => a.status === "confirmed" || a.status === "pending"
  );
  const recentAppointments = appointments.slice(0, 5);

  return (
    <div className="space-y-10">
      {/* 1. Patron Certificate & Next Scheduled Session */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Editorial Patron Certificate — Warm Parchment & Deep Forest */}
        <div className="lg:col-span-5 border border-[#302821]/20 dark:border-[#EAE3D6]/20 bg-[#EAE3D6] dark:bg-[#1a201c] p-7 text-[#302821] dark:text-[#F5F1E8] flex flex-col justify-between min-h-[220px]">
          <div className="flex items-center justify-between border-b border-[#302821]/15 pb-4">
            <div>
              <span className="font-serif text-xl tracking-[0.2em] uppercase font-normal text-[#26372D] dark:text-[#F5F1E8] block">
                SALONBOOK
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#302821]/60 dark:text-[#EAE3D6]/60">
                Atelier de Haute Beauté
              </span>
            </div>
            <span className="px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] font-semibold bg-[#26372D] text-[#F5F1E8]">
              VERIFIED PATRON
            </span>
          </div>

          <div className="py-5 space-y-1">
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#302821]/60 dark:text-[#EAE3D6]/60 block font-semibold">
              PATRON CERTIFICATE
            </span>
            <h3 className="font-serif text-2xl text-[#302821] dark:text-[#F5F1E8]">
              {user?.name || "Valued Patron"}
            </h3>
            <p className="text-xs text-[#302821]/70 dark:text-[#EAE3D6]/70">{user?.email}</p>
          </div>

          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-[#302821]/60 dark:text-[#EAE3D6]/60 border-t border-[#302821]/15 pt-4">
            <span>MEMBERSHIP: PRIVATE ATELIER</span>
            <span className="text-[#B8755B]">FLAGSHIP SUITE 4</span>
          </div>
        </div>

        {/* Next Scheduled Appointment Spotlight */}
        <div className="lg:col-span-7 border border-[#302821]/15 dark:border-[#EAE3D6]/15 bg-[#EAE3D6]/40 dark:bg-[#1a201c] p-7 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#B8755B] font-semibold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#B8755B]" /> NEXT SCHEDULED TREATMENT
              </span>
              {nextAppointment && (
                <span
                  className={`px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-semibold border ${
                    nextAppointment.status === "confirmed"
                      ? "bg-[#26372D] text-[#F5F1E8] border-[#26372D]"
                      : "bg-[#B8755B]/15 text-[#B8755B] border-[#B8755B]/30"
                  }`}
                >
                  {nextAppointment.status}
                </span>
              )}
            </div>

            {loading ? (
              <div className="py-6 flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-[#26372D] border-t-transparent animate-spin" />
                <span className="text-xs text-[#302821]/60">Checking atelier schedule...</span>
              </div>
            ) : nextAppointment ? (
              <div className="space-y-2">
                <h3 className="font-serif text-2xl text-[#302821] dark:text-[#F5F1E8]">
                  {typeof nextAppointment.serviceId === "object"
                    ? (nextAppointment.serviceId as { title?: string }).title || "Salon Treatment"
                    : "Salon Treatment"}
                </h3>
                <div className="flex flex-wrap items-center gap-5 text-xs text-[#302821]/75 dark:text-[#EAE3D6]/75 pt-1">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#26372D] dark:text-[#A4AA91]" />
                    {formatDate(nextAppointment.appointmentDate || nextAppointment.date || "")}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#26372D] dark:text-[#A4AA91]" />
                    {nextAppointment.timeSlot}
                  </span>
                  <span>•</span>
                  <span className="font-medium text-[#26372D] dark:text-[#F5F1E8]">
                    {formatCurrency(nextAppointment.price || nextAppointment.servicePrice || 0)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="py-4 space-y-1">
                <h3 className="font-serif text-lg text-[#302821] dark:text-[#F5F1E8]">
                  No Upcoming Reservations
                </h3>
                <p className="text-xs text-[#302821]/70 dark:text-[#EAE3D6]/70">
                  You do not have any pending or confirmed appointments in the atelier diary.
                </p>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-[#302821]/10 flex items-center justify-between">
            <Link
              href="/dashboard/appointments"
              className="text-xs uppercase tracking-wider text-[#26372D] dark:text-[#B8755B] font-semibold hover:underline flex items-center gap-1"
            >
              Review All Reservations <ArrowRight className="w-3 h-3" />
            </Link>
            <Link href="/services">
              <Button
                variant="outline"
                size="sm"
                className="rounded-none text-[10px] uppercase tracking-wider border-[#302821]/20"
              >
                Reserve Treatment
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Grid: Architectural Hairline Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 border border-[#302821]/15 dark:border-[#EAE3D6]/15 bg-[#EAE3D6]/30 dark:bg-[#1a201c] space-y-2">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#302821]/60 dark:text-[#EAE3D6]/60 font-semibold block">
            TOTAL RESERVATIONS
          </span>
          <div className="font-serif text-3xl text-[#26372D] dark:text-[#F5F1E8]">
            {totalAppointments}
          </div>
          <p className="text-[11px] text-[#302821]/60 dark:text-[#EAE3D6]/60">
            Recorded in your client ledger
          </p>
        </div>

        <div className="p-6 border border-[#302821]/15 dark:border-[#EAE3D6]/15 bg-[#EAE3D6]/30 dark:bg-[#1a201c] space-y-2">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#302821]/60 dark:text-[#EAE3D6]/60 font-semibold block">
            CONFIRMED SESSIONS
          </span>
          <div className="font-serif text-3xl text-[#26372D] dark:text-[#F5F1E8]">
            {confirmedAppointments}
          </div>
          <p className="text-[11px] text-[#302821]/60 dark:text-[#EAE3D6]/60">
            Active chairs locked on schedule
          </p>
        </div>

        <div className="p-6 border border-[#302821]/15 dark:border-[#EAE3D6]/15 bg-[#EAE3D6]/30 dark:bg-[#1a201c] space-y-2">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#302821]/60 dark:text-[#EAE3D6]/60 font-semibold block">
            PENDING REQUESTS
          </span>
          <div className="font-serif text-3xl text-[#B8755B]">
            {pendingAppointments}
          </div>
          <p className="text-[11px] text-[#302821]/60 dark:text-[#EAE3D6]/60">
            Awaiting master review
          </p>
        </div>

        <div className="p-6 border border-[#302821]/15 dark:border-[#EAE3D6]/15 bg-[#EAE3D6]/30 dark:bg-[#1a201c] space-y-2">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#302821]/60 dark:text-[#EAE3D6]/60 font-semibold block">
            STRIPE SSL GATEWAY
          </span>
          <div className="font-serif text-3xl text-[#26372D] dark:text-[#F5F1E8] flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-[#26372D] dark:text-[#A4AA91]" />
            <span>Active</span>
          </div>
          <p className="text-[11px] text-[#302821]/60 dark:text-[#EAE3D6]/60">
            Direct card encryption
          </p>
        </div>
      </div>

      {/* 3. Recent Reservations Table */}
      <div className="border border-[#302821]/15 dark:border-[#EAE3D6]/15 bg-[#EAE3D6]/30 dark:bg-[#1a201c] p-7 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#B8755B] font-semibold block">
              DIARY ACTIVITY
            </span>
            <h3 className="font-serif text-2xl text-[#302821] dark:text-[#F5F1E8]">
              Recent Atelier Bookings
            </h3>
          </div>
          <Link href="/dashboard/appointments">
            <Button
              variant="outline"
              size="sm"
              className="rounded-none text-[10px] uppercase tracking-wider border-[#302821]/20"
            >
              View Full Diary
            </Button>
          </Link>
        </div>

        {recentAppointments.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#302821]/60">
            No booking records found in your profile history.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#302821]/15 text-[#302821]/60 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="pb-3 pr-4">Treatment</th>
                  <th className="pb-3 px-4">Date</th>
                  <th className="pb-3 px-4">Slot</th>
                  <th className="pb-3 px-4">Fee</th>
                  <th className="pb-3 px-4">Status</th>
                  <th className="pb-3 pl-4 text-right">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#302821]/10">
                {recentAppointments.map((app) => (
                  <tr key={app._id} className="hover:bg-[#EAE3D6]/60 transition-colors">
                    <td className="py-3.5 pr-4 font-medium text-[#302821] dark:text-[#F5F1E8]">
                      {typeof app.serviceId === "object"
                        ? (app.serviceId as { title?: string }).title || "Salon Treatment"
                        : "Salon Treatment"}
                    </td>
                    <td className="py-3.5 px-4 text-[#302821]/70 dark:text-[#EAE3D6]/70">
                      {formatDate(app.appointmentDate || app.date || "")}
                    </td>
                    <td className="py-3.5 px-4 text-[#302821]/70 dark:text-[#EAE3D6]/70">
                      {app.timeSlot}
                    </td>
                    <td className="py-3.5 px-4 font-serif text-[#26372D] dark:text-[#F5F1E8]">
                      {formatCurrency(app.price || app.servicePrice || 0)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 border border-[#302821]/20">
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3.5 pl-4 text-right">
                      <span
                        className={`text-[10px] uppercase tracking-wider px-2 py-0.5 ${
                          app.paymentStatus === "paid"
                            ? "bg-[#26372D] text-[#F5F1E8]"
                            : "bg-[#EAE3D6] text-[#302821] border border-[#302821]/20"
                        }`}
                      >
                        {app.paymentStatus || "Unpaid"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
