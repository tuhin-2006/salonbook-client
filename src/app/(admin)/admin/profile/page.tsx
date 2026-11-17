"use client";

import React, { useState } from "react";
import { User, Mail, Phone, Camera, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
      toast.error("Please upload a valid image file.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploadingImage(true);
      toast.info("Uploading admin portrait to ImgBB...");

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
        toast.success("Admin portrait updated via ImgBB!");
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || "Upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateProfile({ name, phone, image });
      toast.success("Admin credentials profile updated.");
    } catch (err: unknown) {
      toast.error((err as Error).message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h2 className="font-serif text-2xl font-bold text-foreground">
          Administrative Profile
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Executive salon supervisor account settings and credentials.
        </p>
      </div>

      <div className="bg-card rounded-2xl border border-border/70 p-6 sm:p-8 space-y-8">
        {/* Avatar Upload */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-border/60">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full border-2 border-primary/30 bg-primary/10 flex items-center justify-center text-primary text-2xl font-serif font-bold overflow-hidden">
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={image}
                  alt={name || "Admin"}
                  className="w-full h-full object-cover"
                />
              ) : (
                getInitials(name || "Admin")
              )}
            </div>

            <label
              htmlFor="admin-avatar-upload"
              className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <Camera className="w-6 h-6" />
            </label>
            <input
              id="admin-avatar-upload"
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
                {name || "SalonBook Administrator"}
              </h3>
              <Badge className="bg-primary text-white text-[10px] uppercase font-bold">
                Admin
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {uploadingImage
                ? "Uploading portrait to ImgBB..."
                : "Executive profile photo hosted in high definition."}
            </p>
            <label htmlFor="admin-avatar-upload">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2 text-xs"
                disabled={uploadingImage}
                onClick={() => document.getElementById("admin-avatar-upload")?.click()}
              >
                {uploadingImage ? "Uploading..." : "Upload New Portrait"}
              </Button>
            </label>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Administrator Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 h-11"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Administrative Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={user?.email || "admin@salonbook.com"}
                disabled
                className="pl-10 h-11 bg-muted/40 cursor-not-allowed text-muted-foreground"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Contact Phone
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 019-2834"
                className="pl-10 h-11"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 flex items-start gap-3 text-xs">
            <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p className="text-muted-foreground">
              This account possesses top-level RBAC privileges including catalog authoring, slot approval, customer restriction, and financial ledger review.
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="luxury"
              className="h-11 px-6 text-sm font-semibold"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Administrator Profile"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}