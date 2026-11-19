"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Eye,
  Check,
  X,
  CreditCard,
  User,
  ShieldCheck,
  AlertCircle,
  Scissors,
  Phone,
  Mail,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { api } from "@/lib/api";
import { Appointment, ApiResponse } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { formatCurrency, formatDate, getInitials } from "@/lib/utils";
import { toast } from "sonner";

type StatusTab = "all" | "pending" | "confirmed" | "cancelled";

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Search & Filter
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusTab>("all");

  // Details Modal
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  // Status updating loader ID
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchAppointments = async () => {
    try {
      setRefreshing(true);
      const res = await api.get<ApiResponse<{ appointments: Appointment[] }>>(
        "/appointments?limit=100"
      );
      if (res.data.success) {
        setAppointments(res.data.data.appointments);
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to load appointments");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Confirm appointment
  const handleConfirm = async (appointmentId: string) => {
    try {
      setActionLoadingId(appointmentId);
      const res = await api.patch<ApiResponse<Appointment>>(
        `/appointments/${appointmentId}/status`,
        { status: "confirmed" }
      );
      if (res.data.success) {
        toast.success("Reservation confirmed. Guest checkout is now unlocked.");
        setAppointments((prev) =>
          prev.map((app) =>
            app._id === appointmentId ? { ...app, status: "confirmed" } : app
          )
        );
        if (selectedAppointment?._id === appointmentId) {
          setSelectedAppointment((prev) => (prev ? { ...prev, status: "confirmed" } : null));
        }
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || "Confirmation failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Cancel appointment
  const handleCancel = async (appointmentId: string) => {
    try {
      setActionLoadingId(appointmentId);
      const res = await api.patch<ApiResponse<Appointment>>(
        `/appointments/${appointmentId}/cancel`
      );
      if (res.data.success) {
        toast.info("Appointment reservation cancelled and released.");
        setAppointments((prev) =>
          prev.map((app) =>
            app._id === appointmentId
              ? { ...app, status: "cancelled", cancelledAt: new Date().toISOString() }
              : app
          )
        );
        if (selectedAppointment?._id === appointmentId) {
          setSelectedAppointment((prev) =>
            prev ? { ...prev, status: "cancelled", cancelledAt: new Date().toISOString() } : null
          );
        }
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || "Cancellation failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredAppointments = useMemo(() => {
    return appointments.filter((app) => {
      const customer = typeof app.customerId === "object" ? app.customerId : null;
      const service = typeof app.serviceId === "object" ? app.serviceId : null;

      const customerName = customer?.name?.toLowerCase() || "";
      const customerEmail = customer?.email?.toLowerCase() || "";
      const serviceTitle = service?.title?.toLowerCase() || "";
      const specialist = app.specialist?.toLowerCase() || "";
      const q = search.toLowerCase();

      const matchesSearch =
        !search ||
        customerName.includes(q) ||
        customerEmail.includes(q) ||
        serviceTitle.includes(q) ||
        specialist.includes(q);

      const matchesStatus =
        statusFilter === "all" ? true : app.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [appointments, search, statusFilter]);

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
              Diary Operations
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Reservation Diary
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
            Review guest bookings, confirm chair reservations to unlock Stripe checkout, and manage artist schedules.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchAppointments}
          disabled={refreshing}
          className="rounded-xl text-xs font-semibold gap-2 border-border hover:bg-muted self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-accent" : ""}`} />
          <span>Refresh Diary</span>
        </Button>
      </div>

      {/* 2. Search & Tab Filter Bar */}
      <div className="p-4 sm:p-5 rounded-2xl border border-border/80 bg-card space-y-4 shadow-sm">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
            {(
              [
                { id: "all", label: "All Reservations", count: counts.all },
                { id: "pending", label: "Pending", count: counts.pending, color: "text-amber-500" },
                { id: "confirmed", label: "Confirmed", count: counts.confirmed, color: "text-emerald-500" },
                { id: "cancelled", label: "Cancelled", count: counts.cancelled, color: "text-rose-500" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all whitespace-nowrap flex items-center gap-2 ${
                  statusFilter === tab.id
                    ? "bg-primary text-primary-foreground shadow-sm font-bold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    statusFilter === tab.id
                      ? "bg-accent/20 text-accent"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search patron, artist, or service..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-10 text-xs rounded-xl border-border bg-background text-foreground"
            />
          </div>
        </div>
      </div>

      {/* 3. Luxury Appointments Table */}
      <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent animate-spin rounded-full mx-auto" />
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
              Loading Atelier Diary...
            </p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="py-20 text-center space-y-3 max-w-sm mx-auto p-4">
            <div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto text-muted-foreground">
              <Calendar className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-serif text-xl font-bold text-foreground">
              No Appointments Found
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              No booking records correspond with your selected filter criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full min-w-[850px] text-left text-xs">
              <thead>
                <tr className="border-b border-border/70 bg-muted/30 text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-4 px-6">Patron &amp; Contact</th>
                  <th className="py-4 px-4">Treatment</th>
                  <th className="py-4 px-4">Session Date &amp; Time</th>
                  <th className="py-4 px-4">Specialist</th>
                  <th className="py-4 px-4">Total</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredAppointments.map((app) => {
                  const customer =
                    typeof app.customerId === "object" ? app.customerId : null;
                  const service =
                    typeof app.serviceId === "object" ? app.serviceId : null;
                  const isActing = actionLoadingId === app._id;

                  return (
                    <tr
                      key={app._id}
                      className="hover:bg-muted/40 transition-colors group"
                    >
                      {/* Patron Column */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-accent/20 text-accent font-serif font-bold text-xs flex items-center justify-center shrink-0 border border-accent/30">
                            {getInitials(customer?.name || "Patron")}
                          </div>
                          <div className="space-y-0.5">
                            <span className="font-semibold text-foreground block">
                              {customer?.name || "Guest Patron"}
                            </span>
                            <span className="text-[11px] text-muted-foreground block">
                              {customer?.email || "No email available"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Treatment Column */}
                      <td className="py-4 px-4">
                        <div className="space-y-0.5 max-w-xs">
                          <span className="font-serif text-sm font-bold text-foreground block truncate">
                            {service?.title || "Custom Treatment"}
                          </span>
                          <span className="text-[10px] uppercase tracking-wider text-accent font-semibold block">
                            {service?.category || "Atelier Ritual"}
                          </span>
                        </div>
                      </td>

                      {/* Date & Time Column */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-foreground font-medium">
                            <Calendar className="w-3.5 h-3.5 text-accent" />
                            <span>{formatDate(app.date || "")}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
                            <Clock className="w-3 h-3" />
                            <span>{app.timeSlot}</span>
                          </div>
                        </div>
                      </td>

                      {/* Specialist Column */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="text-xs text-foreground font-medium">
                          {app.specialist || "Lead Atelier Artist"}
                        </span>
                      </td>

                      {/* Price Column */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="space-y-0.5">
                          <span className="font-serif text-sm font-bold text-foreground block">
                            {formatCurrency(app.price || 0)}
                          </span>
                          <span
                            className={`text-[9px] uppercase tracking-wider font-bold block ${
                              app.paymentStatus === "paid"
                                ? "text-emerald-500"
                                : "text-amber-500"
                            }`}
                          >
                            {app.paymentStatus === "paid" ? "Paid (Stripe)" : "Unpaid"}
                          </span>
                        </div>
                      </td>

                      {/* Status Column */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            app.status === "confirmed"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                              : app.status === "pending"
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                              : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                          }`}
                        >
                          {app.status === "confirmed" ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : app.status === "pending" ? (
                            <Clock className="w-3 h-3" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}
                          <span>{app.status}</span>
                        </span>
                      </td>

                      {/* Actions Column */}
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick Confirm */}
                          {app.status === "pending" && (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={isActing}
                              onClick={() => handleConfirm(app._id)}
                              className="h-8 px-2.5 rounded-lg border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 gap-1 text-[11px]"
                              title="Confirm Reservation"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Confirm</span>
                            </Button>
                          )}

                          {/* Quick Cancel */}
                          {app.status === "pending" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              disabled={isActing}
                              onClick={() => handleCancel(app._id)}
                              className="h-8 px-2.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 gap-1 text-[11px]"
                              title="Cancel Reservation"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Cancel</span>
                            </Button>
                          )}

                          {/* Inspect Details */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedAppointment(app);
                              setDetailsModalOpen(true);
                            }}
                            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                            title="Inspect Reservation"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
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

      {/* 4. Details Deep-Dive Dialog */}
      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="max-w-lg rounded-2xl border-border bg-card p-6 sm:p-8">
          <DialogHeader className="space-y-1 pb-4 border-b border-border">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.25em] text-accent font-bold">
                Reservation Dossier
              </span>
              <span
                className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${
                  selectedAppointment?.status === "confirmed"
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                    : selectedAppointment?.status === "pending"
                    ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                    : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                }`}
              >
                {selectedAppointment?.status}
              </span>
            </div>
            <DialogTitle className="font-serif text-2xl font-bold text-foreground">
              Booking Details
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Reference ID: {selectedAppointment?._id}
            </DialogDescription>
          </DialogHeader>

          {selectedAppointment && (
            <div className="space-y-5 pt-3 text-xs">
              {/* Patron Info Card */}
              <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block">
                  Patron Information
                </span>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-accent/20 text-accent font-serif font-bold flex items-center justify-center">
                      {getInitials(
                        typeof selectedAppointment.customerId === "object"
                          ? selectedAppointment.customerId?.name || "Patron"
                          : "Patron"
                      )}
                    </div>
                    <div>
                      <span className="font-semibold text-foreground block">
                        {typeof selectedAppointment.customerId === "object"
                          ? selectedAppointment.customerId?.name
                          : "Guest Patron"}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {typeof selectedAppointment.customerId === "object"
                          ? selectedAppointment.customerId?.email
                          : "No email provided"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Treatment & Time Specs */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                    Service
                  </span>
                  <span className="font-serif text-sm font-bold text-foreground block truncate">
                    {typeof selectedAppointment.serviceId === "object"
                      ? selectedAppointment.serviceId?.title
                      : "Salon Treatment"}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                    Scheduled Chair Time
                  </span>
                  <span className="font-semibold text-foreground block">
                    {formatDate(selectedAppointment.date || "")} @ {selectedAppointment.timeSlot}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                    Assigned Artist
                  </span>
                  <span className="font-semibold text-foreground block">
                    {selectedAppointment.specialist || "Master Stylist"}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                    Fee &amp; Payment
                  </span>
                  <span className="font-serif text-sm font-bold text-foreground block">
                    {formatCurrency(selectedAppointment.price || 0)} ({selectedAppointment.paymentStatus})
                  </span>
                </div>
              </div>

              {/* Actions in Dialog */}
              <DialogFooter className="pt-4 border-t border-border flex flex-col sm:flex-row gap-2">
                {selectedAppointment.status === "pending" && (
                  <>
                    <Button
                      onClick={() => handleConfirm(selectedAppointment._id)}
                      className="w-full sm:w-auto rounded-xl text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Confirm &amp; Unlock Payment</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleCancel(selectedAppointment._id)}
                      className="w-full sm:w-auto rounded-xl text-xs text-rose-600 border-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/20 gap-1.5"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Cancel Reservation</span>
                    </Button>
                  </>
                )}
                <Button
                  variant="outline"
                  onClick={() => setDetailsModalOpen(false)}
                  className="w-full sm:w-auto rounded-xl text-xs border-border"
                >
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
