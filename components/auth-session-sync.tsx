"use client";

import { useEffect } from "react";

import { clearLoggedInUserCache } from "@/lib/auth-session";
import { setDbaUserKey } from "@/lib/dba-user";
import { writeTokenWallet } from "@/lib/dba-token";
import { getSupabaseAuthClient } from "@/lib/supabase-auth";
import { loadSupabaseTokenWallet } from "@/lib/supabase-store";

export default function AuthSessionSync() {
  useEffect(() => {
    const supabase = getSupabaseAuthClient();
    if (!supabase) return;

    let mounted = true;

    void supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;

      const user = data.session?.user;
      if (user) {
        setDbaUserKey(user.id);
        void loadSupabaseTokenWallet(user.id).then((remoteWallet) => {
          if (!mounted || !remoteWallet) return;
          writeTokenWallet(remoteWallet);
        });
        return;
      }

      void clearLoggedInUserCache();
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setDbaUserKey(session.user.id);
        void loadSupabaseTokenWallet(session.user.id).then((remoteWallet) => {
          if (!remoteWallet) return;
          writeTokenWallet(remoteWallet);
        });
        return;
      }

      void clearLoggedInUserCache();
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  return null;
}
