"use client";

import Image from "next/image";
import Link from "next/link";

import type { Post } from "@/types/post";

export default function NewsCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/news/${post.id}`}
      className="group block overflow-hidden rounded-[1.75rem] border border-black/8 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.12)] transition duration-300 hover:-translate-y-1 hover:border-black/15 hover:shadow-[0_24px_80px_rgba(15,23,42,0.14)]"
      aria-label={`Buka ${post.title}`}
    >
      <article className="flex h-full flex-col">
        <div className="relative overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            width={1200}
            height={900}
            className="h-60 w-full object-cover transition duration-500 group-hover:scale-110 group-hover:opacity-85"
          />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,_rgba(0,0,0,0)_10%,_rgba(0,0,0,0.18)_100%)] opacity-0 transition duration-300 group-hover:opacity-100" />
        </div>

        <div className="flex flex-1 flex-col p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-black/50">
            {post.date}
          </p>
          <h3 className="mt-3 text-xl font-semibold text-black">{post.title}</h3>
          <p className="mt-3 flex-1 text-sm leading-7 text-black/65">
            {post.description}
          </p>
          <span className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white transition duration-200 hover:bg-black/80 active:scale-95">
            Baca Selengkapnya
            <svg
              xmlns="http://www.w3.org/2000/svg"
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
