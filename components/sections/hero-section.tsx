import Link from "next/link";
import BlurText from "../blur-text";
import TextType from "../text-type";

export default function HeroSection() { 
  return ( 
    <section 
      id="home" 
      className="relative overflow-hidden border-y border-black/10 bg-[#f7f6f2] text-black" 
    > 
      <div className="absolute inset-0" /> 

      <div className="relative grid min-h-[320px] content-end px-4 py-19 sm:px-6 sm:py-10 lg:min-h-[520px] lg:px-8 lg:py-10"> 
        <div className="max-w-3xl"> 
          <p className="mb-2 text-xs font-semibold uppercase text-black/45"> 
            Debater Battle Arena 
          </p> 
          <BlurText 
            text="WELCOME TO DBARENA" 
            delay={150} 
            animateBy="words" 
            direction="bottom"
            className="font-display text-[8.5vw] font-bold leading-[0.9] text-[#1a1a1a] sm:text-7xl lg:text-8xl"
          />
          <TextType
            as="p"
            className="mt-2 max-w-2xl text-base leading-5 text-black/68 sm:text-lg min-h-[3rem]"
            text={[
              "adalah penyelenggara event death battle terbesar di indonesia, kalian bisa memulai perjalanan kalian disini, silahkan bersenang senang",
              "buktikan kemampuan logikamu dan raih gelar debater terkuat di DBARENA",
              "tempat berkumpulnya para debater elit dari seluruh penjuru Nusantara"
            ]}
            typingSpeed={30}
            deletingSpeed={15}
            pauseDuration={2500}
            loop={true}
          />
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
