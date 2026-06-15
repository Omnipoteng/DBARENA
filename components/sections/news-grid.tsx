import type { Post } from "@/types/post";

import NewsCard from "@/components/sections/news-card";

export default function NewsGrid({ posts }: { posts: Post[] }) {
  return (
    <section className="py-4">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm text-black/55">
            Terakhir kali di update
          </p>
          <h2 className="mt-2 font-display text-3xl leading-none  uppercase text-black">
            Berita terbaru
          </h2>
        </div>
        <p className="max-w-lg text-sm leading-none text-black/60">
          Update cepat seputar scan debat, revision tiering, event community,
          dan announcement verse match-up terbaru.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {posts.map((post) => (
          <NewsCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
