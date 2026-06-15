export default function CommunityCta() {
  return (
    <section id="community" className="py-4">
      <div className="overflow-hidden rounded-[2rem] border border-black/10 bg-[linear-gradient(135deg,_#ffffff,_#f3f3f0,_#ebebe7)] p-8 shadow-[0_30px_100px_rgba(15,23,42,0.12)] sm:p-10">
        <p className="text-sm uppercase tracking-[0.35em] text-black/55">
          Community Access
        </p>
        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-display text-4xl uppercase leading-tight text-black sm:text-5xl">
              Join the Battleboarding Community
            </h2>
            <p className="mt-4 text-base leading-8 text-black/72">
              Masuk ke server dan grup komunitas untuk update match-up harian,
              polling debat, dan diskusi power scaling lintas verse.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <a
              href="https://discord.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-white transition duration-300 hover:scale-105 hover:bg-neutral-800"
            >
              Join Discord
            </a>
            <a
              href="https://whatsapp.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-black transition duration-300 hover:scale-105 hover:bg-black/4"
            >
              Join WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
