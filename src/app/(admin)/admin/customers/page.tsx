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
} from "lucide-react";
import { api } from "@/lib/api";
import { User, ApiResponse } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate, getInitials } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminCustomersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

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
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || "Action failed");
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
              Loading Patron Registry...
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
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full min-w-[750px] text-left text-xs">
              <thead>
                <tr className="border-b border-border/70 bg-muted/30 text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-4 px-6">Patron Profile</th>
                  <th className="py-4 px-4">Contact</th>
                  <th className="py-4 px-4">Role</th>
                  <th className="py-4 px-4">Registered</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-6 text-right">Privilege Governance</th>
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
                          <div className="w-10 h-10 rounded-full bg-accent/20 text-accent font-serif font-bold text-xs flex items-center justify-center shrink-0 border border-accent/30 overflow-hidden">
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
                            <span className="font-serif text-sm font-bold text-foreground block">
                              {client.name || "Unnamed Patron"}
                            </span>
                            <span className="text-[11px] text-muted-foreground block">
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
                                <span>Reinstate</span>
                              </>
                            ) : (
                              <>
                                <UserX className="w-3.5 h-3.5" />
                                <span>Suspend</span>
                              </>
                            )}
                          </Button>
                        ) : (
                          <span className="text-[10px] text-muted-foreground italic px-2">
                            Protected Role
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
