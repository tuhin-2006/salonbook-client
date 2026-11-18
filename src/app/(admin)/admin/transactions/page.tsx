"use client";

import React, { useEffect, useState } from "react";
import { CreditCard, CheckCircle2, XCircle, Search, ShieldCheck } from "lucide-react";
import { api } from "@/lib/api";
import { Transaction, ApiResponse, User as UserType } from "@/types";
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
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
            Stripe Transaction Ledger
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Immutable transaction logs synced via verified Stripe Webhooks.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-600 self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4" />
          <span>Webhook Enforced · Read Only</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-card rounded-2xl border border-border p-4 max-w-md shadow-sm">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by client name, email, or Stripe ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 text-xs rounded-xl"
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-muted-foreground text-sm space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
            <p className="text-xs font-semibold">Loading Stripe transactions...</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="py-16 text-center space-y-3 max-w-sm mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center font-bold">
              <CreditCard className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-foreground">
              No Transactions Recorded
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              When clients pay via Stripe Checkout, real-time verified ledger records will populate here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
                  <th className="pb-3 pr-4">Patron Client</th>
                  <th className="pb-3 px-4">Amount</th>
                  <th className="pb-3 px-4">Stripe Intent / ID</th>
                  <th className="pb-3 px-4">Payment Date</th>
                  <th className="pb-3 pl-4 text-right">Gateway Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredTransactions.map((tx) => {
                  const customer =
                    typeof tx.customerId === "object" ? tx.customerId : null;

                  return (
                    <tr key={tx._id} className="hover:bg-secondary/40 transition-colors">
                      <td className="py-4 pr-4">
                        <p className="font-bold text-foreground text-xs leading-tight">
                          {customer?.name || "Client Guest"}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {customer?.email || "No email"}
                        </p>
                      </td>

                      <td className="py-4 px-4 font-black text-foreground text-sm whitespace-nowrap">
                        {formatCurrency(tx.amount)}
                      </td>

                      <td className="py-4 px-4 font-mono text-muted-foreground text-[11px]">
                        {tx.stripePaymentIntentId || tx.stripeSessionId || tx._id}
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap text-muted-foreground">
                        {formatDate(tx.createdAt)}
                      </td>

                      <td className="py-4 pl-4 text-right whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" /> Succeeded
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
