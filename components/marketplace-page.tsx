"use client";

import Footer from "@/components/sections/footer";
import Navbar from "@/components/sections/navbar";
import { products } from "@/data/marketplace";
import { Product } from "@/types/marketplace";
import Image from "next/image";
import { useMemo, useState } from "react";

const WHATSAPP_NUMBER = "6282331663390";

const durationOptions = [
  { label: "Satu kali sesi", value: "1 bulan", price: 10000 },
  { label: "Tiga kali sesi", value: "3 bulan", price: 25000 },
  { label: "Permanen", value: "permanen", price: 50000 },
];

const topicOptions = [
  { label: "Low Topic", value: "low", price: 0 },
  { label: "Mid Topic", value: "mid", price: 5000 },
  { label: "High Topic", value: "high", price: 10000 },
];

const editingOptions = [
  { label: "Per Project", value: "per-project", price: 5000 },
  { label: "Weekly Pass", value: "weekly-pass", price: 25000 },
  { label: "Monthly Pass", value: "monthly-pass", price: 75000 },
];

function formatPrice(price: number) {
  return `Rp ${price.toLocaleString("id-ID")}`;
}

function buildWhatsappUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function ProductCard({
  product,
  onSelect,
}: {
  product: Product;
  onSelect: (product: Product) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(product)}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/8 bg-white text-left shadow-[0_18px_60px_rgba(15,23,42,0.10)] transition duration-300 hover:-translate-y-1 hover:border-black/15 hover:shadow-[0_24px_80px_rgba(15,23,42,0.14)]"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/5">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        {product.badge ? (
          <span className="absolute left-4 top-4 rounded-full bg-black px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
            {product.badge}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-black/45">
          {product.category}
        </p>
        <h2 className="mt-3 text-3xl leading-none text-black">{product.name}</h2>
        <p className="mt-4 flex-1 text-sm leading-7 text-black/62">
          {product.description}
        </p>
        <div className="mt-6 flex items-center justify-between border-t border-black/8 pt-4">
          <span className="text-base font-bold text-black">{product.price}</span>
          <span className="text-sm font-semibold uppercase tracking-[0.16em] text-black/45">
            Pilih
          </span>
        </div>
      </div>
    </button>
  );
}

function JudgementConfigurator({ onClose }: { onClose: () => void }) {
  const [duration, setDuration] = useState(durationOptions[0]);
  const [topic, setTopic] = useState(topicOptions[0]);

  const total = duration.price + topic.price;
  const whatsappMessage = useMemo(
    () =>
      [
        "Halo Lianx, saya ingin order Jasa Judgement.",
        "",
        `Durasi: ${duration.label}`,
        `Topic: ${topic.label}`,
        `Total: ${formatPrice(total)}`,
        "",
        "Mohon info langkah pembayaran dan detail pengerjaannya.",
      ].join("\n"),
    [duration.label, topic.label, total],
  );

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
      <div className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="mb-5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-black/55 transition hover:text-black"
        >
          <span aria-hidden="true">&larr;</span>
          Kembali
        </button>

        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/45">
              Service Configurator
            </p>
            <h2 className="mt-3 text-3xl leading-none text-black sm:text-4xl">
              Price list
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/10 text-black transition hover:bg-black hover:text-white"
            aria-label="Tutup konfigurasi"
          >
            x
          </button>
        </div>

        <div className="mt-6 grid gap-6 sm:mt-8">
          <section>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-black/55">
              Silahkan pilih pesanan
            </p>
            <div className="grid gap-2 sm:grid-cols-3 sm:gap-3">
              {durationOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setDuration(option)}
                  className={`border px-4 py-3 text-left transition duration-300 sm:py-4 ${
                    duration.value === option.value
                      ? "border-black bg-black text-white"
                      : "border-black/10 bg-white text-black hover:border-black/25"
                  }`}
                >
                  <span className="block text-lg font-bold">{option.label}</span>
                  <span className="mt-1 block text-sm opacity-70">
                    {formatPrice(option.price)}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-black/55">
              Topic yang akan di-judge
            </p>
            <div className="grid gap-2 sm:grid-cols-3 sm:gap-3">
              {topicOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTopic(option)}
                  className={`border px-4 py-3 text-left transition duration-300 sm:py-4 ${
                    topic.value === option.value
                      ? "border-black bg-black text-white"
                      : "border-black/10 bg-white text-black hover:border-black/25"
                  }`}
                >
                  <span className="block text-lg font-bold">{option.label}</span>
                  <span className="mt-1 block text-sm opacity-70">
                    {option.price === 0 ? "Termasuk" : `+ ${formatPrice(option.price)}`}
                  </span>
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-8 border-t border-black/10 pt-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-black/45">
                Total Harga
              </p>
              <p className="mt-2 text-3xl font-bold text-black sm:text-4xl">
                {formatPrice(total)}
              </p>
            </div>
            <a
              href={buildWhatsappUrl(whatsappMessage)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center rounded-full bg-black px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white transition duration-300 hover:bg-neutral-800 sm:w-auto"
            >
              Order via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditingConfigurator({ onClose }: { onClose: () => void }) {
  const [packageType, setPackageType] = useState(editingOptions[0]);

  const total = packageType.price;
  const whatsappMessage = useMemo(
    () =>
      [
        "Halo Reno, saya ingin order Jasa Editing.",
        "",
        `Paket: ${packageType.label}`,
        `Total: ${formatPrice(total)}`,
        "",
        "Mohon info langkah pembayaran dan detail pengerjaannya.",
      ].join("\n"),
    [packageType.label, total],
  );

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
      <div className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="mb-5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-black/55 transition hover:text-black"
        >
          <span aria-hidden="true">&larr;</span>
          Kembali
        </button>

        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/45">
              Service Configurator
            </p>
            <h2 className="mt-3 text-3xl leading-none text-black sm:text-4xl">
              Jasa Editing
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/10 text-black transition hover:bg-black hover:text-white"
            aria-label="Tutup konfigurasi"
          >
            x
          </button>
        </div>

        <div className="mt-6 grid gap-6 sm:mt-8">
          <section>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-black/55">
              Pilih paket
            </p>
            <div className="grid gap-2 sm:grid-cols-3 sm:gap-3">
              {editingOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPackageType(option)}
                  className={`border px-4 py-3 text-left transition duration-300 sm:py-4 ${
                    packageType.value === option.value
                      ? "border-black bg-black text-white"
                      : "border-black/10 bg-white text-black hover:border-black/25"
                  }`}
                >
                  <span className="block text-lg font-bold">{option.label}</span>
                  <span className="mt-1 block text-sm opacity-70">
                    {formatPrice(option.price)}
                  </span>
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-8 border-t border-black/10 pt-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-black/45">
                Total Harga
              </p>
              <p className="mt-2 text-3xl font-bold text-black sm:text-4xl">
                {formatPrice(total)}
              </p>
            </div>
            <a
              href={buildWhatsappUrl(whatsappMessage)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center rounded-full bg-black px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white transition duration-300 hover:bg-neutral-800 sm:w-auto"
            >
              Order via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const selectedIsJudgement = selectedProduct?.id === "judgement-service";
  const selectedIsEditing = selectedProduct?.id === "debate-review";

  function handleSelect(product: Product) {
    if (product.id === "judgement-service") {
      setSelectedProduct(product);
      return;
    }

    if (product.id === "debate-review") {
      setSelectedProduct(product);
      return;
    }

    const message = [
      "Halo DBARENA, saya ingin order produk marketplace.",
      "",
      `Produk: ${product.name}`,
      `Harga: ${product.price}`,
      "",
      "Mohon info langkah pembayaran dan detail pengerjaannya.",
    ].join("\n");

    window.open(buildWhatsappUrl(message), "_blank", "noopener,noreferrer");
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(0,0,0,0.06),_transparent_30%),linear-gradient(180deg,_#ffffff_0%,_#f7f7f5_52%,_#efefec_100%)] text-black">
      <Navbar />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-16 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.35em] text-black/45">
            DBARENA Marketplace
          </p>
          <h1 className="mt-4 text-3xl leading-none text-black sm:text-7xl">
            Layanan & Produk Eksklusif
          </h1>
          <p className="mt-5 text-base leading-5 text-black/62 sm:text-lg">
            Untuk tahap awal, marketplace berisi dua layanan utama yang bisa
            langsung dipesan melalui WhatsApp.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={handleSelect}
            />
          ))}
        </section>
      </main>

      {selectedIsJudgement ? (
        <JudgementConfigurator onClose={() => setSelectedProduct(null)} />
      ) : selectedIsEditing ? (
        <EditingConfigurator onClose={() => setSelectedProduct(null)} />
      ) : null}

      <Footer />
    </div>
  );
}
