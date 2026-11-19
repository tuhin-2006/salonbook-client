"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar as CalendarIcon,
  Clock,
  Loader2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import confetti from "canvas-confetti";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Service, ApiResponse } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

interface BookingModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  service,
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const getTomorrowString = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  };

  const [selectedDate, setSelectedDate] = useState<string>(getTomorrowString());
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [notes, setNotes] = useState<string>("");
  const [isLoadingSlots, setIsLoadingSlots] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (!service || !isOpen) return;

    const fetchAvailability = async () => {
      setIsLoadingSlots(true);
      try {
        const res = await api.get<
          ApiResponse<{
            availableSlots: string[];
            bookedSlots: string[];
          }>
        >(`/appointments/availability?serviceId=${service._id}&date=${selectedDate}`);

        setAvailableSlots(res.data.data.availableSlots || []);
        setBookedSlots(res.data.data.bookedSlots || []);
        setSelectedSlot("");
      } catch (err) {
        console.warn("Failed to check availability:", err);
        setAvailableSlots([
          "09:00 AM",
          "10:00 AM",
          "11:00 AM",
          "01:00 PM",
          "02:00 PM",
          "03:00 PM",
          "04:00 PM",
          "05:00 PM",
        ]);
      } finally {
        setIsLoadingSlots(false);
      }
    };

    fetchAvailability();
  }, [service, selectedDate, isOpen]);

  if (!service) return null;

  const handleBookNow = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to reserve an appointment.");
      router.push(`/sign-in?redirect=/services/${service._id}`);
      onClose();
      return;
    }

    if (!selectedSlot) {
      toast.error("Please select an available chair time slot.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post<
        ApiResponse<{ _id: string }>
      >("/appointments/book", {
        serviceId: service._id,
        appointmentDate: selectedDate,
        timeSlot: selectedSlot,
        notes,
      });

      if (res.data.success) {
        try {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore confetti errors
        }

        toast.success(
          "Reservation request placed. You can monitor confirmation in your patron lounge."
        );
        onClose();
        router.push("/dashboard/appointments");
      }
    } catch (error: unknown) {
      toast.error((error as Error).message || "Reservation failed. Slot may already be reserved.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const setQuickDate = (daysAhead: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    setSelectedDate(d.toISOString().split("T")[0]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:max-w-lg max-h-[92vh] overflow-y-auto p-5 sm:p-8 bg-[#FAF7F2] dark:bg-[#1E1519] border border-[#3B1F2B]/15 dark:border-[#FAF7F2]/15 shadow-2xl rounded-2xl text-[#231C1E] dark:text-[#FAF7F2] transition-colors no-scrollbar">
        <DialogHeader className="space-y-2 text-left pb-4 border-b border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 text-[9px] uppercase tracking-[0.2em] font-semibold rounded-md bg-[#3B1F2B] dark:bg-[#C5A880] text-[#FAF7F2] dark:text-[#170F13]">
              {service.category}
            </span>
            <span className="text-xs uppercase tracking-wider text-[#231C1E]/70 dark:text-[#FAF7F2]/70 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#C5A880]" /> ⏱ {service.durationMinutes} MIN
            </span>
          </div>

          <DialogTitle className="font-serif text-2xl sm:text-3xl font-bold leading-tight text-[#231C1E] dark:text-[#FAF7F2]">
            {service.title}
          </DialogTitle>
          <DialogDescription className="text-xs text-[#231C1E]/70 dark:text-[#FAF7F2]/70 leading-relaxed">
            Select your preferred consultation date and dedicated chair time slot.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-3">
          {/* Date Picker Input & Quick Chips */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#231C1E]/75 dark:text-[#FAF7F2]/75 flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5 text-[#C5A880]" /> Select Date
              </label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setQuickDate(1)}
                  className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-[#FFFFFF] dark:bg-[#2D1D24] hover:bg-[#3B1F2B] hover:text-[#FAF7F2] dark:hover:bg-[#C5A880] dark:hover:text-[#170F13] text-[#231C1E] dark:text-[#FAF7F2] transition-colors border border-[#3B1F2B]/15 dark:border-[#FAF7F2]/15"
                >
                  Tomorrow
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDate(2)}
                  className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-[#FFFFFF] dark:bg-[#2D1D24] hover:bg-[#3B1F2B] hover:text-[#FAF7F2] dark:hover:bg-[#C5A880] dark:hover:text-[#170F13] text-[#231C1E] dark:text-[#FAF7F2] transition-colors border border-[#3B1F2B]/15 dark:border-[#FAF7F2]/15"
                >
                  In 2 Days
                </button>
              </div>
            </div>

            <input
              type="date"
              value={selectedDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-[#3B1F2B]/15 dark:border-[#FAF7F2]/15 bg-[#FFFFFF] dark:bg-[#2D1D24] text-xs font-medium text-[#231C1E] dark:text-[#FAF7F2] focus:outline-none focus:ring-1 focus:ring-[#3B1F2B] dark:focus:ring-[#C5A880]"
            />
          </div>

          {/* Time Slot Picker */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#231C1E]/75 dark:text-[#FAF7F2]/75 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#C5A880]" /> Available Chair Slots
              </label>
              {selectedSlot && (
                <span className="text-xs uppercase tracking-wider text-[#C5A880] font-bold">
                  Selected: {selectedSlot}
                </span>
              )}
            </div>

            {isLoadingSlots ? (
              <div className="py-8 text-center space-y-2">
                <Loader2 className="w-5 h-5 text-[#3B1F2B] dark:text-[#C5A880] animate-spin mx-auto" />
                <p className="text-xs text-[#231C1E]/60 dark:text-[#FAF7F2]/60">
                  Checking salon schedule...
                </p>
              </div>
            ) : availableSlots.length === 0 ? (
              <div className="p-4 rounded-xl bg-[#FFFFFF] dark:bg-[#2D1D24] border border-[#3B1F2B]/15 dark:border-[#FAF7F2]/15 text-[#231C1E]/70 dark:text-[#FAF7F2]/70 text-xs text-center">
                All chairs are fully reserved on this date. Please select another day.
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {availableSlots.map((slot) => {
                  const isSelected = selectedSlot === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`h-10 text-xs font-semibold rounded-xl uppercase tracking-wider transition-all border ${
                        isSelected
                          ? "bg-[#3B1F2B] dark:bg-[#C5A880] text-[#FAF7F2] dark:text-[#170F13] border-[#3B1F2B] dark:border-[#C5A880] shadow-sm"
                          : "bg-[#FFFFFF] dark:bg-[#2D1D24] text-[#231C1E] dark:text-[#FAF7F2] border-[#3B1F2B]/15 dark:border-[#FAF7F2]/15 hover:border-[#3B1F2B] dark:hover:border-[#C5A880]"
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Notes Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#231C1E]/75 dark:text-[#FAF7F2]/75 block">
              Appointment Notes &amp; Requests (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="e.g. Scalp sensitivity, requested specialist, allergy to specific products..."
              className="w-full p-3 rounded-xl border border-[#3B1F2B]/15 dark:border-[#FAF7F2]/15 bg-[#FFFFFF] dark:bg-[#2D1D24] text-xs text-[#231C1E] dark:text-[#FAF7F2] focus:outline-none focus:ring-1 focus:ring-[#3B1F2B] dark:focus:ring-[#C5A880]"
            />
          </div>

          {/* Summary Strip */}
          <div className="p-4 rounded-xl border border-[#3B1F2B]/15 dark:border-[#FAF7F2]/15 bg-[#FFFFFF] dark:bg-[#2D1D24] flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#231C1E]/60 dark:text-[#FAF7F2]/60 block font-semibold">
                TREATMENT FEE
              </span>
              <div className="font-serif text-2xl font-bold text-[#3B1F2B] dark:text-[#C5A880]">
                {formatCurrency(service.price)}
              </div>
            </div>
            <span className="text-xs text-[#231C1E]/80 dark:text-[#FAF7F2]/80 font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Dedicated Chair
            </span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="rounded-xl text-xs uppercase tracking-wider border-[#3B1F2B]/20 dark:border-[#FAF7F2]/20 text-[#231C1E] dark:text-[#FAF7F2]"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleBookNow}
              disabled={isSubmitting || !selectedSlot}
              className="rounded-xl text-xs font-bold uppercase tracking-wider h-11 px-6 bg-[#3B1F2B] dark:bg-[#C5A880] text-[#FAF7F2] dark:text-[#170F13] hover:bg-[#4A2035] dark:hover:bg-[#d6bc96] shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
                  Reserving...
                </>
              ) : (
                <>
                  Confirm Reservation <ArrowRight className="w-3.5 h-3.5 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
