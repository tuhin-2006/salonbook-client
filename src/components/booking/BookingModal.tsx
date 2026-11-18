"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  Sun,
  Sunset,
  Moon,
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
import { Badge } from "@/components/ui/badge";
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
      toast.error("Please select an available appointment time slot.");
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
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore confetti errors in test
        }

        toast.success(
          "Appointment request placed! You can view and manage it in your dashboard."
        );
        onClose();
        router.push("/dashboard/appointments");
      }
    } catch (error: unknown) {
      toast.error((error as Error).message || "Booking failed. Slot may already be reserved.");
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
      <DialogContent className="sm:max-w-lg max-h-[92vh] overflow-y-auto p-6 sm:p-7 bg-card border-border shadow-2xl rounded-2xl">
        <DialogHeader className="space-y-1.5 text-left">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-primary/10 text-primary">
              <Sparkles className="w-3 h-3" />
              {service.category}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-primary" /> {service.durationMinutes} mins
            </span>
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
            {service.title}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Choose your preferred date and time slot. Instant booking confirmation.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-3">
          {/* Date Picker Input & Quick Chips */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5 text-primary" /> Select Date
              </label>
              <div className="flex items-center gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => setQuickDate(1)}
                  className="px-2 py-0.5 rounded-lg bg-secondary hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors text-[11px] font-semibold"
                >
                  Tomorrow
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDate(2)}
                  className="px-2 py-0.5 rounded-lg bg-secondary hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors text-[11px] font-semibold"
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
              className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Time Slot Picker */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-primary" /> Choose Time Slot
              </label>
              {selectedSlot && (
                <span className="text-xs font-bold text-primary">
                  Selected: {selectedSlot}
                </span>
              )}
            </div>

            {isLoadingSlots ? (
              <div className="py-8 text-center space-y-2">
                <Loader2 className="w-6 h-6 text-primary animate-spin mx-auto" />
                <p className="text-xs text-muted-foreground">Checking live slots...</p>
              </div>
            ) : availableSlots.length === 0 ? (
              <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs text-center">
                All chairs are fully booked for this date. Please choose another day.
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
                      className={`h-10 rounded-xl text-xs font-bold transition-all border ${
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/25 scale-[1.02]"
                          : "bg-secondary text-foreground border-border hover:border-primary/40"
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
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Special Requests / Hair Concerns (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="e.g. Sensitive scalp, preferred stylist, allergy to certain oils..."
              className="w-full p-3 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Summary Strip */}
          <div className="p-3.5 rounded-xl bg-secondary/50 border border-border flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Service Fee
              </span>
              <div className="text-xl font-black text-foreground">
                {formatCurrency(service.price)}
              </div>
            </div>
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> No pre-charge required
            </span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="rounded-xl text-xs font-bold"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="gradient"
              size="sm"
              onClick={handleBookNow}
              disabled={isSubmitting || !selectedSlot}
              className="rounded-xl text-xs font-bold h-10 px-5 gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Confirming...
                </>
              ) : (
                <>
                  Confirm Reservation <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
