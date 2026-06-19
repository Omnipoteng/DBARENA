import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative overflow-hidden border-y border-black/12 bg-black text-white"
    >
      <Image
        src="/images/logo-dba.png"
        alt="DBARENA battle arena"
        fill
        priority
        sizes="(max-width: 1280px) 100vw, 1280px"
        className="object-cover opacity-42 grayscale"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,_rgba(0,0,0,0.92)_0%,_rgba(0,0,0,0.68)_48%,_rgba(0,0,0,0.18)_100%)]" />

      <div className="relative grid min-h-[420px] content-end px-4 py-8 sm:px-6 sm:py-10 lg:min-h-[520px] lg:px-8 lg:py-12">
        <div className="max-w-3xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.42em] text-white/55">
            Debater Battle Arena
          </p>
          <h1 className="font-display text-5xl leading-[0.9] text-white sm:text-7xl lg:text-8xl">
            WELCOME TO DBARENA
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/72 sm:text-lg">
            Arena kompetitif untuk menguji argumen, logika, ranking, dan reputasi debater dalam ekosistem battleboarding DBA.
          </p>
        </div>

        <div className="mt-7 flex max-w-4xl flex-wrap items-center gap-2">
          <Link
            href="/#news"
            className="inline-flex h-9 items-center justify-center border border-white bg-white px-3 text-xs font-semibold uppercase tracking-[0.12em] text-black transition duration-300 hover:bg-white/88 sm:px-4"
          >
            Lihat News
          </Link>
          <Link
            href="/ranked"
            className="inline-flex h-9 items-center justify-center border border-white/22 bg-white/8 px-3 text-xs font-semibold uppercase tracking-[0.12em] text-white backdrop-blur transition duration-300 hover:bg-white hover:text-black sm:px-4"
          >
            Masuk Ranked
          </Link>
          <Link
            href="/library"
            className="inline-flex h-9 items-center justify-center border border-white/22 bg-white/8 px-3 text-xs font-semibold uppercase tracking-[0.12em] text-white backdrop-blur transition duration-300 hover:bg-white hover:text-black sm:px-4"
          >
            Buka Library
          </Link>
          <Link
            href="/token"
            className="inline-flex h-9 items-center justify-center border border-white/22 bg-white/8 px-3 text-xs font-semibold uppercase tracking-[0.12em] text-white backdrop-blur transition duration-300 hover:bg-white hover:text-black sm:px-4"
          >
            Klaim Token
          </Link>
        </div>
      </div>
    </section>
  );
}
