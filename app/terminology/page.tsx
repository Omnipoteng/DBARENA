import Footer from "@/components/sections/footer";
import Navbar from "@/components/sections/navbar";
import TerminologyBrowser from "@/components/terminology-browser";
import { terminologyItems } from "@/data/terminology";

export default function TerminologyPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(0,0,0,0.06),_transparent_28%),linear-gradient(180deg,_#ffffff_0%,_#f7f7f5_54%,_#efefec_100%)] text-black">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/45">
            Battleboarding Terminology
          </p>
          <h1 className="mt-3 font-display text-6xl uppercase leading-none text-black sm:text-7xl">
            Terminology
          </h1>
          <p className="mt-4 text-sm leading-5 text-black/65">
            Halaman ini berisi istilah-istilah penting dalam battleboarding.
            Fokusnya bukan cuma definisi, tapi juga bagaimana istilah itu
            dipakai dalam debat dan karakter mana yang sering dikaitkan dengan
            label tersebut.
          </p>
        </div>

        <TerminologyBrowser items={terminologyItems} />

        <div className="mt-10 rounded-[1.75rem] border border-black/8 bg-black px-6 py-6 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
            Notes
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/75">
            Label yang muncul di sini bersifat debat-based. Artinya, satu
            karakter bisa mendapat label tertentu tergantung interpretasi,
            sumber, dan standar scaling yang dipakai komunitas.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
