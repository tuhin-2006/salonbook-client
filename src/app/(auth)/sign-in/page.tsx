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
  CheckCircle2,
  Clock,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthHeroVisual } from "@/components/auth/AuthHeroVisual";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");

  const { login, quickDemoLogin, isLoading, isAuthenticated, isAdmin } = useAuth();

  const [activePortal, setActivePortal] = useState<"client" | "admin">("client");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [autoFilledRole, setAutoFilledRole] = useState<string | null>(null);

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

  const handleAutofillOnly = (role: "customer" | "admin") => {
    setFormError("");
    setAutoFilledRole(role);
    if (role === "admin") {
      setEmail("admin@salonbook.com");
      setPassword("Admin@123456");
      setActivePortal("admin");
      toast.info("Admin credentials loaded into form.");
    } else {
      setEmail("customer@salonbook.com");
      setPassword("Customer@123456");
      setActivePortal("client");
      toast.info("Client credentials loaded into form.");
    }
  };

  const handleInstantDemoLogin = async (role: "admin" | "customer") => {
    setFormError("");
    try {
      setSubmitting(true);
      await quickDemoLogin(role);
      toast.success(
        `Access granted as ${role === "admin" ? "Salon Administrator" : "Verified Client"}`
      );
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
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F8F5F0] dark:bg-[#150F13] text-[#251C1D] dark:text-[#F7F0E8] transition-colors duration-300 relative overflow-hidden">
      {/* Dynamic Background Ambient Light Orbs (Removes flat void, adds architectural luxury depth) */}
      <div className="absolute top-[-10%] left-[-5%] w-[420px] h-[420px] rounded-full bg-[#C8A879]/10 dark:bg-[#C8A879]/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[450px] h-[450px] rounded-full bg-[#3B1F2B]/10 dark:bg-[#4A2035]/25 blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] right-[52%] w-[280px] h-[280px] rounded-full bg-[#B8755B]/10 dark:bg-[#B8755B]/10 blur-[100px] pointer-events-none hidden lg:block" />

      {/* Left Column: Dynamic Luxury Authentication Panel (~48% width on desktop) */}
      <div className="w-full lg:w-[48%] flex flex-col justify-between px-6 py-7 sm:px-10 md:px-14 lg:px-12 xl:px-16 min-h-screen relative z-10">
        {/* Top Header with Brand & Theme Toggle */}
        <AuthHeader />

        {/* Center Dynamic Content Area */}
        <div className="w-full max-w-[440px] mx-auto my-auto py-4 space-y-6">
          {/* Dynamic Live Atelier Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between text-[11px] font-sans"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFFFFF]/80 dark:bg-[#21191D]/80 border border-[rgba(90,65,48,0.15)] dark:border-[rgba(200,168,121,0.2)] backdrop-blur-md shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#786C68] dark:text-[#C8A879]">
                Live Concierge & Booking Open
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[#786C68]/60 dark:text-[#B9AEB0]/60">
              <Compass className="w-3 h-3 text-[#C8A879]" />
              <span>SoHo Studio</span>
            </div>
          </motion.div>

          {/* Dynamic Editorial Headline with Smooth Transitions */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#94704C] dark:bg-[#C8A879]" />
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#94704C] dark:text-[#C8A879] font-bold font-sans">
                {activePortal === "client" ? "PATRON EXPERIENCE" : "MANAGEMENT SUITE"}
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.h1
                key={activePortal}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="font-serif text-3xl sm:text-4xl xl:text-[2.65rem] font-bold text-[#251C1D] dark:text-[#F7F0E8] tracking-tight leading-[1.12]"
              >
                {activePortal === "client" ? (
                  <>
                    Your Beauty Journey <br />
                    Starts Here.
                  </>
                ) : (
                  <>
                    Salon Management <br />
                    & Operations.
                  </>
                )}
              </motion.h1>
            </AnimatePresence>

            <p className="text-xs sm:text-sm text-[#786C68] dark:text-[#B9AEB0] leading-relaxed font-sans">
              {activePortal === "client"
                ? "Access your chair appointments, restorative regimens, and digital care receipts."
                : "Manage chair scheduling, verified staff assignments, and real-time revenue."}
            </p>
          </div>

          {/* Dynamic Interactive Role Switcher Tabs (Framer Motion sliding pill) */}
          <div className="p-1 rounded-2xl bg-[#EFE8DF]/80 dark:bg-[#21191D] border border-[rgba(90,65,48,0.12)] dark:border-[rgba(200,168,121,0.18)] flex relative">
            <button
              type="button"
              onClick={() => {
                setActivePortal("client");
                if (autoFilledRole === "admin") {
                  setEmail("");
                  setPassword("");
                  setAutoFilledRole(null);
                }
              }}
              className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl transition-all duration-300 relative z-10 flex items-center justify-center gap-2 ${
                activePortal === "client"
                  ? "text-[#251C1D] dark:text-[#171114] font-bold"
                  : "text-[#786C68] dark:text-[#B9AEB0] hover:text-[#251C1D] dark:hover:text-[#F7F0E8]"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Patron Client</span>
              {activePortal === "client" && (
                <motion.div
                  layoutId="portalActivePill"
                  className="absolute inset-0 bg-[#FFFFFF] dark:bg-[#C8A879] rounded-xl shadow-sm -z-10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setActivePortal("admin");
                if (autoFilledRole === "customer") {
                  setEmail("");
                  setPassword("");
                  setAutoFilledRole(null);
                }
              }}
              className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl transition-all duration-300 relative z-10 flex items-center justify-center gap-2 ${
                activePortal === "admin"
                  ? "text-[#251C1D] dark:text-[#171114] font-bold"
                  : "text-[#786C68] dark:text-[#B9AEB0] hover:text-[#251C1D] dark:hover:text-[#F7F0E8]"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Staff / Admin</span>
              {activePortal === "admin" && (
                <motion.div
                  layoutId="portalActivePill"
                  className="absolute inset-0 bg-[#FFFFFF] dark:bg-[#C8A879] rounded-xl shadow-sm -z-10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          </div>

          {/* Elevated Luxury Glassmorphic Card Container */}
          <div className="rounded-3xl p-5 sm:p-6 bg-[#FFFFFF]/90 dark:bg-[#20171B]/90 border border-[rgba(90,65,48,0.16)] dark:border-[rgba(200,168,121,0.22)] shadow-[0_12px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl relative space-y-5">
            {/* Top Hairline Gold Glow */}
            <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#C8A879]/50 to-transparent pointer-events-none" />

            {/* Dynamic Fast-Pass Demo Account Selector */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#786C68] dark:text-[#B9AEB0]">
                <span className="flex items-center gap-1.5 text-[#94704C] dark:text-[#C8A879]">
                  <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
                  EVALUATOR QUICK ACCESS
                </span>
                <span className="text-[10px] text-[#786C68]/70 dark:text-[#B9AEB0]/70 font-normal">
                  Tap to populate credentials
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* Customer Demo Card */}
                <button
                  type="button"
                  onClick={() => handleAutofillOnly("customer")}
                  className={`p-2.5 rounded-xl border text-left transition-all duration-200 group relative ${
                    autoFilledRole === "customer"
                      ? "border-[#94704C] dark:border-[#C8A879] bg-[#94704C]/5 dark:bg-[#C8A879]/10 shadow-xs ring-1 ring-[#94704C]/20 dark:ring-[#C8A879]/30"
                      : "border-[rgba(90,65,48,0.14)] dark:border-[rgba(200,168,121,0.16)] bg-[#F8F5F0]/60 dark:bg-[#261D21]/80 hover:border-[#94704C]/50 dark:hover:border-[#C8A879]/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#251C1D] dark:text-[#F7F0E8] flex items-center gap-1.5">
                      <User className="w-3 h-3 text-[#94704C] dark:text-[#C8A879]" />
                      Customer
                    </span>
                    {autoFilledRole === "customer" ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    ) : (
                      <span className="text-[9px] uppercase tracking-wider font-semibold text-[#94704C] dark:text-[#C8A879] opacity-70 group-hover:opacity-100">
                        Fill
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-[#786C68] dark:text-[#B9AEB0] block truncate mt-0.5 font-mono">
                    customer@salonbook
                  </span>
                </button>

                {/* Admin Demo Card */}
                <button
                  type="button"
                  onClick={() => handleAutofillOnly("admin")}
                  className={`p-2.5 rounded-xl border text-left transition-all duration-200 group relative ${
                    autoFilledRole === "admin"
                      ? "border-[#94704C] dark:border-[#C8A879] bg-[#94704C]/5 dark:bg-[#C8A879]/10 shadow-xs ring-1 ring-[#94704C]/20 dark:ring-[#C8A879]/30"
                      : "border-[rgba(90,65,48,0.14)] dark:border-[rgba(200,168,121,0.16)] bg-[#F8F5F0]/60 dark:bg-[#261D21]/80 hover:border-[#94704C]/50 dark:hover:border-[#C8A879]/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#251C1D] dark:text-[#F7F0E8] flex items-center gap-1.5">
                      <ShieldCheck className="w-3 h-3 text-[#94704C] dark:text-[#C8A879]" />
                      Admin Suite
                    </span>
                    {autoFilledRole === "admin" ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    ) : (
                      <span className="text-[9px] uppercase tracking-wider font-semibold text-[#94704C] dark:text-[#C8A879] opacity-70 group-hover:opacity-100">
                        Fill
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-[#786C68] dark:text-[#B9AEB0] block truncate mt-0.5 font-mono">
                    admin@salonbook
                  </span>
                </button>
              </div>

              {/* Instant 1-Click bypass button for evaluators */}
              <button
                type="button"
                onClick={() => handleInstantDemoLogin(activePortal === "admin" ? "admin" : "customer")}
                disabled={submitting || isLoading}
                className="w-full text-[11px] py-1.5 text-center text-[#94704C] dark:text-[#C8A879] hover:underline flex items-center justify-center gap-1.5 font-semibold transition-opacity"
              >
                <Sparkles className="w-3 h-3" />
                <span>Or 1-Click Instant Sign In as {activePortal === "admin" ? "Admin" : "Customer"}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Error Banner */}
            {formError && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-700 dark:text-red-400 text-xs flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </motion.div>
            )}

            {/* Authentication Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Address Field with Dynamic Focus */}
              <div className="space-y-1.5">
                <label
                  className="text-[11px] font-semibold uppercase tracking-wider text-[#786C68] dark:text-[#B9AEB0] block"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#786C68]/60 dark:text-[#B9AEB0]/50 transition-colors group-focus-within:text-[#94704C] dark:group-focus-within:text-[#C8A879]" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder={
                      activePortal === "admin"
                        ? "admin@salonbook.com"
                        : "name@example.com"
                    }
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 rounded-xl border-[rgba(90,65,48,0.18)] dark:border-[rgba(200,168,121,0.2)] bg-[#F8F5F0]/70 dark:bg-[#181115]/90 text-xs text-[#251C1D] dark:text-[#F7F0E8] placeholder:text-[#786C68]/45 dark:placeholder:text-[#B9AEB0]/40 focus-visible:ring-2 focus-visible:ring-[#94704C]/30 dark:focus-visible:ring-[#C8A879]/30 focus-visible:border-[#94704C] dark:focus-visible:border-[#C8A879] transition-all shadow-xs"
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
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#786C68]/60 dark:text-[#B9AEB0]/50 transition-colors group-focus-within:text-[#94704C] dark:group-focus-within:text-[#C8A879]" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-11 rounded-xl border-[rgba(90,65,48,0.18)] dark:border-[rgba(200,168,121,0.2)] bg-[#F8F5F0]/70 dark:bg-[#181115]/90 text-xs text-[#251C1D] dark:text-[#F7F0E8] placeholder:text-[#786C68]/45 dark:placeholder:text-[#B9AEB0]/40 focus-visible:ring-2 focus-visible:ring-[#94704C]/30 dark:focus-visible:ring-[#C8A879]/30 focus-visible:border-[#94704C] dark:focus-visible:border-[#C8A879] transition-all shadow-xs"
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

              {/* Dynamic Shimmering Gold Sign In Button */}
              <Button
                type="submit"
                className="w-full h-11 text-xs font-bold uppercase tracking-widest rounded-xl bg-gradient-to-r from-[#C8A879] via-[#E2C69D] to-[#C8A879] bg-[length:200%_auto] text-[#171114] hover:bg-[position:right_center] shadow-md hover:shadow-lg transition-all duration-300 mt-2 group relative overflow-hidden"
                disabled={submitting || isLoading}
              >
                {/* Shimmer light beam animation */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-[#171114]" />
                    Verifying Credentials...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>
                      {activePortal === "client"
                        ? "Sign In to SalonBook"
                        : "Enter Management Portal"}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                )}
              </Button>
            </form>

            {/* Privacy Guarantee Note */}
            <p className="text-[10px] text-[#786C68]/70 dark:text-[#B9AEB0]/60 text-center leading-relaxed">
              256-bit TLS encrypted session · Strict single-client privacy standards
            </p>
          </div>

          {/* Create Account Link Footer */}
          <div className="text-center text-xs text-[#786C68] dark:text-[#B9AEB0] pt-2">
            Don&apos;t have an account yet?{" "}
            <Link
              href="/sign-up"
              className="font-semibold text-[#94704C] dark:text-[#C8A879] hover:underline ml-1"
            >
              Create Account
            </Link>
          </div>
        </div>

        {/* Bottom Coordinates Footer */}
        <div className="py-2 text-center lg:text-left text-[11px] text-[#786C68]/60 dark:text-[#B9AEB0]/50 tracking-wider">
          © 2026 SalonBook Atelier · 128 Mercer St, SoHo NYC
        </div>
      </div>

      {/* Right Column: Cinematic Brand Experience */}
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
        <div className="min-h-screen flex items-center justify-center bg-[#F8F5F0] dark:bg-[#150F13] text-[#251C1D] dark:text-[#F7F0E8]">
          <Loader2 className="w-6 h-6 animate-spin text-[#94704C] dark:text-[#C8A879]" />
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
