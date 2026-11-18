"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Users,
  Search,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  UserX,
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
      toast.error((err as Error).message || "Failed to load patrons registry");
    } finally {
      setLoading(false);
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
      return !search || nameMatch || emailMatch;
    });
  }, [users, search]);

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 pb-6 border-b border-[#302821]/15">
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#B8755B] font-semibold block">
            PATRON DIRECTORY
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#302821] dark:text-[#F5F1E8]">
            Client Patrons &amp; Members
          </h2>
          <p className="text-xs text-[#302821]/70 dark:text-[#EAE3D6]/70 max-w-xl leading-relaxed">
            Monitor registered atelier patrons, oversee account roles, and manage booking privileges.
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="border border-[#302821]/15 dark:border-[#EAE3D6]/15 bg-[#EAE3D6]/40 dark:bg-[#1a201c] p-4 max-w-md">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#302821]/40" />
          <Input
            placeholder="Search by patron name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 text-xs rounded-none border-[#302821]/20 bg-[#F5F1E8] dark:bg-[#151916] text-[#302821] dark:text-[#F5F1E8]"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="border border-[#302821]/15 dark:border-[#EAE3D6]/15 bg-[#EAE3D6]/30 dark:bg-[#1a201c] p-6">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-[#26372D] border-t-transparent animate-spin mx-auto" />
            <p className="text-xs uppercase tracking-wider text-[#302821]/60">
              Loading Patron Registry...
            </p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-16 text-center space-y-3 max-w-sm mx-auto">
            <div className="w-12 h-12 border border-[#302821]/20 bg-[#EAE3D6] mx-auto flex items-center justify-center font-bold text-[#26372D]">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-xl text-[#302821] dark:text-[#F5F1E8]">
              No Patrons Located
            </h4>
            <p className="text-xs text-[#302821]/70 leading-relaxed">
              No registered patrons match your search query.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#302821]/15 text-[#302821]/60 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="pb-3 pr-4">Patron Name</th>
                  <th className="pb-3 px-4">Role</th>
                  <th className="pb-3 px-4">Contact Phone</th>
                  <th className="pb-3 px-4">Joined Date</th>
                  <th className="pb-3 px-4">Standing</th>
                  <th className="pb-3 pl-4 text-right">Access Governance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#302821]/10">
                {filteredUsers.map((u) => {
                  const userId = u.id || u._id || "";
                  const isBlocked = u.isBlocked;
                  const isUserAdmin = u.role === "admin";

                  return (
                    <tr key={userId} className="hover:bg-[#EAE3D6]/60 transition-colors">
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-none bg-[#26372D] text-[#F5F1E8] font-serif font-bold text-xs flex items-center justify-center shrink-0">
                            {getInitials(u.name || "Guest")}
                          </div>
                          <div>
                            <p className="font-medium text-[#302821] dark:text-[#F5F1E8] text-xs leading-tight">
                              {u.name}
                            </p>
                            <p className="text-[10px] text-[#302821]/60 dark:text-[#EAE3D6]/60">
                              {u.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 border ${
                            isUserAdmin
                              ? "bg-[#26372D] text-[#F5F1E8] border-[#26372D]"
                              : "bg-[#EAE3D6] text-[#302821] border-[#302821]/20"
                          }`}
                        >
                          {u.role || "Patron"}
                        </span>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap text-[#302821]/70">
                        {u.phone || "—"}
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap text-[#302821]/70">
                        {formatDate(u.createdAt)}
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[9px] uppercase tracking-wider font-semibold border ${
                            isBlocked
                              ? "bg-red-500/10 text-red-700 border-red-500/30"
                              : "bg-emerald-600/10 text-emerald-800 dark:text-emerald-400 border-emerald-600/30"
                          }`}
                        >
                          {isBlocked ? (
                            <>
                              <ShieldAlert className="w-3 h-3 text-red-700" />
                              <span>SUSPENDED</span>
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="w-3 h-3 text-emerald-700" />
                              <span>IN GOOD STANDING</span>
                            </>
                          )}
                        </span>
                      </td>

                      <td className="py-4 pl-4 text-right whitespace-nowrap">
                        {isUserAdmin ? (
                          <span className="text-[10px] uppercase tracking-wider text-[#302821]/40 italic">
                            Protected Executive
                          </span>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className={`h-8 text-[10px] uppercase tracking-wider rounded-none px-3 ${
                              isBlocked
                                ? "border-emerald-600/40 text-emerald-800 hover:bg-emerald-50"
                                : "border-red-300 text-red-700 hover:bg-red-50"
                            }`}
                            onClick={() => handleToggleBlock(u)}
                            disabled={actionLoadingId === userId}
                          >
                            {isBlocked ? (
                              <>
                                <UserCheck className="w-3 h-3 mr-1" />
                                <span>REINSTATE PRIVILEGES</span>
                              </>
                            ) : (
                              <>
                                <UserX className="w-3 h-3 mr-1" />
                                <span>SUSPEND ACCESS</span>
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
