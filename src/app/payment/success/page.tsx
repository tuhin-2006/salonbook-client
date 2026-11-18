"use client";

import React, { useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ShieldCheck, ArrowRight, Receipt } from "lucide-react";
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
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#26372D", "#B8755B", "#343D2E", "#A4AA91"],
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
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-20 bg-[#F5F1E8] dark:bg-[#151916] text-[#302821] dark:text-[#F5F1E8]">
      <div className="max-w-md w-full bg-[#EAE3D6]/40 dark:bg-[#1a201c] border border-[#302821]/15 dark:border-[#EAE3D6]/15 p-8 text-center space-y-6">
        <div className="w-14 h-14 bg-[#26372D] text-[#F5F1E8] mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-[#B8755B] block">
            SETTLEMENT VERIFIED
          </span>
          <h1 className="font-serif text-3xl font-normal text-[#302821] dark:text-[#F5F1E8]">
            Payment Confirmed
          </h1>
          <p className="text-xs text-[#302821]/70 dark:text-[#EAE3D6]/70 leading-relaxed">
            Your transaction has been securely settled via Stripe. Your reservation is finalized and your master practitioner is notified.
          </p>
        </div>

        {sessionId && (
          <div className="p-3 border border-[#302821]/15 bg-[#F5F1E8] text-left space-y-1">
            <span className="text-[9px] uppercase tracking-wider text-[#302821]/60 font-semibold block">
              Stripe Transaction ID
            </span>
            <p className="text-xs font-mono text-[#302821]/70 truncate">{sessionId}</p>
          </div>
        )}

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link href="/dashboard/appointments" className="flex-1">
            <Button
              variant="default"
              className="w-full text-xs uppercase tracking-wider rounded-none h-11 bg-[#26372D] text-[#F5F1E8] hover:bg-[#343D2E]"
            >
              <span>MY DIARY</span>
            </Button>
          </Link>
          <Link href="/dashboard/transactions" className="flex-1">
            <Button
              variant="outline"
              className="w-full text-xs uppercase tracking-wider rounded-none h-11 border-[#302821]/20"
            >
              <Receipt className="w-3.5 h-3.5 mr-1" />
              <span>RECEIPT</span>
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
        <div className="min-h-[75vh] flex items-center justify-center bg-[#F5F1E8]">
          <div className="w-8 h-8 border-2 border-[#26372D] border-t-transparent animate-spin" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
