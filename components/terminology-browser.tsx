"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { TerminologyItem } from "@/data/terminology";

type TerminologyBrowserProps = {
  items: TerminologyItem[];
};

function getPreview(text: string) {
  const sentence = text.split(".")[0]?.trim();
  return sentence ? `${sentence}.` : text;
}

export default function TerminologyBrowser({ items }: TerminologyBrowserProps) {
  const [query, setQuery] = useState("");

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) return items;

    return items.filter((item) => {
      const haystack = [
        item.term,
        item.definition,
        item.debateUse,
        item.commonCharacters.join(" "),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalized);
    });
  }, [items, query]); 

  return (
    <>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em]">
            Search Term
          </p>
          <p className="mt-2 text-sm leading-5 text-black/60">
            Cari istilah seperti gravity manipulation, conceptual manipulation,
            existence erasure, dan lainnya.
          </p>
        </div>

        <div className="w-full sm:max-w-md">
          <label className="sr-only" htmlFor="terminology-search">
            Search terminology
          </label>
          <input
            id="terminology-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search terminology..."
            className="w-full rounded-full border border-black/10 bg-white px-5 py-3 text-sm text-black outline-none transition placeholder:text-black/30 focus:border-black/40 focus:ring-2 focus:ring-black/10"
          />
        </div>
      </div>

      <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-2">
        {filteredItems.map((item) => (
          <article
            key={item.id}
            className="rounded-[1.75rem] border border-black/8 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(15,23,42,0.1)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/40">
                  Entry
                </p>
                <h2 className="mt-3 font-display text-4xl uppercase leading-none text-black">
                  {item.term}
                </h2>
              </div>

              <span className="rounded-full border border-black/10 bg-black px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-white">
                Hax
              </span>
            </div>

            <p className="mt-5 text-sm leading-7 text-black/70">
              {getPreview(item.definition)}
            </p>

            <div className="mt-6 border-t border-black/8 pt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/40">
                Commonly Associated With
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {item.commonCharacters.slice(0, 3).map((character) => (
                  <span
                    key={character}
                    className="rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-xs font-medium text-black"
                  >
                    {character}
                  </span>
                ))}
              </div>
            </div>

            <Link
              href={`/terminology/${item.id}`}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-black transition hover:bg-black hover:text-white"
            >
              Selengkapnya
              <span aria-hidden="true">→</span>
            </Link>
          </article>
        ))}
      </section>

      {!filteredItems.length ? (
        <div className="mt-8 rounded-[1.75rem] border border-black/8 bg-black px-6 py-6 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/70">
            No results
          </p>
          <p className="mt-2 text-sm leading-7 text-white/70">
            Coba kata kunci lain untuk menemukan istilah yang kamu cari.
          </p>
        </div>
      ) : null}
    </>
  );
}
