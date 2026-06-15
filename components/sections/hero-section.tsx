import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="grid min-h-[calc(100vh-5rem)] items-center gap-10 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:py-16"
    >
      <div className="max-w-2xl">
        <p className="mb-5 text-sm uppercase leading-none text-black/55">
          DEBATER BATTLE ARENA
        </p>
        <h1 className="font-display text-3xl leading-none text-black sm:text-6xl lg:text-7xl">
          WELCOME TO DBARENA
        </h1>
        <p className="mt-6 max-w-xl text-base leading-[1] text-black/68 sm:text-lg">
          DBARENA adalah arena kompetitif yang didesain untuk menguji, mengukur, dan menunjukan kapasitas seorang debater dalam menyusun argumen, retrorika, dan ketepatan logika.
        </p>

        <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/#news"
            className="inline-flex items-center justify-center rounded-full border border-black bg-black px-4 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:opacity-90"
          >
            Lihat News
          </Link>
          <Link
            href="/ranked"
            className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-black transition duration-300 hover:-translate-y-0.5 hover:bg-black hover:text-white"
          >
            Masuk Ranked
          </Link>
          <Link
            href="/library"
            className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-black transition duration-300 hover:-translate-y-0.5 hover:bg-black hover:text-white"
          >
            Buka Library
          </Link>
          <Link
            href="/token"
            className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-black transition duration-300 hover:-translate-y-0.5 hover:bg-black hover:text-white"
          >
            Klaim Token
          </Link>
        </div>
      </div>

      <div className="relative">
        <div className="absolute -inset-4 rounded-[2.5rem] bg-[radial-gradient(circle,_rgba(0,0,0,0.08),_transparent_60%)] blur-2xl" />
        <div className="relative overflow-hidden rounded-[2rem] border border-black/8 bg-white p-3 shadow-[0_30px_100px_rgba(15,23,42,0.12)]">
          <div className="relative overflow-hidden rounded-[1.5rem]">
            <Image
              src="/images/logo-dba.png"
              alt="DBARENA anime battle hero banner"
              width={1600}
              height={1200}
              priority
              className="h-[460px] w-full object-cover transition duration-500 hover:scale-105 hover:opacity-90"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(255,255,255,0)_0%,_rgba(0,0,0,0.62)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-white/70">
                dbarena update
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Bersiaplah untuk menerima pembaruan dari kami dalam waktu dekat
              </h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
