export type SiteTheme = "light" | "dark";
export type SiteLanguage = "id" | "en";

export type SitePreferences = {
  theme: SiteTheme;
  reduceMotion: boolean;
  compactLayout: boolean;
  dailyLoginReminder: boolean;
  newsAlerts: boolean;
  rankedAlerts: boolean;
  language: SiteLanguage;
  hideOnlineStatus: boolean;
  publicRankBadge: boolean;
};

const DEFAULT_PREFERENCES: SitePreferences = {
  theme: "light",
  reduceMotion: false,
  compactLayout: false,
  dailyLoginReminder: true,
  newsAlerts: true,
  rankedAlerts: true,
  language: "id",
  hideOnlineStatus: false,
  publicRankBadge: true,
};

const STORAGE_KEYS = {
  theme: "dba-theme",
  reduceMotion: "dba-reduce-motion",
  compactLayout: "dba-compact-layout",
  dailyLoginReminder: "dba-daily-login-reminder",
  newsAlerts: "dba-news-alerts",
  rankedAlerts: "dba-ranked-alerts",
  language: "dba-language",
  hideOnlineStatus: "dba-hide-online-status",
  publicRankBadge: "dba-public-rank-badge",
} as const;

export const THEME_COOKIE = "dba-theme";

function readBoolean(key: string, fallback: boolean) {
  if (typeof window === "undefined") return fallback;

  const raw = window.localStorage.getItem(key);
  if (raw === null) return fallback;

  return raw === "true";
}

function readTheme(): SiteTheme {
  if (typeof window === "undefined") return DEFAULT_PREFERENCES.theme;

  const raw = window.localStorage.getItem(STORAGE_KEYS.theme);
  return raw === "dark" ? "dark" : "light";
}

export function readThemeCookieValue(cookieValue: string | undefined): SiteTheme {
  return cookieValue === "dark" ? "dark" : "light";
}

function readLanguage(): SiteLanguage {
  if (typeof window === "undefined") return DEFAULT_PREFERENCES.language;

  const raw = window.localStorage.getItem(STORAGE_KEYS.language);
  return raw === "en" ? "en" : "id";
}

export function getDefaultPreferences(): SitePreferences {
  return { ...DEFAULT_PREFERENCES };
}

export function readSitePreferences(): SitePreferences {
  return {
    theme: readTheme(),
    reduceMotion: readBoolean(STORAGE_KEYS.reduceMotion, DEFAULT_PREFERENCES.reduceMotion),
    compactLayout: readBoolean(STORAGE_KEYS.compactLayout, DEFAULT_PREFERENCES.compactLayout),
    dailyLoginReminder: readBoolean(STORAGE_KEYS.dailyLoginReminder, DEFAULT_PREFERENCES.dailyLoginReminder),
    newsAlerts: readBoolean(STORAGE_KEYS.newsAlerts, DEFAULT_PREFERENCES.newsAlerts),
    rankedAlerts: readBoolean(STORAGE_KEYS.rankedAlerts, DEFAULT_PREFERENCES.rankedAlerts),
    language: readLanguage(),
    hideOnlineStatus: readBoolean(STORAGE_KEYS.hideOnlineStatus, DEFAULT_PREFERENCES.hideOnlineStatus),
    publicRankBadge: readBoolean(STORAGE_KEYS.publicRankBadge, DEFAULT_PREFERENCES.publicRankBadge),
  };
}

export function writeSitePreferences(preferences: SitePreferences) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(STORAGE_KEYS.theme, preferences.theme);
  window.document.cookie = `${THEME_COOKIE}=${preferences.theme}; path=/; max-age=31536000; samesite=lax`;
  window.localStorage.setItem(STORAGE_KEYS.reduceMotion, String(preferences.reduceMotion));
  window.localStorage.setItem(STORAGE_KEYS.compactLayout, String(preferences.compactLayout));
  window.localStorage.setItem(STORAGE_KEYS.dailyLoginReminder, String(preferences.dailyLoginReminder));
  window.localStorage.setItem(STORAGE_KEYS.newsAlerts, String(preferences.newsAlerts));
  window.localStorage.setItem(STORAGE_KEYS.rankedAlerts, String(preferences.rankedAlerts));
  window.localStorage.setItem(STORAGE_KEYS.language, preferences.language);
  window.localStorage.setItem(STORAGE_KEYS.hideOnlineStatus, String(preferences.hideOnlineStatus));
  window.localStorage.setItem(STORAGE_KEYS.publicRankBadge, String(preferences.publicRankBadge));
}

export function applySitePreferences(preferences: SitePreferences) {
  if (typeof document === "undefined") return;

  document.documentElement.classList.toggle("dark", preferences.theme === "dark");
  document.documentElement.dataset.uiTheme = preferences.theme;
  document.documentElement.dataset.reduceMotion = String(preferences.reduceMotion);
  document.documentElement.dataset.compactLayout = String(preferences.compactLayout);
  document.documentElement.dataset.language = preferences.language;
  document.documentElement.style.colorScheme = preferences.theme;
}
