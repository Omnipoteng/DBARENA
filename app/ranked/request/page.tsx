import Footer from "@/components/sections/footer";
import Navbar from "@/components/sections/navbar";
import Link from "next/link";

export default function RankedRequestPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#f7f7f6_0%,_#efefec_100%)] text-black">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <section className="overflow-hidden border border-black/8 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <div className="border-b border-black/8 bg-[linear-gradient(135deg,_#0f0f10_0%,_#151518_44%,_#f8fafc_44%,_#eef2ff_100%)] px-6 py-6 sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
              Ranked Request
            </p>
            <h1 className="mt-3 font-display text-5xl uppercase leading-none text-black sm:text-6xl">
              Approval flow
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-black/60">
              Halaman ini nanti dipakai untuk mengajukan ranked match, menempelkan link
              debat private, lalu mengirim request ke admin untuk direview.
            </p>
          </div>

          <div className="grid gap-6 px-6 py-6 sm:px-8 lg:grid-cols-[1fr_320px]">
            <div className="border border-black/8 bg-black/[0.03] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                Status
              </p>
              <div className="mt-4 space-y-3">
                {[
                  "Pending: request masuk dan menunggu admin.",
                  "Approved: debat boleh dimulai.",
                  "Completed: hasil dibaca dan rank diperbarui.",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between border-b border-black/8 pb-3 last:border-b-0 last:pb-0"
                  >
                    <span className="text-sm text-black/70">{item}</span>
                    <span className="text-black/35">›</span>
                  </div>
                ))}
              </div>
            </div>

            <aside className="border border-black/8 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                Next step
              </p>
              <p className="mt-3 text-sm leading-7 text-black/65">
                Setelah index ranked ini cocok, kita bisa isi form approval lengkap dengan
                link debat, platform, lawan, dan catatan.
              </p>

              <div className="mt-5 flex flex-col gap-3">
                <Link
                  href="/ranked"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-black/10 bg-white px-5 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
                >
                  Back to Ranked
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-black px-5 text-sm font-semibold text-white transition hover:bg-neutral-800"
                >
                  Open Dashboard
                </Link>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
