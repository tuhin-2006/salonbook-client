"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CreditCard, ShieldCheck } from "lucide-react";
import { api } from "@/lib/api";
import { Transaction, ApiResponse } from "@/types";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function CustomerTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const res = await api.get<ApiResponse<Transaction[]>>("/payments/my-transactions");
        if (res.data.success) {
          setTransactions(res.data.data);
        }
      } catch (err: unknown) {
        toast.error((err as Error).message || "Could not retrieve transaction history.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 pb-6 border-b border-[#302821]/15">
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#B8755B] font-semibold block">
            FINANCIAL DOSSIER
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#302821] dark:text-[#F5F1E8]">
            Invoices &amp; Stripe Receipts
          </h2>
          <p className="text-xs text-[#302821]/70 dark:text-[#EAE3D6]/70 max-w-lg leading-relaxed">
            Verified payment receipts and digital invoices for treatments concluded at SalonBook Atelier.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#26372D]/20 bg-[#EAE3D6]/50 text-[#26372D] dark:text-[#EAE3D6] text-[10px] uppercase tracking-[0.2em] font-semibold self-start sm:self-auto">
          <ShieldCheck className="w-3.5 h-3.5 text-[#26372D] dark:text-[#A4AA91]" />
          <span>STRIPE SSL ENCRYPTED</span>
        </div>
      </div>

      <div className="border border-[#302821]/15 dark:border-[#EAE3D6]/15 bg-[#EAE3D6]/30 dark:bg-[#1a201c] p-6 sm:p-8">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-[#26372D] border-t-transparent animate-spin mx-auto" />
            <p className="text-xs uppercase tracking-wider text-[#302821]/60">
              Loading Ledger Records...
            </p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-16 text-center space-y-3 max-w-sm mx-auto">
            <div className="w-12 h-12 border border-[#302821]/20 bg-[#EAE3D6] mx-auto flex items-center justify-center font-bold text-[#26372D]">
              <CreditCard className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-xl text-[#302821] dark:text-[#F5F1E8]">
              No Payment Receipts Yet
            </h4>
            <p className="text-xs text-[#302821]/70 leading-relaxed">
              When you pay for confirmed appointments via Stripe, receipts will be catalogued here automatically.
            </p>
            <div className="pt-2">
              <Link href="/dashboard/appointments">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-none text-xs uppercase tracking-wider border-[#302821]/20"
                >
                  Review Bookings
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#302821]/15 text-[#302821]/60 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="pb-3 pr-4">Transaction Reference</th>
                  <th className="pb-3 px-4">Amount</th>
                  <th className="pb-3 px-4">Gateway</th>
                  <th className="pb-3 px-4">Date</th>
                  <th className="pb-3 pl-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#302821]/10">
                {transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-[#EAE3D6]/60 transition-colors">
                    <td className="py-3.5 pr-4 font-mono text-xs text-[#302821]/70 dark:text-[#EAE3D6]/70">
                      {tx.stripePaymentIntentId || tx._id}
                    </td>
                    <td className="py-3.5 px-4 font-serif text-base text-[#26372D] dark:text-[#F5F1E8]">
                      {formatCurrency(tx.amount)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 text-[9px] uppercase tracking-wider font-semibold border border-[#302821]/20">
                        Stripe Checkout
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#302821]/70 dark:text-[#EAE3D6]/70">
                      {formatDate(tx.createdAt)}
                    </td>
                    <td className="py-3.5 pl-4 text-right">
                      <span className="px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-semibold bg-[#26372D] text-[#F5F1E8]">
                        Verified Paid
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
