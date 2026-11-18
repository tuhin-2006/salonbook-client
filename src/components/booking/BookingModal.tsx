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
      toast.error("Please sign in to reserve an atelier consultation.");
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
      <DialogContent className="sm:max-w-lg max-h-[92vh] overflow-y-auto p-8 bg-[#F5F1E8] border-[#302821]/20 shadow-2xl rounded-none text-[#302821]">
        <DialogHeader className="space-y-2 text-left pb-4 border-b border-[#302821]/10">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 text-[9px] uppercase tracking-[0.2em] font-semibold bg-[#26372D] text-[#F5F1E8]">
              {service.category}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-[#302821]/70 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#26372D]" /> {service.durationMinutes} MIN
            </span>
          </div>

          <DialogTitle className="font-serif text-2xl sm:text-3xl font-normal leading-tight text-[#302821]">
            {service.title}
          </DialogTitle>
          <DialogDescription className="text-xs text-[#302821]/70 leading-relaxed">
            Select your preferred consultation date and dedicated chair time slot.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Date Picker Input & Quick Chips */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#302821]/70 flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5 text-[#26372D]" /> SELECT DATE
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQuickDate(1)}
                  className="px-2.5 py-1 text-[10px] uppercase tracking-wider bg-[#EAE3D6] hover:bg-[#26372D] hover:text-[#F5F1E8] text-[#302821] transition-colors border border-[#302821]/15"
                >
                  Tomorrow
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDate(2)}
                  className="px-2.5 py-1 text-[10px] uppercase tracking-wider bg-[#EAE3D6] hover:bg-[#26372D] hover:text-[#F5F1E8] text-[#302821] transition-colors border border-[#302821]/15"
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
              className="w-full h-11 px-3.5 rounded-none border border-[#302821]/20 bg-[#F5F1E8] text-xs uppercase tracking-wider text-[#302821] focus:outline-none focus:ring-1 focus:ring-[#26372D]"
            />
          </div>

          {/* Time Slot Picker */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#302821]/70 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#26372D]" /> AVAILABLE CHAIR SLOTS
              </label>
              {selectedSlot && (
                <span className="text-[10px] uppercase tracking-wider text-[#B8755B] font-semibold">
                  SELECTED: {selectedSlot}
                </span>
              )}
            </div>

            {isLoadingSlots ? (
              <div className="py-8 text-center space-y-2">
                <Loader2 className="w-5 h-5 text-[#26372D] animate-spin mx-auto" />
                <p className="text-[10px] uppercase tracking-wider text-[#302821]/60">
                  Checking atelier schedule...
                </p>
              </div>
            ) : availableSlots.length === 0 ? (
              <div className="p-4 bg-[#EAE3D6]/60 border border-[#302821]/15 text-[#302821]/70 text-xs text-center">
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
                      className={`h-10 text-[11px] uppercase tracking-wider transition-all border ${
                        isSelected
                          ? "bg-[#26372D] text-[#F5F1E8] border-[#26372D] font-medium"
                          : "bg-[#EAE3D6]/50 text-[#302821] border-[#302821]/15 hover:border-[#26372D]"
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
            <label className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#302821]/70 block">
              Patron Notes &amp; Requests (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="e.g. Scalp sensitivity, requested specialist, allergy to specific essential oils..."
              className="w-full p-3 rounded-none border border-[#302821]/20 bg-[#F5F1E8] text-xs text-[#302821] focus:outline-none focus:ring-1 focus:ring-[#26372D]"
            />
          </div>

          {/* Summary Strip */}
          <div className="p-4 border border-[#302821]/15 bg-[#EAE3D6]/50 flex items-center justify-between">
            <div>
              <span className="text-[9px] uppercase tracking-[0.2em] text-[#302821]/60 block font-semibold">
                TREATMENT INVESTMENT
              </span>
              <div className="font-serif text-2xl font-medium text-[#26372D]">
                {formatCurrency(service.price)}
              </div>
            </div>
            <span className="text-[10px] uppercase tracking-wider text-[#26372D] font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#26372D]" /> Single-Guest Duration
            </span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="rounded-none text-xs uppercase tracking-wider border-[#302821]/20"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleBookNow}
              disabled={isSubmitting || !selectedSlot}
              className="rounded-none text-xs uppercase tracking-wider h-11 px-6 bg-[#26372D] text-[#F5F1E8] hover:bg-[#343D2E]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
                  RESERVING...
                </>
              ) : (
                <>
                  CONFIRM RESERVATION <ArrowRight className="w-3.5 h-3.5 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
