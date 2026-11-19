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
  Trash2,
  ArrowUpDown,
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
import { formatCurrency, formatDate, getInitials, getAppointmentPrice, getAppointmentDate } from "@/lib/utils";
import { toast } from "sonner";

type StatusTab = "all" | "pending" | "confirmed" | "cancelled";

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Search & Filter & Sorting
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusTab>("all");
  const [sortBy, setSortBy] = useState<"newest" | "pendingFirst" | "date">("newest");

  // Details Modal
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  // Delete Modal
  const [appointmentToDelete, setAppointmentToDelete] = useState<Appointment | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  // Permanently delete appointment
  const handleDelete = async () => {
    if (!appointmentToDelete) return;
    try {
      setDeleting(true);
      const res = await api.delete<ApiResponse<null>>(
        `/appointments/${appointmentToDelete._id}`
      );
      if (res.data.success) {
        toast.success("Appointment reservation permanently deleted.");
        setAppointments((prev) =>
          prev.filter((a) => a._id !== appointmentToDelete._id)
        );
        setDeleteDialogOpen(false);
        if (selectedAppointment?._id === appointmentToDelete._id) {
          setDetailsModalOpen(false);
          setSelectedAppointment(null);
        }
        setAppointmentToDelete(null);
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to delete appointment");
    } finally {
      setDeleting(false);
    }
  };

  const filteredAppointments = useMemo(() => {
    const list = appointments.filter((app) => {
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

    // Ensure strict chronological sequence by booking arrival (newest request first)
    return [...list].sort((a, b) => {
      if (sortBy === "pendingFirst") {
        if (a.status === "pending" && b.status !== "pending") return -1;
        if (a.status !== "pending" && b.status === "pending") return 1;
      }
      if (sortBy === "date") {
        const dateA = new Date(getAppointmentDate(a) || 0).getTime();
        const dateB = new Date(getAppointmentDate(b) || 0).getTime();
        return dateA - dateB;
      }
      // Default: "newest" - strictly order by createdAt so new requests appear immediately at the top
      const timeA = new Date(a.createdAt || 0).getTime();
      const timeB = new Date(b.createdAt || 0).getTime();
      return timeB - timeA;
    });
  }, [appointments, search, statusFilter, sortBy]);

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

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Sort Order Selector */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-background">
              <ArrowUpDown className="w-3.5 h-3.5 text-accent shrink-0" />
              <span className="text-[10px] uppercase font-bold text-muted-foreground whitespace-nowrap">
                Sequence:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-semibold text-foreground focus:outline-none cursor-pointer"
              >
                <option value="newest" className="bg-card text-foreground">
                  Latest Bookings First
                </option>
                <option value="pendingFirst" className="bg-card text-foreground">
                  Pending Review First
                </option>
                <option value="date" className="bg-card text-foreground">
                  Session Date (Earliest First)
                </option>
              </select>
            </div>

            {/* Search Box */}
            <div className="relative flex-1 min-w-[220px]">
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
      </div>

      {/* 3. Luxury Appointments Table */}
      <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent animate-spin rounded-full mx-auto" />
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
              Loading Dashboard Data...
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
                          <div className="w-9 h-9 rounded-full bg-accent/20 text-accent font-sans font-bold text-xs flex items-center justify-center shrink-0 border border-accent/30">
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
                          <div className="flex items-center gap-1.5 text-foreground font-medium tabular-nums">
                            <Calendar className="w-3.5 h-3.5 text-accent" />
                            <span>{formatDate(getAppointmentDate(app))}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] tabular-nums">
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
                          <span className="font-sans text-sm font-bold text-foreground tabular-nums block">
                            {formatCurrency(getAppointmentPrice(app))}
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
                          {/* Quick Confirm - Rule: Only pending appointments can be confirmed */}
                          {app.status === "pending" && (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={isActing}
                              onClick={() => handleConfirm(app._id)}
                              className="h-8 px-2.5 rounded-lg border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 gap-1 text-[11px]"
                              title="Confirm Reservation (Pending Only)"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Confirm</span>
                            </Button>
                          )}

                          {/* Quick Cancel - Rule: Admin can cancel Pending OR Confirmed appointments */}
                          {(app.status === "pending" || app.status === "confirmed") && (
                            <Button
                              size="sm"
                              variant="ghost"
                              disabled={isActing}
                              onClick={() => handleCancel(app._id)}
                              className="h-8 px-2.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 gap-1 text-[11px]"
                              title="Cancel Reservation (Pending or Confirmed)"
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

                          {/* Permanently Delete Appointment (Available for ALL appointments) */}
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={isActing}
                            onClick={() => {
                              setAppointmentToDelete(app);
                              setDeleteDialogOpen(true);
                            }}
                            className="h-8 w-8 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 transition-colors"
                            title="Delete Reservation"
                          >
                            <Trash2 className="w-4 h-4" />
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
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border-border bg-card p-6 sm:p-8 no-scrollbar">
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
              Appointment Dossier &amp; Specifications
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Reference ID: {selectedAppointment?._id}
            </DialogDescription>
          </DialogHeader>

          {selectedAppointment && (
            <div className="space-y-5 pt-3 text-xs">
              {/* 1. Customer Information Card */}
              <div className="p-4 rounded-xl border border-border bg-muted/40 space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-accent font-bold block">
                  Customer Information
                </span>
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-full bg-accent/20 text-accent font-sans font-bold text-sm flex items-center justify-center shrink-0 border border-accent/30 overflow-hidden">
                    {typeof selectedAppointment.customerId === "object" &&
                    selectedAppointment.customerId?.image ? (
                      <img
                        src={selectedAppointment.customerId.image}
                        alt="Customer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      getInitials(
                        typeof selectedAppointment.customerId === "object"
                          ? selectedAppointment.customerId?.name || "Patron"
                          : "Patron"
                      )
                    )}
                  </div>
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <span className="font-semibold text-sm text-foreground block truncate">
                      {typeof selectedAppointment.customerId === "object"
                        ? selectedAppointment.customerId?.name
                        : "Guest Patron"}
                    </span>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground text-[11px]">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-accent" />
                        {typeof selectedAppointment.customerId === "object"
                          ? selectedAppointment.customerId?.email
                          : "No email provided"}
                      </span>
                      {typeof selectedAppointment.customerId === "object" &&
                        selectedAppointment.customerId?.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-accent" />
                            {selectedAppointment.customerId.phone}
                          </span>
                        )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Service Information Card */}
              <div className="p-4 rounded-xl border border-border bg-background space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-accent font-bold block">
                  Service Information
                </span>
                <div className="flex items-center gap-3.5">
                  {typeof selectedAppointment.serviceId === "object" &&
                  selectedAppointment.serviceId?.images?.[0] ? (
                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-border/80">
                      <img
                        src={selectedAppointment.serviceId.images[0]}
                        alt={selectedAppointment.serviceId.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-accent/15 text-accent flex items-center justify-center shrink-0 border border-accent/20">
                      <Scissors className="w-6 h-6" />
                    </div>
                  )}
                  <div className="space-y-1 flex-1 min-w-0">
                    <span className="font-serif text-base font-bold text-foreground block truncate">
                      {typeof selectedAppointment.serviceId === "object"
                        ? selectedAppointment.serviceId?.title
                        : "Salon Formulation Ritual"}
                    </span>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                      <span className="px-2 py-0.5 rounded-full bg-muted font-semibold text-foreground">
                        {typeof selectedAppointment.serviceId === "object"
                          ? selectedAppointment.serviceId?.category || "Specialty Care"
                          : "Specialty Care"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-accent" />
                        ⏱{" "}
                        {typeof selectedAppointment.serviceId === "object"
                          ? selectedAppointment.serviceId?.durationMinutes || 60
                          : 60}{" "}
                        mins
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Appointment Specs Grid (Date, Time, Price, Status, Payment, Booking Date) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block">
                    Session Date &amp; Time
                  </span>
                  <span className="font-semibold text-foreground block">
                    {formatDate(getAppointmentDate(selectedAppointment))}
                  </span>
                  <span className="text-[11px] text-accent font-bold block">
                    {selectedAppointment.timeSlot}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block">
                    Service Price
                  </span>
                  <span className="font-sans text-base font-bold text-foreground tabular-nums block">
                    {formatCurrency(getAppointmentPrice(selectedAppointment))}
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase block font-semibold">
                    Standard Atelier Fee
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block">
                    Payment Status
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      selectedAppointment.paymentStatus === "paid"
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {selectedAppointment.paymentStatus === "paid" ? "Paid (Stripe)" : "Unpaid"}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block">
                    Appointment Status
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      selectedAppointment.status === "confirmed"
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : selectedAppointment.status === "pending"
                        ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                        : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                    }`}
                  >
                    {selectedAppointment.status}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-1 col-span-2">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block">
                    Booking Request Date
                  </span>
                  <span className="font-medium text-foreground block">
                    {selectedAppointment.createdAt
                      ? formatDate(selectedAppointment.createdAt)
                      : "Recently Registered"}
                  </span>
                </div>
              </div>

              {/* 4. Customer Message (if provided) */}
              <div className="p-3.5 rounded-xl border border-border bg-background space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-accent font-bold block">
                  Customer Message / Notes
                </span>
                <p className="text-xs text-foreground italic leading-relaxed">
                  {selectedAppointment.notes && selectedAppointment.notes.trim()
                    ? `“${selectedAppointment.notes}”`
                    : "No additional message or custom requirements provided by customer."}
                </p>
              </div>

              {/* 5. Actions in Dialog (Rules: Only pending can be confirmed; Admin can cancel pending or confirmed) */}
              <DialogFooter className="pt-4 border-t border-border flex flex-col sm:flex-row gap-2">
                {selectedAppointment.status === "pending" && (
                  <Button
                    onClick={() => handleConfirm(selectedAppointment._id)}
                    className="w-full sm:w-auto rounded-xl text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 font-bold"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Confirm Appointment</span>
                  </Button>
                )}

                {(selectedAppointment.status === "pending" ||
                  selectedAppointment.status === "confirmed") && (
                  <Button
                    variant="outline"
                    onClick={() => handleCancel(selectedAppointment._id)}
                    className="w-full sm:w-auto rounded-xl text-xs text-rose-600 dark:text-rose-400 border-rose-500/30 hover:bg-rose-500/10 gap-1.5 font-bold"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Cancel Appointment</span>
                  </Button>
                )}

                <Button
                  variant="outline"
                  onClick={() => {
                    setAppointmentToDelete(selectedAppointment);
                    setDeleteDialogOpen(true);
                  }}
                  className="w-full sm:w-auto rounded-xl text-xs text-rose-600 border-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/20 gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Record</span>
                </Button>

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

      {/* 5. Permanent Deletion Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl border-border bg-card p-6">
          <DialogHeader className="space-y-2">
            <div className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>
            <DialogTitle className="font-serif text-xl font-bold text-foreground">
              Delete Atelier Reservation
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to permanently delete this reservation record for{" "}
              <strong className="text-foreground">
                {typeof appointmentToDelete?.customerId === "object"
                  ? appointmentToDelete?.customerId?.name
                  : "Guest Patron"}
              </strong>
              {" "}for{" "}
              <strong className="text-foreground">
                {typeof appointmentToDelete?.serviceId === "object"
                  ? appointmentToDelete?.serviceId?.title
                  : "Salon Treatment"}
              </strong>
              ? This action will completely purge the record from the database.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-4 border-t border-border flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={deleting}
              onClick={() => setDeleteDialogOpen(false)}
              className="w-full sm:w-auto rounded-xl text-xs border-border"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={deleting}
              onClick={handleDelete}
              className="w-full sm:w-auto rounded-xl text-xs bg-rose-600 hover:bg-rose-700 text-white gap-1.5"
            >
              {deleting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Permanently</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
