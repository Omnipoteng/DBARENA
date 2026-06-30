import type { Post } from "@/types/post"; 

import { getDbaUserKey } from "@/lib/dba-user"; 
import { getSupabaseBrowserClient } from "@/lib/supabase-browser"; 
import type { TokenShopItem } from "@/lib/dba-token"; 
import type { SitePreferences } from "@/lib/site-preferences";
import { normalizeImageSrc } from "@/lib/image";

export type ProfileBorderKey = "none" | "legend" | "mythic" | "apex";
export type ProfileSkinKey = "none" | "sunset" | "neon" | "ocean" | "emerald" | "cosmic";
export type ProfileBannerKind = "image" | "video";
export type ProfileRankKey = "Recruit" | "Challenger" | "Vanguard" | "Legend" | "Mythic" | "Apex";

export type BannerCrop = {
  x: number;
  y: number;
  zoom: number;
};

export type ProfileSnapshot = {
  email?: string;
  displayName: string;
  username: string;
  bio: string;
  avatarSrc: string;
  bannerSrc: string;
  bannerKind: ProfileBannerKind;
  bannerFocus: number;
  bannerCrop?: BannerCrop | null;
  border: ProfileBorderKey;
  selectedSkin?: ProfileSkinKey;
  customSkinColors?: string[];
  tags: string[];
  rankKey?: ProfileRankKey;
  rankedPoints?: number;
  highestRank?: ProfileRankKey | string;
  totalMatch?: number;
  winRate?: number;
};

export type OnboardingPreferenceSnapshot = {
  interests: string[];
  debateTopics: string[];
  favoriteVerses: string[];
  location: string;
  onboardingCompleted: boolean;
};

export type SocialProfile = {
  id: string;
  name: string;
  username: string;
  avatar: string;
  banner: string;
  bio: string;
  followsMe: boolean;
  following: boolean;
};

export type TokenHistoryEntry = {
  id: string;
  title: string;
  cost: number;
  timestamp: string;
};

export type TokenWalletSnapshot = {
  balance: number;
  unlocks: string[];
  history: TokenHistoryEntry[];
  claimDate?: string;
  streakDay?: number;
};

export type RankedMatchSnapshot = {
  id: string;
  opponent: string;
  platform: string;
  result: "Win" | "Loss" | "Draw" | "No Contest";
  delta: number;
  fromRank: ProfileRankKey;
  toRank: ProfileRankKey;
  date: string;
  image: string;
};

function normalizeStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function normalizeUniqueStringArray(value: unknown) {
  return Array.from(new Set(normalizeStringArray(value).map((item) => item.trim()).filter(Boolean)));
}

export async function loadSupabaseProfileSnapshot(customUserKey?: string): Promise<ProfileSnapshot | null> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return null;

  const userKey = customUserKey || getDbaUserKey();

  const { data: profileRow, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_key", userKey)
    .maybeSingle();

  if (profileError || !profileRow) return null;

  const { data: tagsRows } = await supabase
    .from("profile_tags")
    .select("label, position")
    .eq("profile_user_key", userKey)
    .order("position", { ascending: true });

  const allTags = normalizeStringArray(tagsRows?.map((item) => item.label));
  const skinTag = allTags.find((t) => t.startsWith("skin:"));
  const colorsTag = allTags.find((t) => t.startsWith("colors:"));
  const cleanTags = allTags.filter((t) => !t.startsWith("skin:") && !t.startsWith("colors:"));

  return { 
    email: typeof profileRow.email === "string" ? profileRow.email : "", 
    displayName: profileRow.display_name ?? "", 
    username: profileRow.username ?? "", 
    bio: profileRow.bio ?? "", 
    avatarSrc: profileRow.avatar_url ?? "",
    bannerSrc: profileRow.banner_url ?? "",
    bannerKind: (profileRow.banner_kind as ProfileBannerKind) ?? "image",
    bannerFocus: typeof profileRow.banner_focus === "number" ? profileRow.banner_focus : 50,
    bannerCrop: profileRow.banner_crop ?? null,
    border: (profileRow.border_key as ProfileBorderKey) ?? "legend",
    selectedSkin: skinTag ? (skinTag.substring(5) as ProfileSkinKey) : "none",
    customSkinColors: colorsTag ? colorsTag.substring(7).split(",") : ["#000000", "#000000"],
    tags: cleanTags,
    rankKey: (profileRow.rank_key as ProfileRankKey) ?? "Legend",
    rankedPoints: typeof profileRow.ranked_points === "number" ? profileRow.ranked_points : 0,
    highestRank: (profileRow.highest_rank as ProfileRankKey | string) ?? "Mythic",
    totalMatch: typeof profileRow.total_match === "number" ? profileRow.total_match : 0,
    winRate: typeof profileRow.win_rate === "number" ? profileRow.win_rate : 0,
  } satisfies ProfileSnapshot;
}

export async function loadSupabaseProfileSnapshotByKey(userKey: string): Promise<ProfileSnapshot | null> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return null;

  const cleanedKey = userKey.trim();
  if (!cleanedKey) return null;

  const { data: profileRow, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_key", cleanedKey)
    .maybeSingle();

  if (profileError || !profileRow) return null;

  const { data: tagsRows } = await supabase
    .from("profile_tags")
    .select("label, position")
    .eq("profile_user_key", cleanedKey)
    .order("position", { ascending: true });

  const allTags = normalizeStringArray(tagsRows?.map((item) => item.label));
  const skinTag = allTags.find((t) => t.startsWith("skin:"));
  const colorsTag = allTags.find((t) => t.startsWith("colors:"));
  const cleanTags = allTags.filter((t) => !t.startsWith("skin:") && !t.startsWith("colors:"));

  return {
    email: typeof profileRow.email === "string" ? profileRow.email : "",
    displayName: profileRow.display_name ?? "",
    username: profileRow.username ?? "",
    bio: profileRow.bio ?? "",
    avatarSrc: profileRow.avatar_url ?? "",
    bannerSrc: profileRow.banner_url ?? "",
    bannerKind: (profileRow.banner_kind as ProfileBannerKind) ?? "image",
    bannerFocus: typeof profileRow.banner_focus === "number" ? profileRow.banner_focus : 50,
    bannerCrop: profileRow.banner_crop ?? null,
    border: (profileRow.border_key as ProfileBorderKey) ?? "legend",
    selectedSkin: skinTag ? (skinTag.substring(5) as ProfileSkinKey) : "none",
    customSkinColors: colorsTag ? colorsTag.substring(7).split(",") : ["#000000", "#000000"],
    tags: cleanTags,
    rankKey: (profileRow.rank_key as ProfileRankKey) ?? "Legend",
    rankedPoints: typeof profileRow.ranked_points === "number" ? profileRow.ranked_points : 0,
    highestRank: (profileRow.highest_rank as ProfileRankKey | string) ?? "Mythic",
    totalMatch: typeof profileRow.total_match === "number" ? profileRow.total_match : 0,
    winRate: typeof profileRow.win_rate === "number" ? profileRow.win_rate : 0,
  };
}

export async function saveSupabaseProfileSnapshot(snapshot: ProfileSnapshot, customUserKey?: string) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return;

  const userKey = customUserKey || getDbaUserKey();

  const { error: upsertError } = await supabase.from("profiles").upsert( 
    { 
      user_key: userKey, 
      ...(snapshot.email ? { email: snapshot.email } : {}), 
      display_name: snapshot.displayName, 
      username: snapshot.username, 
      bio: snapshot.bio, 
      avatar_url: snapshot.avatarSrc,
      banner_url: snapshot.bannerSrc || null,
      banner_kind: snapshot.bannerKind,
      banner_focus: snapshot.bannerFocus,
      banner_crop: snapshot.bannerCrop ?? null,
      border_key: snapshot.border,
      rank_key: snapshot.rankKey ?? "Legend",
      ranked_points: snapshot.rankedPoints ?? 0,
      highest_rank: snapshot.highestRank ?? "Mythic",
      total_match: snapshot.totalMatch ?? 0,
      win_rate: snapshot.winRate ?? 0,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_key" },
  );

  if (upsertError) return;

  await supabase.from("profile_tags").delete().eq("profile_user_key", userKey);

  // Build the full tag list including internal skin/colors entries
  const allTagsToSave: { profile_user_key: string; label: string; position: number }[] = [];
  let pos = 0;

  for (const label of snapshot.tags) {
    allTagsToSave.push({ profile_user_key: userKey, label, position: pos++ });
  }

  if (snapshot.selectedSkin && snapshot.selectedSkin !== "none") {
    allTagsToSave.push({ profile_user_key: userKey, label: `skin:${snapshot.selectedSkin}`, position: pos++ });
  }

  if (Array.isArray(snapshot.customSkinColors) && snapshot.customSkinColors.length > 0) {
    allTagsToSave.push({ profile_user_key: userKey, label: `colors:${snapshot.customSkinColors.join(",")}`, position: pos++ });
  }

  if (allTagsToSave.length > 0) {
    await supabase.from("profile_tags").insert(allTagsToSave);
  }
}

export async function loadSupabaseOnboardingPreferences(customUserKey?: string) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return null;

  const userKey = customUserKey || getDbaUserKey();

  const { data: row, error } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_key", userKey)
    .maybeSingle();

  if (error || !row) return null;

  return {
    interests: normalizeUniqueStringArray(row.interests),
    debateTopics: normalizeUniqueStringArray(row.debate_topics),
    favoriteVerses: normalizeUniqueStringArray(row.favorite_verses),
    location: typeof row.location === "string" ? row.location : "",
    onboardingCompleted: Boolean(row.onboarding_completed),
  } satisfies OnboardingPreferenceSnapshot;
}

export async function saveSupabaseOnboardingPreferences(snapshot: OnboardingPreferenceSnapshot, customUserKey?: string) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return;

  const userKey = customUserKey || getDbaUserKey();

  await supabase.from("user_preferences").upsert(
    {
      user_key: userKey,
      interests: snapshot.interests,
      debate_topics: snapshot.debateTopics,
      favorite_verses: snapshot.favoriteVerses,
      location: snapshot.location || null,
      onboarding_completed: snapshot.onboardingCompleted,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_key" },
  );
}

export async function loadSupabaseTokenWallet(customUserKey?: string) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return null;

  const userKey = customUserKey || getDbaUserKey();

  const [{ data: walletRow, error: walletError }, { data: historyRows }] = await Promise.all([
    supabase.from("token_wallets").select("*").eq("user_key", userKey).maybeSingle(),
    supabase
      .from("token_transactions")
      .select("id,title,cost,created_at")
      .eq("user_key", userKey)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  if (walletError || !walletRow) return null;

  return {
    balance: Number(walletRow.balance ?? 0),
    unlocks: normalizeStringArray(walletRow.unlocks),
    history: (historyRows ?? []).map((entry) => ({
      id: String(entry.id),
      title: String(entry.title),
      cost: Number(entry.cost ?? 0),
      timestamp: String(entry.created_at),
    })),
    claimDate: walletRow.claim_date ?? undefined,
    streakDay: typeof walletRow.streak_day === "number" ? walletRow.streak_day : undefined,
  } satisfies TokenWalletSnapshot;
}

export async function saveSupabaseTokenWallet(snapshot: TokenWalletSnapshot, customUserKey?: string) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return;

  const userKey = customUserKey || getDbaUserKey();

  const payload: Record<string, unknown> = {
    user_key: userKey,
    balance: snapshot.balance,
    unlocks: snapshot.unlocks,
    updated_at: new Date().toISOString(),
  };

  if (typeof snapshot.streakDay === "number") {
    payload.streak_day = snapshot.streakDay;
  }

  if (typeof snapshot.claimDate === "string") {
    payload.claim_date = snapshot.claimDate;
  }

  await supabase.from("token_wallets").upsert(
    payload,
    { onConflict: "user_key" },
  );
}

export async function appendSupabaseTokenTransaction(
  entry: {
    title: string;
    cost: number;
    kind: "claim" | "redeem";
    balanceAfter: number;
  },
  customUserKey?: string
) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return;

  const userKey = customUserKey || getDbaUserKey();

  await supabase.from("token_transactions").insert({
    user_key: userKey,
    title: entry.title,
    cost: entry.cost,
    kind: entry.kind,
    balance_after: entry.balanceAfter,
  });
}

export async function recordSupabaseDailyLoginClaim(
  entry: {
    claimDate: string;
    streakDay: number;
    rewardDay: number;
    rewardType: "token" | "tag";
    rewardAmount?: number;
    rewardTag?: string;
  },
  customUserKey?: string
) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return;

  const userKey = customUserKey || getDbaUserKey();

  await supabase.from("daily_login_claims").insert({
    user_key: userKey,
    claim_date: entry.claimDate,
    streak_day: entry.streakDay,
    reward_day: entry.rewardDay,
    reward_type: entry.rewardType,
    reward_amount: entry.rewardAmount ?? null,
    reward_tag: entry.rewardTag ?? null,
  });
}


export async function loadSupabasePosts(fallbackPosts: Post[]) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return fallbackPosts;

  const { data, error } = await supabase
    .from("posts")
    .select("id,title,description,content,image_url,date,origin")
    .order("date", { ascending: false });

  if (error) {
    return fallbackPosts;
  }

  if (!data || data.length === 0) {
    await supabase.from("posts").upsert(
      fallbackPosts.map((post) => ({
        id: post.id,
        title: post.title,
        description: post.description,
        content: post.content ?? "",
        image_url: post.image,
        date: post.date,
        origin: "seed",
      })),
      { onConflict: "id" },
    );

    return fallbackPosts;
  }

  return data.map((post) => ({
    id: String(post.id),
    title: String(post.title),
    description: String(post.description),
    content: typeof post.content === "string" ? post.content : "",
    image: normalizeImageSrc(post.image_url),
    date: String(post.date),
    origin: typeof post.origin === "string" ? post.origin : "custom",
  })) satisfies Post[];
}

export async function loadSupabaseRankedMatches(fallbackMatches: RankedMatchSnapshot[] = [], customUserKey?: string) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return fallbackMatches;

  const userKey = customUserKey || getDbaUserKey();

  const { data, error } = await supabase
    .from("ranked_matches")
    .select("id,opponent,platform,result,delta,from_rank,to_rank,match_date,preview_image_url")
    .eq("user_key", userKey)
    .order("match_date", { ascending: false });

  if (error) {
    return fallbackMatches;
  }

  if (!data || data.length === 0) {
    return fallbackMatches;
  }

  return data.map((match) => ({
    id: String(match.id),
    opponent: String(match.opponent),
    platform: String(match.platform),
    result: (match.result as RankedMatchSnapshot["result"]) ?? "Win",
    delta: Number(match.delta ?? 0),
    fromRank: (match.from_rank as ProfileRankKey) ?? "Vanguard",
    toRank: (match.to_rank as ProfileRankKey) ?? "Legend",
    date: String(match.match_date),
    image: String(match.preview_image_url ?? ""),
  })) satisfies RankedMatchSnapshot[];
}

export async function loadSupabaseRankedMatchesByUserKey(userKey: string) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return [];

  const cleanedKey = userKey.trim();
  if (!cleanedKey) return [];

  const { data, error } = await supabase
    .from("ranked_matches")
    .select("id,opponent,platform,result,delta,from_rank,to_rank,match_date,preview_image_url")
    .eq("user_key", cleanedKey)
    .order("match_date", { ascending: false });

  if (error || !data) return [];

  return data.map((match) => ({
    id: String(match.id),
    opponent: String(match.opponent),
    platform: String(match.platform),
    result: (match.result as RankedMatchSnapshot["result"]) ?? "Win",
    delta: Number(match.delta ?? 0),
    fromRank: (match.from_rank as ProfileRankKey) ?? "Vanguard",
    toRank: (match.to_rank as ProfileRankKey) ?? "Legend",
    date: String(match.match_date),
    image: String(match.preview_image_url ?? ""),
  })) satisfies RankedMatchSnapshot[];
}

export async function saveSupabasePosts(posts: Post[]) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return;

  if (posts.length === 0) return;

  await supabase.from("posts").upsert(
    posts.map((post) => ({
      id: post.id,
      title: post.title,
      description: post.description,
      content: post.content ?? "",
      image_url: post.image,
      date: post.date,
      origin: "custom",
      updated_at: new Date().toISOString(),
    })),
    { onConflict: "id" },
  );
}

export async function loadSupabaseFriends() {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return [];

  const userKey = getDbaUserKey();

  const { data: profileRows, error: profileError } = await supabase
    .from("profiles")
    .select("user_key,display_name,username,avatar_url,banner_url,bio,is_public")
    .eq("is_public", true);

  if (profileError) return [];
  if (!profileRows || profileRows.length === 0) return [];

  const { data: followRows } = await supabase
    .from("follows")
    .select("follower_user_key,following_user_key")
    .or(`follower_user_key.eq.${userKey},following_user_key.eq.${userKey}`);

  const followingSet = new Set(
    (followRows ?? [])
      .filter((row) => row.follower_user_key === userKey)
      .map((row) => row.following_user_key as string),
  );
  const followersSet = new Set(
    (followRows ?? [])
      .filter((row) => row.following_user_key === userKey)
      .map((row) => row.follower_user_key as string),
  );

  // Deduplicate by user_key using a Map: the profiles table uses user_key as
  // primary key so the DB cannot return two rows with the same key, but certain
  // Supabase RLS policies that use internal JOINs can produce phantom duplicate
  // rows in the PostgREST response.  Building a Map guarantees each user appears
  // exactly once regardless of the source.
  const seen = new Map<string, SocialProfile>();

  for (const profile of profileRows) {
    const key = String(profile.user_key);

    // Skip the currently logged-in user and already-seen keys.
    if (key === userKey || seen.has(key)) continue;

    seen.set(key, {
      id: key,
      name: String(profile.display_name ?? ""),
      username: String(profile.username ?? ""),
      avatar: String(profile.avatar_url ?? ""),
      banner: String(profile.banner_url ?? ""),
      bio: String(profile.bio ?? ""),
      following: followingSet.has(key),
      followsMe: followersSet.has(key),
    });
  }

  return Array.from(seen.values()) satisfies SocialProfile[];
}

export async function loadSupabaseFriendCountsByUserKey(userKey: string) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return { followers: 0, following: 0, friends: 0 };
  }

  const cleanedKey = userKey.trim();
  if (!cleanedKey) {
    return { followers: 0, following: 0, friends: 0 };
  }

  const [{ count: followingCount }, { count: followersCount }, { data: followRows }] = await Promise.all([
    supabase.from("follows").select("follower_user_key", { count: "exact", head: true }).eq("follower_user_key", cleanedKey),
    supabase.from("follows").select("following_user_key", { count: "exact", head: true }).eq("following_user_key", cleanedKey),
    supabase
      .from("follows")
      .select("follower_user_key,following_user_key")
      .or(`follower_user_key.eq.${cleanedKey},following_user_key.eq.${cleanedKey}`),
  ]);

  const followingSet = new Set(
    (followRows ?? [])
      .filter((row) => row.follower_user_key === cleanedKey)
      .map((row) => row.following_user_key as string),
  );
  const followersSet = new Set(
    (followRows ?? [])
      .filter((row) => row.following_user_key === cleanedKey)
      .map((row) => row.follower_user_key as string),
  );

  const friends = Array.from(followingSet).filter((item) => followersSet.has(item)).length;

  return {
    followers: followersCount ?? 0,
    following: followingCount ?? 0,
    friends,
  };
}

export async function setSupabaseFollowState(targetUserKey: string, following: boolean) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return;

  const userKey = getDbaUserKey();

  if (following) {
    await supabase.from("follows").upsert(
      {
        follower_user_key: userKey,
        following_user_key: targetUserKey,
      },
      { onConflict: "follower_user_key,following_user_key" },
    );
    return;
  }

  await supabase
    .from("follows")
    .delete()
    .eq("follower_user_key", userKey)
    .eq("following_user_key", targetUserKey);
}

export async function loadSupabaseSocialCounts(customUserKey?: string): Promise<{
  following: number;
  followers: number;
  friends: number;
}> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return { following: 0, followers: 0, friends: 0 };

  const userKey = customUserKey || getDbaUserKey();

  const { data: followRows } = await supabase
    .from("follows")
    .select("follower_user_key,following_user_key")
    .or(`follower_user_key.eq.${userKey},following_user_key.eq.${userKey}`);

  const followingSet = new Set(
    (followRows ?? [])
      .filter((row) => row.follower_user_key === userKey)
      .map((row) => row.following_user_key as string),
  );
  const followersSet = new Set(
    (followRows ?? [])
      .filter((row) => row.following_user_key === userKey)
      .map((row) => row.follower_user_key as string),
  );

  // Friends = mutual follows
  let friends = 0;
  for (const key of followingSet) {
    if (followersSet.has(key)) friends++;
  }

  return {
    following: followingSet.size,
    followers: followersSet.size,
    friends,
  };
}

export async function loadSupabaseInventoryItems(fallbackItems: TokenShopItem[]) { 
  const supabase = getSupabaseBrowserClient(); 
  if (!supabase) return fallbackItems; 

  const { data, error } = await supabase
    .from("inventory_items")
    .select("item_key,title,description,cost,category,reward,image_url,active")
    .order("cost", { ascending: true });

  if (error) {
    return fallbackItems;
  }

  if (!data || data.length === 0) {
    await supabase.from("inventory_items").upsert(
      fallbackItems.map((item) => ({
        item_key: item.id,
        title: item.title,
        description: item.description,
        cost: item.cost,
        category: item.category,
        reward: item.reward,
        image_url: item.image,
        active: true,
      })),
      { onConflict: "item_key" },
    );

    return fallbackItems;
  }

  return data.map((item) => ({ 
    id: String(item.item_key), 
    title: String(item.title), 
    description: String(item.description), 
    cost: Number(item.cost), 
    category: item.category as TokenShopItem["category"], 
    reward: String(item.reward), 
    image: String(item.image_url), 
  })) satisfies TokenShopItem[]; 
} 

export async function loadSupabaseSitePreferences(fallbackPreferences: SitePreferences, customUserKey?: string) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return fallbackPreferences;

  const userKey = customUserKey || getDbaUserKey();

  const { data, error } = await supabase
    .from("site_preferences")
    .select("*")
    .eq("user_key", userKey)
    .maybeSingle();

  if (error) {
    return fallbackPreferences;
  }

  if (!data) {
    await supabase.from("site_preferences").upsert(
      {
        user_key: userKey,
        theme: fallbackPreferences.theme,
        reduce_motion: fallbackPreferences.reduceMotion,
        compact_layout: fallbackPreferences.compactLayout,
        daily_login_reminder: fallbackPreferences.dailyLoginReminder,
        news_alerts: fallbackPreferences.newsAlerts,
        ranked_alerts: fallbackPreferences.rankedAlerts,
        language: fallbackPreferences.language,
        hide_online_status: fallbackPreferences.hideOnlineStatus,
        public_rank_badge: fallbackPreferences.publicRankBadge,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_key" },
    );

    return fallbackPreferences;
  }

  return {
    theme: data.theme === "dark" ? "dark" : "light",
    reduceMotion: Boolean(data.reduce_motion),
    compactLayout: Boolean(data.compact_layout),
    dailyLoginReminder: Boolean(data.daily_login_reminder),
    newsAlerts: Boolean(data.news_alerts),
    rankedAlerts: Boolean(data.ranked_alerts),
    language: data.language === "en" ? "en" : "id",
    hideOnlineStatus: Boolean(data.hide_online_status),
    publicRankBadge: Boolean(data.public_rank_badge),
  } satisfies SitePreferences;
}

export async function saveSupabaseSitePreferences(preferences: SitePreferences, customUserKey?: string) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return;

  const userKey = customUserKey || getDbaUserKey();

  await supabase.from("site_preferences").upsert(
    {
      user_key: userKey,
      theme: preferences.theme,
      reduce_motion: preferences.reduceMotion,
      compact_layout: preferences.compactLayout,
      daily_login_reminder: preferences.dailyLoginReminder,
      news_alerts: preferences.newsAlerts,
      ranked_alerts: preferences.rankedAlerts,
      language: preferences.language,
      hide_online_status: preferences.hideOnlineStatus,
      public_rank_badge: preferences.publicRankBadge,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_key" },
  );
}

export type SupabaseUserManagementRow = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "scaler" | "moderator";
  status: "Active" | "Invited" | "Suspended";
  isMuted: boolean;
  isBanned: boolean;
  lastActive: string;
  dateAdded: string;
  notes: string;
};

export async function loadSupabaseAllUsers(
  fallbackUsers: SupabaseUserManagementRow[]
): Promise<SupabaseUserManagementRow[]> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return fallbackUsers;

  const { data, error } = await supabase
    .from("profiles")
    .select("user_key, display_name, role, status, is_muted, is_banned, notes, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading users:", error);
    return fallbackUsers;
  }

  if (!data || data.length === 0) {
    try {
      await supabase.from("profiles").upsert(
        fallbackUsers.map((user) => ({
          user_key: user.id,
          display_name: user.name,
          role: user.role,
          status: user.status,
          is_muted: user.isMuted,
          is_banned: user.isBanned,
          notes: user.notes,
        })),
        { onConflict: "user_key" }
      );
    } catch (upsertErr) {
      console.error("Error seeding initial users:", upsertErr);
    }
    return fallbackUsers;
  }

  return data.map((row) => {
    const dateAdded = row.created_at
      ? new Date(row.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "Jul 4, 2022";

    const lastActive = row.updated_at
      ? new Date(row.updated_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }) +
        ", " +
        new Date(row.updated_at).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      : "Today, 08:14";

    return {
      id: String(row.user_key),
      name: String(row.display_name || "Anonymous"),
      email: "",
      role: (row.role || "scaler") as any,
      status: (row.status || "Active") as any,
      isMuted: Boolean(row.is_muted),
      isBanned: Boolean(row.is_banned),
      lastActive,
      dateAdded,
      notes: String(row.notes || ""),
    };
  });
}

export async function updateSupabaseUserAccess(
  userKey: string,
  updates: {
    role?: string;
    status?: string;
    is_muted?: boolean;
    is_banned?: boolean;
    notes?: string;
    display_name?: string;
    email?: string;
  }
) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return null;

  const payload: Record<string, any> = {
    updated_at: new Date().toISOString(),
  };

  if (updates.role !== undefined) payload.role = updates.role;
  if (updates.status !== undefined) payload.status = updates.status;
  if (updates.is_muted !== undefined) payload.is_muted = updates.is_muted;
  if (updates.is_banned !== undefined) payload.is_banned = updates.is_banned;
  if (updates.notes !== undefined) payload.notes = updates.notes;
  if (updates.display_name !== undefined) payload.display_name = updates.display_name;
  // Note: email column not queried (not in schema cache)

  const { data, error } = await supabase
    .from("profiles")
    .update(payload)
    .eq("user_key", userKey)
    .select()
    .maybeSingle();

  if (error) {
    console.error("Error updating user:", error);
    throw error;
  }

  return data;
}

export async function createSupabaseUser(user: {
  id: string;
  name: string;
  email: string;
  role: string;
  notes: string;
  status: string;
}) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return null;

  // Use upsert instead of insert so that calling this from the admin panel
  // for a user who already bootstrapped their profile via the normal auth
  // flow does not throw a primary-key violation (user_key is the PK).
  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        user_key: user.id,
        display_name: user.name,
        role: user.role,
        notes: user.notes,
        status: user.status,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_key" },
    )
    .select()
    .maybeSingle();

  if (error) {
    console.error("Error creating user:", error);
    throw error;
  }

  return data;
}

// ---------------------------------------------------------------------------
// Dashboard helpers — insert a single post + image upload
// ---------------------------------------------------------------------------

/**
 * Upload an image file to Supabase Storage (bucket: "posts").
 * Returns the public URL of the uploaded file, or null on failure.
 */
export async function uploadImageToStorage(
  file: File,
  folder: string = "uploads"
): Promise<string | null> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    console.error("[uploadImageToStorage] Supabase client tidak tersedia.");
    return null;
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const filePath = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  console.log("[uploadImageToStorage] Memulai upload ke bucket \"post\"...");
  console.log("[uploadImageToStorage] filePath:", filePath);
  console.log("[uploadImageToStorage] File info:", { name: file.name, size: file.size, type: file.type });

  const { data, error } = await supabase.storage
    .from("post")
    .upload(filePath, file, { upsert: false, cacheControl: "3600" });

  if (error) {
    console.error("[uploadImageToStorage] Upload GAGAL:", {
      message: error.message,
      name: error.name,
    });
    return null;
  }

  console.log("[uploadImageToStorage] Upload sukses. Storage path:", data.path);

  const { data: urlData } = supabase.storage
    .from("post")
    .getPublicUrl(data.path);

  const publicUrl = urlData?.publicUrl ?? null;
  console.log("[uploadImageToStorage] publicUrl:", publicUrl);

  return publicUrl;
}

/**
 * Insert one new post into the `posts` table.
 * origin = category key (e.g. "news" | "gallery" | "events" | "library" |
 *                         "marketplace" | "slider" | "terminology")
 * Approval is intentionally bypassed — post is published immediately.
 */
export async function insertSupabasePost(post: {
  title: string;
  description: string;
  content?: string;
  image_url: string;
  date: string;
  origin: string;
}): Promise<Post | null> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return null;

  // Validate & sanitize — prevent undefined from reaching the DB
  const title = (post.title ?? "").trim();
  const description = (post.description ?? "").trim();
  const content = (post.content ?? "").trim();
  const image_url = (post.image_url ?? "").trim();
  const date = (post.date ?? "").trim() || new Date().toISOString().split("T")[0];
  const origin = (post.origin ?? "custom").trim();

  if (!title) throw new Error("Judul tidak boleh kosong.");
  if (!description) throw new Error("Deskripsi tidak boleh kosong.");
  if (!image_url) throw new Error("Gambar belum diupload atau URL kosong.");

  const id = `post-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  const { data, error } = await supabase
    .from("posts")
    .insert({
      id,
      title,
      description,
      content,
      image_url,
      date,
      origin,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select("id,title,description,content,image_url,date,origin")
    .maybeSingle();

  if (error) {
    console.error("insertSupabasePost error:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    throw new Error(
      `Gagal simpan ke database: ${error.message}` +
      (error.hint ? ` — ${error.hint}` : "") +
      ` (code: ${error.code})`
    );
  }

  if (!data) return null;

  return {
    id: String(data.id),
    title: String(data.title),
    description: String(data.description),
    content: typeof data.content === "string" ? data.content : "",
    image: normalizeImageSrc(data.image_url),
    date: String(data.date),
    origin: typeof data.origin === "string" ? data.origin : "custom",
  };
}

/**
 * Load posts filtered by origin (category), ordered newest first.
 * Used by page sections (news, gallery, events, etc.)
 */
export async function loadSupabasePostsByOrigin(
  origin: string,
  fallback: Post[] = []
): Promise<Post[]> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return fallback;

  const { data, error } = await supabase
    .from("posts")
    .select("id,title,description,content,image_url,date")
    .eq("origin", origin)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(`Error loading posts (origin=${origin}):`, error);
    return fallback;
  }

  if (!data || data.length === 0) return fallback;

  return data.map((post) => ({
    id: String(post.id),
    title: String(post.title),
    description: String(post.description),
    content: typeof post.content === "string" ? post.content : "",
    image: normalizeImageSrc(post.image_url),
    date: String(post.date),
  })) satisfies Post[];
}
