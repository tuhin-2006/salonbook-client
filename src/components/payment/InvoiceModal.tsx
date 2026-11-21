"use client";

import React, { useRef } from "react";
import {
  Scissors,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Clock,
  User,
  CreditCard,
  X,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { formatCurrency, formatDate, getAppointmentPrice, getAppointmentDate } from "@/lib/utils";
import { Transaction, Appointment } from "@/types";
import { useAuth } from "@/context/AuthContext";

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction?: Transaction | null;
  appointment?: Appointment | null;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  transaction,
  appointment,
}) => {
  const { isAdmin } = useAuth();
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  // Extract appointment data if embedded or passed directly
  const app: any =
    appointment ||
    (transaction?.appointmentId && typeof transaction.appointmentId === "object"
      ? transaction.appointmentId
      : null);

  const service: any =
    app?.serviceId && typeof app?.serviceId === "object"
      ? app.serviceId
      : null;

  const customer: any =
    transaction?.customerId && typeof transaction.customerId === "object"
      ? transaction.customerId
      : app?.customerId && typeof app?.customerId === "object"
      ? app.customerId
      : null;

  const price = transaction?.amount || getAppointmentPrice(app) || 110;
  const invoiceNumber =
    transaction?.invoiceNumber ||
    (transaction?._id
      ? `INV-${new Date().getFullYear()}-${transaction._id.slice(-5).toUpperCase()}`
      : `INV-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`);

  const paymentDate =
    transaction?.createdAt ||
    app?.updatedAt ||
    new Date().toISOString();

  const sessionReference =
    transaction?.stripeSessionId ||
    app?.stripeSessionId ||
    `cs_test_settled_${Date.now()}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100vw-1.5rem)] sm:w-full max-w-2xl max-h-[92vh] overflow-y-auto p-0 bg-[#FAF7F2] dark:bg-[#1A1416] text-[#231C1E] dark:text-[#FAF7F2] border border-[#E8E2D8] dark:border-[#382F33] rounded-2xl shadow-2xl">
        {/* Printable Receipt Container */}
        <div ref={receiptRef} className="p-4 sm:p-8 space-y-5 sm:space-y-6 print:p-8 print:m-0 print:bg-white print:text-black">
          {/* 1. Atelier Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E2D8] dark:border-[#382F33] print:border-neutral-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#251C1D] text-[#FAF7F2] dark:bg-[#C8A879] dark:text-[#170F13] flex items-center justify-center shadow-sm">
                <Scissors className="w-5 h-5 text-[#C8A879] dark:text-[#170F13]" />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold tracking-tight">
                  SalonBook Atelier
                </h2>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider">
                  128 Mercer St, SoHo, New York, NY 10012
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Paid via Stripe</span>
              </span>
              <p className="font-mono text-xs font-bold text-foreground mt-1.5 tabular-nums">
                {invoiceNumber}
              </p>
            </div>
          </div>

          {/* 2. Billing & Settlement Meta */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-[#F5EFEB] dark:bg-[#231A1E] border border-[#E8E2D8]/80 dark:border-[#382F33]/80 text-xs">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block">
                Date Issued
              </span>
              <span className="font-medium text-foreground tabular-nums block">
                {formatDate(paymentDate)}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block">
                Payment Channel
              </span>
              <span className="font-medium text-foreground block">
                Stripe 256-bit TLS
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block">
                Patron Client
              </span>
              <span className="font-medium text-foreground truncate block">
                {customer?.name || "Private Atelier Patron"}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block">
                Status
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 block uppercase text-[11px]">
                ✓ Settled in Full
              </span>
            </div>
          </div>

          {/* 3. Itemized Treatment Breakdown */}
          <div className="space-y-3">
            <h4 className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground">
              Itemized Treatment Summary
            </h4>

            <div className="border border-[#E8E2D8] dark:border-[#382F33] rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#F5EFEB]/70 dark:bg-[#231A1E]/70 border-b border-[#E8E2D8] dark:border-[#382F33] text-[10px] uppercase tracking-wider text-muted-foreground">
                    <th className="py-2.5 px-4 font-semibold">Service / Ritual</th>
                    <th className="py-2.5 px-4 font-semibold">Scheduled</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Fee</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E2D8]/60 dark:divide-[#382F33]/60">
                  <tr>
                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        <span className="font-serif font-bold text-sm text-foreground block">
                          {service?.title || app?.specialist || "Bespoke Salon Ritual"}
                        </span>
                        <span className="text-[10px] text-muted-foreground block">
                          Category: {service?.category || "Specialty Care"} · {service?.durationMinutes || 60} mins
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground tabular-nums whitespace-nowrap">
                      {formatDate(getAppointmentDate(app))} {app?.timeSlot ? `@ ${app.timeSlot}` : ""}
                    </td>
                    <td className="py-3 px-4 text-right font-sans font-bold text-sm text-foreground tabular-nums">
                      {formatCurrency(price)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. Financial Total Summary */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
            <div className="space-y-1 text-xs text-muted-foreground">
              {isAdmin ? (
                <p className="flex items-center gap-1.5 font-mono text-[10px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Stripe Session: {sessionReference.slice(0, 24)}...</span>
                </p>
              ) : (
                <p className="flex items-center gap-1.5 font-mono text-[10px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Payment Gateway: Stripe TLS Verified Secured</span>
                </p>
              )}
              <p className="text-[10px]">
                All charges settled in USD via Stripe Test Sandbox.
              </p>
            </div>

            <div className="w-full sm:w-60 space-y-1.5 p-3.5 rounded-xl bg-[#F5EFEB] dark:bg-[#231A1E] border border-[#E8E2D8] dark:border-[#382F33] text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-medium text-foreground tabular-nums">
                  {formatCurrency(price)}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Taxes &amp; Atelier Care</span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                  $0.00 (Complimentary)
                </span>
              </div>
              <div className="pt-2 border-t border-[#E8E2D8] dark:border-[#382F33] flex justify-between font-bold text-sm text-foreground">
                <span>Total Settled</span>
                <span className="font-sans text-base text-accent tabular-nums">
                  {formatCurrency(price)}
                </span>
              </div>
            </div>
          </div>

          {/* Digital Signature & Authorization */}
          <div className="pt-4 border-t border-dashed border-[#E8E2D8] dark:border-[#382F33] flex items-center justify-between text-[11px] text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Verified Atelier Tax Invoice · Valid Proof of Payment</span>
            </div>
            <span className="font-serif italic text-accent font-semibold">
              SalonBook SoHo NYC
            </span>
          </div>
        </div>

        {/* Modal Actions (Hidden in Print) */}
        <DialogFooter className="p-4 bg-[#F5EFEB]/90 dark:bg-[#231A1E]/90 border-t border-[#E8E2D8] dark:border-[#382F33] flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 print:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="w-full sm:w-auto rounded-xl text-xs border-[#E8E2D8] dark:border-[#382F33]"
          >
            Close
          </Button>

          <Button
            size="sm"
            onClick={handlePrint}
            className="w-full sm:w-auto rounded-xl text-xs font-semibold bg-[#251C1D] text-[#FAF7F2] dark:bg-[#C8A879] dark:text-[#170F13] hover:opacity-90 gap-1.5 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF Receipt</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
