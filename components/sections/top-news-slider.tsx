"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import type { Post } from "@/types/post";

const sliderImages = [
  "/images/news baru.jpeg",
  "/images/dba 2.jpeg",
  "/images/news banner.jpg",
  "/images/news banner 2.jpg",
];

export default function TopNewsSlider({ posts }: { posts: Post[] }) {
  const slides = posts.slice(0, 4).map((post, index) => ({
    ...post,
    image: sliderImages[index] ?? post.image,
  }));
  const extendedSlides =
    slides.length > 1
      ? [slides[slides.length - 1], ...slides, slides[0]]
      : slides;
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<number | null>(null);
  const autoSlideRef = useRef<number | null>(null);
  const resumeTimeoutRef = useRef<number | null>(null);

  function startAutoSlide() {
    if (autoSlideRef.current) {
      window.clearInterval(autoSlideRef.current);
    }

    autoSlideRef.current = window.setInterval(() => {
      moveToNextSlide();
    }, 4200);
  }

  function pauseAutoSlide() {
    if (autoSlideRef.current) {
      window.clearInterval(autoSlideRef.current);
      autoSlideRef.current = null;
    }

    if (resumeTimeoutRef.current) {
      window.clearTimeout(resumeTimeoutRef.current);
    }

    resumeTimeoutRef.current = window.setTimeout(() => {
      startAutoSlide();
    }, 3000);
  }

  function moveToNextSlide() {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const rawIndex = Math.round(container.scrollLeft / container.clientWidth);

    container.scrollTo({
      left: (rawIndex + 1) * container.clientWidth,
      behavior: "smooth",
    });
  }

  function goToSlide(index: number) {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    pauseAutoSlide();

    const targetIndex = slides.length > 1 ? index + 1 : index;

    container.scrollTo({
      left: targetIndex * container.clientWidth,
      behavior: "smooth",
    });

    setActiveIndex(index);
  }

  function handleScroll() {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const rawIndex = Math.round(container.scrollLeft / container.clientWidth);

    if (slides.length > 1) {
      if (rawIndex === 0) {
        setActiveIndex(slides.length - 1);
      } else if (rawIndex === extendedSlides.length - 1) {
        setActiveIndex(0);
      } else {
        setActiveIndex(rawIndex - 1);
      }
    } else {
      setActiveIndex(0);
    }

    if (scrollTimeoutRef.current) {
      window.clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = window.setTimeout(() => {
      if (!container || slides.length < 2) {
        return;
      }

      const settledIndex = Math.round(container.scrollLeft / container.clientWidth);

      if (settledIndex === 0) {
        container.scrollTo({
          left: slides.length * container.clientWidth,
          behavior: "auto",
        });
      }

      if (settledIndex === extendedSlides.length - 1) {
        container.scrollTo({
          left: container.clientWidth,
          behavior: "auto",
        });
      }
    }, 120);
  }

  useEffect(() => {
    const container = containerRef.current;

    if (!container || slides.length < 2) {
      return;
    }

    container.scrollLeft = container.clientWidth;
  }, [slides.length]);

  useEffect(() => {
    if (slides.length < 2) {
      return;
    }

    if (autoSlideRef.current) {
      window.clearInterval(autoSlideRef.current);
    }

    autoSlideRef.current = window.setInterval(() => {
      moveToNextSlide();
    }, 4200);

    return () => {
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }

      if (autoSlideRef.current) {
        window.clearInterval(autoSlideRef.current);
      }

      if (resumeTimeoutRef.current) {
        window.clearTimeout(resumeTimeoutRef.current);
      }
    };
  }, [slides.length]);

  if (slides.length === 0) {
    return null;
  }

  return (
    <section className="pt-0" aria-label="Latest updates slider">
      <div className="w-full sm:mx-auto sm:max-w-7xl sm:px-6 lg:px-8">
        <div
          ref={containerRef}
          onScroll={handleScroll}
          onTouchStart={pauseAutoSlide}
          onMouseDown={pauseAutoSlide}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto scroll-smooth touch-pan-x border-y border-black/10 bg-white"
        >
          {extendedSlides.map((post, index) => (
            <article
              key={`${post.id}-${index}`}
              className="relative h-[46vw] min-h-[230px] max-h-[330px] w-full shrink-0 snap-center overflow-hidden sm:min-h-[280px] sm:max-h-[390px] lg:h-[30vw] lg:max-h-[440px]"
            >
              <Image
                src={post.image}
                alt={post.title}
                fill
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover"
              />
            </article>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 px-4 sm:px-0">
          {slides.map((post, index) => (
            <button
              key={post.id}
              type="button"
              onClick={() => goToSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === activeIndex ? "w-10 bg-black" : "w-5 bg-black/20"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
