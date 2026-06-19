"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";

const navItems = [
  {
    label: "Home",
    href: "/#home",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 10.5 12 3l9 7.5M5.25 9.75V21h13.5V9.75"
      />
    ),
  },
  {
    label: "Profile",
    href: "/profile",
    icon: (
      <>
        <circle cx="12" cy="9" r="3.5" strokeWidth={2} fill="none" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5.5 19a6.5 6.5 0 0 1 13 0"
        />
      </>
    ),
  },
  {
    label: "Friends",
    href: "/friends",
    icon: (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20a4 4 0 0 0-8 0"
        />
        <circle cx="9" cy="9" r="3.25" strokeWidth={2} fill="none" />
        <circle cx="17" cy="10" r="2.75" strokeWidth={2} fill="none" />
      </>
    ),
  },
  {
    label: "Settings",
    href: "/settings",
    icon: (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.5 4h3l.5 2.2a6.5 6.5 0 0 1 1.4.8l2.2-.8 1.5 2.6-1.7 1.6c.1.3.1.6.1.9s0 .6-.1.9l1.7 1.6-1.5 2.6-2.2-.8a6.5 6.5 0 0 1-1.4.8L13.5 20h-3l-.5-2.2a6.5 6.5 0 0 1-1.4-.8l-2.2.8-1.5-2.6 1.7-1.6a5 5 0 0 1 0-1.8L5 10.2l1.5-2.6 2.2.8a6.5 6.5 0 0 1 1.4-.8L10.5 4Z"
        />
        <circle cx="12" cy="12" r="2.5" strokeWidth={2} fill="none" />
      </>
    ),
  },
  {
    label: "Leaderboard",
    href: "/leaderboard",
    icon: (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 20h16"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 20V11h3v9M14 20V8h3v12"
        />
      </>
    ),
  },
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 5h16v14H4z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 9h8M8 13h5"
        />
      </>
    ),
  },
  {
    label: "Token",
    href: "/token",
    icon: (
      <>
        <circle cx="12" cy="12" r="8" strokeWidth={2} fill="none" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8.5 12h7M12 8.5v7"
        />
      </>
    ),
  },
  {
    label: "Library",
    href: "/library",
    icon: (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.5 6.5A2.5 2.5 0 0 1 7 4h11a1 1 0 0 1 1 1v14a1 1 0 0 0-1-1H7a2.5 2.5 0 0 0-2.5 2.5v-14Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 4v15"
        />
      </>
    ),
  },
  {
    label: "Terminology",
    href: "/terminology",
    icon: (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h10M4 18h14"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 15l3 3-3 3"
        />
      </>
    ),
  },
  {
    label: "News",
    href: "/#news",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 6h13M8 12h13M8 18h13M4 6h.01M4 12h.01M4 18h.01"
      />
    ),
  },
  {
    label: "Events",
    href: "/#events",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3m8 4V3M4 11h16M5 5h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
      />
    ),
  },
  {
    label: "Gallery",
    href: "/#gallery",
    icon: (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="m8 14 2.5-3 3 4 2-2.5L18 16H6l2-2Z"
        />
      </>
    ),
  },
  {
    label: "Community",
    href: "/#community",
    icon: (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20a4 4 0 0 0-8 0"
        />
        <circle cx="12" cy="9" r="4" strokeWidth={2} fill="none" />
      </>
    ),
  },
  {
    label: "Marketplace",
    href: "/marketplace",
    icon: (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 7h18l-2 10H5L3 7Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7a4 4 0 0 1 8 0"
        />
      </>
    ),
  },
  {
    label: "FAQ",
    href: "/faq",
    icon: (
      <>
        <circle cx="12" cy="12" r="8" strokeWidth={2} fill="none" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.5 9a2.5 2.5 0 1 1 3.6 2.2c-.9.5-1.6 1.1-1.6 2.3"
        />
        <circle cx="12" cy="17" r="1" strokeWidth={0} fill="currentColor" />
      </>
    ),
  },
  {
    label: "Ranked",
    href: "/ranked",
    icon: (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 3 9.5 8H4l4 4-1.5 6L12 15l5.5 3-1.5-6 4-4h-5.5L12 3Z"
        />
      </>
    ),
  },
];

type DrawerItem =
  | {
      kind: "link";
      label: string;
      href: string;
      icon: ReactNode;
    }
  | {
      kind: "action";
      label: string;
      icon: ReactNode;
    };

const drawerItems: DrawerItem[] = [
  ...navItems.map((item) => ({ kind: "link" as const, ...item })),
  {
    kind: "action",
    label: "DBA Token",
    icon: (
      <>
        <circle cx="12" cy="12" r="8" strokeWidth={2} fill="none" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8.5 12h7M12 8.5v7"
        />
      </>
    ),
  },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "";
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const openDailyLogin = () => {
    window.dispatchEvent(new Event("open-daily-login"));
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-black/8 bg-white/88 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center transition duration-300 hover:opacity-70"
        >
          <span className="font-sans text-[18px] font-black text-black sm:text-[20px]">
            DBARENA
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-[14px] border border-black/10 bg-white text-black shadow-[0_8px_24px_rgba(0,0,0,0.05)] transition duration-300 hover:scale-105 hover:bg-black hover:text-white"
          aria-expanded={isOpen}
          aria-label="Toggle navigation menu"
        >
          <span className="flex flex-col gap-1.5">
            <span
              className={`block h-0.5 w-5 bg-current transition duration-300 ${
                isOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-current transition duration-300 ${
                isOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-current transition duration-300 ${
                isOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      <div
        className={`fixed inset-0 z-[60] transition duration-300 ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!isOpen}
      >
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="absolute inset-0 bg-black/35 backdrop-blur-[2px]"
          aria-label="Close navigation overlay"
        />

        <aside
          className={`absolute left-0 top-0 flex h-[100dvh] w-[82vw] max-w-sm flex-col overflow-y-auto border-r border-black/8 bg-white shadow-2xl transition duration-300 sm:w-[22rem] ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div className="border-b border-black/8 px-5 py-4">
            <div className="flex items-center gap-3 border border-black/8 bg-black/[0.03] px-3 py-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-black/10 bg-white">
                <Image
                  src="/images/staff/staff-1.svg"
                  alt="DBA profile avatar"
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-black">DBA Reign</p>
                <p className="truncate text-xs uppercase tracking-[0.2em] text-black/45">
                  @dba.reign
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-full bg-black px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
                    Legend
                  </span>
                  <span className="rounded-full border border-black/10 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-black/65">
                    Legend Border
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3 rounded-2xl border border-black/8 bg-black/[0.02] px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.3em] text-black/35">Token wallet</p>
              <p className="mt-2 text-sm font-semibold text-black">DBA Token tersedia dari login harian</p>
            </div>
          </div>

          <nav className="flex flex-1 flex-col px-4 py-4 pb-8">
            {drawerItems.map((item, index) =>
              item.kind === "link" ? (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center rounded-2xl px-4 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-black transition duration-300 hover:bg-black/5 ${
                    index === 0 ? "bg-black/5" : ""
                  }`}
                >
                  <svg
                    className="mr-3 h-5 w-5 shrink-0 text-black/60"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    {item.icon}
                  </svg>
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.label}
                  type="button"
                  onClick={openDailyLogin}
                  className="flex items-center rounded-2xl px-4 py-4 text-left text-sm font-semibold uppercase tracking-[0.16em] text-black transition duration-300 hover:bg-black/5"
                >
                  <svg
                    className="mr-3 h-5 w-5 shrink-0 text-black/60"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    {item.icon}
                  </svg>
                  {item.label}
                </button>
              ),
            )}
          </nav>
        </aside>
      </div>
    </header>
  );
}
