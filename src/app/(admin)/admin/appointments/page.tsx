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
        toast.success("Appointment request confirmed. Guest may now complete payment.");
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
            app._id === appointmentId
              ? { ...app, status: "cancelled", cancelledAt: new Date().toISOString() }
              : app
          )
        );
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || "Cancellation failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filtered appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((app) => {
      const customer = typeof app.customerId === "object" ? app.customerId : null;
      const service = app.serviceId;

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
      {/* Top Header */}
      <div>
        <h2 className="font-serif text-2xl font-bold text-foreground">
          Salon Appointment Schedule
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Review, confirm guest requests, and track Stripe payment states across the atelier.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-card rounded-2xl border border-border/70 p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by customer name, email, or service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 text-xs"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 text-xs rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="all">All Appointment Statuses</option>
          <option value="pending">Pending Confirmation</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Appointments Table */}
      <div className="bg-card rounded-2xl border border-border/70 p-6 sm:p-8">
        {loading ? (
          <div className="py-20 text-center text-muted-foreground text-sm space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
            <p>Loading salon appointments...</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="py-16 text-center space-y-4 max-w-sm mx-auto">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-lg font-semibold text-foreground">
              No Appointments Found
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              No appointment requests matched your search filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border/80 text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                  <th className="pb-3 pr-4">Guest Customer</th>
                  <th className="pb-3 px-4">Service</th>
                  <th className="pb-3 px-4">Schedule</th>
                  <th className="pb-3 px-4">Price</th>
                  <th className="pb-3 px-4">Status</th>
                  <th className="pb-3 px-4">Payment</th>
                  <th className="pb-3 pl-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredAppointments.map((app) => {
                  const customer = typeof app.customerId === "object" ? app.customerId : null;
                  const service = app.serviceId;
                  const isPending = app.status === "pending";

                  return (
                    <tr key={app._id} className="hover:bg-muted/40 transition-colors">
                      {/* Customer Info */}
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
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
                            <p className="font-semibold text-foreground text-sm leading-tight">
                              {customer?.name || "Anonymous Guest"}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              {customer?.email || "No email"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Service Info */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <p className="font-medium text-foreground">
                          {service?.title || "Bespoke Service"}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {service?.category || "Salon"}
                        </p>
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

                      {/* Appointment Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {getStatusBadge(app.status)}
                      </td>

                      {/* Payment Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {getPaymentBadge((app as unknown as { paymentStatus?: string }).paymentStatus)}
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
                              className="h-8 text-xs text-emerald-600 border-emerald-600/30 hover:bg-emerald-500/10 gap-1"
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
                              className="h-8 text-xs text-destructive hover:bg-destructive/10"
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">
              Appointment Details
            </DialogTitle>
            <DialogDescription className="text-xs">
              Complete reservation telemetry and guest preferences.
            </DialogDescription>
          </DialogHeader>

          {selectedAppointment && (
            <div className="space-y-4 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-muted/30 border border-border space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Guest Name:</span>
                  <span className="font-semibold text-foreground">
                    {(selectedAppointment.customerId as UserType)?.name || "Guest"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="text-foreground">
                    {(selectedAppointment.customerId as UserType)?.email || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="text-foreground">
                    {(selectedAppointment.customerId as UserType)?.phone || "Not provided"}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-muted/30 border border-border space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service:</span>
                  <span className="font-semibold text-foreground">
                    {selectedAppointment.serviceId?.title}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <span>{selectedAppointment.serviceId?.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span>{formatDate(selectedAppointment.appointmentDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time Slot:</span>
                  <span className="font-medium text-foreground">{selectedAppointment.timeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price:</span>
                  <span className="font-bold text-foreground">
                    {formatCurrency(selectedAppointment.serviceId?.price || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Status:</span>
                  <span className="capitalize font-semibold text-primary">
                    {(selectedAppointment as unknown as { paymentStatus?: string }).paymentStatus || "unpaid"}
                  </span>
                </div>
              </div>

              {selectedAppointment.notes && (
                <div className="p-3 rounded-xl bg-muted/20 border border-border space-y-1">
                  <span className="text-muted-foreground font-semibold">Guest Notes:</span>
                  <p className="text-foreground italic">{selectedAppointment.notes}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDetailsModalOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}