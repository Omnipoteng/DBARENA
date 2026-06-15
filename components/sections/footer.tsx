const footerLinks = [
  { label: "Home", href: "#home" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Library", href: "/library" },
  { label: "Terminology", href: "/terminology" },
  { label: "News", href: "#news" },
  { label: "Events", href: "#events" },
  { label: "Community", href: "#community" },
];

const communityLinks = [
  { label: "Discord", href: "https://discord.com" },
  { label: "WhatsApp", href: "https://whatsapp.com" },
  {
    label: "deathbattlearena1@gmail.com",
    href: "mailto:deathbattlearena1@gmail.com",
  },
];

export default function Footer() {
  return (
    <footer
      id="community"
      className="mt-12 border-t border-black/10 bg-black text-white"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <section>
            <p className="font-display text-3xl uppercase tracking-[0.18em] text-white">
              DBARENA
            </p>
            <p className="mt-4 max-w-sm text-sm leading-7 text-white/70">
              Pusat berita, event, dan update komunitas battleboarding
              internasional.
            </p>
            <p className="mt-3 max-w-sm text-sm leading-7 text-white/50">
              jangan lupa ikuti media sosial kami!
            </p>
          </section>

          <section>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/45">
              Quick Links
            </p>
            <div className="mt-5 flex flex-col gap-4">
              {footerLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-white/70 transition duration-300 hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </section>

          <section>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/45">
              Community & Contact
            </p>
            <div className="mt-5 flex flex-col gap-4">
              {communityLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                  className="text-sm font-medium text-white/70 transition duration-300 hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-sm text-white/45">
          <p>(c) 2025 DBARENA. All rights reserved.</p>
          <p className="mt-2">
            Built for battleboarding news, events, and community updates.
          </p>
        </div>
      </div>
    </footer>
  );
}
