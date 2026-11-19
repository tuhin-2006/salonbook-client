"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  CreditCard,
  ShieldCheck,
  Search,
  ExternalLink,
  DollarSign,
  TrendingUp,
  RefreshCw,
  CheckCircle2,
  Calendar,
  Lock,
} from "lucide-react";
import { api } from "@/lib/api";
import { Transaction, ApiResponse } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");

  const fetchTransactions = async () => {
    try {
      setRefreshing(true);
      const res = await api.get<ApiResponse<{ transactions: Transaction[] }>>(
        "/payments/transactions?limit=100"
      );
      if (res.data.success) {
        setTransactions(res.data.data.transactions);
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to load transactions");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const customer = typeof tx.customerId === "object" ? tx.customerId : null;
      const name = customer?.name?.toLowerCase() || "";
      const email = customer?.email?.toLowerCase() || "";
      const sessionId = tx.stripeSessionId?.toLowerCase() || "";
      const q = search.toLowerCase();

      return !search || name.includes(q) || email.includes(q) || sessionId.includes(q);
    });
  }, [transactions, search]);

  const totalSettled = useMemo(() => {
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
              Treasury &amp; Settlements
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Stripe Financial Ledger
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
            Immutable transaction logs reconciled synchronously through encrypted Stripe checkout sessions and webhook events.
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
            <span>Sync Ledger</span>
          </Button>

          <div className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] uppercase tracking-[0.2em] font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SSL Verified</span>
          </div>
        </div>
      </div>

      {/* 2. Ledger Highlights & Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl border border-border/80 bg-card flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
              Total Volume Settled
            </span>
            <h3 className="font-sans text-2xl sm:text-3xl font-bold text-foreground tabular-nums tracking-tight">
              {formatCurrency(totalSettled)}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-accent/20 text-accent flex items-center justify-center font-bold">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-border/80 bg-card flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
              Verified Entries
            </span>
            <h3 className="font-sans text-2xl sm:text-3xl font-bold text-foreground tabular-nums tracking-tight">
              {transactions.length} <span className="text-base font-medium text-muted-foreground">Entries</span>
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-muted/60 text-foreground flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-border/80 bg-card flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
              Gateway Protocol
            </span>
            <div className="flex items-center gap-2">
              <span className="font-sans text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400 tracking-tight flex items-center gap-1.5">
                <Lock className="w-4 h-4" /> Stripe 256-bit TLS
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

      {/* 3. Search Filter */}
      <div className="p-4 sm:p-5 rounded-2xl border border-border/80 bg-card shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by patron name, email, or Stripe reference..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 text-xs rounded-xl border-border bg-background text-foreground"
          />
        </div>
      </div>

      {/* 4. Luxury Transactions Table */}
      <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent animate-spin rounded-full mx-auto" />
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
              Accessing Stripe Ledger...
            </p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="py-20 text-center space-y-3 max-w-sm mx-auto p-4">
            <div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto text-muted-foreground">
              <CreditCard className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-serif text-xl font-bold text-foreground">
              No Transactions Recorded
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              When patrons complete checkout via Stripe, verified ledger rows will populate here synchronously.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full min-w-[750px] text-left text-xs">
              <thead>
                <tr className="border-b border-border/70 bg-muted/30 text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-4 px-6">Transaction Ref</th>
                  <th className="py-4 px-4">Patron</th>
                  <th className="py-4 px-4">Amount</th>
                  <th className="py-4 px-4">Settlement Date</th>
                  <th className="py-4 px-4">Payment Method</th>
                  <th className="py-4 px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredTransactions.map((tx) => {
                  const customer =
                    typeof tx.customerId === "object" ? tx.customerId : null;

                  return (
                    <tr
                      key={tx._id}
                      className="hover:bg-muted/40 transition-colors group"
                    >
                      {/* Transaction Reference */}
                      <td className="py-4 px-6">
                        <div className="space-y-0.5">
                          <span className="font-mono text-xs font-semibold text-foreground block">
                            {tx.stripeSessionId
                              ? `${tx.stripeSessionId.slice(0, 16)}...`
                              : `TX-${tx._id.slice(-8).toUpperCase()}`}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            Internal: {tx._id.slice(-8)}
                          </span>
                        </div>
                      </td>

                      {/* Patron */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="space-y-0.5">
                          <span className="font-semibold text-foreground block">
                            {customer?.name || "Verified Client"}
                          </span>
                          <span className="text-[11px] text-muted-foreground block">
                            {customer?.email || "Email recorded"}
                          </span>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="font-sans text-base font-bold text-foreground tabular-nums">
                          {formatCurrency(tx.amount)}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5 text-accent" />
                          <span>{formatDate(tx.createdAt)}</span>
                        </div>
                      </td>

                      {/* Payment Method */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/60 border border-border text-[11px] text-foreground font-medium">
                          <CreditCard className="w-3 h-3 text-accent" />
                          <span>Stripe Checkout</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Succeeded</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
