"use client";

import { useEffect, useState } from "react";
import { Download, X, Smartphone, Check } from "lucide-react";

interface BeforeInstallPromptEvent extends Event { 
  readonly platforms: string[]; 
  readonly userChoice: Promise<{ 
    outcome: "accepted" | "dismissed"; 
    platform: string; 
  }>; 
  prompt(): Promise<void>; 
} 

interface NavigatorWithStandalone extends Navigator { 
  standalone?: boolean; 
} 

export default function PwaInstaller() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [installState, setInstallState] = useState<"idle" | "installing" | "success">("idle");

  useEffect(() => {
    // 1. Registrasi Service Worker di Client
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("Service Worker berhasil didaftarkan dengan scope:", registration.scope);
          })
          .catch((error) => {
            console.error("Gagal mendaftarkan Service Worker:", error);
          });
      });
    }

    // 2. Mendeteksi status standalone (sudah terinstall & dibuka sebagai aplikasi) 
    const checkStandalone = () => { 
      const isStandaloneMedia = window.matchMedia("(display-mode: standalone)").matches; 
      const isNavigatorStandalone = (navigator as NavigatorWithStandalone).standalone === true; 
      if (isStandaloneMedia || isNavigatorStandalone) { 
        setIsInstalled(true); 
      } 
    }; 
    checkStandalone();

    // 3. Menangani event beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      // Mencegah browser menampilkan prompt default otomatis
      e.preventDefault();
      
      // Simpan event prompt instalasi
      const promptEvent = e as BeforeInstallPromptEvent;
      setInstallPrompt(promptEvent);

      // Tampilkan banner instalasi jika user belum menolak di sesi ini
      const isDismissed = sessionStorage.getItem("pwa_install_dismissed");
      const isAppInstalled = window.matchMedia("(display-mode: standalone)").matches;
      
      if (!isDismissed && !isAppInstalled) {
        // Beri sedikit delay untuk transisi UI yang halus setelah page load
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 3000);
        return () => clearTimeout(timer);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // 4. Mendeteksi jika aplikasi berhasil di-install
    const handleAppInstalled = () => {
      console.log("PWA berhasil di-install!");
      setIsInstalled(true);
      setIsVisible(false);
      setInstallPrompt(null);
      setInstallState("success");
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;

    setInstallState("installing");

    // Tampilkan prompt instalasi sistem
    await installPrompt.prompt();

    // Tunggu pilihan user
    const choiceResult = await installPrompt.userChoice;
    console.log(`Pilihan user untuk instalasi: ${choiceResult.outcome}`);

    if (choiceResult.outcome === "accepted") {
      setInstallState("success");
      setIsVisible(false);
      setInstallPrompt(null);
    } else {
      setInstallState("idle");
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Simpan status ditutup di sessionStorage agar tidak mengganggu user di sesi tab saat ini
    sessionStorage.setItem("pwa_install_dismissed", "true");
  };

  // Jangan tampilkan jika sudah di-install, tidak ada event prompt, atau sedang tersembunyi
  if (!isVisible || !installPrompt || isInstalled) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-[9999] w-[92%] max-w-md -translate-x-1/2 px-1 animate-in fade-in slide-in-from-bottom-8 duration-300">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/80 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl md:p-5">
        {/* Latar belakang efek cahaya neon tipis */}
        <div className="absolute -left-16 -top-16 -z-10 h-32 w-32 rounded-full bg-primary/20 blur-2xl"></div>
        <div className="absolute -bottom-16 -right-16 -z-10 h-32 w-32 rounded-full bg-[#f4f4f2]/5 blur-2xl"></div>

        <div className="flex items-start gap-3">
          {/* Logo Mini / Ikon */}
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white">
            <Smartphone className="h-5 w-5 text-neutral-300" />
          </div>

          {/* Deskripsi */}
          <div className="flex-1">
            <h3 className="font-display text-sm font-semibold text-white tracking-wide">
              Install DBARENA App
            </h3>
            <p className="mt-0.5 text-xs text-neutral-400 leading-relaxed">
              Pasang aplikasi di beranda Anda untuk akses offline cepat dan notifikasi langsung.
            </p>

            {/* Aksi */}
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={handleInstallClick}
                disabled={installState === "installing"}
                className="flex items-center gap-1.5 rounded-lg bg-white px-3.5 py-1.5 text-xs font-bold text-black transition-all hover:bg-neutral-200 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
              >
                {installState === "installing" ? (
                  <>
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-black border-t-transparent" />
                    Memasang...
                  </>
                ) : installState === "success" ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Terpasang!
                  </>
                ) : (
                  <>
                    <Download className="h-3.5 w-3.5" />
                    Install Sekarang
                  </>
                )}
              </button>

              <button
                onClick={handleDismiss}
                className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-neutral-400 transition-colors hover:bg-white/5 hover:text-white"
              >
                Nanti saja
              </button>
            </div>
          </div>

          {/* Tombol Close */}
          <button
            onClick={handleDismiss}
            aria-label="Tutup banner"
            className="rounded-full p-1 text-neutral-500 transition-colors hover:bg-white/10 hover:text-neutral-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
