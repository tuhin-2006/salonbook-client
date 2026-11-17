"use client";

import React, { useEffect, useState } from "react";
import { CreditCard, CheckCircle2, XCircle, Search, ShieldCheck } from "lucide-react";
import { api } from "@/lib/api";
import { Transaction, ApiResponse, User as UserType } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchTransactions = async () => {
    try {
      setLoading(true);
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
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter((tx) => {
    const customer = typeof tx.customerId === "object" ? tx.customerId : null;
    const name = customer?.name?.toLowerCase() || "";
    const email = customer?.email?.toLowerCase() || "";
    const sessionId = tx.stripeSessionId?.toLowerCase() || "";
    const q = search.toLowerCase();

    return !search || name.includes(q) || email.includes(q) || sessionId.includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-foreground">
            Stripe Transaction Ledger
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Immutable cryptographic transaction log synced via verified Stripe Webhooks.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted/40 border border-border text-xs text-muted-foreground">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Webhook Enforced · Read Only</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-card rounded-2xl border border-border/70 p-4 sm:p-6 max-w-md">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by customer name, email, or Stripe session ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 text-xs"
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-card rounded-2xl border border-border/70 p-6 sm:p-8">
        {loading ? (
          <div className="py-20 text-center text-muted-foreground text-sm space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
            <p>Loading financial transactions...</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="py-16 text-center space-y-4 max-w-sm mx-auto">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center">
              <CreditCard className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-lg font-semibold text-foreground">
              No Transactions Recorded
            </h4>
            <p className="text-xs text-muted-foreground">
              No transactions match your current search criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border/80 text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                  <th className="pb-3 pr-4">Transaction / Appointment</th>
                  <th className="pb-3 px-4">Customer</th>
                  <th className="pb-3 px-4">Amount</th>
                  <th className="pb-3 px-4">Stripe Session ID</th>
                  <th className="pb-3 px-4">Payment Status</th>
                  <th className="pb-3 pl-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredTransactions.map((tx) => {
                  const customer = typeof tx.customerId === "object" ? tx.customerId : null;
                  const appointment = typeof tx.appointmentId === "object" ? tx.appointmentId : null;
                  const isPaid = tx.status === "succeeded" || (tx.status as string) === "paid";

                  return (
                    <tr key={tx._id} className="hover:bg-muted/40 transition-colors">
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                            <CreditCard className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-mono text-xs font-semibold text-foreground">
                              TX #{tx._id.slice(-8)}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              Appt: {typeof tx.appointmentId === "string" ? tx.appointmentId.slice(-8) : appointment?._id?.slice(-8)}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <p className="font-medium text-foreground">
                          {customer?.name || "Guest"}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {customer?.email || "No email"}
                        </p>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap font-semibold text-foreground">
                        {formatCurrency(tx.amount)} <span className="text-[10px] text-muted-foreground uppercase">{tx.currency}</span>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap font-mono text-[11px] text-muted-foreground">
                        {tx.stripeSessionId ? tx.stripeSessionId.slice(0, 18) + "..." : "—"}
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <Badge
                          className={`gap-1 capitalize text-[10px] font-semibold ${
                            isPaid
                              ? "bg-emerald-600 text-white"
                              : "bg-destructive text-white"
                          }`}
                        >
                          {isPaid ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" /> Paid
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" /> Failed
                            </>
                          )}
                        </Badge>
                      </td>

                      <td className="py-4 pl-4 text-right whitespace-nowrap text-muted-foreground text-xs">
                        {formatDate(tx.createdAt)}
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