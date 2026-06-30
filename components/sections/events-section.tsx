"use client";

import { useState } from "react";
import { usePosts } from "@/components/post-store-provider";

const eventsData = [
  {
    title: "Naruto vs Ichigo Debate Week",
    description: "Debat mingguan dengan live reaction, vote komunitas, dan thread scaling lanjutan di Discord. Acara ini akan membahas perbandingan kecepatan (speed feats), daya hancur (AP/DC), serta hax yang dimiliki kedua karakter untuk menentukan siapa yang akan menang dalam pertarungan 1 lawan 1.",
    date: "18 Mei 2026, 19:00 WIB",
    link: "https://discord.com"
  },
  {
    title: "Dragon Ball Cosmology Breakdown Night",
    description: "Sesi khusus bedah kosmologi Dragon Ball dari seri Z hingga Super. Kita akan membedah macrocosm, layer dimensionalitas, serta implikasinya terhadap scaling karakter tingkat tinggi seperti Beerus, Whis, dan Zeno.",
    date: "20 Mei 2026, 20:00 WIB",
    link: "https://discord.com"
  },
  {
    title: "One Piece Admiral Scaling Open Stage",
    description: "Open stage discussion untuk menilai kembali level kekuatan para Admiral Angkatan Laut pasca arc Egghead. Bawa scan terbaik Anda untuk mempertahankan atau menyanggah argumen Admiral vs Yonko tiering.",
    date: "23 Mei 2026, 19:30 WIB",
    link: "https://discord.com"
  },
  {
    title: "Jujutsu Kaisen Speed Feats Community Review",
    description: "Review komunitas terkait kalkulasi speed feats terbaru dari Jujutsu Kaisen. Apakah Mach 3 masih relevan? Mari kita bahas pixel scaling dan frame by frame dari pertarungan terbaru di manga.",
    date: "25 Mei 2026, 19:00 WIB",
    link: "https://discord.com"
  },
];

export default function EventsSection() {
  const { posts } = usePosts();

  const dbEvents = posts.filter((p) => p.origin === "events");
  const displayEvents = dbEvents.length > 0 ? dbEvents.map((p) => ({
    title: p.title,
    description: p.description,
    date: p.date,
    link: p.content || "https://discord.com"
  })) : eventsData;

  const [selectedEvent, setSelectedEvent] = useState<typeof displayEvents[0] | null>(null);

  return (
    <section id="events" className="py-2">
      <div className="mb-5 border-b border-black/10 pb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-black/42">
          Event yang tersedia
        </p>
        <h2 className="mt-2 font-display text-4xl uppercase text-black sm:text-5xl">
          acara yang tersedia
        </h2>
      </div>

      <div className="grid gap-3">
        {displayEvents.map((event, index) => (
          <article
            key={index}
            className="grid gap-4 border-b border-black/10 py-5 transition duration-300 md:grid-cols-[120px_1fr_auto] md:items-center"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/42">
              Event {String(index + 1).padStart(2, "0")}
            </p>
            <div>
              <h3 className="text-xl font-semibold text-black">{event.title}</h3>
              <p className="mt-2 text-sm leading-6 text-black/60 line-clamp-2">
                {event.description}
              </p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.22em] text-black/45">
                {event.date}
              </p>
            </div>
            <div className="w-full md:w-auto">
              <button
                onClick={() => setSelectedEvent(event)}
                className="inline-flex h-9 w-full items-center justify-center border border-black bg-black px-4 text-xs font-semibold uppercase tracking-[0.14em] text-white transition duration-300 hover:bg-white hover:text-black md:w-auto"
              >
                bergabung
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Event Preview Modal */}
      {selectedEvent && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-6 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setSelectedEvent(null)}
        >
          <div 
            className="relative flex flex-col w-full max-w-2xl overflow-hidden rounded-xl border border-black/10 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-5 right-5 z-10 flex h-10 w-10 items-center justify-center rounded-lg bg-black/5 text-black transition-colors hover:bg-black hover:text-white"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            
            <div className="p-8 sm:p-12">
              <span className="inline-block px-4 py-1.5 rounded-full bg-black/5 text-xs font-bold uppercase tracking-[0.2em] text-black/70 mb-6">
                detail acara
              </span>
              
              <h3 className="font-display text-3xl sm:text-4xl font-bold uppercase text-black mb-6 leading-tight">
                {selectedEvent.title}
              </h3>
              
              <div className="flex items-center gap-3 mb-8 text-black/80 bg-black/5 p-4 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black/60"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                <span className="font-semibold">{selectedEvent.date}</span>
              </div>

              <div className="prose prose-sm sm:prose-base text-black/70 mb-10">
                <p className="leading-relaxed">
                  {selectedEvent.description}
                </p>
                <p className="mt-4 leading-relaxed">
                  Pastikan Anda membaca rules server sebelum join ke voice channel. Siapkan bahan argumen Anda dan selamat berdiskusi!
                </p>
              </div>

              <div className="pt-6 border-t border-black/10 flex justify-end">
                <a
                  href={selectedEvent.link}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setSelectedEvent(null)}
                  className="inline-flex w-full justify-center rounded-lg bg-black px-10 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white transition duration-300 hover:bg-neutral-800 sm:w-auto"
                >
                  bergabung
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
