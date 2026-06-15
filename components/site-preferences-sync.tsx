"use client";

import { useEffect } from "react";

import {
  applySitePreferences,
  readSitePreferences,
} from "@/lib/site-preferences";

const SITE_PREFERENCES_EVENT = "site-preferences-change";

export default function SitePreferencesSync() {
  useEffect(() => {
    const syncPreferences = () => {
      applySitePreferences(readSitePreferences());
    };

    syncPreferences();

    window.addEventListener("storage", syncPreferences);
    window.addEventListener(SITE_PREFERENCES_EVENT, syncPreferences as EventListener);

    return () => {
      window.removeEventListener("storage", syncPreferences);
      window.removeEventListener(SITE_PREFERENCES_EVENT, syncPreferences as EventListener);
    };
  }, []);

  return null;
}

