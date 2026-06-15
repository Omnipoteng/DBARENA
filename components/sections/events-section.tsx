"use client";

import { useState } from "react";

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
  const [selectedEvent, setSelectedEvent] = useState<typeof eventsData[0] | null>(null);

  return (
    <section id="events" className="py-4">
      <div className="mb-6">
        <p className="text-sm uppercase text-black/55">
          Event yang tersedia
        </p>
        <h2 className="mt-2 font-display text-3xl uppercase text-black">
          acara yang tersedia
        </h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {eventsData.map((event, index) => (
          <article
            key={index}
            className="rounded-[1.75rem] border border-black/8 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.12)] transition duration-300 hover:scale-[1.02] hover:border-black/15 flex flex-col items-start"
          >
            <p className="text-xs uppercase tracking-[0.28em] text-black/50">
              Event {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-black">{event.title}</h3>
            <p className="mt-3 text-sm leading-7 text-black/65 line-clamp-2">
              {event.description}
            </p>
            <div className="mt-auto pt-6 w-full">
              <button
                onClick={() => setSelectedEvent(event)}
                className="inline-flex rounded-full border border-black/12 bg-black px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition duration-300 hover:scale-105 hover:bg-neutral-800"
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
            className="relative flex flex-col w-full max-w-2xl bg-white rounded-[2rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300 border border-black/10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-6 right-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/5 text-black hover:bg-black hover:text-white transition-colors"
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
              
              <div className="flex items-center gap-3 mb-8 text-black/80 bg-black/5 p-4 rounded-xl">
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
                  className="inline-flex w-full sm:w-auto justify-center rounded-full bg-black px-10 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white transition duration-300 hover:scale-105 hover:bg-neutral-800 shadow-xl shadow-black/20"
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
