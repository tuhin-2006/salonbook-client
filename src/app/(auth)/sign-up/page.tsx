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
  AlertCircle,
  Loader2,
  ShieldCheck,
  Scissors,
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
      toast.success("Welcome to SalonBook! Your account is created.");
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
        <div className="mx-auto w-full max-w-md space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Free Patron Account</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Create Your Account
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Book hair transformations, facial therapies, and track all your appointments in real time.
            </p>
          </div>

          {/* Error Banner */}
          {formError && (
            <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground" htmlFor="name">
                Full Legal Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g. Elena Rostova"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 h-11 rounded-xl bg-background border-input text-xs"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 rounded-xl bg-background border-input text-xs"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground" htmlFor="phone">
                Phone Number <span className="text-muted-foreground font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-10 h-11 rounded-xl bg-background border-input text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground" htmlFor="password">
                Password <span className="text-muted-foreground font-normal">(Min 6 chars)</span>
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
              className="w-full h-11 text-xs font-bold rounded-xl gap-2 shadow-md shadow-primary/25 mt-2"
              disabled={submitting || isLoading}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Creating Account...
                </>
              ) : (
                <>
                  Create Free Account <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          {/* Footer note */}
          <div className="text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link href="/sign-in" className="font-bold text-primary hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Right Column: Hero Visual */}
      <div className="hidden lg:block lg:flex-1 relative bg-muted overflow-hidden">
        <SafeImage
          src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=85"
          alt="Spa Radiance"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12 text-white space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold">
            <Scissors className="w-3.5 h-3.5" /> Client Privileges
          </div>
          <h3 className="text-2xl font-black">
            Seamless appointments, zero waiting lines.
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed max-w-md">
            Join thousands of satisfied patrons booking their beauty rituals effortlessly.
          </p>
        </div>
      </div>
    </div>
  );
}
