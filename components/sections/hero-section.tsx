import Link from "next/link";

export default function HeroSection() { 
  return ( 
    <section 
      id="home" 
      className="relative overflow-hidden border-y border-black/10 bg-[#f7f6f2] text-black" 
    > 
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_rgba(255,255,255,0.95)_0%,_transparent_42%),_rgba(242,241,236,0.96)_100%)]" /> 

      <div className="relative grid min-h-[320px] content-end px-4 py-19 sm:px-6 sm:py-10 lg:min-h-[520px] lg:px-8 lg:py-10"> 
        <div className="max-w-3xl"> 
          <p className="mb-2 text-xs font-semibold uppercase text-black/45"> 
            Debater Battle Arena 
          </p> 
          <h1 className="font-display text-4xl leading-[0.9] text-black sm:text-7xl lg:text-8xl"> 
            WELCOME TO DBARENA 
          </h1> 
          <p className="mt-2 max-w-2xl text-base leading-5 text-black/68 sm:text-lg"> 
            adalah penyelenggara event death battle terbesar di indonesia, kalian bisa memulai perjalanan kalian disini, silahkan bersenang senang 
          </p> 
        </div> 

        <div className="mt-7 w-full max-w-4xl overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">  
          <div className="flex min-w-max items-center gap-4">  
          <Link  
            href="/#news"  
            className="inline-flex h-8 shrink-0 items-center justify-center px-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-black/72 transition duration-300 hover:bg-black hover:px-3 hover:text-white"  
          >  
            Lihat News  
          </Link>  
          <Link  
            href="/ranked"  
            className="inline-flex h-8 shrink-0 items-center justify-center px-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-black/72 transition duration-300 hover:bg-black hover:px-3 hover:text-white"  
          >  
            Masuk Ranked  
          </Link>  
          <Link  
            href="/library"  
            className="inline-flex h-8 shrink-0 items-center justify-center px-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-black/72 transition duration-300 hover:bg-black hover:px-3 hover:text-white"  
          >  
            Buka Library  
          </Link>  
          <Link  
            href="/token"  
            className="inline-flex h-8 shrink-0 items-center justify-center px-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-black/72 transition duration-300 hover:bg-black hover:px-3 hover:text-white"  
          >  
            Klaim Token  
          </Link>  
          </div>  
        </div> 
      </div> 
    </section> 
  ); 
}
