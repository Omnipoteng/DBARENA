import { Product } from "@/types/marketplace";

export const products: Product[] = [
  {
    id: "judgement-service",
    name: "Jasa Judgement by lianx",
    price: "Mulai Rp 10.000",
    priceNum: 50000,
    image: "/images/karakter bleach .png",
    category: "Service",
    description:
      "Layanan judgement untuk membantu menilai debat, argumen scaling, dan topik versus dengan format yang lebih rapi dan objektif.",
    rating: 4.9,
    reviewCount: 86,
    stock: 999,
    badge: "Hot",
  },
  {
    id: "debate-review",
    name: "Jasa editing by singularity",
    price: "Mulai Rp 5.000",
    priceNum: 75000,
    image: "/images/kawaki.jpg",
    category: "Service",
    description:
      "Layanan jasa editing seperti pembuatan poster, banner untuk UMKM, motion grafis, manga movement, manga animation, dll.",
    rating: 4.8,
    reviewCount: 54,
    stock: 999,
    badge: "Hot",
  },
];
