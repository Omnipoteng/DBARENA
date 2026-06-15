"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import Footer from "@/components/sections/footer";
import Navbar from "@/components/sections/navbar";
import type { LibraryCharacter, LibraryEvidence } from "@/data/library";

type ActiveEvidence = {
  title: string;
  value: string;
  evidence: LibraryEvidence[];
};

type LibraryDetailClientProps = {
  character: LibraryCharacter;
};

export default function LibraryDetailClient({
  character,
}: LibraryDetailClientProps) {
  const [activeEvidence, setActiveEvidence] =
    useState<ActiveEvidence | null>(null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveEvidence(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!activeEvidence) {
      document.body.style.overflow = "";
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [activeEvidence]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(0,0,0,0.06),_transparent_28%),linear-gradient(180deg,_#ffffff_0%,_#f7f7f5_54%,_#efefec_100%)] text-black">
      <Navbar />

      <main className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        <Link
          href="/library"
          className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-black/55 transition hover:text-black"
        >
          <span aria-hidden="true">&larr;</span>
          Kembali ke Library
        </Link>

        <section className="mt-8 rounded-[2rem] border border-black/8 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[340px_1fr] lg:items-start">
            <div className="relative aspect-square overflow-hidden rounded-[1.75rem] bg-black/5">
              <Image
                src={character.image}
                alt={character.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div>
              <div className="flex flex-col gap-5 border-b border-black/8 pb-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/45">
                      {character.franchise}
                    </p>
                    <h1 className="mt-3 font-display text-6xl uppercase leading-none text-black sm:text-7xl">
                      {character.name}
                    </h1>
                    <p className="mt-4 max-w-3xl text-sm leading-7 text-black/65">
                      {character.summary}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-black/8 bg-black px-4 py-3 text-white">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/50">
                      Tier
                    </p>
                    <p className="mt-2 font-display text-4xl uppercase leading-none">
                      {character.tier}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid gap-5">
                {character.details.map((detail) => (
                  <article
                    key={detail.title}
                    className="rounded-2xl border border-black/8 bg-black/[0.03] p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/40">
                          {detail.title}
                        </p>
                        <h2 className="mt-3 font-display text-4xl uppercase leading-none text-black">
                          {detail.value}
                        </h2>
                      </div>

                      {detail.evidence?.length ? (
                        <button
                          type="button"
                          onClick={() =>
                            setActiveEvidence({
                              title: detail.title,
                              value: detail.value,
                              evidence: detail.evidence ?? [],
                            })
                          }
                          className="shrink-0 rounded-full border border-black/10 bg-white px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-black transition hover:bg-black hover:text-white"
                        >
                          Bukti
                        </button>
                      ) : null}
                    </div>

                    <p className="mt-4 text-sm leading-7 text-black/70">
                      {detail.explanation}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <section className="rounded-2xl border border-black/8 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/40">
                Abilities / Hax
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {character.abilities.map((ability) => (
                  <li
                    key={ability}
                    className="rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-xs font-medium text-black"
                  >
                    {ability}
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-black/8 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/40">
                Weakness / Limitations
              </p>
              <p className="mt-4 text-sm leading-7 text-black/70">
                {character.weakness}
              </p>
            </section>
          </div>
        </section>
      </main>

      <Footer />

      {activeEvidence ? (
        <div
          className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-black/70 px-4 py-6 backdrop-blur-sm sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-label={`${activeEvidence.title} evidence`}
          onClick={() => setActiveEvidence(null)}
        >
          <div
            className="w-full max-w-4xl overflow-hidden rounded-[1.5rem] border border-white/10 bg-white shadow-2xl sm:rounded-[2rem]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-black/8 bg-white/95 px-4 py-4 backdrop-blur sm:px-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/40">
                  Evidence
                </p>
                <h3 className="mt-2 font-display text-3xl uppercase leading-none text-black sm:text-4xl">
                  {activeEvidence.title}
                </h3>
                <p className="mt-2 text-sm text-black/60">
                  {activeEvidence.value}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveEvidence(null)}
                className="shrink-0 rounded-full border border-black/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-black transition hover:bg-black hover:text-white"
              >
                Tutup
              </button>
            </div>

            <div className="max-h-[70dvh] overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
              <div className="grid gap-4 sm:grid-cols-2">
              {activeEvidence.evidence.map((item) => (
                <figure
                  key={item.label}
                  className="overflow-hidden rounded-[1.25rem] border border-black/8 bg-black/[0.03]"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={item.image}
                      alt={item.label}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.26em] text-black/40">
                      {item.label}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-black/65">
                      {item.caption}
                    </p>
                  </figcaption>
                </figure>
              ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
