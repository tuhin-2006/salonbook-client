"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  User,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthHeroVisual } from "@/components/auth/AuthHeroVisual";
import { toast } from "sonner";
import { motion } from "framer-motion";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");

  const { login, quickDemoLogin, isLoading, isAuthenticated, isAdmin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  React.useEffect(() => {
    if (isAuthenticated) {
      if (redirectParam) {
        router.push(redirectParam);
      } else if (isAdmin) {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, isAdmin, redirectParam, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!email || !password) {
      setFormError("Please enter both your email address and password.");
      return;
    }

    try {
      setSubmitting(true);
      await login(email, password);
      toast.success("Welcome back to SalonBook Atelier.");
      if (redirectParam) {
        router.push(redirectParam);
      }
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
      toast.success(`Access granted as ${role === "admin" ? "Salon Administrator" : "Verified Client"}`);
      if (redirectParam) {
        router.push(redirectParam);
      }
    } catch (err: unknown) {
      setFormError((err as Error).message || "Demo login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F8F5F0] dark:bg-[#171114] text-[#251C1D] dark:text-[#F7F0E8] transition-colors duration-300">
      {/* Left Column: Luxury Editorial Authentication Panel (~48% width on desktop) */}
      <div className="w-full lg:w-[48%] flex flex-col justify-between px-6 py-8 sm:px-12 md:px-16 lg:px-14 xl:px-20 min-h-screen">
        {/* Top Header with Brand & Theme Toggle */}
        <AuthHeader />

        {/* Center Form Section with Framer Motion Entrance */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md mx-auto my-auto py-6 space-y-6"
        >
          {/* Eyebrow & Editorial Headline */}
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#94704C] dark:bg-[#C8A879]" />
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#94704C] dark:text-[#C8A879] font-bold">
                WELCOME BACK
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl xl:text-[2.65rem] font-bold text-[#251C1D] dark:text-[#F7F0E8] tracking-tight leading-[1.15]">
              Your Beauty Journey <br />
              Starts Here.
            </h1>
            <p className="text-xs sm:text-sm text-[#786C68] dark:text-[#B9AEB0] leading-relaxed font-sans">
              Access your appointments, manage your personal care records, and enjoy a seamless salon experience.
            </p>
          </div>

          {/* Quick Evaluator 1-Click Demo Accounts */}
          <div className="p-4 rounded-2xl border border-[rgba(90,65,48,0.15)] dark:border-[rgba(226,198,157,0.18)] bg-[#FFFFFF] dark:bg-[#21191D] shadow-sm space-y-3">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-[#786C68] dark:text-[#B9AEB0] font-bold">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#94704C] dark:text-[#C8A879]" />
                QUICK ACCESS DEMO ACCOUNTS
              </span>
              <span className="text-[#94704C] dark:text-[#C8A879] font-semibold">
                1-CLICK AUTOFILL
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full text-xs font-semibold rounded-xl border-[rgba(90,65,48,0.2)] dark:border-[rgba(226,198,157,0.2)] bg-[#F8F5F0]/60 dark:bg-[#261D21] hover:bg-[#251C1D] hover:text-[#F8F5F0] dark:hover:bg-[#C8A879] dark:hover:text-[#171114] text-[#251C1D] dark:text-[#F7F0E8] h-10 transition-all duration-200"
                onClick={() => handleDemoFill("customer")}
                disabled={submitting || isLoading}
              >
                <User className="w-3.5 h-3.5 mr-1.5 text-[#94704C] dark:text-[#C8A879]" />
                Customer Demo
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full text-xs font-semibold rounded-xl border-[rgba(90,65,48,0.2)] dark:border-[rgba(226,198,157,0.2)] bg-[#F8F5F0]/60 dark:bg-[#261D21] hover:bg-[#251C1D] hover:text-[#F8F5F0] dark:hover:bg-[#C8A879] dark:hover:text-[#171114] text-[#251C1D] dark:text-[#F7F0E8] h-10 transition-all duration-200"
                onClick={() => handleDemoFill("admin")}
                disabled={submitting || isLoading}
              >
                <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-[#94704C] dark:text-[#C8A879]" />
                Admin Suite Demo
              </Button>
            </div>
          </div>

          {/* Error Banner */}
          {formError && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400 text-xs flex items-center gap-2.5"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </motion.div>
          )}

          {/* Authentication Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Address Field */}
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
                  autoComplete="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 rounded-xl border-[rgba(90,65,48,0.18)] dark:border-[rgba(226,198,157,0.2)] bg-[#FFFFFF] dark:bg-[#261D21] text-xs text-[#251C1D] dark:text-[#F7F0E8] placeholder:text-[#786C68]/45 dark:placeholder:text-[#B9AEB0]/40 focus-visible:ring-1 focus-visible:ring-[#94704C] dark:focus-visible:ring-[#C8A879] transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Field with Show/Hide Toggle */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  className="text-[11px] font-semibold uppercase tracking-wider text-[#786C68] dark:text-[#B9AEB0] block"
                  htmlFor="password"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] text-[#94704C] dark:text-[#C8A879] hover:text-[#251C1D] dark:hover:text-[#E2C69D] hover:underline transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#786C68]/60 dark:text-[#B9AEB0]/50" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
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

            {/* Premium Sign In Button */}
            <Button
              type="submit"
              className="w-full h-11 text-xs font-bold uppercase tracking-widest rounded-xl bg-[#251C1D] dark:bg-[#C8A879] text-[#F8F5F0] dark:text-[#171114] hover:bg-[#3B2B2D] dark:hover:bg-[#E2C69D] shadow-md transition-all duration-200 mt-2"
              disabled={submitting || isLoading}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In to SalonBook
                  <ArrowRight className="w-3.5 h-3.5 ml-2 text-[#C8A879] dark:text-[#171114]" />
                </>
              )}
            </Button>
          </form>

          {/* Privacy & Booking Notice */}
          <p className="text-[11px] text-[#786C68]/70 dark:text-[#B9AEB0]/70 leading-relaxed text-center px-2">
            Protected by end-to-end authentication and verified salon privacy standards.
          </p>

          {/* Create Account Link */}
          <div className="text-center text-xs text-[#786C68] dark:text-[#B9AEB0] pt-4 border-t border-[rgba(90,65,48,0.12)] dark:border-[rgba(226,198,157,0.15)]">
            Don&apos;t have an account yet?{" "}
            <Link
              href="/sign-up"
              className="font-semibold text-[#94704C] dark:text-[#C8A879] hover:underline ml-1"
            >
              Create Account
            </Link>
          </div>
        </motion.div>

        {/* Bottom Coordinates Footer */}
        <div className="py-2 text-center lg:text-left text-[11px] text-[#786C68]/60 dark:text-[#B9AEB0]/50 tracking-wider">
          © 2026 SalonBook Atelier · 128 Mercer St, SoHo NYC
        </div>
      </div>

      {/* Right Column: Cinematic Brand Experience (Editorial Photography & Typography) */}
      <AuthHeroVisual
        imageSrc="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1600&q=85"
        imageAlt="SalonBook Luxury Atelier Interior"
        eyebrow="CRAFTED FOR YOUR BEAUTY"
        heading="Where Beauty Meets Excellence."
        description="Discover exceptional care, personalized experiences, and the art of feeling your best."
        footerDetail="THE SALONBOOK EXPERIENCE"
        subDetail="128 MERCER STREET · SOHO, NYC"
      />
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F8F5F0] dark:bg-[#171114] text-[#251C1D] dark:text-[#F7F0E8]">
          <Loader2 className="w-6 h-6 animate-spin text-[#94704C] dark:text-[#C8A879]" />
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
