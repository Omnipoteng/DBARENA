"use client";

import type { Post } from "@/types/post";

import NewsCard from "@/components/sections/news-card";
import ScrollStack, { ScrollStackItem } from "@/components/scroll-stack";

export default function NewsGrid({ posts }: { posts: Post[] }) {
  return (
    <section className="py-2">
      <div className="sticky md:static top-[72px] z-20 mb-5 grid gap-3 border-b border-black/10 bg-[#f8f8f6] pb-5 pt-4 lg:grid-cols-[0.8fr_1fr] lg:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-black/42">
            Terakhir kali di update
          </p>
          <h2 className="mt-2 font-display text-4xl leading-none uppercase text-black sm:text-5xl">
            Berita terbaru
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-black/58 lg:justify-self-end">
          Update cepat seputar scan debat, revision tiering, event community,
          dan announcement verse match-up terbaru.
        </p>
      </div>

      <div className="block md:hidden">
        <ScrollStack
          useWindowScroll={true}
          itemStackDistance={20}
          stackPosition="30%"
          scaleEndPosition="10%"
          baseScale={0.9}
          className="!h-auto !overflow-visible"
          onStackComplete={() => console.log("Semua kartu berita selesai ditumpuk!")}
        >
          {posts.map((post) => (
            <ScrollStackItem 
              key={post.id} 
              itemClassName="bg-white !p-4 !h-auto !my-4 !shadow-[0_10px_30px_rgba(0,0,0,0.05)] !rounded-3xl border border-black/10"
            >
              <NewsCard post={post} />
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </div>

      <div className="hidden md:grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {posts.map((post) => (
          <NewsCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
