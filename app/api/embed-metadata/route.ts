import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json({ error: "URL query parameter is required" }, { status: 400 });
  }

  try {
    const url = new URL(targetUrl);
    const domain = url.hostname.toLowerCase();

    // Check if it is an internal DBARENA link
    // We support paths starting with /news/ or /profile/
    const isInternal = domain.includes("dbarena") || targetUrl.startsWith("/") || domain === "localhost" || domain === "127.0.0.1";
    if (isInternal) {
      const path = url.pathname;
      if (path.startsWith("/news/")) {
        const id = path.split("/").pop();
        return NextResponse.json({
          title: "Berita DBARENA",
          description: `Baca artikel lengkap di DBARENA (ID: ${id})`,
          image: "",
          site_name: "DBARENA",
          platform: "DBARENA News",
          isInternal: true,
          internalId: id,
          internalType: "news"
        });
      }
      if (path.startsWith("/profile/")) {
        const userKey = path.split("/").pop();
        return NextResponse.json({
          title: `Profil User DBARENA`,
          description: `Lihat biodata, rank, dan pencapaian user di DBARENA (Key: ${userKey})`,
          image: "",
          site_name: "DBARENA",
          platform: "DBARENA Profile",
          isInternal: true,
          internalId: userKey,
          internalType: "profile"
        });
      }
    }

    // Specific logic for known platforms
    if (domain.includes("youtube.com") || domain.includes("youtu.be")) {
      let videoId = "";
      if (domain.includes("youtu.be")) {
        videoId = url.pathname.split("/")[1] || "";
      } else {
        videoId = url.searchParams.get("v") || "";
      }
      return NextResponse.json({
        title: "YouTube Video",
        description: "Tonton video langsung di YouTube.",
        image: videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "",
        site_name: "YouTube",
        platform: "YouTube"
      });
    }

    if (domain.includes("twitter.com") || domain.includes("x.com")) {
      return NextResponse.json({
        title: "Postingan X (Twitter)",
        description: "Lihat postingan terbaru di X.",
        image: "",
        site_name: "X (Twitter)",
        platform: "X"
      });
    }

    if (domain.includes("tiktok.com")) {
      return NextResponse.json({
        title: "Video TikTok",
        description: "Tonton video pendek seru di TikTok.",
        image: "",
        site_name: "TikTok",
        platform: "TikTok"
      });
    }

    if (domain.includes("instagram.com")) {
      return NextResponse.json({
        title: "Postingan Instagram",
        description: "Lihat foto dan video di Instagram.",
        image: "",
        site_name: "Instagram",
        platform: "Instagram"
      });
    }

    if (domain.includes("facebook.com")) {
      return NextResponse.json({
        title: "Facebook",
        description: "Terhubung dengan teman dan komunitas di Facebook.",
        image: "",
        site_name: "Facebook",
        platform: "Facebook"
      });
    }

    if (domain.includes("discord.gg") || domain.includes("discord.com")) {
      return NextResponse.json({
        title: "Undangan Server Discord",
        description: "Gabung ke server obrolan komunitas di Discord.",
        image: "",
        site_name: "Discord",
        platform: "Discord"
      });
    }

    if (domain.includes("whatsapp.com")) {
      const isChannel = url.pathname.includes("/channel/");
      return NextResponse.json({
        title: isChannel ? "Saluran WhatsApp" : "Grup / Obrolan WhatsApp",
        description: "Ikuti pembaruan penting langsung lewat WhatsApp.",
        image: "",
        site_name: "WhatsApp",
        platform: "WhatsApp"
      });
    }

    // General website fetch with Crawler User Agent to bypass some simple blockers
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      // Fallback simple card with URL
      return NextResponse.json({
        title: domain,
        description: targetUrl,
        image: "",
        site_name: domain,
        platform: "Website"
      });
    }

    const html = await response.text();

    // Parse Open Graph meta tags via regex (lightweight, safe, zero-dependency)
    const getMetaContent = (property: string) => {
      const regex1 = new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`, "i");
      const regex2 = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`, "i");
      const regex3 = new RegExp(`<meta[^>]+name=["']${property}["'][^>]+content=["']([^"']+)["']`, "i");
      const regex4 = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${property}["']`, "i");

      const match = html.match(regex1) || html.match(regex2) || html.match(regex3) || html.match(regex4);
      return match ? match[1] : "";
    };

    const title = getMetaContent("og:title") || getMetaContent("twitter:title") || (html.match(/<title>([^<]+)<\/title>/i)?.[1] ?? domain);
    const description = getMetaContent("og:description") || getMetaContent("twitter:description") || getMetaContent("description") || targetUrl;
    const image = getMetaContent("og:image") || getMetaContent("twitter:image") || "";
    const site_name = getMetaContent("og:site_name") || domain;

    return NextResponse.json({
      title: title.trim(),
      description: description.trim(),
      image: image.trim(),
      site_name: site_name.trim(),
      platform: "Website"
    });
  } catch (err) {
    return NextResponse.json({
      title: targetUrl,
      description: "Link web preview",
      image: "",
      site_name: "Web Link",
      platform: "Website"
    });
  }
}
