"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CreditCard, CheckCircle2, Clock, AlertCircle, Sparkles } from "lucide-react";
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
      <div>
        <h2 className="font-serif text-2xl font-bold text-foreground">
          Transaction History
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Verified Stripe payment audit receipts for completed salon reservations.
        </p>
      </div>

      <div className="bg-card rounded-2xl border border-border/70 p-6 sm:p-8">
        {loading ? (
          <div className="py-20 text-center text-muted-foreground text-sm space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
            <p>Loading your transactions...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-16 text-center space-y-4 max-w-sm mx-auto">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center">
              <CreditCard className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-lg font-semibold text-foreground">
              No Payment Transactions
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              When you complete payments for confirmed salon appointments via Stripe Checkout, verified receipts will appear here.
            </p>
            <Link href="/dashboard/appointments">
              <Button variant="luxury" size="sm" className="mt-2">
                Check My Appointments
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
                  <th className="pb-3 pl-4 text-right">Date</th>
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
                          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                            <CreditCard className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground text-sm">
                              {service?.title || "Salon Appointment"}
                            </p>
                            <p className="text-[11px] text-muted-foreground font-mono">
                              ID: {tx._id.slice(-8)}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-semibold text-foreground whitespace-nowrap">
                        {formatCurrency(tx.amount)}
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap font-mono text-[11px] text-muted-foreground">
                        {tx.stripeSessionId ? tx.stripeSessionId.slice(0, 18) + "..." : "—"}
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <Badge className="bg-emerald-600 text-white gap-1 text-[10px] uppercase font-semibold">
                          <CheckCircle2 className="w-3 h-3" />
                          {tx.status}
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