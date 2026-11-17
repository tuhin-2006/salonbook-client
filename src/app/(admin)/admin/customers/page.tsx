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
import { Badge } from "@/components/ui/badge";
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
        <h2 className="font-serif text-2xl font-bold text-foreground">
          Guest Registry & Access Control
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Manage registered clients, monitor customer accounts, and enforce access restrictions.
        </p>
      </div>

      {/* Search Input */}
      <div className="bg-card rounded-2xl border border-border/70 p-4 sm:p-6 max-w-md">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by customer name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 text-xs"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-card rounded-2xl border border-border/70 p-6 sm:p-8">
        {loading ? (
          <div className="py-20 text-center text-muted-foreground text-sm space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
            <p>Loading guest directory...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-16 text-center space-y-4 max-w-sm mx-auto">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-lg font-semibold text-foreground">
              No Customers Found
            </h4>
            <p className="text-xs text-muted-foreground">
              No users matched your search criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border/80 text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                  <th className="pb-3 pr-4">User</th>
                  <th className="pb-3 px-4">Role</th>
                  <th className="pb-3 px-4">Contact Phone</th>
                  <th className="pb-3 px-4">Registered Date</th>
                  <th className="pb-3 px-4">Access Status</th>
                  <th className="pb-3 pl-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredUsers.map((client) => {
                  const userId = client.id || client._id || "";
                  const isAdmin = client.role === "admin";
                  const isBlocked = !!client.isBlocked;

                  return (
                    <tr key={userId} className="hover:bg-muted/40 transition-colors">
                      {/* Avatar & Name */}
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
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
                            <p className="font-semibold text-foreground text-sm leading-tight">
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
                        <Badge
                          variant={isAdmin ? "default" : "secondary"}
                          className="capitalize text-[10px] font-semibold"
                        >
                          {client.role}
                        </Badge>
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
                        <Badge
                          className={`gap-1 capitalize text-[11px] ${
                            isBlocked
                              ? "bg-destructive text-destructive-foreground"
                              : "bg-emerald-600 text-white"
                          }`}
                        >
                          {isBlocked ? (
                            <>
                              <ShieldAlert className="w-3 h-3" /> Blocked
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="w-3 h-3" /> Active
                            </>
                          )}
                        </Badge>
                      </td>

                      {/* Action Toggle */}
                      <td className="py-4 pl-4 text-right whitespace-nowrap">
                        {isAdmin ? (
                          <span className="text-xs text-muted-foreground italic">
                            Protected
                          </span>
                        ) : (
                          <Button
                            variant={isBlocked ? "outline" : "destructive"}
                            size="sm"
                            className="h-8 text-xs gap-1.5"
                            onClick={() => handleToggleBlock(client)}
                            disabled={actionLoadingId === userId}
                          >
                            {isBlocked ? (
                              <>
                                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Unblock</span>
                              </>
                            ) : (
                              <>
                                <UserX className="w-3.5 h-3.5" />
                                <span>Block User</span>
                              </>
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