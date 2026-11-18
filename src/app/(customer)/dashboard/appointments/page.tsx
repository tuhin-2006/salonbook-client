"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  CreditCard,
  AlertCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { api } from "@/lib/api";
import { Appointment, ApiResponse } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";

type FilterTab = "all" | "pending" | "confirmed" | "cancelled";

export default function CustomerAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  // Cancellation modal state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState<Appointment | null>(null);
  const [cancelling, setCancelling] = useState(false);

  // Payment loading state
  const [payingAppointmentId, setPayingAppointmentId] = useState<string | null>(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get<ApiResponse<Appointment[]>>("/appointments/my");
      if (res.data.success) {
        setAppointments(res.data.data);
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || "Could not retrieve appointments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancelClick = (appointment: Appointment) => {
    if (appointment.status !== "pending") {
      toast.error("Only pending appointment requests can be cancelled.");
      return;
    }
    setAppointmentToCancel(appointment);
    setCancelModalOpen(true);
  };

  const confirmCancelAppointment = async () => {
    if (!appointmentToCancel) return;

    try {
      setCancelling(true);
      const res = await api.patch<ApiResponse<Appointment>>(
        `/appointments/${appointmentToCancel._id}/cancel`
      );

      if (res.data.success) {
        toast.success("Appointment request cancelled.");
        setAppointments((prev) =>
          prev.map((app) =>
            app._id === appointmentToCancel._id
              ? { ...app, status: "cancelled", cancelledAt: new Date().toISOString() }
              : app
          )
        );
        setCancelModalOpen(false);
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || "Cancellation failed.");
    } finally {
      setCancelling(false);
      setAppointmentToCancel(null);
    }
  };

  const handlePayNow = async (appointment: Appointment) => {
    try {
      setPayingAppointmentId(appointment._id);
      const res = await api.post<ApiResponse<{ checkoutUrl: string }>>(
        "/payments/create-checkout-session",
        { appointmentId: appointment._id }
      );

      if (res.data.success && res.data.data.checkoutUrl) {
        toast.info("Redirecting to secure Stripe Checkout...");
        window.location.href = res.data.data.checkoutUrl;
      } else {
        toast.error("Could not generate Stripe Checkout session.");
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || "Payment initialization failed.");
    } finally {
      setPayingAppointmentId(null);
    }
  };

  const filteredAppointments = appointments.filter((app) => {
    if (activeTab === "all") return true;
    return app.status === activeTab;
  });

  return (
    <div className="space-y-8">
      {/* Header & Tab Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 pb-6 border-b border-[#302821]/15">
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#B8755B] font-semibold block">
            ATELIER DIARY
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#302821] dark:text-[#F5F1E8]">
            My Reservations
          </h2>
          <p className="text-xs text-[#302821]/70 dark:text-[#EAE3D6]/70 max-w-lg leading-relaxed">
            Review status of booked chairs. Pending requests can be cancelled; confirmed sessions unlock direct Stripe checkout.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1 border border-[#302821]/15 bg-[#EAE3D6]/40 p-1 self-start sm:self-auto">
          {(["all", "pending", "confirmed", "cancelled"] as FilterTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 text-[10px] uppercase tracking-[0.16em] font-medium transition-all ${
                activeTab === tab
                  ? "bg-[#26372D] text-[#F5F1E8]"
                  : "text-[#302821]/70 dark:text-[#EAE3D6]/70 hover:text-[#302821]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      {loading ? (
        <div className="py-24 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#26372D] border-t-transparent animate-spin mx-auto" />
          <p className="text-xs uppercase tracking-wider text-[#302821]/60">
            Accessing Appointment Records...
          </p>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="py-20 border border-dashed border-[#302821]/20 bg-[#EAE3D6]/30 text-center space-y-4 max-w-md mx-auto p-8">
          <h3 className="font-serif text-xl text-[#302821] dark:text-[#F5F1E8]">
            No Reservations Found
          </h3>
          <p className="text-xs text-[#302821]/70 leading-relaxed">
            There are no {activeTab !== "all" ? activeTab : ""} appointments in your client ledger.
          </p>
          <Link href="/services">
            <Button
              variant="default"
              size="sm"
              className="rounded-none text-xs uppercase tracking-wider bg-[#26372D] text-[#F5F1E8]"
            >
              Explore Carte
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredAppointments.map((app) => {
            const serviceTitle =
              typeof app.serviceId === "object"
                ? (app.serviceId as { title?: string }).title || "Salon Treatment"
                : "Salon Treatment";

            const canPay = app.status === "confirmed" && app.paymentStatus !== "paid";
            const canCancel = app.status === "pending";

            return (
              <div
                key={app._id}
                className="border border-[#302821]/15 dark:border-[#EAE3D6]/15 bg-[#EAE3D6]/30 dark:bg-[#1a201c] p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#26372D] transition-colors"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`text-[9px] uppercase tracking-[0.2em] font-semibold px-2 py-0.5 border ${
                        app.status === "confirmed"
                          ? "bg-[#26372D] text-[#F5F1E8] border-[#26372D]"
                          : app.status === "cancelled"
                          ? "bg-red-500/10 text-red-700 border-red-500/30"
                          : "bg-[#B8755B]/15 text-[#B8755B] border-[#B8755B]/30"
                      }`}
                    >
                      {app.status}
                    </span>

                    <span
                      className={`text-[9px] uppercase tracking-[0.2em] font-semibold px-2 py-0.5 border ${
                        app.paymentStatus === "paid"
                          ? "bg-emerald-600/15 text-emerald-800 dark:text-emerald-400 border-emerald-600/30"
                          : "bg-transparent text-[#302821]/60 border-[#302821]/20"
                      }`}
                    >
                      {app.paymentStatus === "paid" ? "PAID VIA STRIPE" : "UNPAID"}
                    </span>

                    <span className="text-[10px] uppercase tracking-wider text-[#302821]/50">
                      REF: {app._id.slice(-8)}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl text-[#302821] dark:text-[#F5F1E8]">
                    {serviceTitle}
                  </h3>

                  <div className="flex flex-wrap items-center gap-5 text-xs text-[#302821]/70 dark:text-[#EAE3D6]/70">
                    <span className="flex items-center gap-1.5 font-medium text-[#302821] dark:text-[#F5F1E8]">
                      <Calendar className="w-3.5 h-3.5 text-[#26372D] dark:text-[#A4AA91]" />
                      {formatDate(app.appointmentDate || app.date || "")}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#26372D] dark:text-[#A4AA91]" />
                      {app.timeSlot}
                    </span>
                    {app.specialist && (
                      <span>SPECIALIST: {app.specialist}</span>
                    )}
                  </div>

                  {app.notes && (
                    <p className="text-xs text-[#302821]/60 italic pt-1">
                      Note: &ldquo;{app.notes}&rdquo;
                    </p>
                  )}
                </div>

                {/* Right Action Block */}
                <div className="flex flex-col md:items-end justify-between gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-[#302821]/10">
                  <div className="md:text-right">
                    <span className="text-[9px] uppercase tracking-wider text-[#302821]/60 block">
                      TREATMENT FEE
                    </span>
                    <span className="font-serif text-2xl font-medium text-[#26372D] dark:text-[#F5F1E8]">
                      {formatCurrency(app.price || app.servicePrice || 0)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {/* Pay Now Button (Only on confirmed + unpaid) */}
                    {canPay && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handlePayNow(app)}
                        disabled={payingAppointmentId === app._id}
                        className="rounded-none text-xs uppercase tracking-wider px-5 bg-[#26372D] text-[#F5F1E8] hover:bg-[#343D2E]"
                      >
                        {payingAppointmentId === app._id ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                            <span>STRIPE...</span>
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-3.5 h-3.5 mr-1.5" />
                            <span>PAY VIA STRIPE</span>
                          </>
                        )}
                      </Button>
                    )}

                    {/* Cancel Button (Only on pending) */}
                    {canCancel && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelClick(app)}
                        className="rounded-none text-xs uppercase tracking-wider border-red-300 text-red-700 hover:bg-red-50"
                      >
                        CANCEL REQUEST
                      </Button>
                    )}

                    {/* Paid confirmation label */}
                    {app.paymentStatus === "paid" && (
                      <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Receipt Verified</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancellation Confirmation Dialog */}
      <Dialog open={cancelModalOpen} onOpenChange={setCancelModalOpen}>
        <DialogContent className="max-w-md bg-[#F5F1E8] border-[#302821]/20 p-6 rounded-none">
          <DialogHeader className="space-y-2">
            <DialogTitle className="font-serif text-2xl text-[#302821]">
              Cancel Appointment Request?
            </DialogTitle>
            <DialogDescription className="text-xs text-[#302821]/70 leading-relaxed">
              Are you sure you wish to cancel this pending appointment request? Once cancelled, this reservation slot will be released back to the atelier schedule.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-4 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCancelModalOpen(false)}
              className="rounded-none text-xs uppercase tracking-wider border-[#302821]/20"
              disabled={cancelling}
            >
              Keep Booking
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={confirmCancelAppointment}
              className="rounded-none text-xs uppercase tracking-wider bg-red-700 text-white hover:bg-red-800"
              disabled={cancelling}
            >
              {cancelling ? "Cancelling..." : "Confirm Cancellation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
