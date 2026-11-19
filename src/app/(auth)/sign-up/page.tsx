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
  Camera,
  Image as ImageIcon,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthHeroVisual } from "@/components/auth/AuthHeroVisual";
import { SafeImage } from "@/components/ui/SafeImage";
import { getInitials } from "@/lib/utils";
import { toast } from "sonner";
import { motion } from "framer-motion";

// Curated cartoon-style avatars for playful, modern & chic atelier patrons
const CARTOON_AVATARS = [
  {
    id: "cartoon-1",
    label: "Felix",
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  },
  {
    id: "cartoon-2",
    label: "Aneka",
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
  },
  {
    id: "cartoon-3",
    label: "Milo",
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Milo",
  },
  {
    id: "cartoon-4",
    label: "Zoe",
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe",
  },
  {
    id: "cartoon-5",
    label: "Oliver",
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver",
  },
  {
    id: "cartoon-6",
    label: "Sophia",
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia",
  },
  {
    id: "cartoon-7",
    label: "Leo",
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Leo",
  },
  {
    id: "cartoon-8",
    label: "Mia",
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mia",
  },
];

function GoogleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
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
  );
}

export default function SignUpPage() {
  const router = useRouter();
  const { register, quickDemoLogin, isLoading, isAuthenticated, isAdmin } = useAuth();
  const { handleGoogleSignIn, isGoogleLoading } = useGoogleAuth();

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

  // Dynamic Cartoon Avatar State
  const [avatarMode, setAvatarMode] = useState<"preset" | "custom">("preset");
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState<string>(CARTOON_AVATARS[0].url);
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
    <div className="min-h-[calc(100vh-4rem)] w-full flex flex-col lg:flex-row bg-[#F8F5F0] dark:bg-[#150F13] text-[#251C1D] dark:text-[#F7F0E8] transition-colors duration-300 relative overflow-hidden">
      {/* Dynamic Background Ambient Light Orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[420px] h-[420px] rounded-full bg-[#C8A879]/10 dark:bg-[#C8A879]/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[450px] h-[450px] rounded-full bg-[#3B1F2B]/10 dark:bg-[#4A2035]/25 blur-[140px] pointer-events-none" />

      {/* Left Column: Dynamic Registration Panel (Responsive full-width on mobile/tablet) */}
      <div className="w-full lg:w-[48%] flex flex-col justify-between px-4 sm:px-8 md:px-12 lg:px-10 xl:px-16 py-6 min-h-[calc(100vh-4rem)] relative z-10">
        <AuthHeader />

        <div className="w-full max-w-[450px] mx-auto my-auto py-3 space-y-4">
          {/* Dynamic Status Badge */}
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
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#94704C] dark:bg-[#C8A879]" />
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#94704C] dark:text-[#C8A879] font-bold">
                NEW CLIENT REGISTRATION
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#251C1D] dark:text-[#F7F0E8] tracking-tight leading-[1.12]">
              Create Your Account
            </h1>
            <p className="text-xs text-[#786C68] dark:text-[#B9AEB0] leading-relaxed font-sans">
              Join SalonBook to enjoy personalized chair consultations and effortless scheduling.
            </p>
          </div>

          {/* Elevated Luxury Glassmorphic Card */}
          <div className="rounded-3xl p-5 sm:p-6 bg-[#FFFFFF]/90 dark:bg-[#20171B]/90 border border-[rgba(90,65,48,0.16)] dark:border-[rgba(200,168,121,0.22)] shadow-[0_12px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl relative space-y-3.5">
            <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#C8A879]/50 to-transparent pointer-events-none" />

            {/* Continue with Google Button */}
            <Button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={submitting || isLoading || isGoogleLoading}
              className="w-full h-11 rounded-xl border border-[rgba(90,65,48,0.2)] dark:border-[rgba(200,168,121,0.22)] bg-[#FFFFFF] dark:bg-[#251C20] text-xs font-semibold text-[#251C1D] dark:text-[#F7F0E8] hover:bg-[#F8F5F0] dark:hover:bg-[#2D1F26] flex items-center justify-center gap-2.5 transition-all shadow-xs"
            >
              <GoogleIcon className="w-4 h-4 shrink-0" />
              <span>
                {isGoogleLoading ? "Connecting to Google..." : "Continue with Google"}
              </span>
            </Button>

            {/* Elegant OR Divider */}
            <div className="relative flex items-center justify-center py-0.5">
              <div className="border-t border-[rgba(90,65,48,0.14)] dark:border-[rgba(200,168,121,0.16)] w-full" />
              <span className="bg-[#FFFFFF] dark:bg-[#20171B] px-3 text-[10px] uppercase tracking-wider text-[#786C68] dark:text-[#B9AEB0] font-semibold shrink-0">
                Or register with email
              </span>
              <div className="border-t border-[rgba(90,65,48,0.14)] dark:border-[rgba(200,168,121,0.16)] w-full" />
            </div>

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

            {/* Dynamic Cartoon Profile Avatar Selector */}
            <div className="p-3 rounded-2xl bg-[#F8F5F0]/70 dark:bg-[#181115]/90 border border-[rgba(90,65,48,0.14)] dark:border-[rgba(200,168,121,0.18)] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#786C68] dark:text-[#C8A879] flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-[#94704C] dark:text-[#C8A879]" />
                  SELECT CARTOON AVATAR
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
                    Cartoon Avatars
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
                    Custom URL
                  </button>
                </div>
              </div>

              {/* Main Avatar Preview & Selection Row */}
              <div className="flex items-center gap-3">
                {/* Live Preview Circle */}
                <div className="relative shrink-0">
                  <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-[#94704C] dark:border-[#C8A879] shadow-md bg-[#FFF3E8] dark:bg-[#261D21] flex items-center justify-center text-[#251C1D] dark:text-[#F7F0E8] font-serif font-bold text-base ring-4 ring-[#C8A879]/15">
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

                {/* Preset Cartoon Avatars Grid OR Custom URL Input */}
                <div className="flex-1 min-w-0">
                  {avatarMode === "preset" ? (
                    <div>
                      <span className="text-[10px] text-[#786C68]/80 dark:text-[#B9AEB0]/80 block mb-1 font-medium">
                        Tap a cartoon character to pick:
                      </span>
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                        {CARTOON_AVATARS.map((avatar) => {
                          const isSelected = selectedAvatarUrl === avatar.url;
                          return (
                            <button
                              key={avatar.id}
                              type="button"
                              onClick={() => {
                                setSelectedAvatarUrl(avatar.url);
                                toast.info(`Avatar "${avatar.label}" selected`);
                              }}
                              className={`relative w-9 h-9 rounded-full overflow-hidden border-2 transition-all shrink-0 bg-[#FFF3E8] dark:bg-[#2B1F25] group ${
                                isSelected
                                  ? "border-[#94704C] dark:border-[#C8A879] ring-2 ring-[#C8A879]/50 scale-105"
                                  : "border-transparent opacity-75 hover:opacity-100 hover:border-[#94704C]/50 dark:hover:border-[#C8A879]/50"
                              }`}
                              title={avatar.label}
                            >
                              <SafeImage
                                src={avatar.url}
                                alt={avatar.label}
                                className="w-full h-full object-cover"
                              />
                              {isSelected && (
                                <div className="absolute inset-0 bg-[#251C1D]/30 flex items-center justify-center">
                                  <Check className="w-3.5 h-3.5 text-[#F7F0E8] stroke-[3]" />
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

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-2.5">
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
              <div className="flex items-start gap-2 pt-0.5">
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
                    <span>Create Account</span>
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
