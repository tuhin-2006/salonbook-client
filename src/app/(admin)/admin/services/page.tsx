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
  Clock,
  DollarSign,
  Filter,
  Sparkles,
  ExternalLink,
  Layers,
  Image as ImageIcon,
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, WEBP).");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploadingImage(true);
      toast.info("Uploading formulation photograph to ImgBB cloud...");

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
        toast.success("Image uploaded successfully.");
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || "Image upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price || !durationMinutes || !description.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const payload = {
      title: title.trim(),
      category,
      price: Number(price),
      durationMinutes: Number(durationMinutes),
      description: description.trim(),
      isActive,
      images: imageUrl.trim()
        ? [imageUrl.trim()]
        : [
            "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
          ],
    };

    try {
      setSubmitting(true);
      if (editingService) {
        const res = await api.patch<ApiResponse<Service>>(
          `/services/${editingService._id}`,
          payload
        );
        if (res.data.success) {
          toast.success("Treatment carte offering updated.");
          setServices((prev) =>
            prev.map((s) => (s._id === editingService._id ? res.data.data : s))
          );
          setModalOpen(false);
        }
      } else {
        const res = await api.post<ApiResponse<Service>>("/services", payload);
        if (res.data.success) {
          toast.success("New treatment added to carte.");
          setServices((prev) => [res.data.data, ...prev]);
          setModalOpen(false);
        }
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || "Operation failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (service: Service) => {
    try {
      const newStatus = !service.isActive;
      const res = await api.patch<ApiResponse<Service>>(
        `/services/${service._id}`,
        {
          isActive: newStatus,
        }
      );
      if (res.data.success) {
        toast.success(
          newStatus ? "Service activated in live catalog." : "Service archived."
        );
        setServices((prev) =>
          prev.map((s) => (s._id === service._id ? { ...s, isActive: newStatus } : s))
        );
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!serviceToDelete) return;
    try {
      setDeleting(true);
      const res = await api.delete<ApiResponse<null>>(
        `/services/${serviceToDelete._id}`
      );
      if (res.data.success) {
        toast.success("Service removed from carte.");
        setServices((prev) => prev.filter((s) => s._id !== serviceToDelete._id));
        setDeleteModalOpen(false);
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to delete service");
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
        statusFilter === "all"
          ? true
          : statusFilter === "active"
          ? s.isActive
          : !s.isActive;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [services, search, categoryFilter, statusFilter]);

  return (
    <div className="space-y-8">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-border/80">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-[11px] uppercase tracking-[0.25em] text-accent font-bold">
              Service Management
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Treatment Carte Catalog
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
            Manage your bespoke styling services, pricing, treatment duration, and catalog visibility across the booking portal.
          </p>
        </div>

        <Button
          onClick={openCreateModal}
          className="rounded-xl text-xs font-semibold tracking-wider gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-accent" />
          <span>Add New Treatment</span>
        </Button>
      </div>

      {/* 2. Filters & Search Control Bar */}
      <div className="p-4 sm:p-5 rounded-2xl border border-border/80 bg-card space-y-4 shadow-sm">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search treatments by title or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-10 text-xs rounded-xl border-border bg-background text-foreground"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Category Dropdown */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter services by category"
              className="h-10 px-3 rounded-xl border border-border bg-background text-foreground text-xs font-medium focus:ring-1 focus:ring-accent outline-none"
            >
              <option value="all">All Specialties ({services.length})</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Status Dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter services by status"
              className="h-10 px-3 rounded-xl border border-border bg-background text-foreground text-xs font-medium focus:ring-1 focus:ring-accent outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="inactive">Archived Only</option>
            </select>

            {(search || categoryFilter !== "all" || statusFilter !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearch("");
                  setCategoryFilter("all");
                  setStatusFilter("all");
                }}
                className="text-xs text-muted-foreground hover:text-foreground h-10 px-3"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Counter */}
        <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-3 border-t border-border/50">
          <span>
            Displaying <strong className="text-foreground">{filteredServices.length}</strong> of {services.length} treatments
          </span>
          <span className="hidden sm:inline-block">Live synchronous updates enabled</span>
        </div>
      </div>

      {/* 3. Luxury Structured Carte Table */}
      <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent animate-spin rounded-full mx-auto" />
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
              Loading Treatment Carte...
            </p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="py-20 text-center space-y-3 max-w-sm mx-auto p-4">
            <div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto text-muted-foreground">
              <Scissors className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-serif text-xl font-bold text-foreground">
              No Treatments Found
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              No services matched your active search or specialty filters. Try clearing filters or create a new treatment.
            </p>
            <Button
              size="sm"
              onClick={openCreateModal}
              className="mt-2 rounded-xl text-xs bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="w-3.5 h-3.5 mr-1 text-accent" /> Add New Treatment
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full min-w-[700px] text-left text-xs">
              <thead>
                <tr className="border-b border-border/70 bg-muted/30 text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-4 px-6">Treatment</th>
                  <th className="py-4 px-4">Specialty</th>
                  <th className="py-4 px-4">Duration</th>
                  <th className="py-4 px-4">Price</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredServices.map((service) => (
                  <tr
                    key={service._id}
                    className="hover:bg-muted/40 transition-colors group"
                  >
                    {/* Treatment Column */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted/60 shrink-0 border border-border/70 relative">
                          <SafeImage
                            src={service.images?.[0] || ""}
                            alt={service.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="space-y-1 min-w-0 max-w-xs sm:max-w-md">
                          <span className="font-serif text-sm sm:text-base font-bold text-foreground block truncate">
                            {service.title}
                          </span>
                          <p className="text-[11px] text-muted-foreground line-clamp-1">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category Column */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent font-semibold text-[11px]">
                        <Layers className="w-3 h-3" />
                        <span>{service.category}</span>
                      </span>
                    </td>

                    {/* Duration Column */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="w-3.5 h-3.5 text-accent" />
                        <span className="font-medium">{service.durationMinutes} mins</span>
                      </div>
                    </td>

                    {/* Price Column */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="font-serif text-base font-bold text-foreground">
                        {formatCurrency(service.price)}
                      </span>
                    </td>

                    {/* Status Column */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(service)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase transition-colors ${
                          service.isActive
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                            : "bg-muted text-muted-foreground border border-border hover:bg-muted/80"
                        }`}
                        title="Click to toggle active status"
                      >
                        {service.isActive ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Archived</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Action Column */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditModal(service)}
                          className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                          title="Edit Service"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setServiceToDelete(service);
                            setDeleteModalOpen(true);
                          }}
                          className="h-8 w-8 rounded-lg text-destructive/80 hover:text-destructive hover:bg-destructive/10"
                          title="Delete Service"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* 4. Add / Edit Service Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border-border bg-card p-6 sm:p-8">
          <DialogHeader className="space-y-1 pb-4 border-b border-border">
            <DialogTitle className="font-serif text-2xl font-bold text-foreground">
              {editingService ? "Edit Treatment Offering" : "New Treatment Formulation"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Configure treatment pricing, duration, description, and visual representation on the SalonBook carte.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5 pt-3">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Treatment Title *
              </label>
              <Input
                placeholder="e.g. Signature Balayage & Silk Glaze"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="h-10 rounded-xl text-xs border-border bg-background"
              />
            </div>

            {/* Category, Price, Duration Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Specialty *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-border bg-background text-foreground text-xs font-medium focus:ring-1 focus:ring-accent outline-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Price ($ USD) *
                </label>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="185"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="h-10 rounded-xl text-xs border-border bg-background"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Duration (mins) *
                </label>
                <Input
                  type="number"
                  min="15"
                  step="15"
                  placeholder="90"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                  required
                  className="h-10 rounded-xl text-xs border-border bg-background"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Treatment Description *
              </label>
              <textarea
                placeholder="Describe treatment procedures, formulation botanicals, and client results..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                required
                className="w-full p-3 rounded-xl border border-border bg-background text-foreground text-xs font-sans focus:ring-1 focus:ring-accent outline-none"
              />
            </div>

            {/* Image Upload / URL */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Treatment Photography (ImgBB Cloud or URL)
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="h-10 rounded-xl text-xs border-border bg-background flex-1"
                />
                <label className="h-10 px-4 rounded-xl border border-border bg-muted/60 hover:bg-muted text-foreground text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shrink-0">
                  <Upload className="w-3.5 h-3.5 text-accent" />
                  <span>{uploadingImage ? "Uploading..." : "Upload"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>
              </div>

              {imageUrl && (
                <div className="mt-2 w-full h-32 rounded-xl overflow-hidden border border-border relative bg-muted/40">
                  <SafeImage
                    src={imageUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            {/* Active Toggle */}
            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="isActiveService"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded text-accent accent-accent"
              />
              <label
                htmlFor="isActiveService"
                className="text-xs font-medium text-foreground cursor-pointer"
              >
                Display offering as active in public reservation catalog
              </label>
            </div>

            <DialogFooter className="pt-4 border-t border-border gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setModalOpen(false)}
                className="rounded-xl text-xs border-border"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting || uploadingImage}
                className="rounded-xl text-xs bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {submitting ? "Saving..." : editingService ? "Update Treatment" : "Create Treatment"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 5. Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="max-w-md rounded-2xl border-border bg-card p-6">
          <DialogHeader className="space-y-2">
            <DialogTitle className="font-serif text-xl font-bold text-destructive">
              Remove Offering from Carte
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to delete <strong className="text-foreground">"{serviceToDelete?.title}"</strong>?
              This action cannot be undone and will prevent future guest reservations for this offering.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4 border-t border-border gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteModalOpen(false)}
              className="rounded-xl text-xs border-border"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={deleting}
              onClick={handleDelete}
              className="rounded-xl text-xs bg-destructive text-destructive-foreground"
            >
              {deleting ? "Removing..." : "Confirm Removal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
