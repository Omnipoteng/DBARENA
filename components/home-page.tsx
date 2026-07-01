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
  const { posts, newsPosts } = usePosts();

  const sliderPosts = posts.filter((p) => p.origin === "slider");
  const displaySliderPosts = sliderPosts.length > 0 ? sliderPosts : newsPosts;

  // Find custom highlight or default to the newest post
  const highlightPost = newsPosts.find((p) => p.is_highlight) || newsPosts[0];

  // News list excludes highlightPost to prevent duplicates
  const remainingNewsPosts = highlightPost
    ? newsPosts.filter((p) => p.id !== highlightPost.id)
    : newsPosts;

  return (
    <div
      suppressHydrationWarning
      className="db-home-shell min-h-screen bg-[#f4f4f2] text-black"
    >
      <Navbar />
      <TopNewsSlider posts={displaySliderPosts} />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-14 px-4 pb-20 pt-8 sm:px-6 lg:px-8 lg:gap-18 lg:pt-10">
        <HeroSection />
        <FeaturedNews post={highlightPost} />
        <NewsGrid posts={remainingNewsPosts} />
        <EventsSection />
        <GallerySection />
      </main>
      <Footer />
    </div>
  );
}
