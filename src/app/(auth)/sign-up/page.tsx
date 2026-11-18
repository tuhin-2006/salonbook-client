"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
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
      toast.success("Welcome to the SalonBook Sanctuary! Your membership is active.");
      router.push("/dashboard");
    } catch (err: unknown) {
      setFormError((err as Error).message || "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] w-full flex flex-col lg:flex-row bg-background">
      {/* Left Form Container */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20 xl:px-24 relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-terracotta-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="mx-auto w-full max-w-md space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-700 dark:text-gold-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-gold-500" />
              <span>Begin Your Personal Ritual</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Create Patron Account
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Join the SalonBook Society to book luxury treatments, manage your schedule, and experience bespoke beauty rituals.
            </p>
          </div>

          {/* Error Banner */}
          {formError && (
            <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs sm:text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" htmlFor="name">
                Full Legal Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Sophia Montgomery"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 h-12 rounded-xl bg-background border-input focus:border-gold-500/50 text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="sophia@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 rounded-xl bg-background border-input focus:border-gold-500/50 text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" htmlFor="phone">
                Mobile Number (Optional)
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 018-9922"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-10 h-12 rounded-xl bg-background border-input focus:border-gold-500/50 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" htmlFor="password">
                Create Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 rounded-xl bg-background border-input focus:border-gold-500/50 text-sm"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="luxury"
              className="w-full h-12 text-xs uppercase tracking-wider font-bold rounded-xl gap-2 mt-2 shadow-lg shadow-gold-500/20"
              disabled={submitting || isLoading}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Registering Membership...
                </>
              ) : (
                <>
                  Complete Registration <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          {/* Footer note */}
          <div className="pt-6 border-t border-border/80 text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              Already have a SalonBook account?{" "}
              <Link href="/sign-in" className="text-primary font-bold hover:underline">
                Sign in to Lounge
              </Link>
            </p>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              By creating an account, you agree to our Privacy Charter and Salon Etiquette Policies.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side Visual & Benefits Panel */}
      <div className="hidden lg:flex flex-1 relative bg-noir-900 items-center justify-center p-12 overflow-hidden border-l border-gold-500/20">
        <div
          className="absolute inset-0 opacity-35 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1600&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-noir-900 via-noir-900/60 to-transparent" />

        <div className="relative z-10 max-w-lg text-white space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 backdrop-blur-md border border-gold-500/30 text-xs text-gold-300 font-semibold">
            <Star className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
            <span>Privileged Patron Privileges</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-normal leading-snug text-champagne-100">
            Slow, considered beauty rituals designed around your cadence.
          </h2>

          <div className="space-y-4 text-xs text-zinc-300">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
              <span>Instant slot reservations with real-time specialist schedule confirmation.</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
              <span>Paris, London, and Tokyo trained resident artists dedicated entirely to you.</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
              <span>Frictionless Stripe checkout upon appointment confirmation with transparent invoices.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
