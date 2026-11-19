"use client";

import React, { useEffect, useState, useMemo } from "react";
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
  Scissors,
  Sparkles,
  User,
  ShieldCheck,
  RefreshCw,
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
import { SafeImage } from "@/components/ui/SafeImage";

type FilterTab = "all" | "pending" | "confirmed" | "cancelled";

export default function CustomerAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  // Cancellation modal state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState<Appointment | null>(null);
  const [cancelling, setCancelling] = useState(false);

  // Stripe Checkout loading state
  const [payingAppointmentId, setPayingAppointmentId] = useState<string | null>(null);

  const fetchAppointments = async () => {
    try {
      setRefreshing(true);
      const res = await api.get<ApiResponse<Appointment[]>>("/appointments/my");
      if (res.data.success) {
        setAppointments(res.data.data);
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || "Could not retrieve appointments.");
    } finally {
      setLoading(false);
      setRefreshing(false);
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
      toast.info("Connecting to Stripe 256-bit secure checkout...");

      const res = await api.post<ApiResponse<{ url: string }>>(
        "/payments/create-checkout-session",
        {
          appointmentId: appointment._id,
        }
      );

      if (res.data.success && res.data.data.url) {
        window.location.href = res.data.data.url;
      } else {
        toast.error("Could not generate Stripe payment session.");
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || "Payment initiation failed.");
    } finally {
      setPayingAppointmentId(null);
    }
  };

  const filteredAppointments = useMemo(() => {
    if (activeTab === "all") return appointments;
    return appointments.filter((a) => a.status === activeTab);
  }, [appointments, activeTab]);

  const counts = {
    all: appointments.length,
    pending: appointments.filter((a) => a.status === "pending").length,
    confirmed: appointments.filter((a) => a.status === "confirmed").length,
    cancelled: appointments.filter((a) => a.status === "cancelled").length,
  };

  return (
    <div className="space-y-8">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-border/80">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-[11px] uppercase tracking-[0.25em] text-accent font-bold">
              Chair Bookings
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            My Appointments
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
            Review status of requested chair sessions, complete Stripe checkout once confirmed, and manage your beauty schedule.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAppointments}
            disabled={refreshing}
            className="rounded-xl text-xs font-semibold gap-2 border-border hover:bg-muted"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-accent" : ""}`} />
            <span>Refresh</span>
          </Button>

          <Link href="/services">
            <Button
              size="sm"
              className="rounded-xl text-xs font-semibold tracking-wider gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
            >
              <Scissors className="w-3.5 h-3.5 text-accent" />
              <span>Book Treatment</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Status Filter Tabs */}
      <div className="p-3 sm:p-4 rounded-2xl border border-border/80 bg-card shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          {(
            [
              { id: "all", label: "All Bookings", count: counts.all },
              { id: "pending", label: "Pending Review", count: counts.pending },
              { id: "confirmed", label: "Confirmed & Ready", count: counts.confirmed },
              { id: "cancelled", label: "Cancelled", count: counts.cancelled },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-sm font-bold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === tab.id
                    ? "bg-accent/20 text-accent"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Luxury Appointment Cards List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-24 text-center space-y-3 rounded-2xl border border-border bg-card">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent animate-spin rounded-full mx-auto" />
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
              Retrieving Atelier Diary...
            </p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="py-20 text-center space-y-3 max-w-sm mx-auto p-6 rounded-2xl border border-border bg-card">
            <div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto text-muted-foreground">
              <Calendar className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-serif text-xl font-bold text-foreground">
              No Appointments in this Category
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              You do not have any {activeTab !== "all" ? activeTab : ""} reservations at the moment.
            </p>
            <Link href="/services">
              <Button
                size="sm"
                className="mt-2 rounded-xl text-xs bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Scissors className="w-3.5 h-3.5 mr-1 text-accent" /> Reserve a Chair
              </Button>
            </Link>
          </div>
        ) : (
          filteredAppointments.map((app) => {
            const service =
              typeof app.serviceId === "object" ? app.serviceId : null;
            const isPaying = payingAppointmentId === app._id;

            return (
              <div
                key={app._id}
                className="p-6 sm:p-7 rounded-2xl border border-border/80 bg-card hover:border-accent/40 transition-all shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                {/* Left Service Media & Specs */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 min-w-0">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-muted relative shrink-0 border border-border/70 shadow-sm">
                    <SafeImage
                      src={service?.images?.[0] || ""}
                      alt={service?.title || "Treatment"}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                        {service?.category || "Specialty"}
                      </span>
                      <span
                        className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${
                          app.status === "confirmed"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            : app.status === "pending"
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                            : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                        }`}
                      >
                        {app.status === "confirmed"
                          ? "✓ Confirmed"
                          : app.status === "pending"
                          ? "⏳ In Review"
                          : "✕ Cancelled"}
                      </span>
                    </div>

                    <h3 className="font-serif text-lg sm:text-xl font-bold text-foreground">
                      {service?.title || "Bespoke Atelier Treatment"}
                    </h3>

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-accent" />
                        <span className="font-medium text-foreground">{formatDate(app.date || "")}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-accent" />
                        <span>{app.timeSlot}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-accent" />
                        <span>{app.specialist || "Lead Artist"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Price & Actions */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between sm:justify-end gap-4 pt-4 sm:pt-0 border-t sm:border-t-0 border-border/50 shrink-0">
                  <div className="text-left sm:text-right space-y-0.5">
                    <span className="font-serif text-2xl font-bold text-foreground block">
                      {formatCurrency(app.price || 0)}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider block ${
                        app.paymentStatus === "paid"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {app.paymentStatus === "paid" ? "Stripe Paid" : "Unpaid"}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    {/* Pay Now Button (Only if confirmed and unpaid) */}
                    {app.status === "confirmed" && app.paymentStatus !== "paid" && (
                      <Button
                        size="sm"
                        disabled={isPaying}
                        onClick={() => handlePayNow(app)}
                        className="rounded-xl text-xs font-semibold tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-sm"
                      >
                        {isPaying ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Opening Stripe...</span>
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Pay Now with Stripe</span>
                          </>
                        )}
                      </Button>
                    )}

                    {/* Paid Receipt Link */}
                    {app.paymentStatus === "paid" && (
                      <Link href="/dashboard/transactions">
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-xl text-xs font-semibold tracking-wider gap-1.5 border-border hover:bg-muted"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                          <span>View Receipt</span>
                        </Button>
                      </Link>
                    )}

                    {/* Cancel Button (Only if pending) */}
                    {app.status === "pending" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCancelClick(app)}
                        className="rounded-xl text-xs text-rose-600 border-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                      >
                        Cancel Request
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 4. Cancellation Confirmation Dialog */}
      <Dialog open={cancelModalOpen} onOpenChange={setCancelModalOpen}>
        <DialogContent className="max-w-md rounded-2xl border-border bg-card p-6">
          <DialogHeader className="space-y-2">
            <DialogTitle className="font-serif text-xl font-bold text-destructive">
              Cancel Appointment Request?
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you wish to cancel this booking request? The reserved slot will be immediately returned to the atelier public availability diary.
            </DialogDescription>
          </DialogHeader>

          {appointmentToCancel && (
            <div className="p-3.5 rounded-xl border border-border bg-muted/30 text-xs space-y-1">
              <span className="font-semibold text-foreground block">
                {typeof appointmentToCancel.serviceId === "object"
                  ? appointmentToCancel.serviceId?.title
                  : "Treatment"}
              </span>
              <span className="text-muted-foreground block">
                {formatDate(appointmentToCancel.date || "")} at {appointmentToCancel.timeSlot}
              </span>
            </div>
          )}

          <DialogFooter className="pt-4 border-t border-border gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCancelModalOpen(false)}
              className="rounded-xl text-xs border-border"
            >
              Keep Appointment
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={cancelling}
              onClick={confirmCancelAppointment}
              className="rounded-xl text-xs bg-destructive text-destructive-foreground"
            >
              {cancelling ? "Cancelling..." : "Confirm Cancellation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
