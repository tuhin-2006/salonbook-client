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
      toast.error("Only pending appointments can be cancelled.");
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
        toast.success("Appointment has been cancelled successfully.");
        // Refresh local list
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
        toast.error("Could not initialize Stripe Checkout session.");
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || "Payment initialization failed.");
    } finally {
      setPayingAppointmentId(null);
    }
  };

  // Filtered list
  const filteredAppointments = appointments.filter((app) => {
    if (activeTab === "all") return true;
    return app.status === activeTab;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 border border-emerald-600/30 gap-1 capitalize">
            <CheckCircle2 className="w-3 h-3" />
            Confirmed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="destructive" className="gap-1 capitalize">
            <XCircle className="w-3 h-3" />
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="bg-gold-500/10 text-gold-700 dark:text-gold-400 border border-gold-500/30 gap-1 capitalize">
            <Clock className="w-3 h-3" />
            Pending
          </Badge>
        );
    }
  };

  const getPaymentBadge = (paymentStatus?: string) => {
    if (paymentStatus === "paid") {
      return (
        <Badge className="bg-emerald-600 text-white gap-1 text-[10px] uppercase font-semibold">
          <CheckCircle2 className="w-3 h-3" />
          Paid
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-muted-foreground text-[10px] uppercase font-semibold">
        Unpaid
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-foreground">
            My Appointments
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your booked salon rituals, complete pending payments, or cancel scheduled visits.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="inline-flex items-center p-1 rounded-xl bg-card border border-border text-xs">
          {(["all", "pending", "confirmed", "cancelled"] as FilterTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${
                activeTab === tab
                  ? "bg-primary text-white shadow-sm font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table / List */}
      <div className="bg-card rounded-2xl border border-border/70 p-6 sm:p-8">
        {loading ? (
          <div className="py-20 text-center text-muted-foreground text-sm space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
            <p>Loading your appointments...</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="py-16 text-center space-y-4 max-w-sm mx-auto">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-lg font-semibold text-foreground">
              No {activeTab !== "all" ? activeTab : ""} Appointments
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {activeTab === "all"
                ? "You haven't requested any salon appointments yet."
                : `You currently have no ${activeTab} appointments in your salon schedule.`}
            </p>
            <Link href="/services">
              <Button variant="luxury" size="sm" className="mt-2">
                Browse Services Catalog
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
                  <th className="pb-3 px-4">Payment</th>
                  <th className="pb-3 pl-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredAppointments.map((app) => {
                  const service = app.serviceId;
                  const isPending = app.status === "pending";
                  const isConfirmed = app.status === "confirmed";
                  const isUnpaid = (app as unknown as { paymentStatus?: string }).paymentStatus !== "paid";
                  const canPayNow = isConfirmed && isUnpaid;

                  return (
                    <tr key={app._id} className="hover:bg-muted/40 transition-colors">
                      {/* Service Info */}
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-3">
                          {service?.images?.[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={service.images[0]}
                              alt={service.title}
                              className="w-14 h-14 rounded-lg object-cover border border-border shrink-0"
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                              SB
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-foreground text-sm leading-tight">
                              {service?.title || "Bespoke Treatment"}
                            </p>
                            <span className="text-[11px] text-muted-foreground">
                              {service?.category || "Salon"} · {service?.durationMinutes || 60} mins
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Date & Time */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-medium text-foreground">
                          {formatDate(app.appointmentDate)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {app.timeSlot}
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-4 font-semibold text-foreground whitespace-nowrap">
                        {formatCurrency(service?.price || 0)}
                      </td>

                      {/* Booking Status Badge */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {getStatusBadge(app.status)}
                      </td>

                      {/* Payment Status Badge */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {getPaymentBadge((app as unknown as { paymentStatus?: string }).paymentStatus)}
                      </td>

                      {/* Actions */}
                      <td className="py-4 pl-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          {/* Pay Now Button (Only enabled on Confirmed + Unpaid) */}
                          {canPayNow && (
                            <Button
                              variant="luxury"
                              size="sm"
                              className="h-8 text-xs gap-1.5"
                              onClick={() => handlePayNow(app)}
                              disabled={payingAppointmentId === app._id}
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              {payingAppointmentId === app._id ? "Connecting..." : "Pay Now"}
                            </Button>
                          )}

                          {/* Cancel Button (Only allowed on Pending) */}
                          {isPending && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
                              onClick={() => handleCancelClick(app)}
                            >
                              Cancel
                            </Button>
                          )}

                          {/* Completed or already paid indicator */}
                          {isConfirmed && !isUnpaid && (
                            <span className="text-xs text-emerald-600 font-medium">
                              Ready for Visit
                            </span>
                          )}

                          {app.status === "cancelled" && (
                            <span className="text-xs text-muted-foreground italic">
                              Closed
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelModalOpen} onOpenChange={setCancelModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">
              Cancel Appointment Request?
            </DialogTitle>
            <DialogDescription className="text-xs leading-relaxed pt-2">
              Are you sure you want to cancel your appointment for{" "}
              <strong className="text-foreground">
                {appointmentToCancel?.serviceId?.title}
              </strong>{" "}
              on {formatDate(appointmentToCancel?.appointmentDate || "")} at{" "}
              {appointmentToCancel?.timeSlot}? This action cannot be reversed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCancelModalOpen(false)}
              disabled={cancelling}
            >
              Keep Booking
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={confirmCancelAppointment}
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