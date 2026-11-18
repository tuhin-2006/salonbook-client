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
  Scissors,
} from "lucide-react";
import { api } from "@/lib/api";
import { Appointment, ApiResponse, User as UserType } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Details Modal
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  // Updating status state
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
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
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Confirm appointment (only for pending)
  const handleConfirm = async (appointmentId: string) => {
    try {
      setActionLoadingId(appointmentId);
      const res = await api.patch<ApiResponse<Appointment>>(
        `/appointments/${appointmentId}/status`,
        { status: "confirmed" }
      );
      if (res.data.success) {
        toast.success("Appointment request confirmed. Client may now pay.");
        setAppointments((prev) =>
          prev.map((app) =>
            app._id === appointmentId ? { ...app, status: "confirmed" } : app
          )
        );
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
        toast.info("Appointment cancelled.");
        setAppointments((prev) =>
          prev.map((app) =>
            app._id === appointmentId ? { ...app, status: "cancelled" } : app
          )
        );
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

      const customerName = customer?.name || "";
      const customerEmail = customer?.email || "";
      const serviceTitle = service?.title || "";

      const matchesSearch =
        !search ||
        customerName.toLowerCase().includes(search.toLowerCase()) ||
        customerEmail.toLowerCase().includes(search.toLowerCase()) ||
        serviceTitle.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || app.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [appointments, search, statusFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> Confirmed
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-destructive/10 text-destructive border border-destructive/20">
            <XCircle className="w-3 h-3" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/10 text-amber-600 border border-amber-500/20">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
    }
  };

  const getPaymentBadge = (paymentStatus?: string) => {
    if (paymentStatus === "paid") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-emerald-600 text-white">
          <CheckCircle2 className="w-3 h-3" /> Paid
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-secondary text-muted-foreground border border-border">
        Unpaid
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
            Appointment Dispatch
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Monitor incoming client bookings, approve pending chairs, and view service details.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-card rounded-2xl border border-border p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-3 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by client name, email, or service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 text-xs rounded-xl"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 text-xs rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="all">All Appointment Statuses</option>
          <option value="pending">Pending Only</option>
          <option value="confirmed">Confirmed Only</option>
          <option value="cancelled">Cancelled Only</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-muted-foreground text-sm space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
            <p className="text-xs font-semibold">Loading appointments list...</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="py-16 text-center space-y-3 max-w-sm mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center font-bold">
              <Calendar className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-foreground">
              No Appointments Found
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              No appointments match your search and filter parameters.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => { setSearch(""); setStatusFilter("all"); }}
              className="rounded-xl text-xs font-bold"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
                  <th className="pb-3 pr-4">Patron Client</th>
                  <th className="pb-3 px-4">Service</th>
                  <th className="pb-3 px-4">Schedule</th>
                  <th className="pb-3 px-4">Price</th>
                  <th className="pb-3 px-4">Status</th>
                  <th className="pb-3 px-4">Payment</th>
                  <th className="pb-3 pl-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredAppointments.map((app) => {
                  const customer = typeof app.customerId === "object" ? app.customerId : null;
                  const service = typeof app.serviceId === "object" ? app.serviceId : null;
                  const isPending = app.status === "pending";
                  const appointmentDate = app.date || (app as unknown as { appointmentDate?: string }).appointmentDate;

                  return (
                    <tr key={app._id} className="hover:bg-secondary/40 transition-colors">
                      {/* Customer Info */}
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                            {customer?.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={customer.image}
                                alt={customer.name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              getInitials(customer?.name || "Guest")
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-foreground text-xs leading-tight">
                              {customer?.name || "Client Guest"}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              {customer?.email || "No email"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Service Info */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <p className="font-bold text-foreground text-xs">
                          {service?.title || "Salon Treatment"}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {service?.category || "Beauty"}
                        </p>
                      </td>

                      {/* Date & Time */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-bold text-foreground text-xs">
                          {formatDate(appointmentDate || "")}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {app.timeSlot}
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-4 font-bold text-foreground whitespace-nowrap">
                        {formatCurrency(app.price || app.servicePrice || service?.price || 0)}
                      </td>

                      {/* Appointment Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {getStatusBadge(app.status)}
                      </td>

                      {/* Payment Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {getPaymentBadge(app.paymentStatus)}
                      </td>

                      {/* Actions */}
                      <td className="py-4 pl-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View details */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => {
                              setSelectedAppointment(app);
                              setDetailsModalOpen(true);
                            }}
                            title="View details"
                          >
                            <Eye className="w-4 h-4 text-muted-foreground" />
                          </Button>

                          {/* Confirm Button (Pending only) */}
                          {isPending && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs font-bold text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10 gap-1 px-2.5 rounded-lg"
                              onClick={() => handleConfirm(app._id)}
                              disabled={actionLoadingId === app._id}
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Confirm</span>
                            </Button>
                          )}

                          {/* Cancel Button */}
                          {app.status !== "cancelled" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 text-xs font-bold text-destructive hover:bg-destructive/10 px-2 rounded-lg"
                              onClick={() => handleCancel(app._id)}
                              disabled={actionLoadingId === app._id}
                              title="Cancel appointment"
                            >
                              <X className="w-3.5 h-3.5" />
                            </Button>
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

      {/* Appointment Details Modal */}
      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              Appointment Details
            </DialogTitle>
            <DialogDescription className="text-xs">
              Complete reservation information and client contact details.
            </DialogDescription>
          </DialogHeader>

          {selectedAppointment && (
            <div className="space-y-4 pt-2 text-xs">
              <div className="p-3.5 rounded-xl bg-secondary/50 border border-border space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Client Details</span>
                <p className="font-bold text-foreground">
                  {typeof selectedAppointment.customerId === "object"
                    ? selectedAppointment.customerId?.name
                    : "Client Guest"}
                </p>
                <p className="text-muted-foreground">
                  {typeof selectedAppointment.customerId === "object"
                    ? selectedAppointment.customerId?.email
                    : ""}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-secondary/50 border border-border space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Service Details</span>
                <p className="font-bold text-foreground">
                  {typeof selectedAppointment.serviceId === "object"
                    ? selectedAppointment.serviceId?.title
                    : "Salon Treatment"}
                </p>
                <p className="text-muted-foreground">
                  Price: {formatCurrency(selectedAppointment.price || selectedAppointment.servicePrice || 0)} • Duration: {selectedAppointment.timeSlot}
                </p>
                {selectedAppointment.specialist && (
                  <p className="text-muted-foreground">
                    Assigned Stylist: {selectedAppointment.specialist}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-border">
                <span>Current Status</span>
                {getStatusBadge(selectedAppointment.status)}
              </div>
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDetailsModalOpen(false)}
              className="rounded-xl text-xs font-bold"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
