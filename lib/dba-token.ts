export const DBA_TOKEN_KEYS = {
  balance: "dba-token-balance",
  claimDate: "dba-daily-token-claim-date",
  streakDay: "dba-daily-token-streak-day",
  unlocks: "dba-daily-token-unlocks",
  history: "dba-token-history",
} as const;

export type TokenShopCategory = "Kosmetik" | "Akses" | "Status" | "Vault";

export type TokenShopItem = {
  id: string;
  title: string;
  description: string;
  cost: number;
  category: TokenShopCategory;
  reward: string;
  image: string;
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

export const TOKEN_SHOP_ITEMS: TokenShopItem[] = [
  {
    id: "legend-border",
    title: "Legend Border",
    description: "Border avatar prestige dengan aksen emas tipis dan glow bersih.",
    cost: 180,
    category: "Kosmetik",
    reward: "Border Legend",
    image: "/images/logo-dba.png",
  },
  {
    id: "mythic-border",
    title: "Mythic Border",
    description: "Border kontras untuk profile yang butuh identitas lebih tajam.",
    cost: 260,
    category: "Kosmetik",
    reward: "Border Mythic",
    image: "/images/Makima.png",
  },
  {
    id: "apex-border",
    title: "Apex Border",
    description: "Border puncak dengan palet obsidian, cyan, dan silver.",
    cost: 420,
    category: "Kosmetik",
    reward: "Border Apex",
    image: "/images/4.jpg",
  },
  {
    id: "special-tag",
    title: "Special Tag Capsule",
    description: "Unlock tag khusus untuk profile dan identitas komunitas.",
    cost: 140,
    category: "Status",
    reward: "DBA Special Tag",
    image: "/images/1.jpg",
  },
  {
    id: "elite-tag",
    title: "Elite Tag Capsule",
    description: "Tag premium untuk profil dengan tampilan lebih eksklusif.",
    cost: 220,
    category: "Status",
    reward: "DBA Elite Tag",
    image: "/images/2.jpg",
  },
  {
    id: "priority-pass",
    title: "Priority Approval Pass",
    description: "Buat request tertentu naik antrian lebih rapi untuk review.",
    cost: 300,
    category: "Akses",
    reward: "Priority Review",
    image: "/images/3.jpg",
  },
  {
    id: "spotlight-slot",
    title: "Weekly Spotlight Slot",
    description: "Slot tampil di highlight mingguan DBARENA.",
    cost: 360,
    category: "Vault",
    reward: "Spotlight Placement",
    image: "/images/news banner.jpg",
  },
  {
    id: "profile-banner-slot",
    title: "Profile Banner Slot",
    description: "Buka fitur banner yang lebih menonjol di halaman profil.",
    cost: 190,
    category: "Kosmetik",
    reward: "Banner Slot",
    image: "/images/news banner 2.jpg",
  },
];

export function readTokenWallet(): TokenWalletSnapshot {
  if (typeof window === "undefined") {
    return { balance: 0, unlocks: [], history: [] };
  }

  const rawBalance = window.localStorage.getItem(DBA_TOKEN_KEYS.balance) ?? "0"; 
  const rawUnlocks = window.localStorage.getItem(DBA_TOKEN_KEYS.unlocks) ?? "[]"; 
  const rawHistory = window.localStorage.getItem(DBA_TOKEN_KEYS.history) ?? "[]"; 
  const rawClaimDate = window.localStorage.getItem(DBA_TOKEN_KEYS.claimDate) ?? ""; 
  const rawStreakDay = Number(window.localStorage.getItem(DBA_TOKEN_KEYS.streakDay) ?? "0"); 

  const balance = Number(rawBalance);

  let unlocks: string[] = [];
  try {
    const parsed = JSON.parse(rawUnlocks) as unknown;
    unlocks = Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    unlocks = [];
  }

  let history: TokenHistoryEntry[] = [];
  try {
    const parsed = JSON.parse(rawHistory) as unknown;
    history = Array.isArray(parsed)
      ? parsed.filter((item): item is TokenHistoryEntry => {
          return (
            !!item &&
            typeof item === "object" &&
            typeof (item as TokenHistoryEntry).id === "string" &&
            typeof (item as TokenHistoryEntry).title === "string" &&
            typeof (item as TokenHistoryEntry).cost === "number" &&
            typeof (item as TokenHistoryEntry).timestamp === "string"
          );
        })
      : [];
  } catch {
    history = [];
  }

  return { 
    balance: Number.isFinite(balance) ? balance : 0, 
    unlocks, 
    history, 
    claimDate: rawClaimDate || undefined, 
    streakDay: Number.isFinite(rawStreakDay) ? rawStreakDay : undefined, 
  }; 
} 

export function writeTokenWallet(nextWallet: TokenWalletSnapshot) { 
  if (typeof window === "undefined") return; 

  window.localStorage.setItem(DBA_TOKEN_KEYS.balance, String(nextWallet.balance)); 
  window.localStorage.setItem(DBA_TOKEN_KEYS.unlocks, JSON.stringify(nextWallet.unlocks)); 
  window.localStorage.setItem(DBA_TOKEN_KEYS.history, JSON.stringify(nextWallet.history)); 
  if (typeof nextWallet.claimDate === "string") { 
    window.localStorage.setItem(DBA_TOKEN_KEYS.claimDate, nextWallet.claimDate); 
  } 
  if (typeof nextWallet.streakDay === "number") { 
    window.localStorage.setItem(DBA_TOKEN_KEYS.streakDay, String(nextWallet.streakDay)); 
  }
  window.dispatchEvent(new Event("dba-token-wallet-updated")); 
} 

export function clearTokenWallet() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(DBA_TOKEN_KEYS.balance);
  window.localStorage.removeItem(DBA_TOKEN_KEYS.unlocks);
  window.localStorage.removeItem(DBA_TOKEN_KEYS.history);
  window.localStorage.removeItem(DBA_TOKEN_KEYS.claimDate);
  window.localStorage.removeItem(DBA_TOKEN_KEYS.streakDay);
  window.dispatchEvent(new Event("dba-token-wallet-updated"));
}

export function formatTokenNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}
