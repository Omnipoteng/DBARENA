"use client";

import Image from "next/image";
import Link from "next/link";

import type { Post } from "@/types/post";
import { normalizeImageSrc } from "@/lib/image";

export default function NewsCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/news/${post.id}`}
      className="group block border-b border-black/10 pb-5 transition duration-300"
      aria-label={`Buka ${post.title}`}
    >
      <article className="flex h-full flex-col">
        <div className="relative overflow-hidden border border-black/10 bg-white">
          <Image
            src={normalizeImageSrc(post.image)}
            alt={post.title}
            width={1200}
            height={900}
            className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>

        <div className="flex flex-1 flex-col pt-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-black/42">
            {post.date}
          </p>
          <h3 className="mt-3 text-lg font-semibold leading-6 text-black">{post.title}</h3>
          <p className="mt-3 flex-1 text-sm leading-6 text-black/60">
            {post.description}
          </p>
          <span className="mt-5 inline-flex h-9 items-center justify-center gap-2 border border-black bg-black px-3 text-xs font-semibold uppercase tracking-[0.12em] text-white transition duration-200 group-hover:bg-white group-hover:text-black">
            Baca Selengkapnya
            <svg
              xmlns=""
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </span>
        </div>
      </article>
    </Link>
  );
}
