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
      <div className="max-w-md w-full bg-card rounded-2xl border border-border p-8 text-center space-y-6 shadow-xl relative overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 mx-auto flex items-center justify-center border border-amber-500/20">
          <XCircle className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 text-xs uppercase font-extrabold tracking-wider text-amber-600 bg-amber-500/10 px-3.5 py-1 rounded-full border border-amber-500/20">
            Payment Cancelled
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            Checkout Incomplete
          </h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your Stripe payment session was cancelled. No money was deducted. Your appointment is still held and you can complete payment anytime.
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-2.5">
          <Link href="/dashboard/appointments">
            <Button variant="gradient" className="w-full gap-2 rounded-xl h-11 text-xs font-bold shadow-md shadow-primary/20">
              <Calendar className="w-4 h-4" />
              <span>Go to My Appointments</span>
            </Button>
          </Link>
          <Link href="/services">
            <Button variant="ghost" className="w-full text-xs font-bold rounded-xl">
              Browse More Services
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
          <div className="w-8 h-8 border-2 border-primary border-t-transparent animate-spin rounded-full" />
        </div>
      }
    >
      <PaymentCancelContent />
    </Suspense>
  );
}
