"use client";

import { useEffect, useState, type ReactNode } from "react";

import {
  applySitePreferences,
  getDefaultPreferences,
  readSitePreferences,
  type SitePreferences,
  type SiteTheme,
  writeSitePreferences,
} from "@/lib/site-preferences";
import Navbar from "@/components/sections/navbar";

const SITE_PREFERENCES_EVENT = "site-preferences-change";

function Icon({ children }: { children: ReactNode }) {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-black/8 bg-black/[0.03] text-black">
      {children}
    </span>
  );
}

function SectionTitle({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] uppercase tracking-[0.42em] text-black/35">{eyebrow}</p>
      <h1 className="font-sans text-3xl font-black uppercase tracking-[0.04em] text-black sm:text-4xl">
        {title}
      </h1>
      <p className="max-w-2xl text-sm leading-6 text-black/55">{description}</p>
    </div>
  );
}

function SettingRow({
  icon,
  title,
  description,
  control,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  control: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4 px-5 py-4">
      <Icon>{icon}</Icon>
      <div className="min-w-0 flex-1">
        <p className="font-sans text-[14px] font-black uppercase tracking-[0.12em] text-black">{title}</p>
        <p className="mt-1 text-sm leading-6 text-black/55">{description}</p>
      </div>
      <div className="shrink-0">{control}</div>
    </div>
  );
}

function SettingSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="relative inline-flex h-8 w-14 items-center rounded-full border border-black/10 bg-black/[0.04] p-1 transition hover:bg-black/[0.06]"
      aria-pressed={checked}
    >
      <span
        className={`h-6 w-6 rounded-full transition duration-300 ${
          checked ? "translate-x-6 bg-black" : "translate-x-0 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.18)]"
        }`}
      />
    </button>
  );
}

function SegmentedChoice({
  options,
  value,
  onChange,
}: {
  options: Array<{ label: string; value: SiteTheme | "id" | "en" }>;
  value: SiteTheme | "id" | "en";
  onChange: (value: SiteTheme | "id" | "en") => void;
}) {
  return (
    <div className="flex overflow-hidden rounded-full border border-black/10 bg-black/[0.03] p-1">
      {options.map((option) => {
        const active = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition ${
              active ? "bg-black text-white" : "text-black/55 hover:text-black"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function SectionBlock({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-black/8 bg-white shadow-[0_18px_60px_rgba(0,0,0,0.04)]">
      <div className="border-b border-black/6 px-5 py-4">
        <p className="text-[11px] uppercase tracking-[0.32em] text-black/38">{subtitle}</p>
        <h2 className="mt-2 font-sans text-xl font-black uppercase tracking-[0.05em] text-black">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export default function SettingsPage() {
  const [preferences, setPreferences] = useState<SitePreferences>(getDefaultPreferences());

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const stored = readSitePreferences();
      setPreferences(stored);
      applySitePreferences(stored);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const savePreferences = (nextPreferences: SitePreferences) => {
    setPreferences(nextPreferences);
    writeSitePreferences(nextPreferences);
    applySitePreferences(nextPreferences);
    window.dispatchEvent(new Event(SITE_PREFERENCES_EVENT));
  };

  const updatePreference = <K extends keyof SitePreferences>(key: K, value: SitePreferences[K]) => {
    savePreferences({ ...preferences, [key]: value });
  };

  const resetPreferences = () => {
    savePreferences(getDefaultPreferences());
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="rounded-[32px] border border-black/8 bg-white p-5 shadow-[0_20px_80px_rgba(0,0,0,0.05)] sm:p-7">
          <SectionTitle
            eyebrow="System"
            title="Pengaturan"
            description="Atur tampilan, notifikasi, bahasa, dan preferensi akun DBARENA lewat satu panel yang ringkas."
          />

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[22px] border border-black/8 bg-black/[0.02] px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.32em] text-black/35">Theme</p>
              <p className="mt-2 text-sm font-semibold text-black">
                {preferences.theme === "dark" ? "Dark mode" : "Light mode"}
              </p>
            </div>
            <div className="rounded-[22px] border border-black/8 bg-black/[0.02] px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.32em] text-black/35">Language</p>
              <p className="mt-2 text-sm font-semibold text-black">
                {preferences.language === "id" ? "Indonesia" : "English"}
              </p>
            </div>
            <div className="rounded-[22px] border border-black/8 bg-black/[0.02] px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.32em] text-black/35">Alerts</p>
              <p className="mt-2 text-sm font-semibold text-black">
                {preferences.newsAlerts || preferences.rankedAlerts ? "Aktif" : "Mati"}
              </p>
            </div>
          </div>
        </section>

        <div className="space-y-5">
          <SectionBlock title="Tampilan" subtitle="Appearance">
            <SettingRow
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3a7 7 0 1 0 7 7" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3a7 7 0 1 1-7 7" />
                </svg>
              }
              title="Mode warna"
              description="Pilih tampilan terang atau gelap. Tema gelap akan membalik seluruh elemen visual DBARENA."
              control={
                <SegmentedChoice
                  value={preferences.theme}
                  onChange={(value) => updatePreference("theme", value as SiteTheme)}
                  options={[
                    { label: "Terang", value: "light" },
                    { label: "Gelap", value: "dark" },
                  ]}
                />
              }
            />
            <div className="border-t border-black/6" />
            <SettingRow
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12h16" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h8" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 17h12" />
                </svg>
              }
              title="Layout compact"
              description="Rapikan jarak antar section dan padatkan tampilan halaman."
              control={
                <SettingSwitch
                  checked={preferences.compactLayout}
                  onChange={(checked) => updatePreference("compactLayout", checked)}
                />
              }
            />
            <div className="border-t border-black/6" />
            <SettingRow
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.5 17.5 12 20l2.5-2.5" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16" />
                </svg>
              }
              title="Kurangi animasi"
              description="Matikan animasi berat supaya halaman terasa lebih ringan."
              control={
                <SettingSwitch
                  checked={preferences.reduceMotion}
                  onChange={(checked) => updatePreference("reduceMotion", checked)}
                />
              }
            />
          </SectionBlock>

          <SectionBlock title="Notifikasi" subtitle="Notifications">
            <SettingRow
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14v-3a6 6 0 1 0-12 0v3c0 .5-.2 1-.6 1.4L4 17h5" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 17a2 2 0 0 0 4 0" />
                </svg>
              }
              title="Daily login reminder"
              description="Pengingat klaim token harian tetap muncul di beranda."
              control={
                <SettingSwitch
                  checked={preferences.dailyLoginReminder}
                  onChange={(checked) => updatePreference("dailyLoginReminder", checked)}
                />
              }
            />
            <div className="border-t border-black/6" />
            <SettingRow
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h10" />
                </svg>
              }
              title="News alerts"
              description="Terima notifikasi saat berita baru dipublikasikan."
              control={
                <SettingSwitch
                  checked={preferences.newsAlerts}
                  onChange={(checked) => updatePreference("newsAlerts", checked)}
                />
              }
            />
            <div className="border-t border-black/6" />
            <SettingRow
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18v10H3z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7a4 4 0 0 1 8 0" />
                </svg>
              }
              title="Ranked alerts"
              description="Notifikasi untuk request, approval, dan hasil ranked match."
              control={
                <SettingSwitch
                  checked={preferences.rankedAlerts}
                  onChange={(checked) => updatePreference("rankedAlerts", checked)}
                />
              }
            />
          </SectionBlock>

          <SectionBlock title="Privasi" subtitle="Privacy & profile">
            <SettingRow
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
                  <circle cx="12" cy="8" r="3.5" strokeWidth={2} />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.5 19a6.5 6.5 0 0 1 13 0" />
                </svg>
              }
              title="Sembunyikan status online"
              description="Kurangi visibilitas status aktif di beberapa area komunitas."
              control={
                <SettingSwitch
                  checked={preferences.hideOnlineStatus}
                  onChange={(checked) => updatePreference("hideOnlineStatus", checked)}
                />
              }
            />
            <div className="border-t border-black/6" />
            <SettingRow
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3 9.5 8H4l4 4-1.5 6L12 15l5.5 3-1.5-6 4-4h-5.5L12 3Z" />
                </svg>
              }
              title="Tampilkan border rank publik"
              description="Tampilkan badge border avatar di profil secara publik."
              control={
                <SettingSwitch
                  checked={preferences.publicRankBadge}
                  onChange={(checked) => updatePreference("publicRankBadge", checked)}
                />
              }
            />
          </SectionBlock>

          <SectionBlock title="Bahasa & data" subtitle="Language">
            <SettingRow
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5h16v14H4z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9h8M8 13h5" />
                </svg>
              }
              title="Bahasa"
              description="Ubah bahasa antarmuka DBARENA."
              control={
                <SegmentedChoice
                  value={preferences.language}
                  onChange={(value) => updatePreference("language", value as "id" | "en")}
                  options={[
                    { label: "Indonesia", value: "id" },
                    { label: "English", value: "en" },
                  ]}
                />
              }
            />
            <div className="border-t border-black/6" />
            <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-sans text-[14px] font-black uppercase tracking-[0.12em] text-black">
                  Reset preferensi
                </p>
                <p className="mt-1 text-sm leading-6 text-black/55">
                  Kembalikan semua pilihan ke setelan awal device ini.
                </p>
              </div>
              <button
                type="button"
                onClick={resetPreferences}
                className="inline-flex h-11 items-center justify-center rounded-full border border-black/10 bg-white px-5 text-sm font-semibold text-black transition hover:bg-black/[0.03]"
              >
                Reset default
              </button>
            </div>
          </SectionBlock>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(new Event(SITE_PREFERENCES_EVENT));
              }}
              className="inline-flex h-12 flex-1 items-center justify-center rounded-full border border-black/10 bg-white px-5 text-sm font-semibold text-black transition hover:bg-black/[0.03]"
            >
              Simpan perubahan
            </button>
            <button
              type="button"
              onClick={resetPreferences}
              className="inline-flex h-12 flex-1 items-center justify-center rounded-full bg-black px-5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Kembali ke default
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
