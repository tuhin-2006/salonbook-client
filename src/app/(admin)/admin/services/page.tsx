"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Scissors,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Upload,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { api } from "@/lib/api";
import { Service, ApiResponse } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatCurrency, formatDate } from "@/lib/utils";
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
      toast.info("Uploading service image to ImgBB cloud...");

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
        toast.success("Image successfully hosted on ImgBB!");
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
      toast.error("Please fill in title and description.");
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
      toast.error("Please upload a service image file via ImgBB.");
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
          toast.success("Service updated successfully.");
          setServices((prev) =>
            prev.map((s) => (s._id === editingService._id ? res.data.data : s))
          );
        }
      } else {
        const res = await api.post<ApiResponse<Service>>("/services", payload);
        if (res.data.success) {
          toast.success("New service created in salon catalog.");
          setServices((prev) => [res.data.data, ...prev]);
        }
      }

      setModalOpen(false);
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to save service.");
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
        toast.success("Service deleted from salon catalog.");
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
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
            Manage Salon Catalog
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Create, edit, toggle visibility, and upload images hosted via ImgBB.
          </p>
        </div>

        <Button
          variant="gradient"
          size="sm"
          className="gap-2 rounded-xl text-xs font-bold"
          onClick={openCreateModal}
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-card rounded-2xl border border-border p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-3 gap-3 shadow-sm">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search services by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 text-xs rounded-xl"
          />
        </div>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-10 px-3 text-xs rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 text-xs rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
        </select>
      </div>

      {/* Services Table */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-muted-foreground text-sm space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
            <p className="text-xs font-semibold">Loading salon catalog...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="py-16 text-center space-y-3 max-w-sm mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center font-bold">
              <Scissors className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-foreground">
              No Services Found
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              No services match your active search and filter parameters.
            </p>
            <Button variant="outline" size="sm" onClick={() => { setSearch(""); setCategoryFilter("all"); setStatusFilter("all"); }} className="rounded-xl text-xs font-bold">
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
                  <th className="pb-3 pr-4">Service</th>
                  <th className="pb-3 px-4">Category</th>
                  <th className="pb-3 px-4">Price</th>
                  <th className="pb-3 px-4">Duration</th>
                  <th className="pb-3 px-4">Status</th>
                  <th className="pb-3 pl-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredServices.map((service) => (
                  <tr key={service._id} className="hover:bg-secondary/40 transition-colors">
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-border bg-muted">
                          <SafeImage
                            src={service.images?.[0] || ""}
                            alt={service.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-foreground text-xs leading-tight">
                            {service.title}
                          </p>
                          <p className="text-[11px] text-muted-foreground line-clamp-1 max-w-[200px]">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-secondary text-foreground border border-border">
                        {service.category}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-bold text-foreground whitespace-nowrap">
                      {formatCurrency(service.price)}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap text-muted-foreground">
                      {service.durationMinutes} min
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(service)}
                        className="cursor-pointer"
                        title="Click to toggle status"
                      >
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            service.isActive
                              ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                              : "bg-slate-500/10 text-slate-500 border border-slate-500/20"
                          }`}
                        >
                          {service.isActive ? (
                            <>
                              <CheckCircle className="w-3 h-3" /> Active
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" /> Inactive
                            </>
                          )}
                        </span>
                      </button>
                    </td>

                    <td className="py-4 pl-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs font-bold rounded-lg gap-1 px-2.5"
                          onClick={() => openEditModal(service)}
                        >
                          <Edit className="w-3 h-3" />
                          <span>Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs font-bold rounded-lg text-destructive hover:bg-destructive/10 px-2"
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
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {editingService ? "Edit Service" : "Add New Salon Service"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Configure treatment details, pricing, duration, and upload high-res imagery to ImgBB.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveService} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Service Title
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Signature French Balayage"
                className="rounded-xl text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-10 px-3 text-xs rounded-xl bg-background border border-border text-foreground"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Price (USD)
                </label>
                <Input
                  type="number"
                  min="1"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="150"
                  className="rounded-xl text-xs"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Duration (Minutes)
                </label>
                <Input
                  type="number"
                  min="15"
                  step="5"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                  placeholder="60"
                  className="rounded-xl text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Visibility Status
                </label>
                <select
                  value={isActive ? "active" : "inactive"}
                  onChange={(e) => setIsActive(e.target.value === "active")}
                  className="w-full h-10 px-3 text-xs rounded-xl bg-background border border-border text-foreground"
                >
                  <option value="active">Active (Visible to Clients)</option>
                  <option value="inactive">Inactive (Hidden)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full p-3 text-xs rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Comprehensive service description..."
                required
              />
            </div>

            {/* ImgBB Image Upload */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Service Image (ImgBB Hosted)
              </label>

              {imageUrl && (
                <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-border bg-muted mb-2">
                  <SafeImage
                    src={imageUrl}
                    alt="Uploaded preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="flex items-center gap-2">
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
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-secondary hover:bg-secondary/80 text-xs font-bold cursor-pointer transition-all"
                >
                  <Upload className="w-4 h-4 text-primary" />
                  <span>{uploadingImage ? "Uploading to ImgBB..." : "Upload Image File"}</span>
                </label>

                {imageUrl && (
                  <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Hosted on ImgBB
                  </span>
                )}
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-border gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setModalOpen(false)}
                className="rounded-xl text-xs font-bold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="gradient"
                disabled={submitting || uploadingImage}
                className="rounded-xl text-xs font-bold"
              >
                {submitting ? "Saving Service..." : editingService ? "Save Changes" : "Create Service"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              Delete Service from Catalog?
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Are you sure you want to remove &quot;{serviceToDelete?.title}&quot;? Clients will no longer be able to book this treatment.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteModalOpen(false)}
              className="rounded-xl text-xs font-bold"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={confirmDelete}
              disabled={deleting}
              className="rounded-xl text-xs font-bold"
            >
              {deleting ? "Deleting..." : "Yes, Delete Service"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
