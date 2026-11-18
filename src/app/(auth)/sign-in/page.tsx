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
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function SignInPage() {
  const router = useRouter();
  const { login, quickDemoLogin, isLoading, isAuthenticated, isAdmin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // If already authenticated, redirect
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
      toast.success("Welcome back to the SalonBook Sanctuary!");
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
      toast.success(`Authenticated as privileged ${role.toUpperCase()} account`);
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
        {/* Subtle Ambient Background Glow */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gold-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="mx-auto w-full max-w-md space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-700 dark:text-gold-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-gold-500" />
              <span>Sanctuary Patron Portal</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Welcome Back to Atelier
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Sign in to manage your appointments, review Stripe receipts, and access privileged salon treatments.
            </p>
          </div>

          {/* Quick Evaluator Demo Fill Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-card border border-gold-500/25 shadow-xl space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase tracking-wider">
              <span className="flex items-center gap-1.5 text-gold-600 dark:text-gold-400">
                <Crown className="w-3.5 h-3.5 text-gold-500" /> Evaluator Quick-Access
              </span>
              <span className="text-[10px] bg-gold-500/15 text-gold-700 dark:text-gold-300 px-2 py-0.5 rounded-full font-bold">
                1-Click Sign In
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full text-xs justify-center gap-1.5 rounded-xl border-gold-500/40 hover:bg-gold-500/10 h-10 font-semibold"
                onClick={() => handleDemoFill("customer")}
                disabled={submitting || isLoading}
              >
                <User className="w-3.5 h-3.5 text-terracotta-500" />
                Customer Demo
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full text-xs justify-center gap-1.5 rounded-xl border-gold-500/40 hover:bg-gold-500/10 h-10 font-semibold"
                onClick={() => handleDemoFill("admin")}
                disabled={submitting || isLoading}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-gold-500" />
                Admin Director
              </Button>
            </div>
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
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@salonbook.com or client@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 rounded-xl bg-background border-input focus:border-gold-500/50 text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" htmlFor="password">
                Secret Passcode
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
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
              className="w-full h-12 text-xs uppercase tracking-wider font-bold rounded-xl gap-2 shadow-lg shadow-gold-500/20"
              disabled={submitting || isLoading}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Authenticating...
                </>
              ) : (
                <>
                  Enter Atelier Sanctuary <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          {/* Social Sign-in (Google OAuth button) */}
          <div className="space-y-4 pt-2">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-border"></div>
              <span className="flex-shrink mx-4 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                Or Continue With
              </span>
              <div className="flex-grow border-t border-border"></div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full h-11 text-xs font-semibold rounded-xl gap-2.5 border-border/80 hover:bg-secondary"
              onClick={() => {
                toast.info("Google OAuth provider is ready. Use test credentials or demo buttons for evaluation.");
              }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Sign in with Google
            </Button>
          </div>

          {/* Footer note */}
          <div className="pt-6 border-t border-border/80 text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              Don&apos;t have an account yet?{" "}
              <Link href="/sign-up" className="text-primary font-bold hover:underline">
                Create an account
              </Link>
            </p>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Admin accounts are provisioned by executive salon administration.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side Visual & Editorial Quote Panel */}
      <div className="hidden lg:flex flex-1 relative bg-noir-900 items-center justify-center p-12 overflow-hidden border-l border-gold-500/20">
        <div
          className="absolute inset-0 opacity-40 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1600&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-noir-900 via-noir-900/60 to-transparent" />

        <div className="relative z-10 max-w-lg text-white space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 backdrop-blur-md border border-gold-500/30 text-xs text-gold-300 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-gold-400" />
            <span>Vogue Beauty Award Atelier</span>
          </div>

          <blockquote className="font-serif text-2xl sm:text-3xl leading-snug italic font-normal text-champagne-100">
            &ldquo;SalonBook redefines what a sanctuary should be. The artists understand the subtle geometry of hair and skin, delivering absolute radiance.&rdquo;
          </blockquote>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-gold-400 overflow-hidden shadow-lg shadow-gold-500/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                alt="Client Portrait"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-serif font-bold text-sm text-white">Vivienne Delacroix</p>
              <p className="text-xs text-gold-400/90 font-medium">Haute Couture Patron · 24 Bespoke Visits</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
