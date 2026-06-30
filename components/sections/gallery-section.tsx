"use client";

import React from "react";
import Image from "next/image";
import { useState } from "react";
import { usePosts } from "@/components/post-store-provider";

const gridClasses = [
  "col-span-2 row-span-2",
  "col-span-1 row-span-2",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-2 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
];

const galleryImages = [
  {
    src: "/images/jjk.jpg",
    alt: "Gallery Image 1",
    className: "col-span-2 row-span-2",
    title: "Cosplay Competition Winner",
    description:
      "The stunning Makima cosplay that won the first prize at the recent DB Arena Anime Festival. A remarkable display of craftsmanship and dedication.",
    date: "12 May 2026",
  },
  {
    src: "/images/4.jpg",
    alt: "Gallery Image 2",
    className: "col-span-1 row-span-2",
    title: "Manga Character Highlight",
    description:
      "A special highlight of our community's favorite character art submission this week. The details are simply breathtaking.",
    date: "10 May 2026",
  },
  {
    src: "/images/one piece.jpg",
    alt: "Gallery Image 3",
    className: "col-span-1 row-span-1",
    title: "Tournament Bracket Announcement",
    description:
      "The official bracket for the upcoming fighting game tournament has been released. Check out the matchups!",
    date: "8 May 2026",
  },
  {
    src: "/images/dragon ball.jpg",
    alt: "Gallery Image 4",
    className: "col-span-1 row-span-1",
    title: "Community Meetup",
    description:
      "Local community meetup highlights and special moments captured on camera during our last weekend gathering.",
    date: "5 May 2026",
  },
  {
    src: "/images/3.jpg",
    alt: "Gallery Image 5",
    className: "col-span-2 row-span-1",
    title: "DB Arena Grand Opening",
    description:
      "The spectacular grand opening of our new flagship arena in the city center. A memorable night for all attendees.",
    date: "1 May 2026",
  },
  {
    src: "/images/1.jpg",
    alt: "Gallery Image 6",
    className: "col-span-1 row-span-1",
    title: "Esports Team Victory",
    description:
      "Our local team bringing home the trophy after an intense grand final match against international rivals.",
    date: "28 Apr 2026",
  },
  {
    src: "/images/2.jpg",
    alt: "Gallery Image 7",
    className: "col-span-1 row-span-1",
    title: "New Merch Drop",
    description:
      "Exclusive sneak peek at the new DB Arena merchandise dropping next week. Make sure to get yours early!",
    date: "25 Apr 2026",
  },
];

export default function GallerySection() {
  const { posts } = usePosts();

  const dbGallery = posts.filter((p) => p.origin === "gallery");
  const displayGallery = dbGallery.length > 0 ? dbGallery.map((p, index) => ({
    src: p.image,
    alt: p.title,
    className: gridClasses[index % gridClasses.length],
    title: p.title,
    description: p.description,
    date: p.date,
  })) : galleryImages;

  const [selectedImage, setSelectedImage] = useState<typeof displayGallery[0] | null>(null);

  return (
    <section id="gallery" className="py-2">
      <div className="mb-5 border-b border-black/10 pb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-black/42">
          Visual archive
        </p>
        <h2 className="mt-2 font-display text-4xl font-bold uppercase text-black sm:text-5xl">
          Gallery
        </h2>
        <p className="mt-2 text-sm font-medium text-black/55">
          Highlights & Moments
        </p>
      </div>

      <div className="grid auto-rows-[180px] grid-cols-2 gap-3 border-b border-black/10 pb-6 md:auto-rows-[230px] md:grid-cols-4">
        {displayGallery.map((img, index) => (
          <div
            key={index}
            role="button"
            tabIndex={0}
            aria-label={`View gallery item: ${img.title}`}
            onClick={() => setSelectedImage(img)}
            onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
              if (e.key === "Enter" || e.key === " ") setSelectedImage(img);
            }}
            className={`group relative cursor-pointer overflow-hidden border border-black/10 bg-black/5 ${img.className}`}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(img);
              }}
              aria-label={`Open ${img.title}`}
              className="pointer-events-auto absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center border border-black/10 bg-white/92 text-black shadow-md transition-colors hover:bg-white"
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
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-500 group-hover:bg-black/18 pointer-events-none">
              <span className="pointer-events-none bg-black/78 px-4 py-2 text-sm font-bold uppercase tracking-widest text-white opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100">
                View
              </span>
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-6 lg:p-8 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative flex max-h-full w-full max-w-5xl flex-col overflow-hidden bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-300 md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center border border-black/10 bg-black/10 text-black transition-colors hover:bg-black hover:text-white"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <div className="relative h-[40vh] w-full flex-shrink-0 bg-black/5 md:h-[70vh] md:w-2/3">
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 66vw"
              />
            </div>

            <div className="flex w-full flex-col overflow-y-auto p-6 sm:p-8 md:w-1/3">
              <span className="mb-2 text-xs font-bold uppercase tracking-widest text-black/50">
                {selectedImage.date}
              </span>
              <h3 className="mb-4 font-display text-2xl font-bold uppercase text-black leading-tight">
                {selectedImage.title}
              </h3>
              <p className="text-sm leading-relaxed text-black/70">
                {selectedImage.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
