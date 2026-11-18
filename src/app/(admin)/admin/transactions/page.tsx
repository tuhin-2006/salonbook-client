"use client";

import React, { useEffect, useState } from "react";
import { CreditCard, ShieldCheck, Search } from "lucide-react";
import { api } from "@/lib/api";
import { Transaction, ApiResponse } from "@/types";
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
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 pb-6 border-b border-[#302821]/15">
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#B8755B] font-semibold block">
            TREASURY &amp; SETTLEMENTS
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#302821] dark:text-[#F5F1E8]">
            Stripe Financial Ledger
          </h2>
          <p className="text-xs text-[#302821]/70 dark:text-[#EAE3D6]/70 max-w-xl leading-relaxed">
            Immutable transaction records verified and synchronized via Stripe Webhooks.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#26372D]/20 bg-[#EAE3D6]/50 text-[#26372D] text-[10px] uppercase tracking-[0.2em] font-semibold self-start sm:self-auto">
          <ShieldCheck className="w-3.5 h-3.5 text-[#26372D] dark:text-[#A4AA91]" />
          <span>WEBHOOK SYNCHRONIZED</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="border border-[#302821]/15 dark:border-[#EAE3D6]/15 bg-[#EAE3D6]/40 dark:bg-[#1a201c] p-4 max-w-md">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#302821]/40" />
          <Input
            placeholder="Search by patron name, email, or Stripe ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 text-xs rounded-none border-[#302821]/20 bg-[#F5F1E8] dark:bg-[#151916] text-[#302821] dark:text-[#F5F1E8]"
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="border border-[#302821]/15 dark:border-[#EAE3D6]/15 bg-[#EAE3D6]/30 dark:bg-[#1a201c] p-6">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-[#26372D] border-t-transparent animate-spin mx-auto" />
            <p className="text-xs uppercase tracking-wider text-[#302821]/60">
              Accessing Stripe Ledger...
            </p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="py-16 text-center space-y-3 max-w-sm mx-auto">
            <div className="w-12 h-12 border border-[#302821]/20 bg-[#EAE3D6] mx-auto flex items-center justify-center font-bold text-[#26372D]">
              <CreditCard className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-xl text-[#302821] dark:text-[#F5F1E8]">
              No Transactions Recorded
            </h4>
            <p className="text-xs text-[#302821]/70 leading-relaxed">
              When patrons complete checkout via Stripe, verified ledger rows will populate here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#302821]/15 text-[#302821]/60 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="pb-3 pr-4">Patron Client</th>
                  <th className="pb-3 px-4">Stripe Reference</th>
                  <th className="pb-3 px-4">Gross Amount</th>
                  <th className="pb-3 px-4">Currency</th>
                  <th className="pb-3 px-4">Settlement Date</th>
                  <th className="pb-3 pl-4 text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#302821]/10">
                {filteredTransactions.map((tx) => {
                  const customer = typeof tx.customerId === "object" ? tx.customerId : null;

                  return (
                    <tr key={tx._id} className="hover:bg-[#EAE3D6]/60 transition-colors">
                      <td className="py-4 pr-4">
                        <div>
                          <p className="font-medium text-[#302821] dark:text-[#F5F1E8] text-xs">
                            {customer?.name || "Client Patron"}
                          </p>
                          <p className="text-[10px] text-[#302821]/60">
                            {customer?.email || "—"}
                          </p>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-mono text-[11px] text-[#302821]/70">
                        {tx.stripePaymentIntentId || tx.stripeSessionId || tx._id}
                      </td>

                      <td className="py-4 px-4 font-serif text-base text-[#26372D] dark:text-[#F5F1E8] whitespace-nowrap">
                        {formatCurrency(tx.amount)}
                      </td>

                      <td className="py-4 px-4 uppercase text-[10px] font-semibold text-[#302821]/70">
                        USD
                      </td>

                      <td className="py-4 px-4 text-[#302821]/70 whitespace-nowrap">
                        {formatDate(tx.createdAt)}
                      </td>

                      <td className="py-4 pl-4 text-right whitespace-nowrap">
                        <span className="px-2.5 py-0.5 text-[9px] uppercase tracking-wider font-semibold bg-[#26372D] text-[#F5F1E8]">
                          Stripe Confirmed
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
