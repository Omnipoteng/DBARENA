"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function isInternalNavigation(target: HTMLAnchorElement) {
  const href = target.getAttribute("href");

  if (!href) {
    return false;
  }

  if (
    href.startsWith("#") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  ) {
    return false;
  }

  if (target.target === "_blank" || target.hasAttribute("download")) {
    return false;
  }

  try {
    const url = new URL(href, window.location.href);

    return url.origin === window.location.origin;
  } catch {
    return false;
  }
}

function PageTransitionLoaderContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentUrl = `${pathname}?${searchParams.toString()}`;
  const previousUrlRef = useRef(currentUrl);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const anchor = target.closest("a");

      if (!(anchor instanceof HTMLAnchorElement)) {
        return;
      }

      if (!isInternalNavigation(anchor)) {
        return;
      }

      setIsVisible(true);
    };

    const handlePopState = () => {
      setIsVisible(true);
    };

    document.addEventListener("click", handleClick, true);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    const previousUrl = previousUrlRef.current;
    previousUrlRef.current = currentUrl;

    if (!isVisible || previousUrl === currentUrl) {
      return;
    }

    const timer = window.setTimeout(() => {
      setIsVisible(false);
    }, 180);

    return () => window.clearTimeout(timer);
  }, [currentUrl, isVisible]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-[rgba(247,247,245,0.92)] backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div
          className="h-14 w-14 animate-spin rounded-full border-4 border-black/10 border-t-black"
          aria-hidden="true"
        />
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/45">
          Tunggu sebentar...
        </p>
      </div>
    </div>
  );
}

export default function PageTransitionLoader() {
  return (
    <Suspense fallback={null}>
      <PageTransitionLoaderContent />
    </Suspense>
  );
}
