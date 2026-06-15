import Link from "next/link";
import { notFound } from "next/navigation";

import Footer from "@/components/sections/footer";
import Navbar from "@/components/sections/navbar";
import { terminologyItems } from "@/data/terminology";

type TerminologyDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return terminologyItems.map((item) => ({
    id: item.id,
  }));
}

export default async function TerminologyDetailPage({
  params,
}: TerminologyDetailPageProps) {
  const { id } = await params;
  const item = terminologyItems.find((entry) => entry.id === id);

  if (!item) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(0,0,0,0.06),_transparent_28%),linear-gradient(180deg,_#ffffff_0%,_#f7f7f5_54%,_#efefec_100%)] text-black">
      <Navbar />

      <main className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        <Link
          href="/terminology"
          className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-black/55 transition hover:text-black"
        >
          <span aria-hidden="true">&larr;</span>
          Back to Terminology
        </Link>

        <section className="mt-8 rounded-[2rem] border border-black/8 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
            <aside className="rounded-[1.5rem] border border-black/8 bg-black/[0.03] p-5 lg:sticky lg:top-24 lg:self-start">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/40">
                Encyclopedia Entry
              </p>
              <h2 className="mt-3 font-display text-4xl uppercase leading-none text-black">
                {item.term}
              </h2>
              <div className="mt-5 space-y-4 text-sm leading-7 text-black/65">
                <p>
                  Category: <span className="font-medium text-black">Hax</span>
                </p>
                <p>
                  Type:{" "}
                  <span className="font-medium text-black">
                    Battleboarding terminology
                  </span>
                </p>
                <p>
                  Usage:{" "}
                  <span className="font-medium text-black">
                    Debate and scaling reference
                  </span>
                </p>
              </div>
            </aside>

            <div className="space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-black/8 pb-8">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/45">
                    Battleboarding Term
                  </p>
                  <h1 className="mt-3 font-display text-6xl uppercase leading-none text-black sm:text-7xl">
                    {item.term}
                  </h1>
                </div>

                <span className="rounded-full border border-black/10 bg-black px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-white">
                  Hax
                </span>
              </div>

              <p className="max-w-3xl text-sm leading-7 text-black/70">
                {item.definition}
              </p>

              <div className="grid gap-5 lg:grid-cols-2">
                <article className="rounded-2xl border border-black/8 bg-black/[0.03] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/40">
                    Encyclopedia Note
                  </p>
                  <p className="mt-4 text-sm leading-7 text-black/70">
                    {item.debateUse}
                  </p>
                </article>

                <article className="rounded-2xl border border-black/8 bg-white p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/40">
                    Commonly Associated With
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.commonCharacters.map((character) => (
                      <span
                        key={character}
                        className="rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-xs font-medium text-black"
                      >
                        {character}
                      </span>
                    ))}
                  </div>
                </article>
              </div>

              <div className="rounded-2xl border border-black/8 bg-black px-5 py-5 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/50">
                  Reader Note
                </p>
                <p className="mt-3 text-sm leading-7 text-white/75">
                  Encyclopedic entries like this are meant to be quick to scan,
                  but still detailed enough for debate context. If a term has
                  stronger or weaker interpretations, treat this page as a
                  baseline and adjust by verse or source.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
