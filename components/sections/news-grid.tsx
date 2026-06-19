import type { Post } from "@/types/post";

import NewsCard from "@/components/sections/news-card";

export default function NewsGrid({ posts }: { posts: Post[] }) {
  return (
    <section className="py-2">
      <div className="mb-5 grid gap-3 border-b border-black/10 pb-5 lg:grid-cols-[0.8fr_1fr] lg:items-end">
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

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {posts.map((post) => (
          <NewsCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
