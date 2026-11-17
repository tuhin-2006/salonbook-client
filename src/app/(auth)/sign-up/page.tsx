"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Mail, Lock, User, Phone, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
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

    if (!name || !email || !password) {
      setFormError("Please fill in your name, email, and password.");
      return;
    }

    if (password.length < 6) {
      setFormError("Password must be at least 6 characters.");
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
      toast.success("Welcome to SalonBook! Your account has been registered.");
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
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          {/* Header */}
          <div className="space-y-2 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Begin Your Ritual</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Join SalonBook to book luxury salon appointments, manage your schedule, and experience bespoke self-care.
            </p>
          </div>

          {/* Error Banner */}
          {formError && (
            <div className="mb-6 p-3.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground" htmlFor="name">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Sophia Montgomery"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 h-11"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground" htmlFor="email">
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
                  className="pl-10 h-11"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground" htmlFor="phone">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 018-9922"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="luxury"
              className="w-full h-11 text-sm font-semibold gap-2 mt-4"
              disabled={submitting || isLoading}
            >
              {submitting ? "Creating Account..." : "Complete Registration"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          {/* Footer note */}
          <div className="mt-8 pt-6 border-t border-border text-center space-y-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              By creating an account, you agree to SalonBook&apos;s Terms of Service and Privacy Policy.
            </p>
            <p className="text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-primary font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side Visual & Features Panel */}
      <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-terracotta-900 to-primary items-center justify-center p-12 overflow-hidden">
        <div
          className="absolute inset-0 opacity-30 bg-cover bg-center mix-blend-overlay"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1600&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />

        <div className="relative z-10 max-w-lg text-white space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-gold-400" />
            <span>Join 8,000+ Happy Clients</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-normal leading-snug text-cream-100">
            Tailored beauty rituals designed around your lifestyle.
          </h2>

          <div className="space-y-4 text-sm text-cream-200/80">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
              <span>Instant slot reservation with real-time salon availability.</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
              <span>Certified master colorists, aesthetic doctors, and massage therapists.</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
              <span>Secure card checkout powered by Stripe.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}