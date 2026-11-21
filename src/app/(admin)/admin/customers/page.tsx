"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Users,
  Search,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  UserX,
  Mail,
  Calendar,
  Sparkles,
  RefreshCw,
  Phone,
  Eye,
  User as UserIcon,
  Clock,
  Scissors,
  CheckCircle2,
  UserCog,
} from "lucide-react";
import { api } from "@/lib/api";
import { User, ApiResponse, Appointment } from "@/types";
import { useAuth } from "@/context/AuthContext";
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
import { formatDate, getInitials, formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminCustomersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // View User Dossier Modal
  const [viewUserModalOpen, setViewUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userDetailsLoading, setUserDetailsLoading] = useState(false);
  const [userBookingsCount, setUserBookingsCount] = useState<number>(0);
  const [userRecentBookings, setUserRecentBookings] = useState<Appointment[]>([]);

  const fetchUsers = async () => {
    try {
      setRefreshing(true);
      const res = await api.get<ApiResponse<User[]>>("/admin/users");
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to load patrons registry");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleViewUser = async (user: User) => {
    setSelectedUser(user);
    setViewUserModalOpen(true);
    setUserDetailsLoading(true);
    setUserBookingsCount(0);
    setUserRecentBookings([]);

    try {
      const userId = user.id || user._id || "";
      const res = await api.get<
        ApiResponse<{
          user: User;
          appointmentsCount: number;
          recentAppointments: Appointment[];
        }>
      >(`/admin/users/${userId}`);

      if (res.data.success && res.data.data) {
        setUserBookingsCount(res.data.data.appointmentsCount || 0);
        setUserRecentBookings(res.data.data.recentAppointments || []);
        if (res.data.data.user) {
          setSelectedUser(res.data.data.user);
        }
      }
    } catch {
      // Fallback: If single fetch fails, still show the user from table
    } finally {
      setUserDetailsLoading(false);
    }
  };

  const handleToggleBlock = async (user: User) => {
    try {
      const userId = user.id || user._id || "";
      setActionLoadingId(userId);
      const isCurrentlyBlocked = user.isBlocked;

      const endpoint = isCurrentlyBlocked
        ? `/admin/users/${userId}/unblock`
        : `/admin/users/${userId}/block`;

      const res = await api.patch<ApiResponse<User>>(endpoint);

      if (res.data.success) {
        toast.success(
          isCurrentlyBlocked
            ? `Patron ${user.name} privileges reinstated.`
            : `Patron ${user.name} access suspended.`
        );

        setUsers((prev) =>
          prev.map((u) =>
            (u.id || u._id) === userId ? { ...u, isBlocked: !isCurrentlyBlocked } : u
          )
        );

        if (selectedUser && (selectedUser.id || selectedUser._id) === userId) {
          setSelectedUser((prev) =>
            prev ? { ...prev, isBlocked: !isCurrentlyBlocked } : null
          );
        }
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || "Action failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleUpdateRole = async (targetUser: User, newRole: "customer" | "admin") => {
    const userId = targetUser.id || targetUser._id;
    if (!userId) return;

    if ((currentUser?.id || currentUser?._id) === userId && newRole !== "admin") {
      toast.error("You cannot remove administrator privileges from your own logged-in account.");
      return;
    }

    try {
      setActionLoadingId(userId);
      const res = await api.patch<ApiResponse<User>>(`/admin/users/${userId}/role`, {
        role: newRole,
      });

      if (res.data.success) {
        toast.success(
          `User role updated to ${newRole === "admin" ? "Administrator" : "Patron Client"} successfully.`
        );
        setUsers((prev) =>
          prev.map((u) => ((u.id || u._id) === userId ? { ...u, role: newRole } : u))
        );
        if (selectedUser && (selectedUser.id || selectedUser._id) === userId) {
          setSelectedUser((prev) => (prev ? { ...prev, role: newRole } : null));
        }
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to update user role");
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const nameMatch = u.name?.toLowerCase().includes(search.toLowerCase());
      const emailMatch = u.email?.toLowerCase().includes(search.toLowerCase());
      const matchesSearch = !search || nameMatch || emailMatch;

      const matchesRole =
        roleFilter === "all" ? true : u.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  return (
    <div className="space-y-8">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-border/80">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-[11px] uppercase tracking-[0.25em] text-accent font-bold">
              Directory &amp; Governance
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Patron &amp; Client Registry
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
            Oversee registered atelier clientele, monitor membership tiers, and govern appointment booking permissions.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchUsers}
          disabled={refreshing}
          className="rounded-xl text-xs font-semibold gap-2 border-border hover:bg-muted self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-accent" : ""}`} />
          <span>Refresh Patrons</span>
        </Button>
      </div>

      {/* 2. Search & Role Filter Bar */}
      <div className="p-4 sm:p-5 rounded-2xl border border-border/80 bg-card space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search patron by full name or email address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-10 text-xs rounded-xl border-border bg-background text-foreground"
            />
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-3">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="h-10 px-3 rounded-xl border border-border bg-background text-foreground text-xs font-medium focus:ring-1 focus:ring-accent outline-none"
            >
              <option value="all">All Roles ({users.length})</option>
              <option value="customer">Clients / Patrons</option>
              <option value="admin">Administrators</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Luxury Customers Table */}
      <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent animate-spin rounded-full mx-auto" />
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
              Loading Dashboard Data...
            </p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-20 text-center space-y-3 max-w-sm mx-auto p-4">
            <div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto text-muted-foreground">
              <Users className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-serif text-xl font-bold text-foreground">
              No Patrons Indexed
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              No registered user profiles matched your current query criteria.
            </p>
          </div>
        ) : (
          <>
            {/* 3A. Mobile & Tablet Patrons Card View (Visible on < lg screens) */}
            <div className="block lg:hidden p-3 sm:p-4 space-y-4">
              {filteredUsers.map((client) => {
                const clientId = client.id || client._id || "";
                const isProcessing = actionLoadingId === clientId;

                return (
                  <div
                    key={clientId}
                    className="p-4 sm:p-5 rounded-2xl border border-border/80 bg-background/50 hover:border-accent/40 transition-all space-y-3.5 shadow-xs"
                  >
                    {/* Top Patron Info & Role Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-11 rounded-full bg-accent/20 text-accent font-sans font-bold text-xs flex items-center justify-center shrink-0 border border-accent/30 overflow-hidden">
                          {client.image ? (
                            <img
                              src={client.image}
                              alt={client.name || "Patron"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            getInitials(client.name || "Client")
                          )}
                        </div>
                        <div className="min-w-0 space-y-0.5">
                          <span className="font-semibold text-sm text-foreground block truncate">
                            {client.name || "Unnamed Patron"}
                          </span>
                          <span className="text-[11px] text-muted-foreground block truncate">
                            {client.email}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            client.role === "admin"
                              ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
                              : "bg-muted text-muted-foreground border-border"
                          }`}
                        >
                          {client.role === "admin" ? "Admin" : "Patron"}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                            client.isBlocked
                              ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                              : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                          }`}
                        >
                          {client.isBlocked ? "Suspended" : "Active"}
                        </span>
                      </div>
                    </div>

                    {/* Metadata Row: Phone & Registration */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground pt-1 border-t border-border/40">
                      <div className="flex items-center gap-2">
                        {client.phone ? (
                          <span className="flex items-center gap-1 text-[11px]">
                            <Phone className="w-3 h-3 text-accent" />
                            {client.phone}
                          </span>
                        ) : (
                          <span className="text-[11px] text-muted-foreground/60 italic">
                            No telephone logged
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-muted-foreground">
                        {client.createdAt ? formatDate(client.createdAt) : "Member"}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-border/50">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewUser(client)}
                        className="h-8 px-3 rounded-xl text-xs font-semibold gap-1.5 border-border hover:bg-muted text-foreground"
                      >
                        <Eye className="w-3.5 h-3.5 text-accent" />
                        <span>View Dossier</span>
                      </Button>

                      {/* Role Update Toggle */}
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={
                          isProcessing ||
                          ((currentUser?.id || currentUser?._id) === clientId &&
                            client.role === "admin")
                        }
                        onClick={() =>
                          handleUpdateRole(
                            client,
                            client.role === "admin" ? "customer" : "admin"
                          )
                        }
                        className={`h-8 px-3 rounded-xl text-xs font-semibold gap-1.5 ${
                          client.role === "admin"
                            ? "border-purple-500/30 text-purple-600 dark:text-purple-400 hover:bg-purple-500/10"
                            : "border-[#94704C]/30 dark:border-[#C8A879]/30 text-[#94704C] dark:text-[#C8A879] hover:bg-[#94704C]/10"
                        }`}
                      >
                        <UserCog className="w-3.5 h-3.5" />
                        <span>{client.role === "admin" ? "Demote" : "Make Admin"}</span>
                      </Button>

                      {/* Block / Unblock Toggle */}
                      {client.role !== "admin" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isProcessing}
                          onClick={() => handleToggleBlock(client)}
                          className={`h-8 px-3 rounded-xl text-xs font-semibold gap-1.5 ${
                            client.isBlocked
                              ? "border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10"
                              : "border-rose-500/30 text-rose-600 hover:bg-rose-500/10"
                          }`}
                        >
                          {client.isBlocked ? (
                            <>
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>Unblock</span>
                            </>
                          ) : (
                            <>
                              <UserX className="w-3.5 h-3.5" />
                              <span>Block</span>
                            </>
                          )}
                        </Button>
                      ) : (
                        <span className="text-[10px] text-muted-foreground italic px-2">
                          Protected
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 3B. Desktop Structured Patrons Table (Visible on lg+ screens with visible smooth scrollbar) */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-xs">
                <thead>
                  <tr className="border-b border-border/70 bg-muted/30 text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
                    <th className="py-4 px-6">Patron Profile</th>
                    <th className="py-4 px-4">Contact</th>
                    <th className="py-4 px-4">Role</th>
                    <th className="py-4 px-4">Registered</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-6 text-right">Actions &amp; Governance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredUsers.map((client) => {
                    const clientId = client.id || client._id || "";
                    const isProcessing = actionLoadingId === clientId;

                    return (
                      <tr
                        key={clientId}
                        className="hover:bg-muted/40 transition-colors group"
                      >
                        {/* Patron Profile */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-full bg-accent/20 text-accent font-sans font-bold text-xs flex items-center justify-center shrink-0 border border-accent/30 overflow-hidden">
                              {client.image ? (
                                <img
                                  src={client.image}
                                  alt={client.name || "Patron"}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                getInitials(client.name || "Client")
                              )}
                            </div>
                            <div>
                              <span className="font-semibold text-sm text-foreground block">
                                {client.name || "Unnamed Patron"}
                              </span>
                              <span className="text-[11px] text-muted-foreground block tabular-nums">
                                ID: {clientId.slice(-8)}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5 text-foreground">
                              <Mail className="w-3.5 h-3.5 text-accent" />
                              <span>{client.email}</span>
                            </div>
                            {client.phone && (
                              <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
                                <Phone className="w-3 h-3" />
                                <span>{client.phone}</span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Role */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                              client.role === "admin"
                                ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
                                : "bg-muted text-muted-foreground border-border"
                            }`}
                          >
                            {client.role === "admin" ? "Administrator" : "Patron Client"}
                          </span>
                        </td>

                        {/* Registered Date */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="text-muted-foreground">
                            {client.createdAt ? formatDate(client.createdAt) : "Member"}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                              client.isBlocked
                                ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            }`}
                          >
                            {client.isBlocked ? (
                              <>
                                <ShieldAlert className="w-3 h-3" />
                                <span>Suspended</span>
                              </>
                            ) : (
                              <>
                                <ShieldCheck className="w-3 h-3" />
                                <span>Active</span>
                              </>
                            )}
                          </span>
                        </td>

                        {/* Privilege Action */}
                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            {/* View User Button */}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewUser(client)}
                              className="rounded-xl text-[11px] font-semibold tracking-wider h-8 gap-1.5 border-border hover:bg-muted text-foreground"
                              title="Inspect Patron Dossier"
                            >
                              <Eye className="w-3.5 h-3.5 text-accent" />
                              <span>View User</span>
                            </Button>

                            {/* Role Update Toggle */}
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={
                                isProcessing ||
                                ((currentUser?.id || currentUser?._id) === clientId &&
                                  client.role === "admin")
                              }
                              onClick={() =>
                                handleUpdateRole(
                                  client,
                                  client.role === "admin" ? "customer" : "admin"
                                )
                              }
                              className={`rounded-xl text-[11px] font-semibold tracking-wider h-8 gap-1.5 ${
                                client.role === "admin"
                                  ? "border-purple-500/30 text-purple-600 dark:text-purple-400 hover:bg-purple-500/10"
                                  : "border-[#94704C]/30 dark:border-[#C8A879]/30 text-[#94704C] dark:text-[#C8A879] hover:bg-[#94704C]/10"
                              }`}
                              title={
                                client.role === "admin"
                                  ? "Demote to Patron Client"
                                  : "Promote to Administrator"
                              }
                            >
                              <UserCog className="w-3.5 h-3.5" />
                              <span>{client.role === "admin" ? "Demote" : "Make Admin"}</span>
                            </Button>

                            {/* Block / Unblock Toggle */}
                            {client.role !== "admin" ? (
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={isProcessing}
                                onClick={() => handleToggleBlock(client)}
                                className={`rounded-xl text-[11px] font-semibold tracking-wider h-8 gap-1.5 ${
                                  client.isBlocked
                                    ? "border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10"
                                    : "border-rose-500/30 text-rose-600 hover:bg-rose-500/10"
                                }`}
                              >
                                {client.isBlocked ? (
                                  <>
                                    <UserCheck className="w-3.5 h-3.5" />
                                    <span>Unblock</span>
                                  </>
                                ) : (
                                  <>
                                    <UserX className="w-3.5 h-3.5" />
                                    <span>Block</span>
                                  </>
                                )}
                              </Button>
                            ) : (
                              <span className="text-[10px] text-muted-foreground italic px-2">
                                Protected
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* 4. Luxury View User Dossier Modal */}
      <Dialog open={viewUserModalOpen} onOpenChange={setViewUserModalOpen}>
        <DialogContent className="w-[calc(100vw-1.5rem)] sm:w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-2xl border-border bg-card p-4 sm:p-6">
          <DialogHeader className="space-y-1 pb-4 border-b border-border">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-accent font-bold">
                Patron Dossier &amp; Profile
              </span>
              {selectedUser && (
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shrink-0 ${
                    selectedUser.isBlocked
                      ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                      : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                  }`}
                >
                  {selectedUser.isBlocked ? "Suspended" : "Active Privilege"}
                </span>
              )}
            </div>
            <DialogTitle className="font-serif text-xl sm:text-2xl font-bold text-foreground">
              {selectedUser?.name || "Patron Profile"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground truncate">
              User ID: {selectedUser?.id || selectedUser?._id}
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4 pt-2 text-xs">
              {/* Primary Profile Badge */}
              <div className="flex items-center gap-3.5 p-3.5 sm:p-4 rounded-xl bg-muted/40 border border-border/80">
                <div className="w-12 h-12 rounded-full bg-accent/20 text-accent font-serif font-bold text-base flex items-center justify-center border border-accent/30 overflow-hidden shrink-0">
                  {selectedUser.image ? (
                    <img
                      src={selectedUser.image}
                      alt={selectedUser.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    getInitials(selectedUser.name)
                  )}
                </div>
                <div className="space-y-0.5 min-w-0 flex-1">
                  <h3 className="font-serif text-base sm:text-lg font-bold text-foreground truncate">
                    {selectedUser.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground text-[11px]">
                    <span className="flex items-center gap-1 text-foreground min-w-0">
                      <Mail className="w-3.5 h-3.5 text-accent shrink-0" />
                      <span className="truncate">{selectedUser.email}</span>
                    </span>
                    {selectedUser.phone && (
                      <span className="flex items-center gap-1 shrink-0">
                        <Phone className="w-3.5 h-3.5 text-accent" />
                        <span>{selectedUser.phone}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Account Meta Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="p-3 rounded-xl border border-border bg-background space-y-1 min-w-0">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block truncate">
                    Account Role
                  </span>
                  <span className="font-semibold text-foreground capitalize block truncate">
                    {selectedUser.role === "admin" ? "Administrator" : "Patron Client"}
                  </span>
                </div>

                <div className="p-3 rounded-xl border border-border bg-background space-y-1 min-w-0">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block truncate">
                    Member Since
                  </span>
                  <span className="font-semibold text-foreground block truncate">
                    {selectedUser.createdAt ? formatDate(selectedUser.createdAt) : "Registered"}
                  </span>
                </div>

                <div className="p-3 rounded-xl border border-border bg-background space-y-1 min-w-0">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block truncate">
                    Total Bookings
                  </span>
                  <span className="font-sans text-sm sm:text-base font-bold text-accent tabular-nums block truncate">
                    {userDetailsLoading ? "..." : userBookingsCount} Reservations
                  </span>
                </div>
              </div>

              {/* Role & Authority Governance */}
              <div className="p-3.5 sm:p-4 rounded-xl border border-border bg-card space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                      Account Authority &amp; System Role
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 mt-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        selectedUser.role === "admin"
                          ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
                          : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {selectedUser.role === "admin" ? "✦ Administrator" : "● Patron Client"}
                    </span>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    disabled={
                      actionLoadingId === (selectedUser.id || selectedUser._id) ||
                      ((currentUser?.id || currentUser?._id) === (selectedUser.id || selectedUser._id) &&
                        selectedUser.role === "admin")
                    }
                    onClick={() =>
                      handleUpdateRole(
                        selectedUser,
                        selectedUser.role === "admin" ? "customer" : "admin"
                      )
                    }
                    className={`rounded-xl text-[11px] font-semibold gap-1.5 self-start sm:self-auto shrink-0 ${
                      selectedUser.role === "admin"
                        ? "border-purple-500/30 text-purple-600 dark:text-purple-400 hover:bg-purple-500/10"
                        : "border-[#94704C]/40 text-[#94704C] dark:text-[#C8A879] hover:bg-[#94704C]/10"
                    }`}
                  >
                    <UserCog className="w-3.5 h-3.5" />
                    <span>
                      {selectedUser.role === "admin"
                        ? "Demote to Patron Client"
                        : "Promote to Administrator"}
                    </span>
                  </Button>
                </div>
              </div>

              {/* Status & Security Notice */}
              <div
                className={`p-3.5 sm:p-4 rounded-xl border text-xs space-y-1 ${
                  selectedUser.isBlocked
                    ? "bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-300"
                    : "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                }`}
              >
                <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[11px]">
                  {selectedUser.isBlocked ? (
                    <>
                      <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                      <span>Account Suspended (Blocked)</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>Account Active &amp; Verified</span>
                    </>
                  )}
                </div>
                <p className="text-[11px] opacity-90 leading-relaxed">
                  {selectedUser.isBlocked
                    ? "This user is restricted from accessing customer lounge protected routes and submitting appointment requests."
                    : "This user holds full privileges to browse, book atelier chair treatments, and settle invoices via Stripe."}
                </p>
              </div>

              {/* Recent Appointments Preview */}
              {userRecentBookings.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                    Recent Booking History
                  </span>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {userRecentBookings.map((b) => {
                      const service = typeof b.serviceId === "object" ? b.serviceId : null;
                      return (
                        <div
                          key={b._id}
                          className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-background text-[11px] gap-2"
                        >
                          <div className="space-y-0.5 min-w-0">
                            <span className="font-semibold text-foreground block truncate">
                              {service?.title || "Atelier Ritual"}
                            </span>
                            <span className="text-muted-foreground text-[10px] block truncate">
                              {formatDate(b.appointmentDate)} @ {b.timeSlot}
                            </span>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border shrink-0 ${
                              b.status === "confirmed"
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                : b.status === "pending"
                                ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                                : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                            }`}
                          >
                            {b.status}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Footer Actions */}
              <DialogFooter className="pt-4 border-t border-border flex flex-wrap items-center justify-end gap-2 w-full">
                {selectedUser.role !== "admin" && (
                  <Button
                    onClick={() => handleToggleBlock(selectedUser)}
                    className={`w-full sm:w-auto rounded-xl text-xs font-bold gap-1.5 ${
                      selectedUser.isBlocked
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                        : "bg-rose-600 hover:bg-rose-700 text-white"
                    }`}
                  >
                    {selectedUser.isBlocked ? (
                      <>
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Unblock Patron</span>
                      </>
                    ) : (
                      <>
                        <UserX className="w-3.5 h-3.5" />
                        <span>Block Patron</span>
                      </>
                    )}
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => setViewUserModalOpen(false)}
                  className="w-full sm:w-auto rounded-xl text-xs border-border"
                >
                  Close Dossier
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
