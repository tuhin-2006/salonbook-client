"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mail,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ArrowLeft,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthHeroVisual } from "@/components/auth/AuthHeroVisual";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!email.trim()) {
      setFormError("Please enter your registered email address.");
      return;
    }

    try {
      setSubmitting(true);
      // Simulate secure dispatch for atelier concierge
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSubmitted(true);
      toast.success("Password recovery instructions dispatched.");
    } catch {
      setFormError("Unable to initiate recovery. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F8F5F0] dark:bg-[#171114] text-[#251C1D] dark:text-[#F7F0E8] transition-colors duration-300">
      {/* Left Column: Form Panel */}
      <div className="w-full lg:w-[48%] flex flex-col justify-between px-6 py-8 sm:px-12 md:px-16 lg:px-14 xl:px-20 min-h-screen">
        <AuthHeader />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md mx-auto my-auto py-6 space-y-6"
        >
          {/* Eyebrow & Headline */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#94704C] dark:bg-[#C8A879]" />
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#94704C] dark:text-[#C8A879] font-bold">
                ACCOUNT RECOVERY
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#251C1D] dark:text-[#F7F0E8] tracking-tight leading-[1.15]">
              Forgot Your Password?
            </h1>
            <p className="text-xs sm:text-sm text-[#786C68] dark:text-[#B9AEB0] leading-relaxed font-sans">
              Enter the email address associated with your SalonBook account, and we&apos;ll send you instructions to securely reset your credentials.
            </p>
          </div>

          {/* Success State */}
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 rounded-2xl border border-[rgba(90,65,48,0.15)] dark:border-[rgba(226,198,157,0.18)] bg-[#FFFFFF] dark:bg-[#21191D] shadow-sm space-y-4"
            >
              <div className="w-12 h-12 rounded-full bg-[#94704C]/10 dark:bg-[#C8A879]/10 text-[#94704C] dark:text-[#C8A879] flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-serif text-lg font-bold text-[#251C1D] dark:text-[#F7F0E8]">
                  Instructions Dispatched
                </h3>
                <p className="text-xs text-[#786C68] dark:text-[#B9AEB0] leading-relaxed">
                  If an account exists for <strong className="text-[#251C1D] dark:text-[#F7F0E8]">{email}</strong>, a secure recovery email has been sent. Follow the link inside to set a new password.
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <Link href="/reset-password">
                  <Button
                    variant="outline"
                    className="w-full text-xs font-semibold rounded-xl border-[rgba(90,65,48,0.2)] dark:border-[rgba(226,198,157,0.2)]"
                  >
                    <KeyRound className="w-3.5 h-3.5 mr-2 text-[#94704C] dark:text-[#C8A879]" />
                    Proceed to Reset Password
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => setSubmitted(false)}
                  className="w-full text-xs text-[#786C68] dark:text-[#B9AEB0]"
                >
                  Did not receive? Resend instructions
                </Button>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Error Banner */}
              {formError && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400 text-xs flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label
                    className="text-[11px] font-semibold uppercase tracking-wider text-[#786C68] dark:text-[#B9AEB0] block"
                    htmlFor="email"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#786C68]/60 dark:text-[#B9AEB0]/50" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-11 rounded-xl border-[rgba(90,65,48,0.18)] dark:border-[rgba(226,198,157,0.2)] bg-[#FFFFFF] dark:bg-[#261D21] text-xs text-[#251C1D] dark:text-[#F7F0E8] placeholder:text-[#786C68]/45 dark:placeholder:text-[#B9AEB0]/40 focus-visible:ring-1 focus-visible:ring-[#94704C] dark:focus-visible:ring-[#C8A879] transition-all"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 text-xs font-bold uppercase tracking-widest rounded-xl bg-[#251C1D] dark:bg-[#C8A879] text-[#F8F5F0] dark:text-[#171114] hover:bg-[#3B2B2D] dark:hover:bg-[#E2C69D] shadow-md transition-all duration-200 mt-2"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Sending Recovery Link...
                    </>
                  ) : (
                    <>
                      Send Reset Link
                      <ArrowRight className="w-3.5 h-3.5 ml-2 text-[#C8A879] dark:text-[#171114]" />
                    </>
                  )}
                </Button>
              </form>
            </>
          )}

          {/* Back to Sign In Link */}
          <div className="text-center text-xs text-[#786C68] dark:text-[#B9AEB0] pt-4 border-t border-[rgba(90,65,48,0.12)] dark:border-[rgba(226,198,157,0.15)]">
            <Link
              href="/sign-in"
              className="inline-flex items-center gap-1.5 font-semibold text-[#94704C] dark:text-[#C8A879] hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
            </Link>
          </div>
        </motion.div>

        <div className="py-2 text-center lg:text-left text-[11px] text-[#786C68]/60 dark:text-[#B9AEB0]/50 tracking-wider">
          © 2026 SalonBook Atelier · Concierge Desk
        </div>
      </div>

      {/* Right Column: Visual */}
      <AuthHeroVisual
        imageSrc="https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=1600&q=85"
        imageAlt="Botanical Formulations"
        eyebrow="CONCIERGE ASSISTANCE"
        heading="Restoring Access With Utmost Privacy."
        description="Our digital concierge protects your appointment history, treatment preferences, and personal care records."
        footerDetail="THE SALONBOOK EXPERIENCE"
        subDetail="SECURITY & PRIVACY"
      />
    </div>
  );
}
