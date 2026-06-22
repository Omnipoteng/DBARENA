"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { 
  formatTokenNumber, 
  readTokenWallet, 
  TOKEN_SHOP_ITEMS, 
  type TokenShopItem, 
  writeTokenWallet, 
} from "@/lib/dba-token"; 
import { 
  appendSupabaseTokenTransaction, 
  loadSupabaseInventoryItems, 
  loadSupabaseTokenWallet, 
  saveSupabaseTokenWallet, 
} from "@/lib/supabase-store"; 

type ShopSection = "Rekomendasi" | "Kosmetik" | "Akses" | "Status" | "Vault" | "Semua";
type PopupState =
  | { kind: "none" }
  | { kind: "detail"; item: TokenShopItem }
  | { kind: "confirm"; item: TokenShopItem }
  | { kind: "result"; status: "success" | "error"; title: string; description: string };

const SHOP_SECTIONS: Array<{ label: ShopSection; countHint: string }> = [
  { label: "Rekomendasi", countHint: "Top picks" },
  { label: "Kosmetik", countHint: "Avatar" },
  { label: "Akses", countHint: "Queue" },
  { label: "Status", countHint: "Profile" },
  { label: "Vault", countHint: "Spotlight" },
  { label: "Semua", countHint: "All items" },
];

const RECOMMENDED_IDS = new Set(["legend-border", "special-tag", "priority-pass", "apex-border"]);

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function ItemBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-black/60">
      {children}
    </span>
  );
}

function CardFrame({ children }: { children: React.ReactNode }) {
  return <div className="overflow-hidden rounded-[24px] border border-black/8 bg-white shadow-[0_12px_32px_rgba(0,0,0,0.04)]">{children}</div>;
}

export default function TokenExchangePage() { 
  const [wallet, setWallet] = useState(() => readTokenWallet()); 
  const [inventoryItems, setInventoryItems] = useState<TokenShopItem[]>(TOKEN_SHOP_ITEMS); 
  const [activeSection, setActiveSection] = useState<ShopSection>("Rekomendasi"); 
  const [message, setMessage] = useState<string | null>(null); 
  const [popup, setPopup] = useState<PopupState>({ kind: "none" }); 

  useEffect(() => { 
    function syncWallet() { 
      setWallet(readTokenWallet()); 
    } 

    function handleStorage(event: StorageEvent) {
      if (
        event.key === "dba-token-balance" ||
        event.key === "dba-daily-token-claim-date" ||
        event.key === "dba-daily-token-streak-day" ||
        event.key === "dba-daily-token-unlocks" ||
        event.key === "dba-token-history"
      ) {
        syncWallet();
      }
    }

    window.addEventListener("storage", handleStorage); 
    window.addEventListener("dba-token-wallet-updated", syncWallet as EventListener); 

    const hasLocalWallet = 
      window.localStorage.getItem("dba-token-balance") !== null || 
      window.localStorage.getItem("dba-token-history") !== null || 
      window.localStorage.getItem("dba-daily-token-unlocks") !== null; 

    if (!hasLocalWallet) { 
      void loadSupabaseTokenWallet().then((remoteWallet) => { 
        if (remoteWallet) { 
          setWallet(remoteWallet); 
        } 
      }); 
    } 

    void loadSupabaseInventoryItems(TOKEN_SHOP_ITEMS).then((remoteItems) => { 
      if (remoteItems.length > 0) { 
        setInventoryItems(remoteItems); 
      } 
    }); 

    return () => { 
      window.removeEventListener("storage", handleStorage); 
      window.removeEventListener("dba-token-wallet-updated", syncWallet as EventListener); 
    };
  }, []);

  useEffect(() => {
    if (popup.kind === "none") {
      document.body.style.overflow = "";
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleEsc(event: KeyboardEvent) {
      if (event.key === "Escape") setPopup({ kind: "none" });
    }

    window.addEventListener("keydown", handleEsc);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEsc);
    };
  }, [popup.kind]);

  const visibleItems = useMemo(() => { 
    if (activeSection === "Semua") return inventoryItems; 
    if (activeSection === "Rekomendasi") { 
      return inventoryItems.filter((item) => RECOMMENDED_IDS.has(item.id)); 
    } 
    return inventoryItems.filter((item) => item.category === activeSection); 
  }, [activeSection, inventoryItems]); 

  const openDailyLogin = () => {
    window.dispatchEvent(new Event("open-daily-login"));
    setMessage("Popup login harian dibuka. Klaim token lalu balik ke shop.");
  };

  const openDetail = (item: TokenShopItem) => {
    setPopup({ kind: "detail", item });
  };

  const purchaseItem = (item: TokenShopItem) => {
    const walletSnapshot = readTokenWallet();

    if (walletSnapshot.unlocks.includes(item.reward)) {
      setPopup({
        kind: "result",
        status: "error",
        title: "Item sudah dimiliki",
        description: `${item.title} sudah ada di wallet kamu. Tidak perlu membeli lagi.`,
      });
      return;
    }

    if (walletSnapshot.balance < item.cost) {
      setPopup({
        kind: "result",
        status: "error",
        title: "Token tidak cukup",
        description: `Kamu butuh ${formatTokenNumber(item.cost)} token untuk membeli ${item.title}.`,
      });
      return;
    }

    const nextWallet = {
      balance: walletSnapshot.balance - item.cost,
      unlocks: Array.from(new Set([...walletSnapshot.unlocks, item.reward])),
      history: [
        {
          id: `${item.id}-${walletSnapshot.history.length + 1}`,
          title: item.title,
          cost: item.cost,
          timestamp: new Date().toISOString(),
        },
        ...walletSnapshot.history,
      ].slice(0, 10),
    };

    writeTokenWallet(nextWallet); 
    setWallet(nextWallet); 
    void saveSupabaseTokenWallet(nextWallet); 
    void appendSupabaseTokenTransaction({ 
      title: item.title, 
      cost: item.cost, 
      kind: "redeem", 
      balanceAfter: nextWallet.balance, 
    }); 
    setPopup({ 
      kind: "result", 
      status: "success", 
      title: "Pembelian berhasil",
      description: `${item.title} berhasil ditukar. Cek profil atau inventory untuk melihat efeknya.`,
    });
    setMessage(`${item.title} berhasil ditukar. Cek profil atau inventory untuk melihat dampaknya.`);
  };

  const currentOwnedCount = wallet.unlocks.length;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(0,0,0,0.04),_transparent_28%),linear-gradient(180deg,_#ffffff_0%,_#f7f7f6_54%,_#efefed_100%)] text-black">
      <section className="mx-auto w-full max-w-7xl px-3 py-3 sm:px-6 lg:px-8">
        <div className="rounded-[30px] border border-black/8 bg-white shadow-[0_18px_55px_rgba(0,0,0,0.06)]">
          <div className="flex flex-col gap-4 border-b border-black/8 px-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-black text-white">
                <span className="text-[10px] font-black uppercase tracking-[0.22em]">DB</span>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-black/35">DBA TOKEN SHOP</p>
                <h1 className="mt-1 font-sans text-2xl font-black uppercase tracking-[0.08em] sm:text-3xl">
                  Shop Token
                </h1>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={openDailyLogin}
                className="inline-flex h-10 items-center justify-center rounded-full border border-black/10 bg-black px-4 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Klaim Harian
              </button>
              <div className="inline-flex h-10 items-center rounded-full border border-black/10 bg-black/[0.03] px-4 text-sm font-semibold text-black/70">
                {formatTokenNumber(wallet.balance)} token
              </div>
            </div>
          </div>

          {message ? (
            <div className="border-b border-black/8 bg-black/[0.03] px-4 py-3 text-sm text-black/70 lg:px-6">
              {message}
            </div>
          ) : null}

          <div className="grid gap-4 px-4 py-4 lg:grid-cols-[220px_minmax(0,1fr)_320px] lg:px-6 lg:py-6">
            <aside className="space-y-4">
              <CardFrame>
                <div className="border-b border-black/8 px-3 py-3">
                  <p className="text-[10px] uppercase tracking-[0.34em] text-black/35">Kategori</p>
                </div>
                <div className="flex gap-2 overflow-x-auto p-3 pb-1 lg:flex-col lg:overflow-visible">
                  {SHOP_SECTIONS.map((section) => {
                    const active = activeSection === section.label;
                    return (
                      <button
                        key={section.label}
                        type="button"
                        onClick={() => setActiveSection(section.label)}
                        className={`flex min-w-[118px] items-center justify-between rounded-[18px] border px-3 py-3 text-left transition lg:min-w-0 ${
                          active
                            ? "border-black bg-black text-white"
                            : "border-black/8 bg-white text-black/70 hover:bg-black/[0.03]"
                        }`}
                      >
                        <span className="flex flex-col gap-1">
                          <span className="text-[11px] font-black uppercase tracking-[0.18em]">
                            {section.label}
                          </span>
                          <span className={`text-[9px] uppercase tracking-[0.26em] ${active ? "text-white/60" : "text-black/35"}`}>
                            {section.countHint}
                          </span>
                        </span>
                        <span className={`text-[10px] font-semibold uppercase tracking-[0.22em] ${active ? "text-white/55" : "text-black/35"}`}>
                          {active ? "On" : "View"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </CardFrame>

              <CardFrame>
                <div className="border-b border-black/8 px-4 py-3">
                  <p className="text-[10px] uppercase tracking-[0.34em] text-black/35">Wallet</p>
                </div>
                <div className="p-4">
                  <div className="rounded-[22px] border border-black/8 bg-black px-4 py-5 text-white">
                    <p className="text-[10px] uppercase tracking-[0.34em] text-white/45">Balance</p>
                    <p className="mt-2 font-sans text-4xl font-black uppercase tracking-[0.06em]">
                      {formatTokenNumber(wallet.balance)}
                    </p>
                    <p className="mt-2 text-sm text-white/65">Token dari login harian bisa dipakai untuk item shop.</p>
                  </div>

                  <div className="mt-4 grid gap-3">
                    <ItemBadge>Owned {currentOwnedCount}</ItemBadge>
                    <ItemBadge>Unlock {wallet.unlocks.length > 0 ? wallet.unlocks[0] : "Belum ada"}</ItemBadge>
                    <ItemBadge>
                      Latest {wallet.history[0] ? wallet.history[0].title : "Belum ada transaksi"}
                    </ItemBadge>
                  </div>
                </div>
              </CardFrame>
            </aside>

            <section className="space-y-4">
              <div className="rounded-[24px] border border-black/8 bg-black/[0.02] px-4 py-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.36em] text-black/35">Daily offer</p>
                    <h2 className="mt-1 font-sans text-xl font-black uppercase tracking-[0.08em] text-black">
                      Item exchange board
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <ItemBadge>{visibleItems.length} items</ItemBadge>
                    <ItemBadge>{activeSection}</ItemBadge>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {visibleItems.map((item) => {
                  const owned = wallet.unlocks.includes(item.reward);

                  return (
                    <article
                      key={item.id}
                      className={`overflow-hidden rounded-[24px] border text-left transition ${
                        owned
                          ? "border-black/10 bg-white"
                          : "border-black/8 bg-white hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(0,0,0,0.08)]"
                      }`}
                    >
                      <div className="relative aspect-[4/3] w-full bg-black/[0.02]">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        />
                      </div>

                      <div className="space-y-3 border-t border-black/8 px-4 py-4">
                        <h3 className="font-sans text-lg font-black uppercase tracking-[0.06em] text-black">
                          {item.title}
                        </h3>

                        <button
                          type="button"
                          onClick={() => openDetail(item)}
                          className="inline-flex h-10 items-center justify-center rounded-full border border-black/10 bg-black px-4 text-[11px] font-black uppercase tracking-[0.22em] text-white transition hover:opacity-90"
                        >
                          {formatTokenNumber(item.cost)} DBA TOKEN
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            <aside className="space-y-4">
              <CardFrame>
                <div className="border-b border-black/8 px-4 py-3">
                  <p className="text-[10px] uppercase tracking-[0.34em] text-black/35">Summary</p>
                </div>
                <div className="space-y-3 p-4">
                  <ItemBadge>Balance {formatTokenNumber(wallet.balance)} token</ItemBadge>
                  <ItemBadge>Unlocked {String(wallet.unlocks.length)}</ItemBadge>
                  <ItemBadge>Available {String(TOKEN_SHOP_ITEMS.length)}</ItemBadge>
                </div>
              </CardFrame>

              <CardFrame>
                <div className="border-b border-black/8 px-4 py-3">
                  <p className="text-[10px] uppercase tracking-[0.34em] text-black/35">Recent transactions</p>
                </div>
                <div className="space-y-3 p-4">
                  {wallet.history.length > 0 ? (
                    wallet.history.map((entry) => (
                      <div key={entry.id} className="rounded-[18px] border border-black/8 bg-black/[0.02] px-4 py-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-black">{entry.title}</p>
                            <p className="mt-1 text-xs text-black/45">{formatDateTime(entry.timestamp)}</p>
                          </div>
                          <div className="rounded-full border border-black/10 bg-black px-3 py-1 text-xs font-black text-white">
                            -{entry.cost}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[18px] border border-dashed border-black/12 bg-black/[0.02] px-4 py-5 text-sm text-black/55">
                      Belum ada transaksi token. Klaim token harian dulu lalu mulai tukar item.
                    </div>
                  )}
                </div>
              </CardFrame>
            </aside>
          </div>
        </div>
      </section>

      {popup.kind !== "none" ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/55 px-4 py-6 backdrop-blur-sm"
          onClick={() => setPopup({ kind: "none" })}
          role="presentation"
        >
          {popup.kind === "detail" ? (
            <div
              className="w-full max-w-3xl overflow-hidden rounded-[28px] border border-black/8 bg-white shadow-[0_30px_90px_rgba(0,0,0,0.25)]"
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label={popup.item.title}
            >
              <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="relative min-h-[260px] bg-black/[0.02]">
                  <Image
                    src={popup.item.image}
                    alt={popup.item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>

                <div className="flex flex-col">
                  <div className="border-b border-black/8 px-5 py-4">
                    <p className="text-[10px] uppercase tracking-[0.34em] text-black/35">{popup.item.category}</p>
                    <h3 className="mt-2 font-sans text-2xl font-black uppercase tracking-[0.06em] text-black">
                      {popup.item.title}
                    </h3>
                  </div>

                  <div className="flex-1 space-y-4 px-5 py-4">
                    <p className="text-sm leading-6 text-black/65">{popup.item.description}</p>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <ItemBadge>Reward {popup.item.reward}</ItemBadge>
                      <ItemBadge>Cost {formatTokenNumber(popup.item.cost)} token</ItemBadge>
                    </div>

                    <div className="rounded-[20px] border border-black/8 bg-black/[0.02] px-4 py-3">
                      <p className="text-[10px] uppercase tracking-[0.32em] text-black/35">How it works</p>
                      <p className="mt-2 text-sm leading-6 text-black/60">
                        Pilih beli untuk membuka popup konfirmasi. Kalau token cukup, item akan langsung masuk ke
                        wallet dan histori transaksi.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 border-t border-black/8 px-5 py-4">
                    <button
                      type="button"
                      onClick={() => setPopup({ kind: "none" })}
                      className="inline-flex h-11 flex-1 items-center justify-center rounded-2xl border border-black/10 bg-white px-4 text-sm font-semibold text-black/75 transition hover:bg-black/[0.03]"
                    >
                      Tutup
                    </button>
                    <button
                      type="button"
                      onClick={() => setPopup({ kind: "confirm", item: popup.item })}
                      className="inline-flex h-11 flex-1 items-center justify-center rounded-2xl bg-black px-4 text-sm font-semibold text-white transition hover:opacity-90"
                    >
                      {formatTokenNumber(popup.item.cost)} DBA TOKEN
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : popup.kind === "confirm" ? (
            <div
              className="w-full max-w-lg overflow-hidden rounded-[28px] border border-black/8 bg-white shadow-[0_30px_90px_rgba(0,0,0,0.25)]"
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label={`Konfirmasi ${popup.item.title}`}
            >
              <div className="border-b border-black/8 px-5 py-4">
                <p className="text-[10px] uppercase tracking-[0.34em] text-black/35">Konfirmasi pembelian</p>
                <h3 className="mt-2 font-sans text-2xl font-black uppercase tracking-[0.06em] text-black">
                  {popup.item.title}
                </h3>
              </div>

              <div className="space-y-4 px-5 py-4">
                <div className="rounded-[20px] border border-black/8 bg-black/[0.02] px-4 py-3">
                  <p className="text-sm leading-6 text-black/65">
                    Kamu akan menukar <span className="font-semibold text-black">{formatTokenNumber(popup.item.cost)} token</span>{" "}
                    untuk mendapatkan <span className="font-semibold text-black">{popup.item.reward}</span>.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <ItemBadge>Saldo {formatTokenNumber(wallet.balance)} token</ItemBadge>
                  <ItemBadge>Kebutuhan {formatTokenNumber(popup.item.cost)} token</ItemBadge>
                </div>
              </div>

              <div className="flex gap-3 border-t border-black/8 px-5 py-4">
                <button
                  type="button"
                  onClick={() => setPopup({ kind: "none" })}
                  className="inline-flex h-11 flex-1 items-center justify-center rounded-2xl border border-black/10 bg-white px-4 text-sm font-semibold text-black/75 transition hover:bg-black/[0.03]"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => purchaseItem(popup.item)}
                  className="inline-flex h-11 flex-1 items-center justify-center rounded-2xl bg-black px-4 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Konfirmasi
                </button>
              </div>
            </div>
          ) : (
            <div
              className={`w-full max-w-md overflow-hidden rounded-[28px] border shadow-[0_30px_90px_rgba(0,0,0,0.25)] ${
                popup.status === "success" ? "border-black/8 bg-white" : "border-black/8 bg-white"
              }`}
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label={popup.title}
            >
              <div className="border-b border-black/8 px-5 py-4">
                <p className="text-[10px] uppercase tracking-[0.34em] text-black/35">
                  {popup.status === "success" ? "Pembelian berhasil" : "Pembelian gagal"}
                </p>
                <h3 className="mt-2 font-sans text-2xl font-black uppercase tracking-[0.06em] text-black">
                  {popup.title}
                </h3>
              </div>

              <div className="px-5 py-4">
                <p className="text-sm leading-6 text-black/65">{popup.description}</p>
              </div>

              <div className="border-t border-black/8 px-5 py-4">
                <button
                  type="button"
                  onClick={() => setPopup({ kind: "none" })}
                  className="inline-flex h-11 w-full items-center justify-center rounded-2xl bg-black px-4 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Tutup
                </button>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </main>
  );
}
