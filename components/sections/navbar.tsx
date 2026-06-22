"use client";

import Link from "next/link"; 
import { useEffect, useState, useRef, type ReactNode } from "react"; 
import { usePathname } from "next/navigation";

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
    label: "Login",
    href: "/login",
    icon: (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2v-2"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M14 12H4m0 0 3-3m-3 3 3 3"
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
  const [isCollapsed, setIsCollapsed] = useState(() => { 
    if (typeof window === "undefined") { 
      return false; 
    } 

    return localStorage.getItem("sidebar-collapsed") === "true"; 
  }); 
  const pathname = usePathname();

  // Floating mobile bubble gesture state
  const [bubbleX, setBubbleX] = useState(16);
  const [bubbleY, setBubbleY] = useState(250);
  const [isDragging, setIsDragging] = useState(false);
  const [isRadialOpen, setIsRadialOpen] = useState(false);
  
  const dragStartX = useRef(0);
  const dragStartY = useRef(0);
  const elementStartX = useRef(0);
  const elementStartY = useRef(0);
  const hasDragged = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    dragStartX.current = e.touches[0].clientX;
    dragStartY.current = e.touches[0].clientY;
    elementStartX.current = bubbleX;
    elementStartY.current = bubbleY;
    hasDragged.current = false;
    setIsRadialOpen(false); // Close radial menu on drag start
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - dragStartX.current;
    const diffY = currentY - dragStartY.current;

    if (Math.abs(diffX) > 5 || Math.abs(diffY) > 5) {
      hasDragged.current = true;
    }

    let newX = elementStartX.current + diffX;
    let newY = elementStartY.current + diffY;

    // Constrain position to visible screen range
    const screenWidth = typeof window !== "undefined" ? window.innerWidth : 360;
    const screenHeight = typeof window !== "undefined" ? window.innerHeight : 800;
    newX = Math.max(8, Math.min(screenWidth - 56, newX));
    newY = Math.max(80, Math.min(screenHeight - 100, newY));
    
    setBubbleX(newX);
    setBubbleY(newY);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    
    // Snap to nearest horizontal edge (left or right side)
    const screenWidth = typeof window !== "undefined" ? window.innerWidth : 360;
    const isLeftHalf = bubbleX < screenWidth / 2;
    
    if (isLeftHalf) {
      setBubbleX(16);
    } else {
      setBubbleX(screenWidth - 64); // width of bubble (48px) + offset (16px) = 64px from right boundary
    }
  };

  const handleBubbleClick = (e: React.MouseEvent) => {
    if (!hasDragged.current) {
      e.stopPropagation();
      setIsRadialOpen((prev) => !prev);
    }
  };

  // Radial menu item labels and filtering
  const radialLabels = ["Home", "Profile", "Friends", "Leaderboard"];
  const radialItems = navItems.filter((item) => radialLabels.includes(item.label));

  // Radial positions calculation with edge adjustments to prevent overflow
  const getRadialPositions = () => {
    const screenWidth = typeof window !== "undefined" ? window.innerWidth : 360;
    const screenHeight = typeof window !== "undefined" ? window.innerHeight : 800;
    const isLeft = bubbleX < screenWidth / 2;
    const R = 80; // Radial distance from main bubble center

    let baseAngle = isLeft ? 0 : Math.PI;

    // Shift arc center if bubble is near top or bottom to keep items on-screen
    const marginY = 140;
    if (bubbleY < marginY) {
      baseAngle += isLeft ? Math.PI / 6 : -Math.PI / 6;
    } else if (bubbleY > screenHeight - marginY) {
      baseAngle += isLeft ? -Math.PI / 6 : Math.PI / 6;
    }

    const offsets = [
      -Math.PI / 3, // -60 degrees
      -Math.PI / 9, // -20 degrees
      Math.PI / 9,  // +20 degrees
      Math.PI / 3,  // +60 degrees
    ];

    return offsets.map((offset) => {
      const angle = baseAngle + offset;
      return {
        x: Math.cos(angle) * R,
        y: Math.sin(angle) * R,
      };
    });
  };

  const radialPositions = getRadialPositions();

  // Drawer bubble outline particles state
  interface BubbleParticle {
    id: number;
    x: number;
    y: number;
    size: number;
    tx: number;
    ty: number;
    buttonLabel: string;
  }

  const [particles, setParticles] = useState<BubbleParticle[]>([]);
  const particleIdCounter = useRef(0);

  const spawnClickBubbles = (label: string, e: React.MouseEvent<HTMLElement>) => { 
    const rect = e.currentTarget.getBoundingClientRect(); 
    const clickX = e.clientX - rect.left; 
    const clickY = e.clientY - rect.top; 

    const newParticles: BubbleParticle[] = []; 
    for (let i = 0; i < 8; i++) { 
      particleIdCounter.current += 1; 
      const seed = clickX * 12.9898 + clickY * 78.233 + (i + 1) * 37.719; 
      const pseudoRandom = (offset: number) => { 
        const value = Math.sin(seed + offset) * 10000; 
        return value - Math.floor(value); 
      }; 
      const angle = pseudoRandom(1) * Math.PI * 2; 
      const distance = 25 + pseudoRandom(2) * 35; 

      newParticles.push({ 
        id: particleIdCounter.current, 
        x: clickX, 
        y: clickY, 
        size: 6 + pseudoRandom(3) * 8, 
        tx: Math.cos(angle) * distance, 
        ty: -pseudoRandom(4) * 40 - 20, 
        buttonLabel: label, 
      }); 
    } 

    setParticles((prev) => [...prev, ...newParticles]);

    setTimeout(() => {
      const idsToRemove = newParticles.map((p) => p.id);
      setParticles((prev) => prev.filter((p) => !idsToRemove.includes(p.id)));
    }, 800);
  };

  useEffect(() => { 
    const root = document.documentElement; 
    if (isCollapsed) {
      root.classList.add("sidebar-collapsed");
    } else {
      root.classList.remove("sidebar-collapsed");
    }
  }, [isCollapsed]);

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

  const handleToggleCollapse = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
    localStorage.setItem("sidebar-collapsed", String(collapsed));
  };

  const isLinkActive = (href: string) => {
    if (href === "/#home" || href === "/") {
      return pathname === "/";
    }
    const baseHref = href.split(/[?#]/)[0];
    if (baseHref === "") return false;
    return pathname.startsWith(baseHref);
  };

  const getBadge = (label: string) => {
    if (label === "Friends") return "3";
    if (label === "Marketplace") return "New";
    if (label === "DBA Token") return "HOT";
    return null;
  };

  const renderMenuItem = (item: DrawerItem, isCollapsedView: boolean) => {
    const isActive = item.kind === "link" && isLinkActive(item.href);
    const badge = getBadge(item.label);

    const content = (
      <>
        <svg
          className={`w-5 h-5 shrink-0 transition-colors ${
            isActive
              ? "text-black dark:text-white"
              : "text-black/60 dark:text-white/60 group-hover:text-black dark:group-hover:text-white"
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          {item.icon}
        </svg>
        {!isCollapsedView && (
          <span className="text-sm font-semibold tracking-[0.06em] truncate">
            {item.label}
          </span>
        )}
        {badge && (
          isCollapsedView ? (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-black dark:bg-white animate-pulse" />
          ) : (
            <span className="ml-auto px-2 py-0.5 rounded-md bg-black dark:bg-white text-[9px] font-bold text-white dark:text-black uppercase tracking-wider">
              {badge}
            </span>
          )
        )}

        {/* Floating click bubbles animation wrapper */}
        <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
          {particles
            .filter((p) => p.buttonLabel === item.label)
            .map((p) => (
              <span
                key={p.id}
                style={{
                  left: `${p.x}px`,
                  top: `${p.y}px`,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  "--tx": `${p.tx}px`,
                  "--ty": `${p.ty}px`,
                } as React.CSSProperties}
                className="absolute rounded-full border border-black/15 dark:border-white/30 bg-black/[0.03] dark:bg-white/10 opacity-80 animate-bubble-float pointer-events-none"
              />
            ))}
        </span>
      </>
    );

    const baseClasses = `relative flex items-center gap-3 rounded-2xl transition duration-300 group ${
      isCollapsedView ? "w-12 h-12 justify-center mx-auto" : "px-4 py-3.5 w-full"
    } ${
      isActive
        ? "bg-black/8 dark:bg-white/12 text-black dark:text-white shadow-sm border border-black/8 dark:border-white/10"
        : "text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white"
    }`;

    if (item.kind === "link") {
      const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        spawnClickBubbles(item.label, e);
        setTimeout(() => {
          setIsOpen(false);
        }, 250);
      };

      return (
        <Link
          key={item.label}
          href={item.href}
          onClick={handleLinkClick}
          className={baseClasses}
        >
          {content}
        </Link>
      );
    } else {
      const handleActionClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        spawnClickBubbles(item.label, e);
        setTimeout(() => {
          openDailyLogin();
        }, 250);
      };

      return (
        <button
          key={item.label}
          type="button"
          onClick={handleActionClick}
          className={baseClasses}
        >
          {content}
        </button>
      );
    }
  };

  const generalLabels = ["Home", "Dashboard", "Profile", "Friends", "Leaderboard", "Ranked", "Community"];
  const toolsLabels = ["DBA Token", "Marketplace", "Library", "Terminology", "Token", "Settings", "FAQ"];
  const updatesLabels = ["News", "Events", "Gallery"];

  const generalItems = drawerItems.filter((item) => generalLabels.includes(item.label));
  const toolsItems = drawerItems.filter((item) => toolsLabels.includes(item.label));
  const updatesItems = drawerItems.filter((item) => updatesLabels.includes(item.label));

  const renderSidebarContent = (isCollapsedView: boolean, isMobileView: boolean) => {
    return (
      <div className="flex flex-col h-full bg-white dark:bg-[#121212] text-black dark:text-white">
        {isCollapsedView ? (
          <div className="flex flex-col items-center py-5 shrink-0 border-b border-black/8 dark:border-white/8">
            <button
              type="button"
              onClick={() => handleToggleCollapse(false)}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-black dark:text-white border border-black/10 dark:border-white/10 transition duration-300 cursor-pointer"
              aria-label="Expand sidebar"
            >
              <svg className="w-6 h-6 text-black dark:text-white shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="3" width="8" height="8" rx="2.5" />
                <rect x="13" y="3" width="8" height="8" rx="2.5" />
                <rect x="3" y="13" width="8" height="8" rx="2.5" />
                <rect x="13" y="13" width="8" height="8" rx="2.5" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between px-5 py-4 shrink-0 border-b border-black/8 dark:border-white/8">
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8 text-black dark:text-white shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="3" width="8" height="8" rx="2.5" />
                <rect x="13" y="3" width="8" height="8" rx="2.5" />
                <rect x="3" y="13" width="8" height="8" rx="2.5" />
                <rect x="13" y="13" width="8" height="8" rx="2.5" />
              </svg>
              <span className="font-sans text-[20px] font-black tracking-wider text-black dark:text-white">
                DBARENA
              </span>
            </div>
            {!isMobileView ? (
              <button
                type="button"
                onClick={() => handleToggleCollapse(true)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-black/80 dark:text-white/80 hover:bg-black/10 dark:hover:bg-white/10 hover:text-black dark:hover:text-white transition duration-300 cursor-pointer"
                aria-label="Collapse sidebar"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
                </svg>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-black/80 dark:text-white/80 hover:bg-black/10 dark:hover:bg-white/10 hover:text-black dark:hover:text-white transition duration-300 cursor-pointer"
                aria-label="Close sidebar"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        {isCollapsedView ? (
          <div className="flex flex-col items-center py-4 shrink-0 border-b border-black/8 dark:border-white/8">
            <p className="text-[9px] uppercase tracking-[0.1em] font-semibold text-black/30 dark:text-white/30 mb-1">Stores</p>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-black to-neutral-700 dark:from-white dark:to-neutral-300 text-white dark:text-black flex items-center justify-center font-bold text-base shadow-sm cursor-pointer hover:scale-105 transition duration-300">
              D
            </div>
            <svg className="w-3 h-3 text-black/40 dark:text-white/40 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        ) : (
          <div className="px-4 py-4 shrink-0 border-b border-black/8 dark:border-white/8">
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-black/[0.03] dark:bg-white/5 border border-black/8 dark:border-white/8 cursor-pointer hover:bg-black/[0.06] dark:hover:bg-white/8 transition duration-300">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 shrink-0 rounded-xl bg-gradient-to-tr from-black to-neutral-700 dark:from-white dark:to-neutral-300 text-white dark:text-black flex items-center justify-center font-bold text-base shadow-sm">
                  D
                </div>
                <div className="min-w-0 text-left">
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-black/45 dark:text-white/45">Stores</p>
                  <p className="text-sm font-bold text-black dark:text-white truncate leading-tight">DBARENA</p>
                </div>
              </div>
              <svg className="w-4 h-4 text-black/50 dark:text-white/50 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto no-scrollbar px-3 py-4 space-y-6">
          {generalItems.length > 0 && (
            <div>
              <p className={isCollapsedView ? "text-[9px] uppercase tracking-[0.15em] font-black text-black/25 dark:text-white/25 mb-3 text-center truncate px-1" : "text-[10px] uppercase tracking-[0.2em] font-black text-black/35 dark:text-white/35 mb-2.5 px-4"}>
                General
              </p>
              <nav className="space-y-1">
                {generalItems.map((item) => renderMenuItem(item, isCollapsedView))}
              </nav>
            </div>
          )}

          {toolsItems.length > 0 && (
            <div>
              <p className={isCollapsedView ? "text-[9px] uppercase tracking-[0.15em] font-black text-black/25 dark:text-white/25 mb-3 text-center truncate px-1" : "text-[10px] uppercase tracking-[0.2em] font-black text-black/35 dark:text-white/35 mb-2.5 px-4"}>
                Tools
              </p>
              <nav className="space-y-1">
                {toolsItems.map((item) => renderMenuItem(item, isCollapsedView))}
              </nav>
            </div>
          )}

          {updatesItems.length > 0 && (
            <div>
              <p className={isCollapsedView ? "text-[9px] uppercase tracking-[0.15em] font-black text-black/25 dark:text-white/25 mb-3 text-center truncate px-1" : "text-[10px] uppercase tracking-[0.2em] font-black text-black/35 dark:text-white/35 mb-2.5 px-4"}>
                Updates
              </p>
              <nav className="space-y-1">
                {updatesItems.map((item) => renderMenuItem(item, isCollapsedView))}
              </nav>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile Top Header (Intact) */}
      <header className="sticky top-0 z-50 border-b border-black/8 bg-white/88 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
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
      </header>

      {/* Radial Menu Backdrop Overlay */}
      {isRadialOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/10 dark:bg-black/25 backdrop-blur-[1.5px] transition-all duration-300 animate-in fade-in"
          onClick={() => setIsRadialOpen(false)}
        />
      )}

      {/* Radial Menu Buttons */}
      {radialItems.map((item, index) => {
        const pos = radialPositions[index] || { x: 0, y: 0 };
        return (
          <Link
            key={item.label}
            href={item.href}
            onClick={() => setIsRadialOpen(false)}
            style={{
              left: `${bubbleX + 2}px`,
              top: `${bubbleY + 2}px`,
              transform: isRadialOpen
                ? `translate(${pos.x}px, ${pos.y}px) scale(1)`
                : `translate(0px, 0px) scale(0)`,
              opacity: isRadialOpen ? 1 : 0,
              transitionDelay: isRadialOpen ? `${index * 60}ms` : "0ms",
              pointerEvents: isRadialOpen ? "auto" : "none",
              transitionTimingFunction: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            }}
            className="lg:hidden fixed z-40 w-11 h-11 rounded-full bg-white dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 group"
          >
            <svg className="w-5 h-5 text-black dark:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              {item.icon}
            </svg>
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-black tracking-wider text-black/60 dark:text-white/60 bg-white/95 dark:bg-[#121212]/95 border border-black/5 dark:border-white/5 px-2 py-0.5 rounded-full shadow-sm pointer-events-none uppercase scale-90">
              {item.label}
            </span>
          </Link>
        );
      })}

      {/* Mobile AssistiveTouch Draggable Floating Toggle Widget */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleBubbleClick}
        style={{
          left: `${bubbleX}px`,
          top: `${bubbleY}px`,
        }}
        className={`lg:hidden fixed z-40 w-12 h-12 rounded-full bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10 flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.12)] cursor-pointer select-none active:scale-90 touch-none ${
          isDragging ? "opacity-90 scale-105" : "opacity-60 hover:opacity-90 transition-all duration-300"
        }`}
      >
        <div className="relative w-5 h-5 flex items-center justify-center pointer-events-none">
          <svg
            className={`absolute w-5 h-5 text-black dark:text-white transition-all duration-300 ${
              isRadialOpen ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"
            }`}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <rect x="3" y="3" width="8" height="8" rx="2.5" />
            <rect x="13" y="3" width="8" height="8" rx="2.5" />
            <rect x="3" y="13" width="8" height="8" rx="2.5" />
            <rect x="13" y="13" width="8" height="8" rx="2.5" />
          </svg>
          <svg
            className={`absolute w-5 h-5 text-black dark:text-white transition-all duration-300 ${
              isRadialOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      </div>

      {/* Mobile Drawer (Styled as a floating iOS Card sheet) */}
      <div
        className={`lg:hidden fixed inset-0 z-[60] transition duration-300 ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!isOpen}
      >
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
          aria-label="Close navigation overlay"
        />

        <aside
          className={`absolute left-4 top-4 bottom-4 flex w-[calc(100vw-32px)] max-w-[288px] flex-col bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10 rounded-[24px] shadow-2xl transition duration-300 ${
            isOpen ? "translate-x-0 opacity-100" : "-translate-x-[110%] opacity-0"
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          {renderSidebarContent(false, true)}
        </aside>
      </div>

      {/* Desktop Sidebar (Floating Card) */}
      <aside
        className={`hidden lg:flex fixed left-4 top-4 bottom-4 z-50 flex-col bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10 rounded-[24px] shadow-2xl transition-all duration-300 overflow-hidden ${
          isCollapsed ? "w-[88px]" : "w-[288px]"
        }`}
      >
        {renderSidebarContent(isCollapsed, false)}
      </aside>
    </>
  );
}
