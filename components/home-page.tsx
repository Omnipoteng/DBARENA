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
  const { posts } = usePosts();

  return (
    <div className="db-home-shell min-h-screen bg-[radial-gradient(circle_at_top,_rgba(0,0,0,0.06),_transparent_30%),linear-gradient(180deg,_#ffffff_0%,_#f7f7f5_52%,_#efefec_100%)] text-black">
      <Navbar />
      <TopNewsSlider posts={posts} />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-20 sm:px-6 lg:px-8">
        <HeroSection />
        <FeaturedNews post={posts[0]} />
        <NewsGrid posts={posts.slice(1)} />
        <EventsSection />
        <GallerySection />
      </main>
      <Footer />
    </div>
  );
}
