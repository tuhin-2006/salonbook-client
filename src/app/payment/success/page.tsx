"use client";

import React, { useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Calendar, ArrowRight, ShieldCheck, Sparkles, Receipt } from "lucide-react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const appointmentId = searchParams.get("appointment_id");
  const isMock = searchParams.get("mock") === "true";

  useEffect(() => {
    // Trigger celebratory confetti burst
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#be9643", "#e6ca7b", "#c4755f", "#f8f5f0"],
      });
    } catch {
      // ignore in tests
    }

    // If mock dev mode, trigger local payment simulation
    if (appointmentId && (isMock || (sessionId && sessionId.startsWith("cs_mock_")))) {
      api.post("/payments/simulate-dev-payment", {
        appointmentId,
        sessionId,
      }).catch((err) => console.warn("Dev payment simulation sync:", err));
    }
  }, [appointmentId, sessionId, isMock]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-card rounded-3xl border border-gold-500/30 p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-gold-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/20 shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 text-xs uppercase font-bold tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3.5 py-1 rounded-full border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            Stripe Transaction Verified
          </span>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Appointment Confirmed!
          </h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your transaction has been securely processed. Our master resident artist has reserved your private chair at 450 Madison Avenue.
          </p>
        </div>

        {appointmentId && (
          <div className="p-4 rounded-2xl bg-secondary/50 border border-gold-500/20 text-xs space-y-2 text-left font-mono">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Appointment Voucher:</span>
              <span className="font-bold text-foreground">#{appointmentId.slice(-8).toUpperCase()}</span>
            </div>
            {sessionId && (
              <div className="flex justify-between truncate">
                <span className="text-muted-foreground">Stripe Session:</span>
                <span className="text-muted-foreground truncate max-w-[180px]">{sessionId}</span>
              </div>
            )}
            <div className="flex justify-between pt-1 border-t border-border/60">
              <span className="text-muted-foreground">Status:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">SETTLED & PAID</span>
            </div>
          </div>
        )}

        <div className="pt-2 flex flex-col gap-3">
          <Link href="/dashboard/appointments">
            <Button variant="luxury" className="w-full gap-2 rounded-2xl h-11 text-xs font-semibold shadow-md shadow-gold-500/20">
              <Calendar className="w-4 h-4" />
              <span>Review in My Lounge Appointments</span>
            </Button>
          </Link>
          <Link href="/services">
            <Button variant="ghost" className="w-full text-xs rounded-full">
              Explore More Atelier Rituals
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
