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
} from "lucide-react";
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
      toast.error("Please log in to reserve an appointment.");
      router.push(`/login?redirect=/services/${service._id}`);
      onClose();
      return;
    }

    if (!selectedSlot) {
      toast.error("Please select an available appointment slot.");
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
        toast.success(
          "Appointment request submitted! Awaiting salon artist confirmation."
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="terracotta">{service.category}</Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {service.durationMinutes} mins
            </span>
          </div>
          <DialogTitle className="text-2xl font-serif">
            Reserve: {service.title}
          </DialogTitle>
          <DialogDescription>
            Select your preferred reservation date and time slot for your bespoke experience.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Date Picker Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <CalendarIcon className="w-4 h-4 text-primary" /> Select Reservation Date
            </label>
            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full flex h-11 rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          {/* Time Slot Picker */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-primary" /> Available Time Slots
              </label>
              {isLoadingSlots && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin text-primary" /> Checking slots...
                </span>
              )}
            </div>

            {availableSlots.length === 0 && !isLoadingSlots ? (
              <div className="p-4 rounded-lg bg-muted text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                All slots are booked for this date. Please select another date.
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto p-1">
                {availableSlots.map((slot) => {
                  const isSelected = selectedSlot === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2.5 px-3 rounded-lg text-xs font-medium border text-center transition-all ${
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-card hover:bg-muted border-border text-foreground"
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
              Special Requests or Stylist Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Sensitive scalp, preferred stylist, dietary preferences for refreshment..."
              className="w-full rounded-lg border border-input bg-background p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          {/* Summary Box */}
          <div className="rounded-xl bg-secondary/50 border border-border p-4 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Service Fee:</span>
              <span className="font-semibold text-foreground">
                {formatCurrency(service.price)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Selected Slot:</span>
              <span className="font-semibold text-primary">
                {selectedDate} at {selectedSlot || "Not selected"}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border">
              <span>Payment Processing:</span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> Powered by Stripe Checkout
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button variant="outline" onClick={onClose} className="sm:w-1/3">
            Cancel
          </Button>
          <Button
            variant="luxury"
            onClick={handleBookNow}
            disabled={!selectedSlot || isSubmitting}
            className="sm:w-2/3 gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting Request...
              </>
            ) : (
              <>
                Request Appointment <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
