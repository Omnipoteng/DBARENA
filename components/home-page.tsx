"use client";

import EventsSection from "@/components/sections/events-section";
import FeaturedNews from "@/components/sections/featured-news";
import Footer from "@/components/sections/footer";
import GallerySection from "@/components/sections/gallery-section";
import HeroSection from "@/components/sections/hero-section";
import Navbar from "@/components/sections/navbar";
import NewsGrid from "@/components/sections/news-grid";
import TopNewsSlider from "@/components/sections/top-news-slider";
import { usePosts } from "@/components/post-store-provider";

export default function HomePage() {
  const { newsPosts } = usePosts();

  return (
    <div
      suppressHydrationWarning
      className="db-home-shell min-h-screen bg-[#f4f4f2] text-black"
    >
      <Navbar />
      <TopNewsSlider posts={newsPosts} />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-14 px-4 pb-20 pt-8 sm:px-6 lg:px-8 lg:gap-18 lg:pt-10">
        <HeroSection />
        <FeaturedNews post={newsPosts[0]} />
        <NewsGrid posts={newsPosts.slice(1)} />
        <EventsSection />
        <GallerySection />
      </main>
      <Footer />
    </div>
  );
}
