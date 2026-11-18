"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  User,
  AlertCircle,
  Loader2,
  Star,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { SafeImage } from "@/components/ui/SafeImage";
import { toast } from "sonner";

export default function SignInPage() {
  const router = useRouter();
  const { login, quickDemoLogin, isLoading, isAuthenticated, isAdmin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  React.useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, isAdmin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!email || !password) {
      setFormError("Please enter both email address and password.");
      return;
    }

    try {
      setSubmitting(true);
      await login(email, password);
      toast.success("Welcome back to SalonBook.");
    } catch (err: unknown) {
      setFormError((err as Error).message || "Invalid authentication credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoFill = async (role: "admin" | "customer") => {
    setFormError("");
    try {
      setSubmitting(true);
      await quickDemoLogin(role);
      toast.success(`Access granted as ${role.toUpperCase()}`);
    } catch (err: unknown) {
      setFormError((err as Error).message || "Demo login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] w-full flex flex-col lg:flex-row bg-[#FAF7F2] dark:bg-[#170F13] text-[#231C1E] dark:text-[#FAF7F2] transition-colors duration-200">
      {/* Left Form Container */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-md space-y-7">
          {/* Header */}
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-bold block">
              WELCOME BACK
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#231C1E] dark:text-[#FAF7F2]">
              Sign In to SalonBook
            </h1>
            <p className="text-xs sm:text-sm text-[#231C1E]/75 dark:text-[#FAF7F2]/75 leading-relaxed">
              Access your appointment schedule, personal care records, and digital invoices.
            </p>
          </div>

          {/* Quick Evaluator Demo Fill Box */}
          <div className="p-4 rounded-2xl border border-[#3B1F2B]/15 dark:border-[#FAF7F2]/15 bg-[#FFFFFF] dark:bg-[#22161B] shadow-sm space-y-3">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-[#231C1E]/75 dark:text-[#FAF7F2]/75 font-bold">
              <span>TEST DEMO ACCOUNTS</span>
              <span className="text-[#C5A880]">1-CLICK AUTOFILL</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full text-xs font-semibold rounded-xl border-[#3B1F2B]/20 dark:border-[#FAF7F2]/20 hover:bg-[#3B1F2B] hover:text-[#FAF7F2] dark:hover:bg-[#C5A880] dark:hover:text-[#170F13] text-[#231C1E] dark:text-[#FAF7F2] h-10 transition-colors"
                onClick={() => handleDemoFill("customer")}
                disabled={submitting || isLoading}
              >
                <User className="w-3.5 h-3.5 mr-1.5 text-[#C5A880]" />
                Customer Demo
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full text-xs font-semibold rounded-xl border-[#3B1F2B]/20 dark:border-[#FAF7F2]/20 hover:bg-[#3B1F2B] hover:text-[#FAF7F2] dark:hover:bg-[#C5A880] dark:hover:text-[#170F13] text-[#231C1E] dark:text-[#FAF7F2] h-10 transition-colors"
                onClick={() => handleDemoFill("admin")}
                disabled={submitting || isLoading}
              >
                <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-[#3B1F2B] dark:text-[#C5A880]" />
                Admin Suite Demo
              </Button>
            </div>
          </div>

          {/* Error Banner */}
          {formError && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#231C1E]/75 dark:text-[#FAF7F2]/75 block" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#231C1E]/40 dark:text-[#FAF7F2]/40" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@salonbook.com or customer@salonbook.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 rounded-xl border-[#3B1F2B]/15 dark:border-[#FAF7F2]/15 bg-[#FFFFFF] dark:bg-[#22161B] text-xs text-[#231C1E] dark:text-[#FAF7F2] placeholder:text-[#231C1E]/40 dark:placeholder:text-[#FAF7F2]/40 focus-visible:ring-1 focus-visible:ring-[#3B1F2B] dark:focus-visible:ring-[#C5A880]"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#231C1E]/75 dark:text-[#FAF7F2]/75 block" htmlFor="password">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#231C1E]/40 dark:text-[#FAF7F2]/40" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11 rounded-xl border-[#3B1F2B]/15 dark:border-[#FAF7F2]/15 bg-[#FFFFFF] dark:bg-[#22161B] text-xs text-[#231C1E] dark:text-[#FAF7F2] placeholder:text-[#231C1E]/40 dark:placeholder:text-[#FAF7F2]/40 focus-visible:ring-1 focus-visible:ring-[#3B1F2B] dark:focus-visible:ring-[#C5A880]"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-xs font-bold uppercase tracking-wider rounded-xl bg-[#3B1F2B] dark:bg-[#C5A880] text-[#FAF7F2] dark:text-[#170F13] hover:bg-[#4A2035] dark:hover:bg-[#d6bc96] shadow-md transition-all"
              disabled={submitting || isLoading}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" /> Signing In...
                </>
              ) : (
                <>
                  Sign In to SalonBook <ArrowRight className="w-3.5 h-3.5 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Specification Mandatory Notice Text */}
          <p className="text-[11px] text-[#231C1E]/65 dark:text-[#FAF7F2]/60 leading-relaxed text-center px-2">
            By signing in you agree to our salon booking terms. Admin accounts are provisioned privately and cannot be created through this form.
          </p>

          {/* Footer note */}
          <div className="text-center text-xs text-[#231C1E]/70 dark:text-[#FAF7F2]/70 pt-2 border-t border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10">
            Don&apos;t have an account yet?{" "}
            <Link href="/sign-up" className="font-semibold text-[#3B1F2B] dark:text-[#C5A880] hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>

      {/* Right Column: Salon Visual with Overlaid Testimonial Card */}
      <div className="hidden lg:block lg:flex-1 relative bg-[#EAE3D6] dark:bg-[#1E1317] overflow-hidden border-l border-[#3B1F2B]/10 dark:border-[#FAF7F2]/10">
        <SafeImage
          src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=85"
          alt="SalonBook Boutique Sanctuary"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#231C1E]/40" />

        {/* Customer Testimonial Card */}
        <div className="absolute bottom-12 left-12 right-12 text-[#FAF7F2] space-y-4 p-7 bg-[#231C1E]/90 backdrop-blur-md rounded-2xl border border-[#FAF7F2]/20 shadow-2xl">
          <div className="flex text-amber-400 gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>
          <p className="font-serif text-lg leading-relaxed italic text-[#FAF7F2]">
            &ldquo;Marcus gave me the sharpest cut and cleanest shave I&apos;ve had in New York. The atmosphere is warm, calm, and zero rush. SalonBook is a breath of fresh air.&rdquo;
          </p>
          <div className="pt-2 border-t border-[#FAF7F2]/15 flex items-center justify-between text-xs text-[#FAF7F2]/80">
            <div>
              <p className="font-bold text-[#FAF7F2]">Julian Reynolds</p>
              <p className="text-[11px] text-[#C5A880]">Patron since 2021 · Tribeca</p>
            </div>
            <span className="text-[11px] font-semibold text-[#C5A880] bg-[#FAF7F2]/10 px-2.5 py-1 rounded-full">
              Verified Booking
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
