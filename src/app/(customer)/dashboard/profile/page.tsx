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
        // Persist immediately to profile
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
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h2 className="font-serif text-2xl font-bold text-foreground">
          Profile Settings
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Manage your personal atelier identity, contact information, and portrait photo.
        </p>
      </div>

      <div className="bg-card rounded-2xl border border-border/70 p-6 sm:p-8 space-y-8">
        {/* Avatar Upload Section */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-border/60">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full border-2 border-primary/30 bg-primary/10 flex items-center justify-center text-primary text-2xl font-serif font-bold overflow-hidden">
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
              className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <Camera className="w-6 h-6" />
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
              <h3 className="font-semibold text-foreground text-base">
                {name || "Valued Guest"}
              </h3>
              <Badge variant="outline" className="capitalize text-[11px]">
                {user?.role || "customer"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {uploadingImage
                ? "Uploading your new photo via ImgBB..."
                : "Click the portrait or use the button below to upload a new avatar (Max 5MB)."}
            </p>
            <label htmlFor="avatar-upload">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2 text-xs"
                disabled={uploadingImage}
                onClick={() => document.getElementById("avatar-upload")?.click()}
              >
                {uploadingImage ? "Uploading..." : "Upload New Portrait"}
              </Button>
            </label>
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSaveProfile} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground" htmlFor="profile-name">
              Full Legal Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="profile-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 h-11"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground" htmlFor="profile-email">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="profile-email"
                value={user?.email || ""}
                disabled
                className="pl-10 h-11 bg-muted/40 cursor-not-allowed text-muted-foreground"
              />
            </div>
            <p className="text-[11px] text-muted-foreground">
              Email is managed by authentication provider and cannot be modified directly.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground" htmlFor="profile-phone">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="profile-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 018-9922"
                className="pl-10 h-11"
              />
            </div>
          </div>

          {/* Direct Photo URL fallback */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground" htmlFor="profile-image-url">
              Profile Photo URL (Optional Alternative)
            </label>
            <Input
              id="profile-image-url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="h-11 text-xs"
            />
          </div>

          {/* Role & Security Guard indicator */}
          <div className="p-3.5 rounded-xl bg-muted/30 border border-border/70 flex items-start gap-3 text-xs text-muted-foreground">
            <Shield className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Protected Account Profile</p>
              <p className="text-[11px] text-muted-foreground">
                Role attributes and access privilege levels are strictly server-enforced and cannot be elevated from this form.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="luxury"
              className="h-11 px-6 text-sm font-semibold"
              disabled={saving}
            >
              {saving ? "Saving Changes..." : "Save Profile"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}