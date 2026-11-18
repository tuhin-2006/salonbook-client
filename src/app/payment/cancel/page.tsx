"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { XCircle, Calendar, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get("appointment_id");

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-card rounded-3xl border border-amber-500/30 p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center border border-amber-500/20">
          <XCircle className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 text-xs uppercase font-bold tracking-widest text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3.5 py-1 rounded-full border border-amber-500/20">
            Payment Suspended
          </span>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Checkout Session Cancelled
          </h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your Stripe checkout session was cancelled. No charges were deducted from your card. Your confirmed appointment remains held in your patron lounge.
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-3">
          <Link href="/dashboard/appointments">
            <Button variant="luxury" className="w-full gap-2 rounded-2xl h-11 text-xs font-semibold shadow-md shadow-gold-500/20">
              <Calendar className="w-4 h-4" />
              <span>Retry Payment in Lounge</span>
            </Button>
          </Link>
          <Link href="/services">
            <Button variant="ghost" className="w-full text-xs rounded-full">
              Return to Services Menu
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent animate-spin rounded-full" />
        </div>
      }
    >
      <PaymentCancelContent />
    </Suspense>
  );
}
