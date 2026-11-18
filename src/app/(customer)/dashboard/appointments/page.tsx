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
  Sparkles,
  ArrowRight,
  Filter,
  Loader2,
  ShieldCheck,
  Scissors,
} from "lucide-react";
import { api } from "@/lib/api";
import { Appointment, ApiResponse } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 capitalize">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Confirmed
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-destructive/10 text-destructive border border-destructive/20 capitalize">
            <XCircle className="w-3.5 h-3.5" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 capitalize">
            <Clock className="w-3.5 h-3.5" />
            Pending
          </span>
        );
    }
  };

  const getPaymentBadge = (paymentStatus?: string) => {
    if (paymentStatus === "paid") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-emerald-600 text-white">
          <CheckCircle2 className="w-3 h-3" /> Paid
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-secondary text-muted-foreground border border-border">
        Unpaid
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header & Tab Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
            My Appointments
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your booked treatments, cancel pending requests, or pay with Stripe when confirmed.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="inline-flex items-center p-1 rounded-xl bg-card border border-border text-xs self-start sm:self-auto">
          {(["all", "pending", "confirmed", "cancelled"] as FilterTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg capitalize font-bold transition-all ${
                activeTab === tab
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Appointment Cards */}
      {loading ? (
        <div className="py-20 text-center space-y-3 bg-card rounded-2xl border border-border">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-muted-foreground font-semibold">
            Loading your appointments...
          </p>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-card rounded-2xl border border-dashed border-border p-8 max-w-md mx-auto">
          <Scissors className="w-8 h-8 text-muted-foreground mx-auto opacity-50" />
          <h3 className="text-base font-bold text-foreground">
            No Appointments Found
          </h3>
          <p className="text-xs text-muted-foreground">
            {activeTab === "all"
              ? "You haven't made any appointments yet."
              : `You have no ${activeTab} appointments at this time.`}
          </p>
          <Link href="/services">
            <Button variant="gradient" size="sm" className="text-xs font-bold rounded-xl mt-2">
              Browse Services
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((app) => {
            const service =
              typeof app.serviceId === "object" ? app.serviceId : null;
            const serviceTitle = service?.title || "Salon Service";
            const serviceCategory = service?.category || "Beauty";
            const serviceDuration = service?.durationMinutes || 60;

            const isPending = app.status === "pending";
            const isConfirmed = app.status === "confirmed";
            const isUnpaid = app.paymentStatus === "unpaid" || !app.paymentStatus;
            const canPay = isConfirmed && isUnpaid;
            const canCancel = isPending;

            return (
              <div
                key={app._id}
                className="bg-card rounded-2xl border border-border p-5 sm:p-6 shadow-sm hover:border-primary/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Left: Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-secondary text-muted-foreground border border-border">
                      {serviceCategory}
                    </span>
                    {getStatusBadge(app.status)}
                    {getPaymentBadge(app.paymentStatus)}
                  </div>

                  <h3 className="text-lg font-bold text-foreground">
                    {serviceTitle}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1 font-semibold text-foreground">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      {formatDate(app.appointmentDate || app.date || "")}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      {app.timeSlot} ({serviceDuration} mins)
                    </span>
                    <span>•</span>
                    <span className="text-foreground font-black text-sm">
                      {formatCurrency(app.price || app.servicePrice || service?.price || 0)}
                    </span>
                  </div>

                  {app.specialist && (
                    <p className="text-xs text-muted-foreground">
                      Assigned Stylist:{" "}
                      <span className="font-semibold text-foreground">
                        {app.specialist}
                      </span>
                    </p>
                  )}
                </div>

                {/* Right: Actions */}
                <div className="flex flex-wrap items-center gap-2.5 pt-3 md:pt-0 border-t md:border-t-0 border-border">
                  {canPay && (
                    <Button
                      variant="gradient"
                      size="sm"
                      onClick={() => handlePayNow(app)}
                      disabled={payingAppointmentId === app._id}
                      className="gap-1.5 text-xs font-bold rounded-xl h-10 px-4"
                    >
                      {payingAppointmentId === app._id ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Connecting Stripe...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-3.5 h-3.5" />
                          Pay with Stripe
                        </>
                      )}
                    </Button>
                  )}

                  {canCancel && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancelClick(app)}
                      className="text-xs font-bold rounded-xl h-10 px-4 text-destructive hover:bg-destructive/10 hover:border-destructive/30"
                    >
                      Cancel Request
                    </Button>
                  )}

                  {!canPay && !canCancel && (
                    <span className="text-xs text-muted-foreground italic">
                      {app.status === "cancelled"
                        ? "Reservation cancelled"
                        : "Paid & scheduled"}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancellation Confirmation Dialog */}
      <Dialog open={cancelModalOpen} onOpenChange={setCancelModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              Cancel Appointment Request?
            </DialogTitle>
            <DialogDescription className="text-xs leading-relaxed text-muted-foreground">
              Are you sure you want to cancel your appointment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {appointmentToCancel && (
            <div className="p-4 rounded-xl bg-secondary/50 border border-border text-xs space-y-1">
              <p className="font-bold text-foreground">
                {typeof appointmentToCancel.serviceId === "object"
                  ? (appointmentToCancel.serviceId as { title?: string }).title
                  : "Salon Treatment"}
              </p>
              <p className="text-muted-foreground">
                Date: {formatDate(appointmentToCancel.appointmentDate || appointmentToCancel.date || "")} at {appointmentToCancel.timeSlot}
              </p>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCancelModalOpen(false)}
              disabled={cancelling}
              className="rounded-xl text-xs"
            >
              Keep Booking
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={confirmCancelAppointment}
              disabled={cancelling}
              className="rounded-xl text-xs gap-1.5"
            >
              {cancelling ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Yes, Cancel Appointment"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
