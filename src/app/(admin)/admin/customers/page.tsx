"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Users,
  Search,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  UserX,
  AlertCircle,
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
  const [search, setSearch] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get<ApiResponse<User[]>>("/admin/users");
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleBlock = async (user: User) => {
    try {
      setActionLoadingId(user.id || user._id || "");
      const userId = user.id || user._id;
      const isCurrentlyBlocked = user.isBlocked;

      const endpoint = isCurrentlyBlocked
        ? `/admin/users/${userId}/unblock`
        : `/admin/users/${userId}/block`;

      const res = await api.patch<ApiResponse<User>>(endpoint);

      if (res.data.success) {
        toast.success(
          isCurrentlyBlocked
            ? `User ${user.name} has been unblocked.`
            : `User ${user.name} has been suspended.`
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
      return !search || nameMatch || emailMatch;
    });
  }, [users, search]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
          Client Patrons Registry
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Manage registered clients, monitor customer accounts, and enforce access restrictions.
        </p>
      </div>

      {/* Search Input */}
      <div className="bg-card rounded-2xl border border-border p-4 max-w-md shadow-sm">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by client name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 text-xs rounded-xl"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-muted-foreground text-sm space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
            <p className="text-xs font-semibold">Loading client directory...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-16 text-center space-y-3 max-w-sm mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-foreground">
              No Customers Found
            </h4>
            <p className="text-xs text-muted-foreground">
              No users matched your search criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
                  <th className="pb-3 pr-4">Patron Name</th>
                  <th className="pb-3 px-4">Role</th>
                  <th className="pb-3 px-4">Contact Phone</th>
                  <th className="pb-3 px-4">Joined Date</th>
                  <th className="pb-3 px-4">Status</th>
                  <th className="pb-3 pl-4 text-right">Access Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.map((client) => {
                  const userId = client.id || client._id || "";
                  const isAdmin = client.role === "admin";
                  const isBlocked = !!client.isBlocked;

                  return (
                    <tr key={userId} className="hover:bg-secondary/40 transition-colors">
                      {/* Avatar & Name */}
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                            {client.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={client.image}
                                alt={client.name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              getInitials(client.name || "User")
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-foreground text-xs leading-tight">
                              {client.name}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              {client.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                            isAdmin
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-muted-foreground border border-border"
                          }`}
                        >
                          {client.role}
                        </span>
                      </td>

                      {/* Phone */}
                      <td className="py-4 px-4 whitespace-nowrap text-muted-foreground text-xs">
                        {client.phone || "—"}
                      </td>

                      {/* Created */}
                      <td className="py-4 px-4 whitespace-nowrap text-muted-foreground text-xs">
                        {formatDate(client.createdAt)}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isBlocked
                              ? "bg-destructive/10 text-destructive border border-destructive/20"
                              : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                          }`}
                        >
                          {isBlocked ? (
                            <>
                              <ShieldAlert className="w-3 h-3" /> Suspended
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="w-3 h-3" /> Active
                            </>
                          )}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-4 pl-4 text-right whitespace-nowrap">
                        {!isAdmin && (
                          <Button
                            variant={isBlocked ? "outline" : "ghost"}
                            size="sm"
                            className={`h-8 text-xs font-bold rounded-lg ${
                              isBlocked
                                ? "text-emerald-600 hover:bg-emerald-500/10 border-emerald-500/30"
                                : "text-destructive hover:bg-destructive/10"
                            }`}
                            onClick={() => handleToggleBlock(client)}
                            disabled={actionLoadingId === userId}
                          >
                            {isBlocked ? (
                              <span className="flex items-center gap-1">
                                <UserCheck className="w-3 h-3" /> Restore
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <UserX className="w-3 h-3" /> Suspend
                              </span>
                            )}
                          </Button>
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
