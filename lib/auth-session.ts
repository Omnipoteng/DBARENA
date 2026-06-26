"use client";

import { clearDbaUserKey } from "@/lib/dba-user";
import { clearTokenWallet } from "@/lib/dba-token";
import { clearProfileBannerVideo } from "@/lib/profile-banner-store";
import { getSupabaseAuthClient, resetSupabaseAuthClient } from "@/lib/supabase-auth";
import { resetSupabaseBrowserClient } from "@/lib/supabase-browser";

export function clearSupabaseStorage() {
  if (typeof window === "undefined") return;

  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key && (key.startsWith("sb-") || key.includes("supabase"))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => window.localStorage.removeItem(key));

    const sessionKeysToRemove: string[] = [];
    for (let i = 0; i < window.sessionStorage.length; i++) {
      const key = window.sessionStorage.key(i);
      if (key && (key.startsWith("sb-") || key.includes("supabase"))) {
        sessionKeysToRemove.push(key);
      }
    }
    sessionKeysToRemove.forEach((key) => window.sessionStorage.removeItem(key));
  } catch (err) {
    console.error("Failed to clear Supabase storage keys:", err);
  }
}

export async function clearLoggedInUserCache() {
  clearDbaUserKey();
  clearTokenWallet();
  clearSupabaseStorage();

  try {
    await clearProfileBannerVideo();
  } catch {
    // Ignore IndexedDB cleanup failures during sign-out.
  }
}

export async function logoutCurrentUser() {
  const supabase = getSupabaseAuthClient();

  try {
    if (supabase) {
      await supabase.auth.signOut();
    }
  } finally {
    await clearLoggedInUserCache();
    resetSupabaseAuthClient();
    resetSupabaseBrowserClient();
  }
}

