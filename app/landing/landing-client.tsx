"use client";

import dynamic from "next/dynamic";

const HomePage = dynamic(() => import("@/components/home-page"), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#f4f4f2]" />,
});

export default function LandingClient() {
  return <HomePage />;
}
