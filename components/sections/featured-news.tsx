import Image from "next/image";
import Link from "next/link";

import type { Post } from "@/types/post";

export default function FeaturedNews({ post }: { post?: Post }) {
  if (!post) {
    return null;
  }

  return (
    <section id="news" className="py-4">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm text-black/55">
            Highlight
          </p>
          <h2 className="mt-2 font-display text-3xl leading-none uppercase text-black">
            update
          </h2>
        </div>
        <p className="max-w-lg text-sm leading-none text-black/60">
          Pembaruan utama bisa anda lihat disini, ikuti kami untuk pembaruan lainnya.
        </p>
      </div>

      <Link 
        href={`/news/${post.id}`}
        className="block group relative overflow-hidden rounded-[2rem] border border-black/8 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.12)]"
      >
        <article>
          <Image
          src={post.image}
          alt={post.title}
          width={1200}
          height={900}
          className="h-[420px] w-full object-cover transition duration-500 group-hover:scale-105 group-hover:opacity-90"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(0,0,0,0.08)_0%,_rgba(0,0,0,0.82)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-white/70">
            {post.date}
          </p>
          <h3 className="mt-3 max-w-3xl text-3xl font-semibold text-white sm:text-4xl">
            {post.title}
          </h3>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/72 sm:text-base">
            {post.description}
          </p>
        </div>
        </article>
      </Link>
    </section>
  );
}
