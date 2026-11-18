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
        toast.success("Reservation confirmed. Patron checkout is now unlocked.");
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
        toast.info("Appointment reservation cancelled.");
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

  const filteredAppointments = useMemo(() => {
    return appointments.filter((app) => {
      const customer = typeof app.customerId === "object" ? app.customerId : null;
      const service = typeof app.serviceId === "object" ? app.serviceId : null;

      const customerName = customer?.name?.toLowerCase() || "";
      const serviceTitle = service?.title?.toLowerCase() || "";
      const q = search.toLowerCase();

      const matchesSearch = !search || customerName.includes(q) || serviceTitle.includes(q);
      const matchesStatus = statusFilter === "all" || app.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [appointments, search, statusFilter]);

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 pb-6 border-b border-[#302821]/15">
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#B8755B] font-semibold block">
            DIARY SUPERVISION
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#302821] dark:text-[#F5F1E8]">
            Reservations &amp; Chair Bookings
          </h2>
          <p className="text-xs text-[#302821]/70 dark:text-[#EAE3D6]/70 max-w-xl leading-relaxed">
            Review, confirm pending chair requests, and monitor Stripe settlement statuses in real time.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar: Architectural Surface */}
      <div className="border border-[#302821]/15 dark:border-[#EAE3D6]/15 bg-[#EAE3D6]/40 dark:bg-[#1a201c] p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#302821]/40" />
          <Input
            placeholder="Search by patron name or treatment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 text-xs rounded-none border-[#302821]/20 bg-[#F5F1E8] dark:bg-[#151916] text-[#302821] dark:text-[#F5F1E8]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 text-xs uppercase tracking-wider rounded-none bg-[#F5F1E8] dark:bg-[#151916] border border-[#302821]/20 text-[#302821] dark:text-[#F5F1E8] focus:outline-none"
        >
          <option value="all">ALL RESERVATION STATUSES</option>
          <option value="pending">PENDING ONLY</option>
          <option value="confirmed">CONFIRMED ONLY</option>
          <option value="cancelled">CANCELLED ONLY</option>
        </select>
      </div>

      {/* Table */}
      <div className="border border-[#302821]/15 dark:border-[#EAE3D6]/15 bg-[#EAE3D6]/30 dark:bg-[#1a201c] p-6">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-[#26372D] border-t-transparent animate-spin mx-auto" />
            <p className="text-xs uppercase tracking-wider text-[#302821]/60">
              Accessing Diary Records...
            </p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="py-16 text-center space-y-3 max-w-sm mx-auto">
            <div className="w-12 h-12 border border-[#302821]/20 bg-[#EAE3D6] mx-auto flex items-center justify-center font-bold text-[#26372D]">
              <Calendar className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-xl text-[#302821] dark:text-[#F5F1E8]">
              No Appointments Located
            </h4>
            <p className="text-xs text-[#302821]/70 leading-relaxed">
              No appointments match your active search and filter parameters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#302821]/15 text-[#302821]/60 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="pb-3 pr-4">Patron</th>
                  <th className="pb-3 px-4">Treatment</th>
                  <th className="pb-3 px-4">Date &amp; Slot</th>
                  <th className="pb-3 px-4">Fee</th>
                  <th className="pb-3 px-4">Status</th>
                  <th className="pb-3 px-4">Stripe</th>
                  <th className="pb-3 pl-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#302821]/10">
                {filteredAppointments.map((app) => {
                  const customer = typeof app.customerId === "object" ? app.customerId : null;
                  const service = typeof app.serviceId === "object" ? app.serviceId : null;
                  const isPending = app.status === "pending";
                  const appointmentDate = app.date || (app as unknown as { appointmentDate?: string }).appointmentDate;

                  return (
                    <tr key={app._id} className="hover:bg-[#EAE3D6]/60 transition-colors">
                      {/* Customer Info */}
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-none bg-[#26372D] text-[#F5F1E8] font-serif font-bold text-xs flex items-center justify-center shrink-0">
                            {getInitials(customer?.name || "Guest")}
                          </div>
                          <div>
                            <p className="font-medium text-[#302821] dark:text-[#F5F1E8] text-xs leading-tight">
                              {customer?.name || "Patron Guest"}
                            </p>
                            <p className="text-[10px] text-[#302821]/60 dark:text-[#EAE3D6]/60">
                              {customer?.email || "No email"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Service Info */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <p className="font-serif text-sm text-[#302821] dark:text-[#F5F1E8]">
                          {service?.title || "Salon Treatment"}
                        </p>
                        <p className="text-[9px] uppercase tracking-wider text-[#B8755B]">
                          {service?.category || "Beauty"}
                        </p>
                      </td>

                      {/* Date & Time */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="text-xs font-medium text-[#302821] dark:text-[#F5F1E8]">
                          {formatDate(appointmentDate || "")}
                        </div>
                        <div className="text-[10px] text-[#302821]/60">
                          {app.timeSlot}
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-4 font-serif text-sm text-[#26372D] dark:text-[#F5F1E8] whitespace-nowrap">
                        {formatCurrency(app.price || app.servicePrice || service?.price || 0)}
                      </td>

                      {/* Appointment Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 border ${
                            app.status === "confirmed"
                              ? "bg-[#26372D] text-[#F5F1E8] border-[#26372D]"
                              : app.status === "cancelled"
                              ? "bg-red-500/10 text-red-700 border-red-500/30"
                              : "bg-[#B8755B]/15 text-[#B8755B] border-[#B8755B]/30"
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>

                      {/* Payment Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 border ${
                            app.paymentStatus === "paid"
                              ? "bg-emerald-600/15 text-emerald-800 dark:text-emerald-400 border-emerald-600/30"
                              : "bg-transparent text-[#302821]/60 border-[#302821]/20"
                          }`}
                        >
                          {app.paymentStatus || "Unpaid"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 pl-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 rounded-none text-[#302821]"
                            onClick={() => {
                              setSelectedAppointment(app);
                              setDetailsModalOpen(true);
                            }}
                            title="Review dossier"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Button>

                          {/* Confirm Button (Pending only) */}
                          {isPending && (
                            <Button
                              variant="default"
                              size="sm"
                              className="h-8 text-[10px] uppercase tracking-wider rounded-none bg-[#26372D] text-[#F5F1E8] hover:bg-[#343D2E] px-3"
                              onClick={() => handleConfirm(app._id)}
                              disabled={actionLoadingId === app._id}
                            >
                              <Check className="w-3 h-3 mr-1" />
                              <span>CONFIRM</span>
                            </Button>
                          )}

                          {/* Cancel Button */}
                          {app.status !== "cancelled" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 text-[10px] uppercase tracking-wider rounded-none border-red-300 text-red-700 hover:bg-red-50 px-2"
                              onClick={() => handleCancel(app._id)}
                              disabled={actionLoadingId === app._id}
                              title="Cancel appointment"
                            >
                              <X className="w-3 h-3" />
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

      {/* Appointment Details Dossier Modal */}
      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="max-w-lg bg-[#F5F1E8] border-[#302821]/20 p-8 rounded-none">
          <DialogHeader className="space-y-1">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#B8755B] font-semibold block">
              APPOINTMENT DOSSIER
            </span>
            <DialogTitle className="font-serif text-2xl text-[#302821]">
              Reservation Overview
            </DialogTitle>
            <DialogDescription className="text-xs text-[#302821]/70">
              Reference ID: {selectedAppointment?._id}
            </DialogDescription>
          </DialogHeader>

          {selectedAppointment && (
            <div className="space-y-4 pt-4 border-t border-[#302821]/10 text-xs">
              <div className="grid grid-cols-2 gap-4 p-4 border border-[#302821]/15 bg-[#EAE3D6]/50">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-[#302821]/60 block font-semibold">
                    PATRON NAME
                  </span>
                  <p className="font-medium text-[#302821] text-sm mt-0.5">
                    {typeof selectedAppointment.customerId === "object"
                      ? selectedAppointment.customerId?.name
                      : "Client"}
                  </p>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-[#302821]/60 block font-semibold">
                    PATRON EMAIL
                  </span>
                  <p className="text-xs text-[#302821]/80 mt-0.5">
                    {typeof selectedAppointment.customerId === "object"
                      ? selectedAppointment.customerId?.email
                      : "No email"}
                  </p>
                </div>
              </div>

              <div className="space-y-2 p-4 border border-[#302821]/15 bg-[#EAE3D6]/30">
                <span className="text-[9px] uppercase tracking-wider text-[#302821]/60 block font-semibold">
                  TREATMENT SPECIFICATION
                </span>
                <p className="font-serif text-lg text-[#302821]">
                  {typeof selectedAppointment.serviceId === "object"
                    ? (selectedAppointment.serviceId as { title?: string }).title
                    : "Salon Treatment"}
                </p>
                <div className="flex items-center gap-4 text-xs text-[#302821]/70 pt-1">
                  <span>
                    Date: {formatDate(selectedAppointment.appointmentDate || selectedAppointment.date || "")}
                  </span>
                  <span>•</span>
                  <span>Time: {selectedAppointment.timeSlot}</span>
                </div>
              </div>

              {selectedAppointment.notes && (
                <div className="p-3 border border-[#302821]/10 text-xs text-[#302821]/70 italic">
                  Patron Notes: &ldquo;{selectedAppointment.notes}&rdquo;
                </div>
              )}
            </div>
          )}

          <DialogFooter className="pt-4 border-t border-[#302821]/10">
            <Button
              variant="default"
              size="sm"
              onClick={() => setDetailsModalOpen(false)}
              className="rounded-none text-xs uppercase tracking-wider bg-[#26372D] text-[#F5F1E8]"
            >
              Close Dossier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
