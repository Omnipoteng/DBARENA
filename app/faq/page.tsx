import Footer from "@/components/sections/footer";
import Navbar from "@/components/sections/navbar";
import Link from "next/link";

const faqGroups = [
  {
    title: "Umum",
    items: [
      {
        question: "Apa itu DBARENA?",
        answer:
          "DBARENA adalah pusat komunitas battleboarding untuk berita, event, terminology, library thread, dan layanan marketplace.",
      },
      {
        question: "Bagaimana cara melihat update terbaru?",
        answer:
          "Gunakan slider berita di beranda, grid news, dan section event untuk mengikuti update yang sedang aktif di seluruh situs.",
      },
      {
        question: "Apakah situs ini sudah memakai database?",
        answer:
          "Belum sepenuhnya. Saat ini sebagian besar data masih disimpan lokal dulu supaya layout, alur upload, dan preview bisa dibangun lebih cepat sebelum backend masuk.",
      },
    ],
  },
  {
    title: "Library",
    items: [
      {
        question: "Bagaimana cara kerja library?",
        answer:
          "Library fokus pada stat sheet karakter seperti attack potency, speed, durability, stamina, range, intelligence, dan bukti pendukungnya.",
      },
      {
        question: "Apakah bisa upload bukti foto per kategori?",
        answer:
          "Bisa. Dashboard memang disusun supaya tiap kategori stat bisa punya penjelasan dan bukti foto sendiri agar thread tetap rapi dan mudah ditinjau.",
      },
      {
        question: "Kenapa halaman detail library dibuat panjang?",
        answer:
          "Karena format battleboarding biasanya butuh penjelasan detail, scaling chain, dan evidence, jadi halaman detail dibuat seperti thread yang lengkap, bukan ringkasan singkat.",
      },
    ],
  },
  {
    title: "Marketplace",
    items: [
      {
        question: "Bagaimana cara memesan layanan?",
        answer:
          "Pesanan marketplace diatur dulu di UI, lalu diarahkan ke WhatsApp supaya request bisa diproses manual untuk saat ini.",
      },
      {
        question: "Layanan apa saja yang tersedia saat ini?",
        answer:
          "Saat ini tersedia jasa judgement dan jasa editing, dengan opsi paket yang bisa dipilih sesuai kebutuhan layanan.",
      },
      {
        question: "Apakah pembayaran sudah otomatis?",
        answer:
          "Belum. Untuk sekarang alurnya masih manual melalui WhatsApp. Nanti kalau backend dan payment flow sudah siap, baru bisa dibuat lebih otomatis.",
      },
    ],
  },
  {
    title: "Dashboard",
    items: [
      {
        question: "Siapa yang bisa memakai dashboard?",
        answer:
          "Dashboard disusun untuk anggota tim dengan role berbeda, seperti admin, editor, scaler, dan moderator.",
      },
      {
        question: "Apakah upload bisa disetujui dulu sebelum tampil?",
        answer:
          "Bisa. Struktur dashboard sekarang sudah disiapkan untuk approval flow, tinggal disambungkan ke backend dan database nanti.",
      },
      {
        question: "Kenapa ada preview di dashboard?",
        answer:
          "Preview dipasang supaya kamu bisa mengecek hasil upload sebelum disambungkan ke database, jadi layout dan isi kontennya lebih aman dilihat dulu.",
      },
    ],
  },
  {
    title: "Terminology",
    items: [
      {
        question: "Apa isi halaman terminology?",
        answer:
          "Halaman ini berisi penjelasan istilah battleboarding seperti gravity manipulation, conceptual manipulation, existence erasure, dan istilah lain yang sering muncul di debat.",
      },
      {
        question: "Kenapa istilah dibagi jadi halaman ringkas dan detail?",
        answer:
          "Supaya index utama tetap cepat dibaca, sedangkan penjelasan panjang dan contoh karakter bisa dibuka di halaman detail masing-masing.",
      },
      {
        question: "Apakah istilah bisa dicari?",
        answer:
          "Bisa. Di halaman terminology sudah ada search agar kamu bisa cepat menemukan istilah yang ingin dibuka.",
      },
    ],
  },
  {
    title: "Profile",
    items: [
      {
        question: "Kenapa halaman profil dibuat seperti aplikasi mobile?",
        answer:
          "Karena kamu minta tampilannya lebih premium dan dekat ke referensi profile app, jadi profil dibuat lebih terasa seperti layar aplikasi daripada halaman web biasa.",
      },
      {
        question: "Apakah profil ini bisa dipakai untuk role lain?",
        answer:
          "Bisa. Struktur profilnya bisa dikembangkan nanti untuk editor, scaler, moderator, atau role lain dengan data yang berbeda.",
      },
      {
        question: "Apakah profil ini sudah terhubung ke akun asli?",
        answer:
          "Belum. Saat ini masih statis dulu sebagai UI, jadi nanti tinggal kita sambungkan ke login dan database kalau sistem user sudah siap.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#f8f8f7_0%,_#efefec_100%)] text-black">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-[2rem] border border-black/8 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
              Pusat Bantuan
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-black sm:text-5xl">
              Tanya Jawab
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-black/60">
              Jawaban cepat untuk member, contributor, dan siapa pun yang sedang
              menjelajahi DBARENA untuk berita, library, terminology, atau layanan.
            </p>

            <div className="mt-6 rounded-[1.5rem] border border-black/8 bg-black/[0.03] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                Tautan cepat
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  ["Beranda", "/#home"],
                  ["Library", "/library"],
                  ["Terminology", "/terminology"],
                  ["Marketplace", "/marketplace"],
                  ["Dashboard", "/dashboard"],
                ].map(([label, href]) => (
                  <Link
                    key={label}
                    href={href}
                    className="rounded-full border border-black/10 bg-white px-3 py-2 text-xs font-medium text-black/65 transition hover:bg-black hover:text-white"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-black/8 bg-black/[0.03] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                Kontak
              </p>
              <p className="mt-2 text-sm leading-7 text-black/60">
                Untuk pertanyaan komunitas, pesanan, atau bantuan upload, gunakan jalur
                Discord atau WhatsApp dari navigasi situs.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            {faqGroups.map((group) => (
              <div
                key={group.title}
                className="rounded-[2rem] border border-black/8 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.05)]"
              >
                <div className="flex items-center justify-between gap-4 border-b border-black/8 pb-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                      {group.title}
                    </p>
                    <h2 className="mt-2 text-xl font-semibold text-black">
                      Pertanyaan umum
                    </h2>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                {group.items.map((item) => (
                    <details
                      key={item.question}
                      className="group rounded-2xl border border-black/8 bg-black/[0.02] p-4"
                    >
                      <summary className="cursor-pointer list-none text-sm font-semibold text-black outline-none">
                        <div className="flex items-center justify-between gap-3">
                          <span>{item.question}</span>
                          <span className="text-lg leading-none text-black/40 transition group-open:rotate-45">
                            +
                          </span>
                        </div>
                      </summary>
                      <p className="mt-3 text-sm leading-7 text-black/65">{item.answer}</p>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
