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
  Sparkles,
  Compass,
  CheckCircle2,
  Camera,
  Image as ImageIcon,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthHeroVisual } from "@/components/auth/AuthHeroVisual";
import { SafeImage } from "@/components/ui/SafeImage";
import { getInitials } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

// Curated aesthetic portrait avatars for atelier patrons
const DEMO_AVATARS = [
  {
    id: "avatar-1",
    label: "Camille",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "avatar-2",
    label: "Marcus",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "avatar-3",
    label: "Elena",
    url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "avatar-4",
    label: "Julian",
    url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "avatar-5",
    label: "Genevieve",
    url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "avatar-6",
    label: "Harrison",
    url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
  },
];

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

  // Dynamic Profile Picture State
  const [avatarMode, setAvatarMode] = useState<"preset" | "custom">("preset");
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState<string>(DEMO_AVATARS[0].url);
  const [customAvatarUrl, setCustomAvatarUrl] = useState("");

  const activePhotoUrl = avatarMode === "custom" ? customAvatarUrl.trim() : selectedAvatarUrl;

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
        image: activePhotoUrl || undefined,
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
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F8F5F0] dark:bg-[#150F13] text-[#251C1D] dark:text-[#F7F0E8] transition-colors duration-300 relative overflow-hidden">
      {/* Dynamic Background Ambient Light Orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[420px] h-[420px] rounded-full bg-[#C8A879]/10 dark:bg-[#C8A879]/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[450px] h-[450px] rounded-full bg-[#3B1F2B]/10 dark:bg-[#4A2035]/25 blur-[140px] pointer-events-none" />

      {/* Left Column: Dynamic Registration Panel */}
      <div className="w-full lg:w-[48%] flex flex-col justify-between px-6 py-7 sm:px-10 md:px-14 lg:px-12 xl:px-16 min-h-screen relative z-10">
        <AuthHeader />

        <div className="w-full max-w-[450px] mx-auto my-auto py-4 space-y-5">
          {/* Dynamic Live Status Badge */}
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
                VIP Client Registration · Priority Slots
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[#786C68]/60 dark:text-[#B9AEB0]/60">
              <Compass className="w-3 h-3 text-[#C8A879]" />
              <span>SoHo Studio</span>
            </div>
          </motion.div>

          {/* Headline */}
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#94704C] dark:bg-[#C8A879]" />
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#94704C] dark:text-[#C8A879] font-bold">
                NEW CLIENT REGISTRATION
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#251C1D] dark:text-[#F7F0E8] tracking-tight leading-[1.12]">
              Create Your Account
            </h1>
            <p className="text-xs sm:text-sm text-[#786C68] dark:text-[#B9AEB0] leading-relaxed font-sans">
              Join SalonBook to enjoy personalized chair consultations and effortless scheduling.
            </p>
          </div>

          {/* Elevated Luxury Glassmorphic Card */}
          <div className="rounded-3xl p-5 sm:p-6 bg-[#FFFFFF]/90 dark:bg-[#20171B]/90 border border-[rgba(90,65,48,0.16)] dark:border-[rgba(200,168,121,0.22)] shadow-[0_12px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl relative space-y-4">
            <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#C8A879]/50 to-transparent pointer-events-none" />

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

            {/* Dynamic Profile Picture Selection Section */}
            <div className="p-3.5 rounded-2xl bg-[#F8F5F0]/70 dark:bg-[#181115]/90 border border-[rgba(90,65,48,0.14)] dark:border-[rgba(200,168,121,0.18)] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#786C68] dark:text-[#C8A879] flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-[#94704C] dark:text-[#C8A879]" />
                  SELECT PROFILE AVATAR
                </span>

                {/* Mode Selector Tabs */}
                <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[#EFE8DF] dark:bg-[#261D21] text-[10px]">
                  <button
                    type="button"
                    onClick={() => setAvatarMode("preset")}
                    className={`px-2 py-0.5 rounded-md font-semibold transition-all ${
                      avatarMode === "preset"
                        ? "bg-[#FFFFFF] dark:bg-[#C8A879] text-[#251C1D] dark:text-[#171114] shadow-xs"
                        : "text-[#786C68] dark:text-[#B9AEB0] hover:text-[#251C1D] dark:hover:text-[#F7F0E8]"
                    }`}
                  >
                    Preset Avatars
                  </button>
                  <button
                    type="button"
                    onClick={() => setAvatarMode("custom")}
                    className={`px-2 py-0.5 rounded-md font-semibold transition-all ${
                      avatarMode === "custom"
                        ? "bg-[#FFFFFF] dark:bg-[#C8A879] text-[#251C1D] dark:text-[#171114] shadow-xs"
                        : "text-[#786C68] dark:text-[#B9AEB0] hover:text-[#251C1D] dark:hover:text-[#F7F0E8]"
                    }`}
                  >
                    Photo URL
                  </button>
                </div>
              </div>

              {/* Main Avatar Preview & Selection Row */}
              <div className="flex items-center gap-3.5">
                {/* Live Preview Circle */}
                <div className="relative shrink-0">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#94704C] dark:border-[#C8A879] shadow-md bg-[#251C1D] dark:bg-[#261D21] flex items-center justify-center text-[#F7F0E8] font-serif font-bold text-base ring-4 ring-[#C8A879]/15">
                    {activePhotoUrl ? (
                      <SafeImage
                        src={activePhotoUrl}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : name ? (
                      getInitials(name)
                    ) : (
                      <User className="w-6 h-6 text-[#C8A879]" />
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#94704C] dark:bg-[#C8A879] text-[#F7F0E8] dark:text-[#171114] flex items-center justify-center shadow-xs">
                    <Sparkles className="w-2.5 h-2.5" />
                  </div>
                </div>

                {/* Preset Avatars Grid OR Custom URL Input */}
                <div className="flex-1 min-w-0">
                  {avatarMode === "preset" ? (
                    <div>
                      <span className="text-[10px] text-[#786C68]/80 dark:text-[#B9AEB0]/80 block mb-1.5 font-medium">
                        Tap an atelier portrait to select:
                      </span>
                      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                        {DEMO_AVATARS.map((avatar) => {
                          const isSelected = selectedAvatarUrl === avatar.url;
                          return (
                            <button
                              key={avatar.id}
                              type="button"
                              onClick={() => {
                                setSelectedAvatarUrl(avatar.url);
                                toast.info(`Avatar "${avatar.label}" selected`);
                              }}
                              className={`relative w-9 h-9 rounded-full overflow-hidden border-2 transition-all shrink-0 group ${
                                isSelected
                                  ? "border-[#94704C] dark:border-[#C8A879] ring-2 ring-[#C8A879]/40 scale-105"
                                  : "border-transparent opacity-65 hover:opacity-100 hover:border-[#94704C]/50 dark:hover:border-[#C8A879]/50"
                              }`}
                              title={avatar.label}
                            >
                              <SafeImage
                                src={avatar.url}
                                alt={avatar.label}
                                className="w-full h-full object-cover"
                              />
                              {isSelected && (
                                <div className="absolute inset-0 bg-[#251C1D]/35 flex items-center justify-center">
                                  <Check className="w-3 h-3 text-[#F7F0E8] stroke-[3]" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <span className="text-[10px] text-[#786C68]/80 dark:text-[#B9AEB0]/80 block font-medium">
                        Paste custom image web link:
                      </span>
                      <div className="relative">
                        <ImageIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#786C68]/60 dark:text-[#B9AEB0]/60" />
                        <Input
                          type="url"
                          placeholder="https://images.com/my-photo.jpg"
                          value={customAvatarUrl}
                          onChange={(e) => setCustomAvatarUrl(e.target.value)}
                          className="pl-8 pr-7 h-8 text-[11px] rounded-lg border-[rgba(90,65,48,0.2)] dark:border-[rgba(200,168,121,0.2)] bg-[#FFFFFF] dark:bg-[#20171B]"
                        />
                        {customAvatarUrl && (
                          <button
                            type="button"
                            onClick={() => setCustomAvatarUrl("")}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-[#786C68] dark:text-[#B9AEB0] hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Full Name */}
              <div className="space-y-1">
                <label
                  className="text-[11px] font-semibold uppercase tracking-wider text-[#786C68] dark:text-[#B9AEB0] block"
                  htmlFor="name"
                >
                  Full Name
                </label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#786C68]/60 dark:text-[#B9AEB0]/50 group-focus-within:text-[#94704C] dark:group-focus-within:text-[#C8A879] transition-colors" />
                  <Input
                    id="name"
                    type="text"
                    autoComplete="name"
                    placeholder="e.g. Julian Reynolds"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 h-10 rounded-xl border-[rgba(90,65,48,0.18)] dark:border-[rgba(200,168,121,0.2)] bg-[#F8F5F0]/70 dark:bg-[#181115]/90 text-xs text-[#251C1D] dark:text-[#F7F0E8] placeholder:text-[#786C68]/45 dark:placeholder:text-[#B9AEB0]/40 focus-visible:ring-2 focus-visible:ring-[#94704C]/30 dark:focus-visible:ring-[#C8A879]/30 focus-visible:border-[#94704C] dark:focus-visible:border-[#C8A879] transition-all shadow-xs"
                    required
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label
                  className="text-[11px] font-semibold uppercase tracking-wider text-[#786C68] dark:text-[#B9AEB0] block"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#786C68]/60 dark:text-[#B9AEB0]/50 group-focus-within:text-[#94704C] dark:group-focus-within:text-[#C8A879] transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-10 rounded-xl border-[rgba(90,65,48,0.18)] dark:border-[rgba(200,168,121,0.2)] bg-[#F8F5F0]/70 dark:bg-[#181115]/90 text-xs text-[#251C1D] dark:text-[#F7F0E8] placeholder:text-[#786C68]/45 dark:placeholder:text-[#B9AEB0]/40 focus-visible:ring-2 focus-visible:ring-[#94704C]/30 dark:focus-visible:ring-[#C8A879]/30 focus-visible:border-[#94704C] dark:focus-visible:border-[#C8A879] transition-all shadow-xs"
                    required
                  />
                </div>
              </div>

              {/* Phone (Optional) */}
              <div className="space-y-1">
                <label
                  className="text-[11px] font-semibold uppercase tracking-wider text-[#786C68] dark:text-[#B9AEB0] block"
                  htmlFor="phone"
                >
                  Contact Phone <span className="font-normal text-[10px] text-[#786C68]/60 dark:text-[#B9AEB0]/60">(Optional)</span>
                </label>
                <div className="relative group">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#786C68]/60 dark:text-[#B9AEB0]/50 group-focus-within:text-[#94704C] dark:group-focus-within:text-[#C8A879] transition-colors" />
                  <Input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+1 (646) 892-4410"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10 h-10 rounded-xl border-[rgba(90,65,48,0.18)] dark:border-[rgba(200,168,121,0.2)] bg-[#F8F5F0]/70 dark:bg-[#181115]/90 text-xs text-[#251C1D] dark:text-[#F7F0E8] placeholder:text-[#786C68]/45 dark:placeholder:text-[#B9AEB0]/40 focus-visible:ring-2 focus-visible:ring-[#94704C]/30 dark:focus-visible:ring-[#C8A879]/30 focus-visible:border-[#94704C] dark:focus-visible:border-[#C8A879] transition-all shadow-xs"
                  />
                </div>
              </div>

              {/* Password & Confirm Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label
                    className="text-[11px] font-semibold uppercase tracking-wider text-[#786C68] dark:text-[#B9AEB0] block"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#786C68]/60 dark:text-[#B9AEB0]/50" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Min 6 chars"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-8 pr-7 h-10 rounded-xl border-[rgba(90,65,48,0.18)] dark:border-[rgba(200,168,121,0.2)] bg-[#F8F5F0]/70 dark:bg-[#181115]/90 text-xs text-[#251C1D] dark:text-[#F7F0E8] placeholder:text-[#786C68]/45 dark:placeholder:text-[#B9AEB0]/40 focus-visible:ring-2 focus-visible:ring-[#94704C]/30 dark:focus-visible:ring-[#C8A879]/30 focus-visible:border-[#94704C] dark:focus-visible:border-[#C8A879] transition-all shadow-xs"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[#786C68]/60 dark:text-[#B9AEB0]/60 hover:text-[#251C1D] dark:hover:text-[#F7F0E8] focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label
                    className="text-[11px] font-semibold uppercase tracking-wider text-[#786C68] dark:text-[#B9AEB0] block"
                    htmlFor="confirmPassword"
                  >
                    Confirm
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#786C68]/60 dark:text-[#B9AEB0]/50" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Re-enter"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-8 pr-7 h-10 rounded-xl border-[rgba(90,65,48,0.18)] dark:border-[rgba(200,168,121,0.2)] bg-[#F8F5F0]/70 dark:bg-[#181115]/90 text-xs text-[#251C1D] dark:text-[#F7F0E8] placeholder:text-[#786C68]/45 dark:placeholder:text-[#B9AEB0]/40 focus-visible:ring-2 focus-visible:ring-[#94704C]/30 dark:focus-visible:ring-[#C8A879]/30 focus-visible:border-[#94704C] dark:focus-visible:border-[#C8A879] transition-all shadow-xs"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[#786C68]/60 dark:text-[#B9AEB0]/60 hover:text-[#251C1D] dark:hover:text-[#F7F0E8] focus:outline-none"
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Terms checkbox */}
              <div className="flex items-start gap-2 pt-1">
                <input
                  id="terms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 w-3.5 h-3.5 rounded text-[#94704C] dark:text-[#C8A879] border-[rgba(90,65,48,0.25)] dark:border-[rgba(200,168,121,0.25)] focus:ring-[#94704C] dark:focus:ring-[#C8A879] bg-[#FFFFFF] dark:bg-[#20171B] cursor-pointer"
                />
                <label
                  htmlFor="terms"
                  className="text-[11px] text-[#786C68] dark:text-[#B9AEB0] leading-relaxed cursor-pointer select-none"
                >
                  I agree to the SalonBook appointment policy and private client care guidelines.
                </label>
              </div>

              {/* Dynamic Shimmering Gold Button */}
              <Button
                type="submit"
                className="w-full h-11 text-xs font-bold uppercase tracking-widest rounded-xl bg-gradient-to-r from-[#C8A879] via-[#E2C69D] to-[#C8A879] bg-[length:200%_auto] text-[#171114] hover:bg-[position:right_center] shadow-md hover:shadow-lg transition-all duration-300 mt-2 group relative overflow-hidden"
                disabled={submitting || isLoading}
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-[#171114]" />
                    Creating Profile...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>Complete Client Registration</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                )}
              </Button>
            </form>
          </div>

          {/* Existing Account Footer Link */}
          <div className="text-center text-xs text-[#786C68] dark:text-[#B9AEB0] pt-1">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-semibold text-[#94704C] dark:text-[#C8A879] hover:underline ml-1"
            >
              Sign In
            </Link>
          </div>
        </div>

        <div className="py-2 text-center lg:text-left text-[11px] text-[#786C68]/60 dark:text-[#B9AEB0]/50 tracking-wider">
          © 2026 SalonBook Atelier · 128 Mercer St, SoHo NYC
        </div>
      </div>

      {/* Right Column: Visual Panel */}
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
