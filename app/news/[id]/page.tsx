"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { usePosts } from "@/components/post-store-provider";
import Navbar from "@/components/sections/navbar";
import Footer from "@/components/sections/footer";
import { normalizeImageSrc } from "@/lib/image";

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { posts } = usePosts();
  
  const postId = params.id as string;
  const post = posts.find((p) => p.id === postId);

  if (!post) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(0,0,0,0.06),_transparent_30%),linear-gradient(180deg,_#ffffff_0%,_#f7f7f5_52%,_#efefec_100%)] flex flex-col">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center p-8 text-center text-black">
          <h1 className="font-display text-8xl uppercase font-bold mb-4 tracking-widest text-black/20">404</h1>
          <p className="text-black/60 mb-8 font-medium tracking-wider uppercase">Berita tidak ditemukan atau telah dihapus.</p>
          <button 
            onClick={() => router.back()}
            className="px-8 py-4 bg-black text-white rounded-full uppercase tracking-[0.2em] text-sm font-semibold hover:bg-black/80 hover:scale-105 transition duration-300"
          >
            Kembali
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(0,0,0,0.06),_transparent_30%),linear-gradient(180deg,_#ffffff_0%,_#f7f7f5_52%,_#efefec_100%)] flex flex-col text-black">
      <Navbar />
      
      <main className="flex-grow w-full max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <Link 
          href="/" 
          className="inline-flex items-center text-sm font-bold uppercase tracking-widest text-black/50 hover:text-black transition-colors duration-300 mb-10 group"
        >
          <svg className="w-5 h-5 mr-3 transition-transform duration-300 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke Beranda
        </Link>
        
        <article className="bg-white p-6 sm:p-12 rounded-[2.5rem] shadow-[0_24px_80px_rgba(15,23,42,0.08)] border border-black/5">
          <header className="mb-10 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.4em] text-black/40 mb-6">
              {post.date}
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold uppercase leading-[1.1] text-black mb-8 max-w-3xl mx-auto">
              {post.title}
            </h1>
          </header>
          
          <div className="relative w-full h-[350px] sm:h-[500px] mb-12 overflow-hidden rounded-[2rem] bg-black/5">
            <Image
              src={normalizeImageSrc(post.image)}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          
          <div className="prose prose-lg max-w-3xl mx-auto text-black/70">
            <p className="text-xl sm:text-2xl leading-relaxed font-medium text-black/90 mb-8">
              {post.description}
            </p>

            {(post.content ?? "").trim() ? (
              <div className="space-y-6 whitespace-pre-line leading-relaxed text-black/75">
                {(post.content ?? "")
                  .trim()
                  .split(/\n{2,}/)
                  .map((paragraph) => paragraph.trim())
                  .filter(Boolean)
                  .map((paragraph, index) => (
                    <p key={`${post.id}-body-${index}`}>{paragraph}</p>
                  ))}
              </div>
            ) : (
              <p className="border-t border-black/10 pt-6 leading-relaxed text-black/45">
                Belum ada isi berita untuk artikel ini.
              </p>
            )}
          </div>
        </article>
      </main>
      
      <Footer />
    </div>
  );
}
