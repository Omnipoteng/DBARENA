"use client";

import { useState } from "react";

const CONSENT_COOKIE = "dbarena_cookie_consent";
const CONSENT_VALUE = "accepted";
const CONSENT_MAX_AGE = 60 * 60 * 24 * 365;

function readCookie(name: string) {
  if (typeof document === "undefined") {
    return null;
  }

  const cookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${name}=`));

  return cookie ? cookie.split("=").slice(1).join("=") : null;
}

function writeCookie(name: string, value: string, maxAge: number) {
  document.cookie = [
    `${name}=${value}`,
    `Max-Age=${maxAge}`,
    "Path=/",
    "SameSite=Lax",
  ].join("; ");
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(() => {
    if (typeof document === "undefined") {
      return false;
    }

    return readCookie(CONSENT_COOKIE) !== CONSENT_VALUE;
  });

  function acceptAllCookies() {
    writeCookie(CONSENT_COOKIE, CONSENT_VALUE, CONSENT_MAX_AGE);
    setVisible(false);
  }

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[300] px-4 pb-4 sm:px-6 sm:pb-6">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 border border-black/10 bg-white/95 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.18)] backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="max-w-3xl">
          <p className="text-1xl font-semibold uppercase">
            Cookie Notice
          </p>
          <p className="mt-2 text-sm leading-5 text-black/70">
            We use cookies to support essential site features and improve your
            browsing experience.
          </p>
        </div>

        <button
          type="button"
          onClick={acceptAllCookies}
          className="inline-flex shrink-0 items-center justify-center bg-black px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition duration-300 hover:bg-neutral-800"
        >
          Accept All Cookies
        </button>
      </div>
    </div>
  );
}
