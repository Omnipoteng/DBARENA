"use client";

import { clearDbaUserKey } from "@/lib/dba-user";
import { clearTokenWallet } from "@/lib/dba-token";
import { clearProfileBannerVideo } from "@/lib/profile-banner-store";
import { getSupabaseAuthClient } from "@/lib/supabase-auth";

export async function clearLoggedInUserCache() {
  clearDbaUserKey();
  clearTokenWallet();

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
  }
}
