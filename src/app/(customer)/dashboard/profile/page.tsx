"use client";

import React, { useState } from "react";
import { User, Mail, Phone, Camera, Shield, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { ApiResponse } from "@/types";
import { toast } from "sonner";
import { getInitials } from "@/lib/utils";

export default function CustomerProfilePage() {
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
      toast.error("Please select a valid image file (PNG, JPG, WEBP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file size must be less than 5 MB.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploadingImage(true);
      toast.info("Uploading portrait to ImgBB cloud...");

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
        toast.success("Profile photo updated successfully!");
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || "Avatar upload failed.");
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
        name,
        phone,
        image,
      });
      toast.success("Profile information updated successfully.");
    } catch (err: unknown) {
      toast.error((err as Error).message || "Profile update failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
          Profile Settings
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Manage your contact details, phone number, and profile picture.
        </p>
      </div>

      <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 space-y-6 shadow-sm">
        {/* Avatar Upload Section */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-border">
          <div className="relative group">
            <div className="w-20 h-20 rounded-full border-2 border-primary/30 bg-primary/10 flex items-center justify-center text-primary text-xl font-bold overflow-hidden shadow-sm">
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={image}
                  alt={name || "Guest"}
                  className="w-full h-full object-cover"
                />
              ) : (
                getInitials(name || "Salon Guest")
              )}
            </div>

            <label
              htmlFor="avatar-upload"
              className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <Camera className="w-5 h-5" />
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploadingImage}
            />
          </div>

          <div className="space-y-1.5 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h3 className="font-bold text-foreground text-base">
                {name || "Valued Guest"}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary uppercase">
                {user?.role || "customer"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Hover over the avatar to upload a new profile photo via ImgBB.
            </p>
          </div>
        </div>

        {/* Profile Details Form */}
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Full Legal Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 h-11 rounded-xl text-xs"
                placeholder="Your full name"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Email Address <span className="text-[10px] lowercase text-muted-foreground">(Locked)</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={user?.email || ""}
                disabled
                className="pl-10 h-11 rounded-xl text-xs bg-muted/40 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Contact Phone
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-10 h-11 rounded-xl text-xs"
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="gradient"
              disabled={saving}
              className="text-xs font-bold rounded-xl h-10 px-6 gap-2"
            >
              {saving ? "Saving Changes..." : "Save Profile Details"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
