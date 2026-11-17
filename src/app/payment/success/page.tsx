"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Calendar, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const appointmentId = searchParams.get("appointment_id");
  const isMock = searchParams.get("mock") === "true";

  useEffect(() => {
    // If mock dev mode, trigger local payment simulation
    if (appointmentId && (isMock || (sessionId && sessionId.startsWith("cs_mock_")))) {
      api.post("/payments/simulate-dev-payment", {
        appointmentId,
        sessionId,
      }).catch((err) => console.warn("Dev payment simulation sync:", err));
    }
  }, [appointmentId, sessionId, isMock]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-card rounded-2xl border border-border/80 p-8 text-center space-y-6 shadow-lg">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase font-semibold tracking-wider text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full">
            Payment Verified
          </span>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Appointment Confirmed!
          </h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your transaction has been securely processed by Stripe. Your salon master artist has been notified of your reservation.
          </p>
        </div>

        {appointmentId && (
          <div className="p-4 rounded-xl bg-muted/40 border border-border/60 text-xs space-y-1.5 text-left font-mono">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Appointment ID:</span>
              <span className="font-semibold text-foreground">{appointmentId.slice(-8)}</span>
            </div>
            {sessionId && (
              <div className="flex justify-between truncate">
                <span className="text-muted-foreground">Stripe Session:</span>
                <span className="text-muted-foreground truncate max-w-[180px]">{sessionId}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className="text-emerald-600 font-semibold">PAID</span>
            </div>
          </div>
        )}

        <div className="pt-2 flex flex-col gap-3">
          <Link href="/dashboard/appointments">
            <Button variant="luxury" className="w-full gap-2">
              <Calendar className="w-4 h-4" />
              <span>View in My Appointments</span>
            </Button>
          </Link>
          <Link href="/services">
            <Button variant="ghost" className="w-full text-xs">
              Explore More Treatments
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent animate-spin rounded-full" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}