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
      toast.success("Welcome to SalonBook Atelier. Your profile is created.");
      router.push("/dashboard");
    } catch (err: unknown) {
      setFormError((err as Error).message || "Registration failed.");
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
              PATRON INVITATION
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#302821] dark:text-[#F5F1E8]">
              Create Your Profile
            </h1>
            <p className="text-xs text-[#302821]/70 dark:text-[#EAE3D6]/70 leading-relaxed">
              Reserve hair transformations, restorative facial therapies, and private consultations in real time.
            </p>
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
              <label className="text-[10px] uppercase tracking-[0.2em] text-[#302821]/70 dark:text-[#EAE3D6]/70 block font-semibold" htmlFor="name">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#302821]/40" />
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g. Elena Rostova"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 h-11 rounded-none border-[#302821]/20 bg-[#F5F1E8] dark:bg-[#151916] text-xs text-[#302821] dark:text-[#F5F1E8] focus-visible:ring-1 focus-visible:ring-[#26372D]"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-[0.2em] text-[#302821]/70 dark:text-[#EAE3D6]/70 block font-semibold" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#302821]/40" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 rounded-none border-[#302821]/20 bg-[#F5F1E8] dark:bg-[#151916] text-xs text-[#302821] dark:text-[#F5F1E8] focus-visible:ring-1 focus-visible:ring-[#26372D]"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-[0.2em] text-[#302821]/70 dark:text-[#EAE3D6]/70 block font-semibold" htmlFor="phone">
                Contact Phone <span className="text-[#302821]/40 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#302821]/40" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (212) 555-0198"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-10 h-11 rounded-none border-[#302821]/20 bg-[#F5F1E8] dark:bg-[#151916] text-xs text-[#302821] dark:text-[#F5F1E8] focus-visible:ring-1 focus-visible:ring-[#26372D]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-[0.2em] text-[#302821]/70 dark:text-[#EAE3D6]/70 block font-semibold" htmlFor="password">
                Password <span className="text-[#302821]/40 font-normal">(Minimum 6 characters)</span>
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
              className="w-full h-11 text-xs uppercase tracking-[0.2em] rounded-none bg-[#26372D] text-[#F5F1E8] hover:bg-[#343D2E] mt-2"
              disabled={submitting || isLoading}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" /> CREATING PROFILE...
                </>
              ) : (
                <>
                  CREATE PATRON PROFILE <ArrowRight className="w-3.5 h-3.5 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Footer note */}
          <div className="text-center text-xs text-[#302821]/70 dark:text-[#EAE3D6]/70 pt-2 border-t border-[#302821]/10">
            Already have a patron profile?{" "}
            <Link href="/sign-in" className="font-semibold text-[#26372D] dark:text-[#B8755B] hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Right Column: Editorial Visual */}
      <div className="hidden lg:block lg:flex-1 relative bg-[#EAE3D6] overflow-hidden border-l border-[#302821]/15">
        <SafeImage
          src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=85"
          alt="Spa Radiance Ritual"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#26372D]/40" />
        <div className="absolute bottom-12 left-12 right-12 text-[#F5F1E8] space-y-3 p-6 bg-[#26372D]/90 backdrop-blur-sm border border-[#F5F1E8]/20">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#A4AA91] font-semibold block">
            PATRON PRIVILEGES
          </span>
          <h3 className="font-serif text-2xl font-normal leading-snug">
            Priority reservations, unhurried service, and curated botanical dossiers.
          </h3>
          <p className="text-xs text-[#EAE3D6]/70">
            Join the discerning community of SalonBook atelier patrons.
          </p>
        </div>
      </div>
    </div>
  );
}
