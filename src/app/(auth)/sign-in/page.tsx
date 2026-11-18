"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  User,
  AlertCircle,
  Loader2,
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
      toast.success("Welcome back to SalonBook Atelier.");
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
      toast.success(`Access granted as ${role.toUpperCase()}`);
    } catch (err: unknown) {
      setFormError((err as Error).message || "Demo login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] w-full flex flex-col lg:flex-row bg-[#F5F1E8] dark:bg-[#151916] text-[#302821] dark:text-[#F5F1E8]">
      {/* Left Form Container */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-md space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#B8755B] font-semibold block">
              ATELIER ACCESS
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#302821] dark:text-[#F5F1E8]">
              Sign In to Your Dossier
            </h1>
            <p className="text-xs text-[#302821]/70 dark:text-[#EAE3D6]/70 leading-relaxed">
              Access your appointments, biological care formulations, and concierge receipts.
            </p>
          </div>

          {/* Quick Evaluator Demo Fill Box */}
          <div className="p-5 border border-[#302821]/15 dark:border-[#EAE3D6]/15 bg-[#EAE3D6]/40 dark:bg-[#1a201c] space-y-3">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-[#302821]/70 dark:text-[#EAE3D6]/70 font-semibold">
              <span>EVALUATOR 1-CLICK ACCESS</span>
              <span className="text-[#B8755B]">INSTANT CREDENTIALS</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full text-[10px] uppercase tracking-[0.16em] rounded-none border-[#302821]/20 hover:bg-[#26372D] hover:text-[#F5F1E8] h-10"
                onClick={() => handleDemoFill("customer")}
                disabled={submitting || isLoading}
              >
                <User className="w-3.5 h-3.5 mr-1.5" />
                PATRON DEMO
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full text-[10px] uppercase tracking-[0.16em] rounded-none border-[#302821]/20 hover:bg-[#26372D] hover:text-[#F5F1E8] h-10"
                onClick={() => handleDemoFill("admin")}
                disabled={submitting || isLoading}
              >
                <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                ADMIN DEMO
              </Button>
            </div>
          </div>

          {/* Error Banner */}
          {formError && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-[0.2em] text-[#302821]/70 dark:text-[#EAE3D6]/70 block font-semibold" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#302821]/40" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@salonbook.com or customer@salonbook.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 rounded-none border-[#302821]/20 bg-[#F5F1E8] dark:bg-[#151916] text-xs text-[#302821] dark:text-[#F5F1E8] focus-visible:ring-1 focus-visible:ring-[#26372D]"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-[0.2em] text-[#302821]/70 dark:text-[#EAE3D6]/70 block font-semibold" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#302821]/40" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11 rounded-none border-[#302821]/20 bg-[#F5F1E8] dark:bg-[#151916] text-xs text-[#302821] dark:text-[#F5F1E8] focus-visible:ring-1 focus-visible:ring-[#26372D]"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="default"
              className="w-full h-11 text-xs uppercase tracking-[0.2em] rounded-none bg-[#26372D] text-[#F5F1E8] hover:bg-[#343D2E]"
              disabled={submitting || isLoading}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" /> ACCESSING DOSSIER...
                </>
              ) : (
                <>
                  SIGN IN TO ATELIER <ArrowRight className="w-3.5 h-3.5 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Footer note */}
          <div className="text-center text-xs text-[#302821]/70 dark:text-[#EAE3D6]/70 pt-2 border-t border-[#302821]/10">
            First time at SalonBook?{" "}
            <Link href="/sign-up" className="font-semibold text-[#26372D] dark:text-[#B8755B] hover:underline">
              Create a patron profile
            </Link>
          </div>
        </div>
      </div>

      {/* Right Column: Editorial Visual */}
      <div className="hidden lg:block lg:flex-1 relative bg-[#EAE3D6] overflow-hidden border-l border-[#302821]/15">
        <SafeImage
          src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=85"
          alt="European Atelier Sanctuary"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#26372D]/40" />
        <div className="absolute bottom-12 left-12 right-12 text-[#F5F1E8] space-y-3 p-6 bg-[#26372D]/90 backdrop-blur-sm border border-[#F5F1E8]/20">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#A4AA91] font-semibold block">
            SALONBOOK ARCHIVE
          </span>
          <h3 className="font-serif text-2xl font-normal leading-snug">
            &ldquo;Hair is personal architecture. Treat it with unhurried craft.&rdquo;
          </h3>
          <p className="text-xs text-[#EAE3D6]/70">
            Madison Avenue Atelier · New York Flagship
          </p>
        </div>
      </div>
    </div>
  );
}
