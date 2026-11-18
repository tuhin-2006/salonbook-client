"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Scissors,
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Upload,
} from "lucide-react";
import { api } from "@/lib/api";
import { Service, ApiResponse } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

const CATEGORIES = [
  "Hair",
  "Nails",
  "Facial & Skin",
  "Massage",
  "Makeup",
  "Barbering",
  "Spa & Wellness",
  "Waxing",
];

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Add / Edit Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [price, setPrice] = useState<number | string>("");
  const [durationMinutes, setDurationMinutes] = useState<number | string>(60);
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await api.get<ApiResponse<{ services: Service[] }>>(
        "/services?limit=100"
      );
      if (res.data.success) {
        setServices(res.data.data.services);
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openCreateModal = () => {
    setEditingService(null);
    setTitle("");
    setCategory(CATEGORIES[0]);
    setPrice("");
    setDurationMinutes(60);
    setDescription("");
    setIsActive(true);
    setImageUrl("");
    setModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setTitle(service.title);
    setCategory(service.category);
    setPrice(service.price);
    setDurationMinutes(service.durationMinutes);
    setDescription(service.description);
    setIsActive(service.isActive);
    setImageUrl(service.images?.[0] || "");
    setModalOpen(true);
  };

  // Image Upload via ImgBB
  const handleImageFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (PNG, JPG, WEBP).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image file size cannot exceed 10 MB.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploadingImage(true);
      toast.info("Uploading formulation image to ImgBB cloud...");

      const res = await api.post<ApiResponse<{ url: string }>>(
        "/services/upload-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success && res.data.data.url) {
        setImageUrl(res.data.data.url);
        toast.success("Image successfully hosted on ImgBB.");
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || "Image upload failed.");
    } finally {
      setUploadingImage(false);
    }
  };

  // Save (Create or Update)
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      toast.error("Please enter treatment title and description.");
      return;
    }

    const numericPrice = Number(price);
    const numericDuration = Number(durationMinutes);

    if (isNaN(numericPrice) || numericPrice <= 0) {
      toast.error("Price must be a positive number.");
      return;
    }

    if (isNaN(numericDuration) || numericDuration <= 0) {
      toast.error("Duration must be a positive number.");
      return;
    }

    if (!imageUrl) {
      toast.error("Please upload a formulation image file via ImgBB.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        title,
        category,
        description,
        price: numericPrice,
        durationMinutes: numericDuration,
        isActive,
        images: [imageUrl],
      };

      if (editingService) {
        const res = await api.patch<ApiResponse<Service>>(
          `/services/${editingService._id}`,
          payload
        );
        if (res.data.success) {
          toast.success("Treatment dossier updated.");
          setServices((prev) =>
            prev.map((s) => (s._id === editingService._id ? res.data.data : s))
          );
        }
      } else {
        const res = await api.post<ApiResponse<Service>>("/services", payload);
        if (res.data.success) {
          toast.success("New formulation added to atelier carte.");
          setServices((prev) => [res.data.data, ...prev]);
        }
      }

      setModalOpen(false);
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to save treatment.");
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle active/inactive
  const handleToggleStatus = async (service: Service) => {
    try {
      const res = await api.patch<ApiResponse<Service>>(
        `/services/${service._id}/toggle-status`
      );
      if (res.data.success) {
        toast.success(res.data.message);
        setServices((prev) =>
          prev.map((s) =>
            s._id === service._id ? { ...s, isActive: !s.isActive } : s
          )
        );
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || "Toggle status failed.");
    }
  };

  // Delete
  const confirmDelete = async () => {
    if (!serviceToDelete) return;
    try {
      setDeleting(true);
      const res = await api.delete(`/services/${serviceToDelete._id}`);
      if (res.status === 200) {
        toast.success("Treatment removed from atelier carte.");
        setServices((prev) =>
          prev.filter((s) => s._id !== serviceToDelete._id)
        );
        setDeleteModalOpen(false);
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || "Delete failed.");
    } finally {
      setDeleting(false);
      setServiceToDelete(null);
    }
  };

  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const matchesSearch =
        !search ||
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.description.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" || s.category === categoryFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" ? s.isActive : !s.isActive);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [services, search, categoryFilter, statusFilter]);

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 pb-6 border-b border-[#302821]/15">
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#B8755B] font-semibold block">
            CARTE MANAGEMENT
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#302821] dark:text-[#F5F1E8]">
            Atelier Formulations &amp; Rituals
          </h2>
          <p className="text-xs text-[#302821]/70 dark:text-[#EAE3D6]/70 max-w-xl leading-relaxed">
            Manage public carte offerings, update pricing and durations, toggle visibility, and host imagery via ImgBB.
          </p>
        </div>

        <Button
          variant="default"
          size="sm"
          className="rounded-none text-xs uppercase tracking-wider px-5 py-2.5 bg-[#26372D] text-[#F5F1E8] hover:bg-[#343D2E]"
          onClick={openCreateModal}
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span>ADD NEW FORMULATION</span>
        </Button>
      </div>

      {/* Filter and Search Bar: Architectural Surface */}
      <div className="border border-[#302821]/15 dark:border-[#EAE3D6]/15 bg-[#EAE3D6]/40 dark:bg-[#1a201c] p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#302821]/40" />
          <Input
            placeholder="Search treatments by title or ingredients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 text-xs rounded-none border-[#302821]/20 bg-[#F5F1E8] dark:bg-[#151916] text-[#302821] dark:text-[#F5F1E8]"
          />
        </div>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-10 px-3 text-xs uppercase tracking-wider rounded-none bg-[#F5F1E8] dark:bg-[#151916] border border-[#302821]/20 text-[#302821] dark:text-[#F5F1E8] focus:outline-none"
        >
          <option value="all">ALL SPECIALTIES</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat.toUpperCase()}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 text-xs uppercase tracking-wider rounded-none bg-[#F5F1E8] dark:bg-[#151916] border border-[#302821]/20 text-[#302821] dark:text-[#F5F1E8] focus:outline-none"
        >
          <option value="all">ALL VISIBILITY STATUSES</option>
          <option value="active">ACTIVE ONLY</option>
          <option value="inactive">INACTIVE (ARCHIVED)</option>
        </select>
      </div>

      {/* Services Table */}
      <div className="border border-[#302821]/15 dark:border-[#EAE3D6]/15 bg-[#EAE3D6]/30 dark:bg-[#1a201c] p-6">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-[#26372D] border-t-transparent animate-spin mx-auto" />
            <p className="text-xs uppercase tracking-wider text-[#302821]/60">
              Loading Atelier Carte...
            </p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="py-16 text-center space-y-3 max-w-sm mx-auto">
            <div className="w-12 h-12 border border-[#302821]/20 bg-[#EAE3D6] mx-auto flex items-center justify-center font-bold text-[#26372D]">
              <Scissors className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-xl text-[#302821] dark:text-[#F5F1E8]">
              No Formulations Found
            </h4>
            <p className="text-xs text-[#302821]/70 leading-relaxed">
              No treatments match your active filter parameters.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch("");
                setCategoryFilter("all");
                setStatusFilter("all");
              }}
              className="rounded-none text-xs uppercase tracking-wider border-[#302821]/20"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#302821]/15 text-[#302821]/60 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="pb-3 pr-4">Treatment</th>
                  <th className="pb-3 px-4">Specialty</th>
                  <th className="pb-3 px-4">Fee</th>
                  <th className="pb-3 px-4">Duration</th>
                  <th className="pb-3 px-4">Visibility</th>
                  <th className="pb-3 pl-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#302821]/10">
                {filteredServices.map((service) => (
                  <tr key={service._id} className="hover:bg-[#EAE3D6]/60 transition-colors">
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 overflow-hidden shrink-0 border border-[#302821]/15 bg-[#EAE3D6]">
                          <SafeImage
                            src={service.images?.[0] || ""}
                            alt={service.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-serif text-base text-[#302821] dark:text-[#F5F1E8] leading-tight">
                            {service.title}
                          </p>
                          <p className="text-[11px] text-[#302821]/60 dark:text-[#EAE3D6]/60 line-clamp-1 max-w-[240px]">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 text-[9px] uppercase tracking-wider border border-[#302821]/20">
                        {service.category}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-serif text-base text-[#26372D] dark:text-[#F5F1E8] whitespace-nowrap">
                      {formatCurrency(service.price)}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap text-[#302821]/70">
                      {service.durationMinutes} MIN
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(service)}
                        className="cursor-pointer"
                        title="Click to toggle status"
                      >
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[9px] uppercase tracking-wider font-semibold border ${
                            service.isActive
                              ? "bg-[#26372D] text-[#F5F1E8] border-[#26372D]"
                              : "bg-[#EAE3D6] text-[#302821]/60 border-[#302821]/20"
                          }`}
                        >
                          {service.isActive ? (
                            <>
                              <CheckCircle className="w-3 h-3" /> ACTIVE
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" /> HIDDEN
                            </>
                          )}
                        </span>
                      </button>
                    </td>

                    <td className="py-4 pl-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-[10px] uppercase tracking-wider rounded-none border-[#302821]/20 hover:bg-[#26372D] hover:text-[#F5F1E8] px-3"
                          onClick={() => openEditModal(service)}
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          <span>EDIT</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-red-700 hover:bg-red-50 px-2 rounded-none"
                          onClick={() => {
                            setServiceToDelete(service);
                            setDeleteModalOpen(true);
                          }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Service Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto bg-[#F5F1E8] border-[#302821]/20 p-8 rounded-none">
          <DialogHeader className="space-y-1">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#B8755B] font-semibold block">
              CARTE FORMULATION DOSSIER
            </span>
            <DialogTitle className="font-serif text-2xl text-[#302821]">
              {editingService ? "Update Treatment Formulation" : "Add New Carte Treatment"}
            </DialogTitle>
            <DialogDescription className="text-xs text-[#302821]/70">
              Configure formulation details, treatment investment, duration, and upload clinical imagery to ImgBB.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveService} className="space-y-4 pt-3">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-[0.2em] text-[#302821]/70 font-semibold block">
                Treatment Title
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Signature French Balayage & Silk Glaze"
                className="rounded-none border-[#302821]/20 bg-[#F5F1E8] text-xs text-[#302821] focus-visible:ring-1 focus-visible:ring-[#26372D]"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-[0.2em] text-[#302821]/70 font-semibold block">
                  Specialty Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-10 px-3 text-xs uppercase tracking-wider rounded-none bg-[#F5F1E8] border border-[#302821]/20 text-[#302821]"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-[0.2em] text-[#302821]/70 font-semibold block">
                  Treatment Fee ($ USD)
                </label>
                <Input
                  type="number"
                  min="1"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="195"
                  className="rounded-none border-[#302821]/20 bg-[#F5F1E8] text-xs text-[#302821]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-[0.2em] text-[#302821]/70 font-semibold block">
                  Duration (Minutes)
                </label>
                <Input
                  type="number"
                  min="15"
                  step="5"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                  placeholder="60"
                  className="rounded-none border-[#302821]/20 bg-[#F5F1E8] text-xs text-[#302821]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-[0.2em] text-[#302821]/70 font-semibold block">
                  Visibility Status
                </label>
                <select
                  value={isActive ? "active" : "inactive"}
                  onChange={(e) => setIsActive(e.target.value === "active")}
                  className="w-full h-10 px-3 text-xs uppercase tracking-wider rounded-none bg-[#F5F1E8] border border-[#302821]/20 text-[#302821]"
                >
                  <option value="active">Active (Visible on Carte)</option>
                  <option value="inactive">Archived (Hidden)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-[0.2em] text-[#302821]/70 font-semibold block">
                Formulation Protocol &amp; Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full p-3 text-xs rounded-none bg-[#F5F1E8] border border-[#302821]/20 text-[#302821] focus:outline-none focus:ring-1 focus:ring-[#26372D]"
                placeholder="Comprehensive clinical and botanical description of the service..."
                required
              />
            </div>

            {/* ImgBB Image Upload */}
            <div className="space-y-2 pt-1">
              <label className="text-[10px] uppercase tracking-[0.2em] text-[#302821]/70 font-semibold block">
                Formulation Imagery (Hosted on ImgBB Cloud)
              </label>

              {imageUrl && (
                <div className="relative aspect-[16/9] w-full border border-[#302821]/15 bg-[#EAE3D6] mb-2 overflow-hidden">
                  <SafeImage
                    src={imageUrl}
                    alt="Uploaded preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="flex items-center gap-3">
                <input
                  type="file"
                  id="service-image-input"
                  accept="image/*"
                  onChange={handleImageFileUpload}
                  className="hidden"
                  disabled={uploadingImage}
                />
                <label
                  htmlFor="service-image-input"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-none border border-[#302821]/20 bg-[#EAE3D6] text-xs uppercase tracking-wider font-semibold cursor-pointer hover:bg-[#26372D] hover:text-[#F5F1E8] transition-all"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingImage ? "Hosting on ImgBB..." : "Upload Photo File"}</span>
                </label>

                {imageUrl && (
                  <span className="text-[10px] uppercase tracking-wider text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Cloud Hosted
                  </span>
                )}
              </div>
            </div>

            <DialogFooter className="pt-6 border-t border-[#302821]/10 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setModalOpen(false)}
                className="rounded-none text-xs uppercase tracking-wider border-[#302821]/20"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                disabled={submitting || uploadingImage}
                className="rounded-none text-xs uppercase tracking-wider bg-[#26372D] text-[#F5F1E8] hover:bg-[#343D2E] px-6"
              >
                {submitting ? "Saving..." : editingService ? "Update Formulation" : "Create Formulation"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-md bg-[#F5F1E8] border-[#302821]/20 p-6 rounded-none">
          <DialogHeader className="space-y-2">
            <DialogTitle className="font-serif text-2xl text-[#302821]">
              Remove Formulation from Carte?
            </DialogTitle>
            <DialogDescription className="text-xs text-[#302821]/70 leading-relaxed">
              Are you sure you wish to delete &quot;{serviceToDelete?.title}&quot;? Patrons will no longer be able to select or reserve this service.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteModalOpen(false)}
              className="rounded-none text-xs uppercase tracking-wider border-[#302821]/20"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={confirmDelete}
              disabled={deleting}
              className="rounded-none text-xs uppercase tracking-wider bg-red-700 text-white hover:bg-red-800"
            >
              {deleting ? "Removing..." : "Confirm Removal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
