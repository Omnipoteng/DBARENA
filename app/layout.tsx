import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import localFont from "next/font/local";

import CookieBanner from "@/components/cookie-banner";
import DailyLoginPopup from "@/components/daily-login-popup";
import PageTransitionLoader from "@/components/page-transition-loader";
import SitePreferencesSync from "@/components/site-preferences-sync";
import PwaInstaller from "@/components/pwa-installer";
import { PostStoreProvider } from "@/components/post-store-provider";
import { THEME_COOKIE, readThemeCookieValue } from "@/lib/site-preferences";

import "./globals.css";
import { cn } from "@/lib/utils";

const coolvetica = localFont({
  src: "./fonts/Coolvetica-Regular.woff2",
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "DBARENA | Battleboarding News & Community Hub",
  description:
    "Pusat berita, event, dan update komunitas battleboarding internasional.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "DBARENA",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#090909",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeCookie = (await cookies()).get(THEME_COOKIE)?.value;
  const theme = readThemeCookieValue(themeCookie);

  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-ui-theme={theme}
      className={cn("h-full", "antialiased", coolvetica.variable, "font-sans", theme === "dark" && "dark")}
      style={{ colorScheme: theme }}
    >
      <body className="min-h-full bg-background font-sans text-foreground transition-colors duration-300">
        <PostStoreProvider>{children}</PostStoreProvider>
        <SitePreferencesSync />
        <PageTransitionLoader />
        <DailyLoginPopup />
        <CookieBanner />
        <PwaInstaller />
      </body>
    </html>
  );
}

