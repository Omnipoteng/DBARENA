"use client";

import React from "react";
import Image from "next/image";
import { useState } from "react";

const galleryImages = [
  {
    src: "/images/jjk.jpg",
    alt: "Gallery Image 1",
    className: "col-span-2 row-span-2",
    title: "Cosplay Competition Winner",
    description: "The stunning Makima cosplay that won the first prize at the recent DB Arena Anime Festival. A remarkable display of craftsmanship and dedication.",
    date: "12 May 2026",
  },
  {
    src: "/images/4.jpg",
    alt: "Gallery Image 2",
    className: "col-span-1 row-span-2",
    title: "Manga Character Highlight",
    description: "A special highlight of our community's favorite character art submission this week. The details are simply breathtaking.",
    date: "10 May 2026",
  },
  {
    src: "/images/one piece.jpg",
    alt: "Gallery Image 3",
    className: "col-span-1 row-span-1",
    title: "Tournament Bracket Announcement",
    description: "The official bracket for the upcoming fighting game tournament has been released. Check out the matchups!",
    date: "8 May 2026",
  },
  {
    src: "/images/dragon ball.jpg",
    alt: "Gallery Image 4",
    className: "col-span-1 row-span-1",
    title: "Community Meetup",
    description: "Local community meetup highlights and special moments captured on camera during our last weekend gathering.",
    date: "5 May 2026",
  },
  {
    src: "/images/3.jpg",
    alt: "Gallery Image 5",
    className: "col-span-2 row-span-1",
    title: "DB Arena Grand Opening",
    description: "The spectacular grand opening of our new flagship arena in the city center. A memorable night for all attendees.",
    date: "1 May 2026",
  },
  {
    src: "/images/1.jpg",
    alt: "Gallery Image 6",
    className: "col-span-1 row-span-1",
    title: "Esports Team Victory",
    description: "Our local team bringing home the trophy after an intense grand final match against international rivals.",
    date: "28 Apr 2026",
  },
  {
    src: "/images/2.jpg",
    alt: "Gallery Image 7",
    className: "col-span-1 row-span-1",
    title: "New Merch Drop",
    description: "Exclusive sneak peek at the new DB Arena merchandise dropping next week. Make sure to get yours early!",
    date: "25 Apr 2026",
  },
];

export default function GallerySection() {
  const [selectedImage, setSelectedImage] = useState<typeof galleryImages[0] | null>(null);

  return (
    <section id="gallery" className="py-12 border-t border-black/8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="font-display text-3xl font-bold uppercase tracking-widest text-black sm:text-5xl">
            Gallery
          </h2>
          <p className="mt-2 text-sm font-medium tracking-wider text-black/60 uppercase">
            Highlights & Moments
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px] md:auto-rows-[250px]">
        {galleryImages.map((img, index) => (
          <div
            key={index}
            role="button"
            tabIndex={0}
            aria-label={`View gallery item: ${img.title}`}
            onClick={() => setSelectedImage(img)}
            onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
              if (e.key === "Enter" || e.key === " ") setSelectedImage(img);
            }}
            className={`cursor-pointer relative overflow-hidden group bg-black/5 rounded-2xl border border-black/10 ${img.className}`}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(img);
              }}
              aria-label={`Open ${img.title}`}
              className="absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-black shadow-md transition-colors hover:bg-white pointer-events-auto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
              </svg>
            </button>
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="pointer-events-none object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="absolute inset-0 pointer-events-none bg-black/0 transition-colors duration-500 group-hover:bg-black/20 flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/70 text-white text-sm font-bold uppercase tracking-widest px-4 py-2 rounded-full backdrop-blur-md pointer-events-none">
                View
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-6 lg:p-8 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="relative flex flex-col md:flex-row w-full max-w-5xl max-h-full bg-white rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/10 text-black hover:bg-black hover:text-white transition-colors"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            
            <div className="relative w-full md:w-2/3 h-[40vh] md:h-[70vh] bg-black/5 flex-shrink-0">
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 66vw"
              />
            </div>
            
            <div className="flex flex-col w-full md:w-1/3 p-6 sm:p-8 overflow-y-auto">
              <span className="text-xs font-bold uppercase tracking-widest text-black/50 mb-2">
                {selectedImage.date}
              </span>
              <h3 className="font-display text-2xl font-bold uppercase text-black mb-4 leading-tight">
                {selectedImage.title}
              </h3>
              <p className="text-black/70 text-sm leading-relaxed">
                {selectedImage.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
