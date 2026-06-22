import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";

import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

let authClient: SupabaseClient | null = null;

export function getSupabaseAuthClient() {
  if (authClient) return authClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  authClient = createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  return authClient;
}

export async function resolveLoginEmail(identifier: string) {
  const cleaned = identifier.trim();

  if (!cleaned) return null;
  if (cleaned.includes("@")) return cleaned;

  const supabase = getSupabaseBrowserClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from("profiles")
    .select("email")
    .ilike("username", cleaned)
    .maybeSingle();

  const email = typeof data?.email === "string" ? data.email.trim() : "";
  return email || null;
}

export function getPrimaryEmail(user: User) {
  const directEmail = user.email?.trim();
  if (directEmail) return directEmail;

  const identityEmail = user.identities?.find((identity) => identity.identity_data?.email)?.identity_data?.email;
  return typeof identityEmail === "string" ? identityEmail.trim() : null;
}
