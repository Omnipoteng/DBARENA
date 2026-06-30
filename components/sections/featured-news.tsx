import Image from "next/image";
import Link from "next/link";

import type { Post } from "@/types/post";
import { normalizeImageSrc } from "@/lib/image";

export default function FeaturedNews({ post }: { post?: Post }) {
  if (!post) {
    return null;
  }

  return (
    <section id="news" className="py-2">
      <div className="mb-5 grid gap-3 border-b border-black/10 pb-5 lg:grid-cols-[0.7fr_1fr] lg:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-black/42">
            Highlight
          </p>
          <h2 className="mt-2 font-display text-4xl leading-none uppercase text-black sm:text-5xl">
            Update utama
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-black/58 lg:justify-self-end">
          Pembaruan utama bisa anda lihat disini, ikuti kami untuk pembaruan lainnya.
        </p>
      </div>

      <Link
        href={`/news/${post.id}`}
        className="group block border-b border-black/10 pb-8 transition duration-300"
      >
        <article className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="relative min-h-[280px] overflow-hidden border border-black/10 bg-white sm:min-h-[360px] lg:min-h-[430px]">
            <Image
              src={normalizeImageSrc(post.image)}
              alt={post.title}
              fill
              sizes="(max-width: 1024px) 100vw, 760px"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          </div>
          <div className="flex flex-col justify-end">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/45">
              {post.date}
            </p>
            <h3 className="mt-4 font-display text-4xl leading-[0.95] uppercase text-black sm:text-5xl">
              {post.title}
            </h3>
            <p className="mt-5 text-sm leading-7 text-black/62 sm:text-base">
              {post.description}
            </p>
            <span className="mt-7 inline-flex h-9 w-fit items-center justify-center border border-black bg-black px-4 text-xs font-semibold uppercase tracking-[0.14em] text-white transition group-hover:bg-white group-hover:text-black">
              Baca highlight
            </span>
          </div>
        </article>
      </Link>
    </section>
  );
}
