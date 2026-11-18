"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { User, ApiResponse } from "@/types";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    image?: string;
  }) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  quickDemoLogin: (role: "customer" | "admin") => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCurrentUser = useCallback(async () => {
    const storedToken = localStorage.getItem("salonbook_token");
    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    try {
      setToken(storedToken);
      const res = await api.get<ApiResponse<{ user: User }>>("/auth/me");
      setUser(res.data.data.user);
    } catch (error) {
      console.warn("Session restore failed:", error);
      localStorage.removeItem("salonbook_token");
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.post<ApiResponse<{ user: User; token: string }>>(
        "/auth/login",
        { email, password }
      );
      const { user: loggedInUser, token: authToken } = res.data.data;
      localStorage.setItem("salonbook_token", authToken);
      setToken(authToken);
      setUser(loggedInUser);
      toast.success(`Welcome back, ${loggedInUser.name}`);
    } catch (error: unknown) {
      toast.error((error as Error).message || "Login failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    image?: string;
  }) => {
    setIsLoading(true);
    try {
      const res = await api.post<ApiResponse<{ user: User; token: string }>>(
        "/auth/register",
        userData
      );
      const { user: registeredUser, token: authToken } = res.data.data;
      localStorage.setItem("salonbook_token", authToken);
      setToken(authToken);
      setUser(registeredUser);
      toast.success("Account created successfully!");
    } catch (error: unknown) {
      toast.error((error as Error).message || "Registration failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const quickDemoLogin = async (role: "customer" | "admin") => {
    if (role === "admin") {
      await login("admin@salonbook.com", "Admin@123456");
    } else {
      await login("customer@salonbook.com", "Customer@123456");
    }
  };

  const logout = () => {
    localStorage.removeItem("salonbook_token");
    setToken(null);
    setUser(null);
    toast.info("Logged out successfully");
    if (typeof window !== "undefined") {
      window.location.href = "/signed-out";
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      const res = await api.patch<ApiResponse<{ user: User }>>(
        "/auth/profile",
        data
      );
      setUser(res.data.data.user);
      toast.success("Profile updated successfully!");
    } catch (error: unknown) {
      toast.error((error as Error).message || "Profile update failed");
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        login,
        register,
        logout,
        updateProfile,
        quickDemoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
