"use client";

import React, { useState } from "react";
import { User, Mail, Phone, Camera, ShieldCheck } from "lucide-react";
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
      toast.error("Please upload a valid image file.");
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
        name,
        phone,
        image,
      });
      toast.success("Executive settings updated.");
    } catch (err: unknown) {
      toast.error((err as Error).message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="space-y-1 pb-4 border-b border-[#302821]/15">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#B8755B] font-semibold block">
          EXECUTIVE DIRECTION
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#302821] dark:text-[#F5F1E8]">
          Administrator Settings
        </h2>
        <p className="text-xs text-[#302821]/70 dark:text-[#EAE3D6]/70 leading-relaxed">
          Manage executive credentials, contact telephone, and administrator portrait hosted via ImgBB.
        </p>
      </div>

      <div className="border border-[#302821]/15 dark:border-[#EAE3D6]/15 bg-[#EAE3D6]/30 dark:bg-[#1a201c] p-7 sm:p-8 space-y-8">
        {/* Avatar Section */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-[#302821]/10">
          <div className="relative group">
            <div className="w-20 h-20 rounded-none border border-[#302821]/20 bg-[#26372D] flex items-center justify-center text-[#F5F1E8] font-serif text-xl font-bold overflow-hidden">
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
              className="absolute inset-0 bg-[#302821]/70 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <Camera className="w-5 h-5" />
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
              <h3 className="font-serif text-xl text-[#302821] dark:text-[#F5F1E8]">
                {name || "Administrator"}
              </h3>
              <span className="px-2 py-0.5 text-[9px] uppercase tracking-wider font-semibold border border-[#26372D] bg-[#26372D] text-[#F5F1E8]">
                Director
              </span>
            </div>
            <p className="text-xs text-[#302821]/60">
              Hover over portrait to upload via ImgBB cloud storage.
            </p>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSaveProfile} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-[0.2em] text-[#302821]/70 font-semibold block">
              Full Legal Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#302821]/40" />
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 h-11 rounded-none border-[#302821]/20 bg-[#F5F1E8] dark:bg-[#151916] text-xs text-[#302821] dark:text-[#F5F1E8] focus-visible:ring-1 focus-visible:ring-[#26372D]"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-[0.2em] text-[#302821]/70 font-semibold block">
              Admin Email <span className="text-[#302821]/40 font-normal">(Locked)</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#302821]/40" />
              <Input
                value={user?.email || ""}
                disabled
                className="pl-10 h-11 rounded-none border-[#302821]/15 bg-[#EAE3D6]/50 text-xs text-[#302821]/60 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-[0.2em] text-[#302821]/70 font-semibold block">
              Contact Telephone
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#302821]/40" />
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-10 h-11 rounded-none border-[#302821]/20 bg-[#F5F1E8] dark:bg-[#151916] text-xs text-[#302821] dark:text-[#F5F1E8] focus-visible:ring-1 focus-visible:ring-[#26372D]"
                placeholder="+1 (212) 555-0198"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="default"
              disabled={saving}
              className="text-xs uppercase tracking-[0.2em] rounded-none h-11 px-6 bg-[#26372D] text-[#F5F1E8] hover:bg-[#343D2E]"
            >
              {saving ? "SAVING..." : "UPDATE EXECUTIVE DOSSIER"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
