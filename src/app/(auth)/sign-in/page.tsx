"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  User,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Scissors,
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
      toast.success("Welcome back to SalonBook!");
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
      toast.success(`Logged in as ${role.toUpperCase()}`);
    } catch (err: unknown) {
      setFormError((err as Error).message || "Demo login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] w-full flex flex-col lg:flex-row bg-background">
      {/* Left Form Container */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20 xl:px-24 relative overflow-hidden">
        <div className="mx-auto w-full max-w-md space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Client & Admin Portal</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Sign In to SalonBook
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Access your appointment bookings, Stripe receipts, and stylist messaging.
            </p>
          </div>

          {/* Quick Evaluator Demo Fill Box */}
          <div className="p-4 rounded-2xl bg-card border border-border shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase tracking-wider">
              <span className="flex items-center gap-1.5 text-primary">
                <Sparkles className="w-3.5 h-3.5" /> Evaluator 1-Click Access
              </span>
              <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                Instant Fill
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full text-xs justify-center gap-1.5 rounded-xl h-10 font-bold hover:border-primary/50"
                onClick={() => handleDemoFill("customer")}
                disabled={submitting || isLoading}
              >
                <User className="w-3.5 h-3.5 text-primary" />
                Customer Demo
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full text-xs justify-center gap-1.5 rounded-xl h-10 font-bold hover:border-primary/50"
                onClick={() => handleDemoFill("admin")}
                disabled={submitting || isLoading}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                Admin Demo
              </Button>
            </div>
          </div>

          {/* Error Banner */}
          {formError && (
            <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@salonbook.com or customer@salonbook.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 rounded-xl bg-background border-input text-xs"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11 rounded-xl bg-background border-input text-xs"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="gradient"
              className="w-full h-11 text-xs font-bold rounded-xl gap-2 shadow-md shadow-primary/25"
              disabled={submitting || isLoading}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Signing In...
                </>
              ) : (
                <>
                  Sign In to Account <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          {/* Footer note */}
          <div className="text-center text-xs text-muted-foreground">
            Don&apos;t have an account yet?{" "}
            <Link href="/sign-up" className="font-bold text-primary hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>

      {/* Right Column: Hero Visual */}
      <div className="hidden lg:block lg:flex-1 relative bg-muted overflow-hidden">
        <SafeImage
          src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=85"
          alt="Salon Experience"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12 text-white space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold">
            <Scissors className="w-3.5 h-3.5" /> SalonBook Experience
          </div>
          <h3 className="text-2xl font-black">
            The standard for modern salon & wellness reservations.
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed max-w-md">
            Join thousands of satisfied patrons booking their beauty rituals effortlessly.
          </p>
        </div>
      </div>
    </div>
  );
}
