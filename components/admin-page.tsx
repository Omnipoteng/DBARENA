"use client";

import Link from "next/link";
import Image from "next/image";
import { FormEvent, useState } from "react";

import { usePosts } from "@/components/post-store-provider";
import { normalizeImageSrc } from "@/lib/image";

type FormState = {
  title: string;
  description: string;
  image: string;
  date: string;
};

const initialForm: FormState = {
  title: "",
  description: "",
  image: "",
  date: "",
};

export default function AdminPage() {
  const { posts, addPost } = usePosts();
  const [form, setForm] = useState<FormState>(initialForm);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    addPost({
      title: form.title,
      description: form.description,
      image: form.image,
      date: form.date,
    });

    setForm(initialForm);
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(0,0,0,0.06),_transparent_30%),linear-gradient(180deg,_#ffffff_0%,_#f7f7f5_52%,_#efefec_100%)] px-4 py-10 text-black sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <div className="flex items-center justify-between rounded-[2rem] border border-black/8 bg-white/90 px-6 py-5 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur">
          <div>
            <p className="text-sm text-black/55">
              PANEL KONTROL KHUSUS ADMIN
            </p>
            <h1 className="mt-2 font-display text-1xl uppercase text-black">
              DBARENA News Control
            </h1>
          </div>
          <Link
            href="/"
            className="rounded-full border border-black/10 bg-black px-3 py-2 text-sm font-semibold text-white transition duration-300 hover:scale-105 hover:bg-neutral-800"
          >
            kembali
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-[2rem] border border-black/8 bg-white/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur"
          >
            <div className="mb-6">
              <p className="text-sm uppercase tracking-[0.3em] text-black/55">
                post berita
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-black">
                Posting berita terbaru mengenai DBARENA
              </h2>
            </div>

            <div className="grid gap-4">
              <label className="grid gap-2">
                <span className="text-sm font-medium text-black/75">Tambahin judul woy</span>
                <input
                  required
                  value={form.title}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, title: event.target.value }))
                  }
                  className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-black outline-none transition duration-300 placeholder:text-black/35 focus:border-black/40 focus:ring-2 focus:ring-black/10"
                  placeholder="Naruto vs Ichigo Debate Week Begins"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-medium text-black/75">
                  Kasih deskripsi jangan lupa
                </span>
                <textarea
                  required
                  rows={5}
                  value={form.description}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-black outline-none transition duration-300 placeholder:text-black/35 focus:border-black/40 focus:ring-2 focus:ring-black/10"
                  placeholder="Share the latest community development, power scaling updates, or event announcement."
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-medium text-black/75">
                  Image URL or Path
                </span>
                <input
                  required
                  value={form.image}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, image: event.target.value }))
                  }
                  className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-black outline-none transition duration-300 placeholder:text-black/35 focus:border-black/40 focus:ring-2 focus:ring-black/10"
                  placeholder="/images/dbarena-news-1.svg"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-medium text-black/75">Date</span>
                <input
                  required
                  type="date"
                  value={form.date}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, date: event.target.value }))
                  }
                  className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-black outline-none transition duration-300 focus:border-black/40 focus:ring-2 focus:ring-black/10"
                />
              </label>
            </div>

            <button
              type="submit"
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-black px-5 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-white shadow-[0_20px_60px_rgba(15,23,42,0.16)] transition duration-300 hover:scale-105 hover:bg-neutral-800"
            >
              POSTING BERITA
            </button>
          </form>

          <section className="rounded-[2rem] border border-black/8 bg-white/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur">
            <div className="mb-6">
              <p className="text-sm uppercase tracking-[0.3em] text-black/55">
                Ini live previewnya
              </p>
              <h2 className="mt-2 text-1xl font-semibold text-black">
                Posting yang penting penting aja ya ajg, dilihat semua orang soalnya
              </h2>
            </div>

            <div className="grid gap-4">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="rounded-3xl border border-black/8 bg-white p-4 transition duration-300 hover:scale-[1.02] hover:border-black/15 hover:shadow-[0_16px_40px_rgba(15,23,42,0.12)]"
                >
                  <div className="mb-3 overflow-hidden rounded-2xl border border-black/8">
                    <Image
                      src={normalizeImageSrc(post.image)}
                      alt={post.title}
                      width={1200}
                      height={900}
                      className="h-40 w-full object-cover"
                    />
                  </div>
                  <p className="text-xs uppercase tracking-[0.24em] text-black/50">
                    {post.date}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-black">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-black/65">
                    {post.description}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
