"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { XCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

function PaymentCancelContent() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-20 bg-[#F5F1E8] dark:bg-[#151916] text-[#302821] dark:text-[#F5F1E8]">
      <div className="max-w-md w-full bg-[#EAE3D6]/40 dark:bg-[#1a201c] border border-[#302821]/15 dark:border-[#EAE3D6]/15 p-8 text-center space-y-6">
        <div className="w-14 h-14 border border-[#B8755B] bg-[#B8755B]/10 text-[#B8755B] mx-auto flex items-center justify-center">
          <XCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-[#B8755B] block">
            CHECKOUT INCOMPLETE
          </span>
          <h1 className="font-serif text-3xl font-normal text-[#302821] dark:text-[#F5F1E8]">
            Payment Cancelled
          </h1>
          <p className="text-xs text-[#302821]/70 dark:text-[#EAE3D6]/70 leading-relaxed">
            Your Stripe checkout session was not completed. No charges were made. Your reservation remains held in your diary and you may complete checkout at any time.
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-3">
          <Link href="/dashboard/appointments">
            <Button
              variant="default"
              className="w-full h-11 text-xs uppercase tracking-wider rounded-none bg-[#26372D] text-[#F5F1E8] hover:bg-[#343D2E]"
            >
              <span>RETURN TO MY RESERVATIONS</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </Link>
          <Link href="/services">
            <Button
              variant="outline"
              className="w-full h-11 text-xs uppercase tracking-wider rounded-none border-[#302821]/20"
            >
              BROWSE CARTE
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
        <div className="min-h-[70vh] flex items-center justify-center bg-[#F5F1E8]">
          <div className="w-8 h-8 border-2 border-[#26372D] border-t-transparent animate-spin" />
        </div>
      }
    >
      <PaymentCancelContent />
    </Suspense>
  );
}
