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
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#6366f1", "#8b5cf6", "#10b981", "#f43f5e"],
      });
    } catch {
      // ignore
    }

    if (appointmentId && (isMock || (sessionId && sessionId.startsWith("cs_mock_")))) {
      api.post("/payments/simulate-dev-payment", {
        appointmentId,
        sessionId,
      }).catch((err) => console.warn("Dev payment simulation sync:", err));
    }
  }, [appointmentId, sessionId, isMock]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-card rounded-2xl border border-border p-8 text-center space-y-6 shadow-xl relative overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-600 mx-auto flex items-center justify-center border border-emerald-500/20">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 text-xs uppercase font-extrabold tracking-wider text-emerald-600 bg-emerald-500/10 px-3.5 py-1 rounded-full border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            Payment Verified
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            Payment Successful!
          </h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your transaction has been securely processed via Stripe. Your appointment is confirmed and your stylist is notified.
          </p>
        </div>

        {sessionId && (
          <div className="p-3 rounded-xl bg-secondary/50 border border-border text-left space-y-1">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Stripe Session ID</span>
            <p className="text-[11px] font-mono text-muted-foreground truncate">{sessionId}</p>
          </div>
        )}

        <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
          <Link href="/dashboard/appointments" className="flex-1">
            <Button variant="gradient" className="w-full text-xs font-bold rounded-xl h-10 gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>My Appointments</span>
            </Button>
          </Link>
          <Link href="/dashboard/transactions" className="flex-1">
            <Button variant="outline" className="w-full text-xs font-bold rounded-xl h-10 gap-1.5">
              <Receipt className="w-4 h-4" />
              <span>View Invoice</span>
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
        <div className="min-h-[75vh] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
