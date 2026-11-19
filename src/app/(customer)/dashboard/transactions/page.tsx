"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  CreditCard,
  ShieldCheck,
  Calendar,
  DollarSign,
  Download,
  ExternalLink,
  Receipt,
  Lock,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { api } from "@/lib/api";
import { Transaction, ApiResponse } from "@/types";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function CustomerTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTransactions = async () => {
    try {
      setRefreshing(true);
      const res = await api.get<ApiResponse<Transaction[]>>("/payments/my-transactions");
      if (res.data.success) {
        setTransactions(res.data.data);
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || "Could not retrieve transaction history.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const totalSpent = useMemo(() => {
    return transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);
  }, [transactions]);

  return (
    <div className="space-y-8">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-border/80">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-[11px] uppercase tracking-[0.25em] text-accent font-bold">
              Billing &amp; Receipts
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Invoices &amp; Stripe Receipts
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
            Verified payment receipts and digital proof of purchase for treatments concluded at SalonBook Atelier.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchTransactions}
            disabled={refreshing}
            className="rounded-xl text-xs font-semibold gap-2 border-border hover:bg-muted"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-accent" : ""}`} />
            <span>Refresh Receipts</span>
          </Button>

          <div className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] uppercase tracking-[0.2em] font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Stripe Encrypted</span>
          </div>
        </div>
      </div>

      {/* 2. Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl border border-border/80 bg-card flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
              Total Invested in Care
            </span>
            <h3 className="font-sans text-2xl sm:text-3xl font-bold text-foreground tabular-nums tracking-tight">
              {formatCurrency(totalSpent)}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-accent/20 text-accent flex items-center justify-center font-bold">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-border/80 bg-card flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
              Settled Invoices
            </span>
            <h3 className="font-sans text-2xl sm:text-3xl font-bold text-foreground tabular-nums tracking-tight">
              {transactions.length} <span className="text-base font-medium text-muted-foreground">Receipts</span>
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-muted/60 text-foreground flex items-center justify-center">
            <Receipt className="w-5 h-5 text-accent" />
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-border/80 bg-card flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
              Payment Standard
            </span>
            <div className="flex items-center gap-2">
              <span className="font-sans text-base font-bold text-emerald-600 dark:text-emerald-400 tracking-tight flex items-center gap-1.5">
                <Lock className="w-4 h-4" /> PCI-DSS Compliant
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Verified
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Luxury Transactions Table */}
      <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent animate-spin rounded-full mx-auto" />
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
              Loading Ledger Records...
            </p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-20 text-center space-y-3 max-w-sm mx-auto p-6">
            <div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto text-muted-foreground">
              <CreditCard className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-serif text-xl font-bold text-foreground">
              No Payment Receipts Yet
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              When you pay for confirmed appointments via Stripe, receipts will be catalogued here automatically with verifiable references.
            </p>
            <div className="pt-2">
              <Link href="/dashboard/appointments">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl text-xs uppercase tracking-wider border-border"
                >
                  Review Bookings
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full min-w-[600px] text-left text-xs">
              <thead>
                <tr className="border-b border-border/70 bg-muted/30 text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-4 px-6">Transaction Reference</th>
                  <th className="py-4 px-4">Amount</th>
                  <th className="py-4 px-4">Gateway</th>
                  <th className="py-4 px-4">Date</th>
                  <th className="py-4 px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {transactions.map((tx) => (
                  <tr
                    key={tx._id}
                    className="hover:bg-muted/40 transition-colors group"
                  >
                    {/* Reference */}
                    <td className="py-4 px-6">
                      <div className="space-y-0.5">
                        <span className="font-mono text-xs font-semibold text-foreground block">
                          {tx.stripeSessionId
                            ? `${tx.stripeSessionId.slice(0, 18)}...`
                            : `TX-${tx._id.slice(-8).toUpperCase()}`}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          ID: {tx._id}
                        </span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="font-sans text-base font-bold text-foreground tabular-nums">
                        {formatCurrency(tx.amount)}
                      </span>
                    </td>

                    {/* Gateway */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/60 border border-border text-[11px] text-foreground font-medium">
                        <CreditCard className="w-3 h-3 text-accent" />
                        <span>Stripe Checkout</span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5 text-accent" />
                        <span>{formatDate(tx.createdAt)}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Succeeded</span>
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
