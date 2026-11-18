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
  Star,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { SafeImage } from "@/components/ui/SafeImage";
import { toast } from "sonner";

export default function SignUpPage() {
  const router = useRouter();
  const { register, isLoading, isAuthenticated, isAdmin } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
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
      setFormError("Please fill in your full name, email, and password.");
      return;
    }

    if (password.length < 6) {
      setFormError("Password must contain at least 6 characters.");
      return;
    }

    try {
      setSubmitting(true);
      await register({
        name,
        email,
        password,
        phone: phone || undefined,
      });
      toast.success("Welcome to SalonBook! Your account has been created.");
      router.push("/dashboard");
    } catch (err: unknown) {
      setFormError((err as Error).message || "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] w-full flex flex-col lg:flex-row bg-[#FAF7F2] text-[#231C1E]">
      {/* Left Form Container */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-md space-y-7">
          {/* Header */}
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-bold block">
              NEW CLIENT REGISTRATION
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#231C1E]">
              Create Your Account
            </h1>
            <p className="text-xs sm:text-sm text-[#231C1E]/75 leading-relaxed">
              Reserve hair styling, restorative skin rituals, and barbershop services with real-time slot confirmation.
            </p>
          </div>

          {/* Error Banner */}
          {formError && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#231C1E]/75 block" htmlFor="name">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#231C1E]/40" />
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g. Julian Reynolds"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 h-11 rounded-xl border-[#3B1F2B]/15 bg-[#FFFFFF] text-xs text-[#231C1E] placeholder:text-[#231C1E]/40 focus-visible:ring-1 focus-visible:ring-[#3B1F2B]"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#231C1E]/75 block" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#231C1E]/40" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 rounded-xl border-[#3B1F2B]/15 bg-[#FFFFFF] text-xs text-[#231C1E] placeholder:text-[#231C1E]/40 focus-visible:ring-1 focus-visible:ring-[#3B1F2B]"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#231C1E]/75 block" htmlFor="phone">
                Contact Phone <span className="text-[#231C1E]/40 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#231C1E]/40" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (212) 555-0198"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-10 h-11 rounded-xl border-[#3B1F2B]/15 bg-[#FFFFFF] text-xs text-[#231C1E] placeholder:text-[#231C1E]/40 focus-visible:ring-1 focus-visible:ring-[#3B1F2B]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#231C1E]/75 block" htmlFor="password">
                Password <span className="text-[#231C1E]/40 font-normal">(Minimum 6 characters)</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#231C1E]/40" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11 rounded-xl border-[#3B1F2B]/15 bg-[#FFFFFF] text-xs text-[#231C1E] placeholder:text-[#231C1E]/40 focus-visible:ring-1 focus-visible:ring-[#3B1F2B]"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-xs font-bold uppercase tracking-wider rounded-xl bg-[#3B1F2B] text-[#FAF7F2] hover:bg-[#4A2035] shadow-md mt-2"
              disabled={submitting || isLoading}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" /> Creating Account...
                </>
              ) : (
                <>
                  Create Account <ArrowRight className="w-3.5 h-3.5 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Notice text */}
          <p className="text-[11px] text-[#231C1E]/65 leading-relaxed text-center px-2">
            By registering you agree to our salon booking terms. Admin accounts are provisioned privately.
          </p>

          {/* Footer note */}
          <div className="text-center text-xs text-[#231C1E]/70 pt-2 border-t border-[#3B1F2B]/10">
            Already have an account?{" "}
            <Link href="/sign-in" className="font-semibold text-[#3B1F2B] hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Right Column: Visual Panel */}
      <div className="hidden lg:block lg:flex-1 relative bg-[#EAE3D6] overflow-hidden border-l border-[#3B1F2B]/10">
        <SafeImage
          src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=85"
          alt="Facial and Skincare Sanctuary"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#231C1E]/40" />
        <div className="absolute bottom-12 left-12 right-12 text-[#FAF7F2] space-y-4 p-7 bg-[#231C1E]/90 backdrop-blur-md rounded-2xl border border-[#FAF7F2]/20 shadow-2xl">
          <div className="flex text-amber-400 gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>
          <h3 className="font-serif text-lg font-normal leading-relaxed italic text-[#FAF7F2]">
            &ldquo;Elena understands colour like a true painter. The balayage grew out seamlessly over 4 months with zero brassiness. The booking system was instant and effortless.&rdquo;
          </h3>
          <div className="pt-2 border-t border-[#FAF7F2]/15 flex items-center justify-between text-xs text-[#FAF7F2]/80">
            <div>
              <p className="font-bold text-[#FAF7F2]">Camille Laurent</p>
              <p className="text-[11px] text-[#C5A880]">Upper East Side, NYC</p>
            </div>
            <span className="text-[11px] font-semibold text-[#C5A880] bg-[#FAF7F2]/10 px-2.5 py-1 rounded-full">
              Signature Balayage
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
