"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { CampusLottie } from "@/components/common/CampusLottie";
import type { Profile } from "@/types/admin";

/**
 * OAuth Callback Route (/auth/callback)
 * Handles Google Sign-In redirect from Supabase Auth:
 *  - Existing approved profile -> logs directly into Student / Faculty / Admin portal
 *  - Existing pending/rejected/suspended -> redirects to /login with clear status message
 *  - No account created yet -> redirects to /register?oauth=google (skips email & password!)
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const { loginWithSupabaseProfile } = useAdminAuth();
  const [statusText, setStatusText] = useState("Completing Google sign-in…");

  useEffect(() => {
    let active = true;

    const handleCallback = async () => {
      const client = getSupabaseClient();
      if (!client) {
        router.replace("/login");
        return;
      }

      try {
        // Exchange PKCE code if present in query string
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        if (code) {
          await client.auth.exchangeCodeForSession(code);
        }

        const { data: sessionData, error: sessionErr } = await client.auth.getSession();
        const user = sessionData.session?.user;

        if (sessionErr || !user) {
          if (active) router.replace("/login?oauth_error=session_failed");
          return;
        }

        // Look up existing institutional profile by user ID or email
        const { data: profileById } = await client
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        let profile = profileById as Profile | null;
        if (!profile && user.email) {
          const { data: profileByEmail } = await client
            .from("profiles")
            .select("*")
            .ilike("email", user.email)
            .maybeSingle();
          profile = profileByEmail as Profile | null;
        }

        if (!active) return;

        // No UniCampus account exists yet -> send to registration without asking for email!
        if (!profile) {
          setStatusText("New Google account detected. Opening registration…");
          router.replace("/register?oauth=google");
          return;
        }

        const accountStatus =
          profile.account_status || (profile.is_approved ? "active" : "pending");

        if (accountStatus === "rejected") {
          router.replace(
            `/login?oauth_status=rejected&reason=${encodeURIComponent(
              profile.rejection_reason || "Please review admin feedback."
            )}`
          );
          return;
        }
        if (accountStatus === "suspended") {
          router.replace("/login?oauth_status=suspended");
          return;
        }
        if (accountStatus === "pending" || !profile.is_approved) {
          router.replace("/login?oauth_status=pending");
          return;
        }

        // Approved user -> sign straight into their portal
        loginWithSupabaseProfile(profile);
        if (profile.role === "admin") {
          router.replace("/admin/dashboard");
        } else if (profile.role === "teacher") {
          router.replace("/teacher/dashboard");
        } else {
          router.replace("/dashboard");
        }
      } catch {
        if (active) router.replace("/login?oauth_error=unexpected");
      }
    };

    void handleCallback();
    return () => {
      active = false;
    };
  }, [loginWithSupabaseProfile, router]);

  return (
    <div className="min-h-dvh flex items-center justify-center bg-canvas text-fg px-4">
      <div className="w-full max-w-[380px] p-8 rounded-2xl bg-surface border border-line text-center space-y-3 shadow-sm">
        <CampusLottie name="rocket" className="w-24 h-24 mx-auto" />
        <h1 className="text-lg font-semibold text-fg tracking-tight">Signing you in</h1>
        <p className="text-xs sm:text-sm text-fg-muted">{statusText}</p>
      </div>
    </div>
  );
}
