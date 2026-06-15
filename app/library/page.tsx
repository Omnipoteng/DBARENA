import Image from "next/image";
import Link from "next/link";

import Footer from "@/components/sections/footer";
import Navbar from "@/components/sections/navbar";
import { libraryCharacters } from "@/data/library";

export default function LibraryPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(0,0,0,0.06),_transparent_28%),linear-gradient(180deg,_#ffffff_0%,_#f7f7f5_54%,_#efefec_100%)] text-black">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/45">
              Character Library
            </p>
            <h1 className="mt-3 font-display text-6xl uppercase leading-none text-black sm:text-7xl">
              DBA Library
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-black/65">
              Ringkasan singkat karakter battleboarding. Untuk detail lengkap
              per stat seperti attack potency, speed, durability, dan analisis
              scaling, buka halaman selengkapnya.
            </p>
          </div>
        </div>

        <section className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {libraryCharacters.map((character) => (
            <article
              key={character.id}
              className="group rounded-[1.75rem] border border-black/8 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(15,23,42,0.1)]"
            >
              <div className="relative mb-5 aspect-square w-full overflow-hidden rounded-[1.5rem] bg-black/5">
                <Image
                  src={character.image}
                  alt={character.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/40">
                    {character.franchise}
                  </p>
                  <h2 className="mt-3 font-display text-4xl uppercase leading-none text-black">
                    {character.name}
                  </h2>
                </div>

                <span className="rounded-full border border-black/10 bg-black px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-white">
                  {character.tier}
                </span>
              </div>

              <p className="mt-5 text-sm leading-7 text-black/65">
                {character.summary}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-xs font-medium text-black">
                  AP: {character.details[0]?.value}
                </span>
                <span className="rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-xs font-medium text-black">
                  Speed: {character.details[1]?.value}
                </span>
              </div>

              <Link
                href={`/library/${character.id}`}
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-black transition hover:bg-black hover:text-white"
              >
                Selengkapnya
                <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}
