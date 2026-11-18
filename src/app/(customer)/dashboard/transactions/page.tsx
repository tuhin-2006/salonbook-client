"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CreditCard, CheckCircle2, Clock, AlertCircle, Sparkles, Receipt, ArrowRight, ShieldCheck } from "lucide-react";
import { api } from "@/lib/api";
import { Transaction, ApiResponse } from "@/types";
import { Badge } from "@/components/ui/badge";
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
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
            Transaction Ledger & Invoices
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Verified Stripe payment receipts for completed salon reservations and treatments.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>256-Bit SSL Encrypted Ledger</span>
        </div>
      </div>

      <div className="bg-card rounded-3xl border border-gold-500/20 p-6 sm:p-8 shadow-xl">
        {loading ? (
          <div className="py-20 text-center text-muted-foreground text-sm space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-gold-500 border-t-transparent animate-spin mx-auto" />
            <p className="text-xs font-semibold text-muted-foreground">Verifying transaction ledgers...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-16 text-center space-y-4 max-w-sm mx-auto">
            <div className="w-12 h-12 rounded-full bg-gold-500/10 text-gold-500 mx-auto flex items-center justify-center">
              <CreditCard className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-xl font-bold text-foreground">
              No Payment Transactions Yet
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              When you complete payments for confirmed salon appointments via Stripe Checkout, official receipts and line-item vouchers will appear here.
            </p>
            <Link href="/dashboard/appointments">
              <Button variant="luxury" size="sm" className="mt-2 rounded-full text-xs font-semibold">
                View My Appointments
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border/80 text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                  <th className="pb-3 pr-4">Transaction / Service</th>
                  <th className="pb-3 px-4">Amount</th>
                  <th className="pb-3 px-4">Stripe Reference</th>
                  <th className="pb-3 px-4">Status</th>
                  <th className="pb-3 pl-4 text-right">Settled Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {transactions.map((tx) => {
                  const appointment = typeof tx.appointmentId === "object" ? tx.appointmentId : null;
                  const service = appointment?.serviceId;

                  return (
                    <tr key={tx._id} className="hover:bg-muted/40 transition-colors">
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gold-500/10 text-gold-600 dark:text-gold-400 flex items-center justify-center shrink-0 border border-gold-500/20">
                            <Receipt className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-serif font-bold text-foreground text-sm">
                              {service?.title || "Salon Appointment"}
                            </p>
                            <p className="text-[11px] text-muted-foreground font-mono">
                              Voucher: {tx._id.slice(-8).toUpperCase()}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-serif font-bold text-foreground whitespace-nowrap text-base">
                        {formatCurrency(tx.amount)}
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap font-mono text-[11px] text-muted-foreground">
                        {tx.stripeSessionId ? tx.stripeSessionId.slice(0, 18) + "..." : "—"}
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <Badge className="bg-emerald-600 text-white gap-1 text-[10px] uppercase font-bold tracking-wider">
                          <CheckCircle2 className="w-3 h-3" />
                          {tx.status}
                        </Badge>
                      </td>

                      <td className="py-4 pl-4 text-right whitespace-nowrap text-muted-foreground text-xs font-medium">
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
