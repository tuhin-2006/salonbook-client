"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CreditCard, CheckCircle2, Clock, AlertCircle, Sparkles, Receipt, ArrowRight, ShieldCheck } from "lucide-react";
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
            Transaction History
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Verified Stripe payments and invoice records for your salon appointments.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold self-start sm:self-auto">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Stripe SSL Encrypted</span>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-muted-foreground text-sm space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
            <p className="text-xs font-semibold text-muted-foreground">Loading payment records...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-16 text-center space-y-3 max-w-sm mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center font-bold">
              <CreditCard className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-foreground">
              No Payment Transactions Yet
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              When you pay for confirmed appointments via Stripe, receipts will be saved here automatically.
            </p>
            <Link href="/dashboard/appointments">
              <Button variant="outline" size="sm" className="rounded-xl text-xs font-bold mt-2">
                Check My Appointments
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
                  <th className="pb-3 pr-4">Transaction ID</th>
                  <th className="pb-3 px-4">Amount</th>
                  <th className="pb-3 px-4">Gateway</th>
                  <th className="pb-3 px-4">Date</th>
                  <th className="pb-3 pl-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-secondary/40 transition-colors">
                    <td className="py-3.5 pr-4 font-mono text-muted-foreground">
                      {tx.stripePaymentIntentId || tx._id.slice(-8)}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-foreground text-sm">
                      {formatCurrency(tx.amount)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/10 text-indigo-600 uppercase">
                        Stripe
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">
                      {formatDate(tx.createdAt)}
                    </td>
                    <td className="py-3.5 pl-4 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 uppercase">
                        <CheckCircle2 className="w-3 h-3" /> Succeeded
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
