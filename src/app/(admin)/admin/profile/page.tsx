"use client";

import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Camera,
  ShieldCheck,
  Sparkles,
  Save,
  Lock,
  Upload,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { ApiResponse } from "@/types";
import { toast } from "sonner";
import { getInitials } from "@/lib/utils";

export default function AdminProfilePage() {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [image, setImage] = useState(user?.image || "");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (PNG, JPG, WEBP).");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploadingImage(true);
      toast.info("Uploading executive portrait to ImgBB cloud...");

      const res = await api.post<ApiResponse<{ url: string }>>(
        "/auth/upload-avatar",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success && res.data.data.url) {
        setImage(res.data.data.url);
        await updateProfile({ image: res.data.data.url });
        toast.success("Executive portrait updated via ImgBB.");
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || "Upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }

    try {
      setSaving(true);
      await updateProfile({
        name: name.trim(),
        phone: phone.trim(),
        image: image.trim(),
      });
      toast.success("Executive settings updated successfully.");
    } catch (err: unknown) {
      toast.error((err as Error).message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* 1. Header Banner */}
      <div className="space-y-2 pb-6 border-b border-border/80">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent" />
          <span className="text-[11px] uppercase tracking-[0.25em] text-accent font-bold">
            Executive Settings
          </span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Administrator Profile Dossier
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Manage executive credentials, contact telephone for atelier emergency communications, and executive portrait hosted via ImgBB.
        </p>
      </div>

      {/* 2. Main Profile Form Card */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 space-y-8 shadow-sm">
        {/* Avatar Upload Section */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-border/60">
          <div className="relative group">
            <div className="w-24 h-24 rounded-2xl border-2 border-border/80 bg-muted/60 flex items-center justify-center text-foreground font-serif text-2xl font-bold overflow-hidden shadow-sm">
              {image ? (
                <img
                  src={image}
                  alt={name || "Admin"}
                  className="w-full h-full object-cover"
                />
              ) : (
                getInitials(name || "Admin")
              )}
            </div>

            <label className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center cursor-pointer shadow-md transition-transform hover:scale-110">
              <Camera className="w-4 h-4 text-accent" />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploadingImage}
                className="hidden"
              />
            </label>
          </div>

          <div className="space-y-1.5 text-center sm:text-left">
            <h3 className="font-serif text-lg font-bold text-foreground">
              Executive Portrait
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm">
              Upload a high-resolution portrait. File will be compressed and securely hosted on ImgBB.
            </p>
            <div className="pt-1">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                Salon Administrator
              </span>
            </div>
          </div>
        </div>

        {/* Profile Inputs Form */}
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-accent" />
                <span>Executive Full Name *</span>
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Marcus Sterling"
                required
                className="h-11 rounded-xl text-xs border-border bg-background"
              />
            </div>

            {/* Telephone */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-accent" />
                <span>Contact Telephone</span>
              </label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (212) 555-0198"
                className="h-11 rounded-xl text-xs border-border bg-background"
              />
            </div>
          </div>

          {/* Email Address (Read-Only) */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-accent" />
              <span>Email Address (Protected Identifier)</span>
            </label>
            <div className="relative">
              <Input
                value={user?.email || ""}
                disabled
                className="h-11 rounded-xl text-xs border-border bg-muted/60 text-muted-foreground cursor-not-allowed pl-10"
              />
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
            </div>
            <p className="text-[11px] text-muted-foreground">
              To update your primary authentication email, please reach out to systems security engineering.
            </p>
          </div>

          {/* Custom Avatar URL */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-accent" />
              <span>Direct Photo URL (Optional)</span>
            </label>
            <Input
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://..."
              className="h-11 rounded-xl text-xs border-border bg-background"
            />
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-border/60 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>256-bit TLS encrypted session</span>
            </div>

            <Button
              type="submit"
              disabled={saving || uploadingImage}
              className="rounded-xl text-xs font-semibold tracking-wider gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-6 h-10 shadow-sm"
            >
              <Save className="w-3.5 h-3.5 text-accent" />
              <span>{saving ? "Updating..." : "Save Settings"}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
