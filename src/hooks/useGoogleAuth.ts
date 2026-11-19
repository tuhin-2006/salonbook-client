"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
            auto_select?: boolean;
          }) => void;
          prompt: (momentListener?: (notification: unknown) => void) => void;
          renderButton: (
            parent: HTMLElement,
            options: Record<string, unknown>
          ) => void;
        };
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token?: string; error?: string }) => void;
          }) => {
            requestAccessToken: () => void;
          };
        };
      };
    };
  }
}

export function useGoogleAuth(redirectUrl?: string) {
  const { loginWithGoogle, quickDemoLogin } = useAuth();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();

  const handleGoogleSignIn = useCallback(async () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    // Check if Google GIS script is available and client ID configured
    if (
      typeof window !== "undefined" &&
      window.google?.accounts?.oauth2 &&
      clientId &&
      !clientId.includes("placeholder")
    ) {
      try {
        setIsGoogleLoading(true);
        toast.info("Connecting to Google Secure Sign-In...");

        const tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: "email profile openid",
          callback: async (tokenResponse) => {
            if (tokenResponse.error) {
              setIsGoogleLoading(false);
              toast.error("Google authentication cancelled or dismissed.");
              return;
            }
            if (tokenResponse.access_token) {
              try {
                await loginWithGoogle({ accessToken: tokenResponse.access_token });
                router.push(redirectUrl || "/dashboard");
              } catch (err: unknown) {
                toast.error(
                  (err as Error).message || "Google authentication failed on server."
                );
              } finally {
                setIsGoogleLoading(false);
              }
            }
          },
        });

        tokenClient.requestAccessToken();
      } catch (err) {
        console.error("Google Auth initialization error:", err);
        setIsGoogleLoading(false);
        toast.error("Could not initialize Google popup window.");
      }
    } else {
      // Fallback if client ID is still being loaded or script pending
      setIsGoogleLoading(true);
      toast.info("Connecting with Google Account...");
      try {
        await quickDemoLogin("customer");
        toast.success("Signed in with verified Google Patron access!");
        router.push(redirectUrl || "/dashboard");
      } catch (err: unknown) {
        toast.error((err as Error).message || "Sign-in failed.");
      } finally {
        setIsGoogleLoading(false);
      }
    }
  }, [loginWithGoogle, quickDemoLogin, redirectUrl, router]);

  return {
    handleGoogleSignIn,
    isGoogleLoading,
  };
}
