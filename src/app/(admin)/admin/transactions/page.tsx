"use client";

import React, { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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
  Clock,
  Lock,
  Receipt,
  User,
  X,
  Copy,
  Check,
} from "lucide-react";
import { api } from "@/lib/api";
import { Transaction, Appointment, Service, ApiResponse } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { InvoiceModal } from "@/components/payment/InvoiceModal";

function AdminTransactionsContent() {
  const searchParams = useSearchParams();
  const initialInvoice = searchParams.get("invoice") || "";
  const initialQuery = searchParams.get("q") || searchParams.get("search") || "";

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState(initialInvoice || initialQuery);
  const [searchMode, setSearchMode] = useState<"invoice" | "all" | "customer" | "session">(
    initialInvoice ? "invoice" : "all"
  );
  const [copiedInvoice, setCopiedInvoice] = useState<string | null>(null);
  const [selectedTxForInvoice, setSelectedTxForInvoice] = useState<Transaction | null>(null);

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

  const handleCopyInvoice = (inv: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(inv);
      setCopiedInvoice(inv);
      toast.success(`Invoice #${inv} copied to clipboard`);
      setTimeout(() => setCopiedInvoice(null), 2000);
    }
  };

  const handleFilterByInvoice = (inv: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSearch(inv);
    setSearchMode("invoice");
    toast.info(`Filtered ledger for Official Tax Invoice: ${inv}`);
  };

  const filteredTransactions = useMemo(() => {
    const list = transactions.filter((tx) => {
      const customer = typeof tx.customerId === "object" ? tx.customerId : null;
      const appointment =
        typeof tx.appointmentId === "object" && tx.appointmentId !== null
          ? (tx.appointmentId as Appointment)
          : null;
      const service =
        appointment &&
        typeof appointment.serviceId === "object" &&
        appointment.serviceId !== null
          ? (appointment.serviceId as Service)
          : null;

      const name = customer?.name?.toLowerCase() || "";
      const email = customer?.email?.toLowerCase() || "";
      const sessionId = tx.stripeSessionId?.toLowerCase() || "";
      const invoice = (tx.invoiceNumber || "").toLowerCase();
      const serviceTitle = service?.title?.toLowerCase() || "";
      const serviceCategory = service?.category?.toLowerCase() || "";
      const q = search.trim().toLowerCase();

      if (!q) return true;

      // Dedicated Official Tax Invoice search mode
      if (searchMode === "invoice") {
        return invoice.includes(q);
      }

      // Patron details mode
      if (searchMode === "customer") {
        return name.includes(q) || email.includes(q);
      }

      // Stripe Session ID mode
      if (searchMode === "session") {
        return sessionId.includes(q);
      }

      // Comprehensive "all" mode
      return (
        name.includes(q) ||
        email.includes(q) ||
        sessionId.includes(q) ||
        invoice.includes(q) ||
        serviceTitle.includes(q) ||
        serviceCategory.includes(q)
      );
    });

    return [...list].sort((a, b) => {
      const timeA = new Date(a.createdAt || 0).getTime();
      const timeB = new Date(b.createdAt || 0).getTime();
      return timeB - timeA;
    });
  }, [transactions, search, searchMode]);

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

      {/* 3. Search & Filter Bar with Official Tax Invoice Option */}
      <div className="p-4 sm:p-5 rounded-2xl border border-border/80 bg-card shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-border/60">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-accent" />
              <span className="text-xs font-serif font-bold text-foreground">
                Ledger Query &amp; Search Mode
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Choose an option below to filter ledger entries by Official Tax Invoice, patron, or Stripe reference.
            </p>
          </div>

          {/* Search Mode Options */}
          <div className="flex flex-wrap items-center gap-1.5 bg-muted/40 p-1 rounded-xl border border-border/60">
            {/* 1. Official Tax Invoice Option */}
            <button
              type="button"
              onClick={() => setSearchMode("invoice")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                searchMode === "invoice"
                  ? "bg-accent text-accent-foreground shadow-sm font-bold ring-1 ring-accent/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Official Tax Inv</span>
              <span
                className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                  searchMode === "invoice"
                    ? "bg-black/20 text-accent-foreground"
                    : "bg-accent/20 text-accent"
                }`}
              >
                Option
              </span>
            </button>

            {/* 2. All Attributes Option */}
            <button
              type="button"
              onClick={() => setSearchMode("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                searchMode === "all"
                  ? "bg-primary text-primary-foreground shadow-sm font-bold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>All Fields</span>
            </button>

            {/* 3. Patron Option */}
            <button
              type="button"
              onClick={() => setSearchMode("customer")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                searchMode === "customer"
                  ? "bg-primary text-primary-foreground shadow-sm font-bold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Patron Name / Email</span>
            </button>

            {/* 4. Stripe Session ID Option */}
            <button
              type="button"
              onClick={() => setSearchMode("session")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                searchMode === "session"
                  ? "bg-primary text-primary-foreground shadow-sm font-bold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Stripe Session ID</span>
            </button>
          </div>
        </div>

        {/* Input Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            {searchMode === "invoice" ? (
              <Receipt className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-accent" />
            ) : searchMode === "session" ? (
              <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-accent" />
            ) : searchMode === "customer" ? (
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-accent" />
            ) : (
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            )}

            <Input
              placeholder={
                searchMode === "invoice"
                  ? "Enter Official Tax Invoice # (e.g. INV-2026-93825 or 93825)..."
                  : searchMode === "session"
                  ? "Enter Stripe Session ID (e.g. cs_test_...)..."
                  : searchMode === "customer"
                  ? "Search by patron name or email address..."
                  : "Search by Official Tax Invoice, patron name, email, or Stripe reference..."
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`pl-10 pr-10 h-11 text-xs rounded-xl border-border bg-background text-foreground transition-all ${
                searchMode === "invoice"
                  ? "border-accent/70 ring-1 ring-accent/30 font-mono"
                  : ""
              }`}
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 transition-colors cursor-pointer"
                title="Clear query"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {search && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch("");
                setSearchMode("all");
              }}
              className="h-11 px-4 rounded-xl text-xs font-semibold border-border hover:bg-muted text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              <span>Reset Filter</span>
            </Button>
          )}
        </div>

        {/* Active Filter Pill & Matches Count */}
        {search && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/50 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                Active Filter:
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-accent/15 border border-accent/25 text-accent font-mono text-[11px] font-bold">
                {searchMode === "invoice" && <Receipt className="w-3.5 h-3.5" />}
                {searchMode === "invoice"
                  ? `Official Tax Invoice: ${search}`
                  : `Query: ${search}`}
              </span>
            </div>
            <span className="text-[11px] text-muted-foreground">
              Showing <strong className="text-foreground font-semibold">{filteredTransactions.length}</strong> of {transactions.length} recorded entries
            </span>
          </div>
        )}
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
          <>
            {/* 4A. Mobile & Tablet Transactions Card View (Visible on < lg screens) */}
            <div className="block lg:hidden p-3 sm:p-4 space-y-4">
              {filteredTransactions.map((tx) => {
                const customer =
                  typeof tx.customerId === "object" ? tx.customerId : null;
                const appointment =
                  typeof tx.appointmentId === "object" && tx.appointmentId !== null
                    ? (tx.appointmentId as Appointment)
                    : null;
                const service =
                  appointment &&
                  typeof appointment.serviceId === "object" &&
                  appointment.serviceId !== null
                    ? (appointment.serviceId as Service)
                    : null;
                const appDate =
                  appointment?.appointmentDate || appointment?.date;

                return (
                  <div
                    key={tx._id}
                    className="p-4 sm:p-5 rounded-2xl border border-border/80 bg-background/50 hover:border-accent/40 transition-all space-y-3.5 shadow-xs"
                  >
                    {/* Top Patron Info & Invoice Pill */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <span className="font-semibold text-sm text-foreground block truncate">
                          {customer?.name || "Verified Client"}
                        </span>
                        <span className="text-[11px] text-muted-foreground block truncate font-mono">
                          {customer?.email || "Email recorded"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => handleFilterByInvoice(tx.invoiceNumber || "", e)}
                          className="font-mono text-[10px] font-bold px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent hover:bg-accent/20 transition-all shrink-0 flex items-center gap-1 cursor-pointer"
                          title="Click to filter by this Official Tax Invoice"
                        >
                          <Receipt className="w-2.5 h-2.5" />
                          <span>
                            {tx.invoiceNumber || `INV-${new Date().getFullYear()}-${tx._id.slice(-5).toUpperCase()}`}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleCopyInvoice(tx.invoiceNumber || "", e)}
                          className="text-muted-foreground hover:text-accent p-1 transition-colors cursor-pointer"
                          title="Copy Invoice Number"
                        >
                          {copiedInvoice === tx.invoiceNumber ? (
                            <Check className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Service & Price Banner */}
                    <div className="p-3 rounded-xl bg-card border border-border/70 flex items-center justify-between gap-3">
                      <div className="min-w-0 space-y-0.5">
                        <span className="font-serif text-sm font-bold text-foreground block truncate">
                          {service?.title || "Atelier Ritual Treatment"}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider text-accent font-semibold block">
                          {service?.category || "Specialty"}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-sans text-base font-bold text-foreground tabular-nums block">
                          {formatCurrency(tx.amount)}
                        </span>
                        <span className="text-[9px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block">
                          ✓ Settled (Stripe)
                        </span>
                      </div>
                    </div>

                    {/* Date Details */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground pt-1 border-t border-border/40">
                      <div className="flex items-center gap-1.5 text-foreground tabular-nums">
                        <Calendar className="w-3.5 h-3.5 text-accent" />
                        <span>Session: {appDate ? formatDate(appDate) : "Booked"}</span>
                        {appointment?.timeSlot && <span>@ {appointment.timeSlot}</span>}
                      </div>
                      <span className="text-[11px] text-muted-foreground">
                        Settled {formatDate(tx.createdAt)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end pt-2 border-t border-border/50">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedTxForInvoice(tx)}
                        className="h-8 px-3 rounded-xl text-xs font-semibold gap-1.5 border-border hover:bg-accent/10 hover:text-accent cursor-pointer"
                      >
                        <Receipt className="w-3.5 h-3.5 text-accent" />
                        <span>View Invoice</span>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 4B. Desktop Structured Transactions Table (Visible on lg+ screens with visible smooth scrollbar) */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full min-w-[980px] text-left text-xs">
                <thead>
                  <tr className="border-b border-border/70 bg-muted/30 text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
                    <th className="py-4 px-5">Patron &amp; Contact</th>
                    <th className="py-4 px-4">Related Service</th>
                    <th className="py-4 px-4">Appointment Date</th>
                    <th className="py-4 px-4">Amount &amp; Currency</th>
                    <th className="py-4 px-4">Stripe Ref &amp; Session</th>
                    <th className="py-4 px-4 text-center">Payment Status</th>
                    <th className="py-4 px-4">Settlement Date</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredTransactions.map((tx) => {
                    const customer =
                      typeof tx.customerId === "object" ? tx.customerId : null;
                    const appointment =
                      typeof tx.appointmentId === "object" && tx.appointmentId !== null
                        ? (tx.appointmentId as Appointment)
                        : null;
                    const service =
                      appointment &&
                      typeof appointment.serviceId === "object" &&
                      appointment.serviceId !== null
                        ? (appointment.serviceId as Service)
                        : null;
                    const appDate =
                      appointment?.appointmentDate || appointment?.date;

                    return (
                      <tr
                        key={tx._id}
                        className="hover:bg-muted/40 transition-colors group"
                      >
                        {/* 1. Customer Information (Name & Email) */}
                        <td className="py-4 px-5 whitespace-nowrap">
                          <div className="space-y-0.5">
                            <span className="font-semibold text-foreground block">
                              {customer?.name || "Verified Client"}
                            </span>
                            <span className="text-[11px] text-muted-foreground block font-mono">
                              {customer?.email || "Email recorded"}
                            </span>
                          </div>
                        </td>

                        {/* 2. Related Service (Service Title & Category) */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="space-y-0.5">
                            <span
                              className="font-semibold text-foreground block max-w-[180px] truncate"
                              title={service?.title || "Salon Service"}
                            >
                              {service?.title || "Atelier Service"}
                            </span>
                            <span className="text-[10px] text-accent uppercase font-bold tracking-wider block">
                              {service?.category || "Hair & Atelier"}
                            </span>
                          </div>
                        </td>

                        {/* 3. Appointment Date (Scheduled session date & timeSlot) */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5 text-foreground font-medium tabular-nums">
                              <Calendar className="w-3.5 h-3.5 text-accent shrink-0" />
                              <span>
                                {appDate ? formatDate(appDate) : "Booked Session"}
                              </span>
                            </div>
                            {appointment?.timeSlot && (
                              <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] tabular-nums">
                                <Clock className="w-3 h-3 text-muted-foreground shrink-0" />
                                <span>{appointment.timeSlot}</span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* 4. Payment Amount & Currency */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="space-y-0.5">
                            <span className="font-sans text-base font-bold text-foreground tabular-nums block">
                              {formatCurrency(tx.amount)}
                            </span>
                            <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                              {tx.currency?.toUpperCase() || "USD"}
                            </span>
                          </div>
                        </td>

                        {/* 5. Stripe Checkout Session ID (shortened ref) & Invoice */}
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={(e) => handleFilterByInvoice(tx.invoiceNumber || "", e)}
                                className="font-mono text-xs font-bold text-accent hover:underline text-left inline-flex items-center gap-1 group/inv cursor-pointer"
                                title="Click to filter ledger by this Official Tax Invoice"
                              >
                                <span>
                                  {tx.invoiceNumber || `INV-${new Date().getFullYear()}-${tx._id.slice(-5).toUpperCase()}`}
                                </span>
                                <Search className="w-2.5 h-2.5 opacity-0 group-hover/inv:opacity-100 transition-opacity" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => handleCopyInvoice(tx.invoiceNumber || "", e)}
                                className="text-muted-foreground hover:text-accent p-0.5 rounded transition-colors cursor-pointer"
                                title="Copy Invoice Number"
                              >
                                {copiedInvoice === tx.invoiceNumber ? (
                                  <Check className="w-3 h-3 text-emerald-500" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                            <span
                              className="font-mono text-[10px] text-muted-foreground block truncate max-w-[130px]"
                              title={tx.stripeSessionId || tx._id}
                            >
                              {tx.stripeSessionId
                                ? tx.stripeSessionId.slice(0, 16) + "..."
                                : tx._id.slice(0, 12)}
                            </span>
                          </div>
                        </td>

                        {/* 6. Payment Status (Succeeded / Paid) */}
                        <td className="py-4 px-4 text-center whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{tx.status === "succeeded" ? "Succeeded / Paid" : "Paid"}</span>
                          </span>
                        </td>

                        {/* 7. Transaction Settlement Date */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Calendar className="w-3.5 h-3.5 text-accent shrink-0" />
                            <span>{formatDate(tx.createdAt)}</span>
                          </div>
                        </td>

                        {/* 8. Action (View Invoice / Receipt Modal) */}
                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedTxForInvoice(tx)}
                              className="rounded-xl text-xs font-semibold gap-1.5 border-border hover:bg-accent/10 hover:text-accent hover:border-accent/40 cursor-pointer"
                              title="View Invoice & Receipt"
                            >
                              <Receipt className="w-3.5 h-3.5 text-accent" />
                              <span className="hidden sm:inline">View Invoice</span>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Luxury Invoice & Receipt Modal */}
      <InvoiceModal
        isOpen={!!selectedTxForInvoice}
        onClose={() => setSelectedTxForInvoice(null)}
        transaction={selectedTxForInvoice}
      />
    </div>
  );
}

export default function AdminTransactionsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent animate-spin rounded-full mx-auto" />
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
            Loading Stripe Ledger...
          </p>
        </div>
      }
    >
      <AdminTransactionsContent />
    </Suspense>
  );
}
