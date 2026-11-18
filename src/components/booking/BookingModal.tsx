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

  // Default to tomorrow
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

  // Fetch available slots when service or date changes
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
        // Fallback default slots
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
      toast.error("Please sign in to reserve an atelier appointment.");
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
        // Trigger Haute Confetti Burst
        try {
          confetti({
            particleCount: 90,
            spread: 80,
            origin: { y: 0.6 },
            colors: ["#be9643", "#e6ca7b", "#c4755f", "#f8f5f0", "#18181b"],
          });
        } catch {
          // ignore confetti errors in headless test
        }

        toast.success(
          "Reservation request registered! Our salon concierge will confirm your session shortly."
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

  // Quick Date Selectors
  const setQuickDate = (daysAhead: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    setSelectedDate(d.toISOString().split("T")[0]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl max-h-[92vh] overflow-y-auto p-6 sm:p-8 bg-card border-gold-500/20 shadow-2xl">
        <DialogHeader className="space-y-2 text-left">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-widest bg-gold-500/10 border border-gold-500/30 text-gold-700 dark:text-gold-300">
              <Sparkles className="w-3 h-3 text-gold-500" />
              {service.category}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-primary" /> {service.durationMinutes} Minutes
            </span>
          </div>
          <DialogTitle className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
            Reserve: {service.title}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Select your preferred appointment date and curated time slot. Gratuity and post-treatment refreshments are included.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Date Picker Input & Quick Chips */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <CalendarIcon className="w-4 h-4 text-primary" /> Select Date
              </label>
              <div className="flex items-center gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => setQuickDate(1)}
                  className="px-2.5 py-1 rounded-full bg-secondary hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors text-[11px]"
                >
                  Tomorrow
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDate(2)}
                  className="px-2.5 py-1 rounded-full bg-secondary hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors text-[11px]"
                >
                  In 2 Days
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDate(7)}
                  className="px-2.5 py-1 rounded-full bg-secondary hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors text-[11px]"
                >
                  Next Week
                </button>
              </div>
            </div>
            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full flex h-11 rounded-xl border border-input bg-background px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/50"
            />
          </div>

          {/* Time Slot Picker */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-primary" /> Available Openings
              </label>
              {isLoadingSlots && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin text-gold-500" /> Verifying schedule...
                </span>
              )}
            </div>

            {availableSlots.length === 0 && !isLoadingSlots ? (
              <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-center text-sm text-destructive flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4" />
                All resident specialists are reserved for this date. Please choose another date.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto p-1">
                {availableSlots.map((slot) => {
                  const isSelected = selectedSlot === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-semibold border text-center transition-all duration-200 ${
                        isSelected
                          ? "bg-gradient-to-r from-gold-500 to-terracotta-600 text-white border-transparent shadow-md shadow-gold-500/20 scale-[1.02]"
                          : "bg-secondary/40 hover:bg-secondary border-border/80 text-foreground hover:border-gold-500/40"
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Client Notes */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Stylist Notes & Sensory Preferences (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Sensitive scalp, preferred silence during ritual, iced matcha tea preference..."
              className="w-full rounded-xl border border-input bg-background p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/50"
            />
          </div>

          {/* Luxury Summary Box */}
          <div className="rounded-2xl bg-gradient-to-br from-secondary/50 via-background to-secondary/30 border border-gold-500/20 p-5 space-y-3 text-sm shadow-inner">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Session Investment:</span>
              <span className="font-serif text-lg font-bold text-foreground">
                {formatCurrency(service.price)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Reserved Schedule:</span>
              <span className="font-semibold text-gold-600 dark:text-gold-400">
                {selectedDate} at {selectedSlot || "Select slot above"}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/60">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> Instant Confirmation & Stripe Protection
              </span>
              <span>No pre-payment required until approved</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="sm:w-1/3 rounded-xl"
          >
            Cancel
          </Button>
          <Button
            variant="luxury"
            onClick={handleBookNow}
            disabled={!selectedSlot || isSubmitting}
            className="sm:w-2/3 gap-2 rounded-xl text-sm font-semibold shadow-lg shadow-gold-500/20"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Confirming with Atelier...
              </>
            ) : (
              <>
                Confirm Reservation <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
