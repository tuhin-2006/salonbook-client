"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthHeroVisual } from "@/components/auth/AuthHeroVisual";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function SignUpPage() {
  const router = useRouter();
  const { register, isLoading, isAuthenticated, isAdmin } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
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

    if (!name.trim() || !email.trim() || !password) {
      setFormError("Please fill in your full name, email address, and password.");
      return;
    }

    if (password.length < 6) {
      setFormError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match. Please re-enter your password.");
      return;
    }

    if (!agreeTerms) {
      setFormError("Please accept the salon terms and booking policy.");
      return;
    }

    try {
      setSubmitting(true);
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        phone: phone.trim() || undefined,
      });
      toast.success("Welcome to SalonBook! Your client profile is ready.");
      router.push("/dashboard");
    } catch (err: unknown) {
      setFormError((err as Error).message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F8F5F0] dark:bg-[#171114] text-[#251C1D] dark:text-[#F7F0E8] transition-colors duration-300">
      {/* Left Column: Luxury Editorial Registration Panel */}
      <div className="w-full lg:w-[48%] flex flex-col justify-between px-6 py-8 sm:px-12 md:px-16 lg:px-14 xl:px-20 min-h-screen">
        {/* Top Header */}
        <AuthHeader />

        {/* Center Registration Form */}
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
                NEW CLIENT REGISTRATION
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#251C1D] dark:text-[#F7F0E8] tracking-tight leading-[1.15]">
              Create Your Account
            </h1>
            <p className="text-xs sm:text-sm text-[#786C68] dark:text-[#B9AEB0] leading-relaxed font-sans">
              Join SalonBook and make every beauty appointment effortless.
            </p>
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label
                className="text-[11px] font-semibold uppercase tracking-wider text-[#786C68] dark:text-[#B9AEB0] block"
                htmlFor="name"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#786C68]/60 dark:text-[#B9AEB0]/50" />
                <Input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="e.g. Julian Reynolds"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 h-11 rounded-xl border-[rgba(90,65,48,0.18)] dark:border-[rgba(226,198,157,0.2)] bg-[#FFFFFF] dark:bg-[#261D21] text-xs text-[#251C1D] dark:text-[#F7F0E8] placeholder:text-[#786C68]/45 dark:placeholder:text-[#B9AEB0]/40 focus-visible:ring-1 focus-visible:ring-[#94704C] dark:focus-visible:ring-[#C8A879] transition-all"
                  required
                />
              </div>
            </div>

            {/* Email Address */}
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

            {/* Contact Phone (Optional) */}
            <div className="space-y-1.5">
              <label
                className="text-[11px] font-semibold uppercase tracking-wider text-[#786C68] dark:text-[#B9AEB0] block"
                htmlFor="phone"
              >
                Contact Phone <span className="font-normal text-[10px] text-[#786C68]/60 dark:text-[#B9AEB0]/60">(Optional)</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#786C68]/60 dark:text-[#B9AEB0]/50" />
                <Input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+1 (646) 892-4410"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-10 h-11 rounded-xl border-[rgba(90,65,48,0.18)] dark:border-[rgba(226,198,157,0.2)] bg-[#FFFFFF] dark:bg-[#261D21] text-xs text-[#251C1D] dark:text-[#F7F0E8] placeholder:text-[#786C68]/45 dark:placeholder:text-[#B9AEB0]/40 focus-visible:ring-1 focus-visible:ring-[#94704C] dark:focus-visible:ring-[#C8A879] transition-all"
                />
              </div>
            </div>

            {/* Password & Confirm Password Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Password */}
              <div className="space-y-1.5">
                <label
                  className="text-[11px] font-semibold uppercase tracking-wider text-[#786C68] dark:text-[#B9AEB0] block"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#786C68]/60 dark:text-[#B9AEB0]/50" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min 6 chars"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 pr-8 h-11 rounded-xl border-[rgba(90,65,48,0.18)] dark:border-[rgba(226,198,157,0.2)] bg-[#FFFFFF] dark:bg-[#261D21] text-xs text-[#251C1D] dark:text-[#F7F0E8] placeholder:text-[#786C68]/45 dark:placeholder:text-[#B9AEB0]/40 focus-visible:ring-1 focus-visible:ring-[#94704C] dark:focus-visible:ring-[#C8A879] transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#786C68]/60 dark:text-[#B9AEB0]/60 hover:text-[#251C1D] dark:hover:text-[#F7F0E8] transition-colors focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label
                  className="text-[11px] font-semibold uppercase tracking-wider text-[#786C68] dark:text-[#B9AEB0] block"
                  htmlFor="confirmPassword"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#786C68]/60 dark:text-[#B9AEB0]/50" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-9 pr-8 h-11 rounded-xl border-[rgba(90,65,48,0.18)] dark:border-[rgba(226,198,157,0.2)] bg-[#FFFFFF] dark:bg-[#261D21] text-xs text-[#251C1D] dark:text-[#F7F0E8] placeholder:text-[#786C68]/45 dark:placeholder:text-[#B9AEB0]/40 focus-visible:ring-1 focus-visible:ring-[#94704C] dark:focus-visible:ring-[#C8A879] transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#786C68]/60 dark:text-[#B9AEB0]/60 hover:text-[#251C1D] dark:hover:text-[#F7F0E8] transition-colors focus:outline-none"
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Terms Agreement Checkbox */}
            <div className="flex items-start gap-2.5 pt-1">
              <input
                id="terms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-[#94704C] dark:text-[#C8A879] border-[rgba(90,65,48,0.25)] dark:border-[rgba(226,198,157,0.25)] focus:ring-[#94704C] dark:focus:ring-[#C8A879] bg-[#FFFFFF] dark:bg-[#261D21] cursor-pointer"
              />
              <label
                htmlFor="terms"
                className="text-[11px] text-[#786C68] dark:text-[#B9AEB0] leading-relaxed cursor-pointer select-none"
              >
                I agree to the SalonBook appointment policy, cancellation standards, and private client care guidelines.
              </label>
            </div>

            {/* Create Account Button */}
            <Button
              type="submit"
              className="w-full h-11 text-xs font-bold uppercase tracking-widest rounded-xl bg-[#251C1D] dark:bg-[#C8A879] text-[#F8F5F0] dark:text-[#171114] hover:bg-[#3B2B2D] dark:hover:bg-[#E2C69D] shadow-md transition-all duration-200 mt-2"
              disabled={submitting || isLoading}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-3.5 h-3.5 ml-2 text-[#C8A879] dark:text-[#171114]" />
                </>
              )}
            </Button>
          </form>

          {/* Existing Account Footer Link */}
          <div className="text-center text-xs text-[#786C68] dark:text-[#B9AEB0] pt-4 border-t border-[rgba(90,65,48,0.12)] dark:border-[rgba(226,198,157,0.15)]">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-semibold text-[#94704C] dark:text-[#C8A879] hover:underline ml-1"
            >
              Sign In
            </Link>
          </div>
        </motion.div>

        {/* Bottom Coordinates Footer */}
        <div className="py-2 text-center lg:text-left text-[11px] text-[#786C68]/60 dark:text-[#B9AEB0]/50 tracking-wider">
          © 2026 SalonBook Atelier · 128 Mercer St, SoHo NYC
        </div>
      </div>

      {/* Right Column: Visual Panel with Different Composition */}
      <AuthHeroVisual
        imageSrc="https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1600&q=85"
        imageAlt="SalonBook Boutique Styling Stations"
        eyebrow="PERSONALIZED ATELIER CARE"
        heading="Begin Your Transformation."
        description="A dedicated sanctuary where master stylists and clinical skin specialists curate rituals tailored to you."
        footerDetail="THE SALONBOOK EXPERIENCE"
        subDetail="ESTABLISHED IN NEW YORK"
      />
    </div>
  );
}
