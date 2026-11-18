"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ArrowLeft,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthHeroVisual } from "@/components/auth/AuthHeroVisual";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!password || !confirmPassword) {
      setFormError("Please fill in both password fields.");
      return;
    }

    if (password.length < 6) {
      setFormError("New password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match. Please ensure both passwords match.");
      return;
    }

    try {
      setSubmitting(true);
      // Simulate password update
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSubmitted(true);
      toast.success("Password updated successfully.");
    } catch {
      setFormError("Unable to update password. Please try again.");
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
                NEW CREDENTIALS
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#251C1D] dark:text-[#F7F0E8] tracking-tight leading-[1.15]">
              Reset Your Password
            </h1>
            <p className="text-xs sm:text-sm text-[#786C68] dark:text-[#B9AEB0] leading-relaxed font-sans">
              Create a strong new password for your SalonBook account to restore access.
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
                  Password Successfully Reset
                </h3>
                <p className="text-xs text-[#786C68] dark:text-[#B9AEB0] leading-relaxed">
                  Your credentials have been securely updated. You can now sign in with your new password to resume booking your treatments.
                </p>
              </div>

              <div className="pt-2">
                <Button
                  onClick={() => router.push("/sign-in")}
                  className="w-full h-11 text-xs font-bold uppercase tracking-widest rounded-xl bg-[#251C1D] dark:bg-[#C8A879] text-[#F8F5F0] dark:text-[#171114] hover:bg-[#3B2B2D] dark:hover:bg-[#E2C69D] shadow-md"
                >
                  Sign In with New Password
                  <ArrowRight className="w-3.5 h-3.5 ml-2" />
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
                    htmlFor="password"
                  >
                    New Password <span className="font-normal text-[10px] text-[#786C68]/60 dark:text-[#B9AEB0]/60">(Min 6 characters)</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#786C68]/60 dark:text-[#B9AEB0]/50" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-11 rounded-xl border-[rgba(90,65,48,0.18)] dark:border-[rgba(226,198,157,0.2)] bg-[#FFFFFF] dark:bg-[#261D21] text-xs text-[#251C1D] dark:text-[#F7F0E8] placeholder:text-[#786C68]/45 dark:placeholder:text-[#B9AEB0]/40 focus-visible:ring-1 focus-visible:ring-[#94704C] dark:focus-visible:ring-[#C8A879] transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#786C68]/60 dark:text-[#B9AEB0]/60 hover:text-[#251C1D] dark:hover:text-[#F7F0E8] transition-colors focus:outline-none"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label
                    className="text-[11px] font-semibold uppercase tracking-wider text-[#786C68] dark:text-[#B9AEB0] block"
                    htmlFor="confirmPassword"
                  >
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#786C68]/60 dark:text-[#B9AEB0]/50" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 pr-10 h-11 rounded-xl border-[rgba(90,65,48,0.18)] dark:border-[rgba(226,198,157,0.2)] bg-[#FFFFFF] dark:bg-[#261D21] text-xs text-[#251C1D] dark:text-[#F7F0E8] placeholder:text-[#786C68]/45 dark:placeholder:text-[#B9AEB0]/40 focus-visible:ring-1 focus-visible:ring-[#94704C] dark:focus-visible:ring-[#C8A879] transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#786C68]/60 dark:text-[#B9AEB0]/60 hover:text-[#251C1D] dark:hover:text-[#F7F0E8] transition-colors focus:outline-none"
                      aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
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
                      Updating Password...
                    </>
                  ) : (
                    <>
                      Update Password
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
          © 2026 SalonBook Atelier · Security & Concierge
        </div>
      </div>

      {/* Right Column: Visual */}
      <AuthHeroVisual
        imageSrc="https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=1600&q=85"
        imageAlt="Botanical Formulations"
        eyebrow="ACCOUNT SECURITY"
        heading="Excellence in Every Detail."
        description="Your salon profile, personal stylist preferences, and past care records remain secured with high-grade encryption."
        footerDetail="THE SALONBOOK EXPERIENCE"
        subDetail="CONFIDENTIAL & VERIFIED"
      />
    </div>
  );
}
