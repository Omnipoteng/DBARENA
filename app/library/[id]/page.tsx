import { notFound } from "next/navigation";

import LibraryDetailClient from "@/components/library-detail-client";
import { libraryCharacters } from "@/data/library";

type LibraryDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return libraryCharacters.map((character) => ({
    id: character.id,
  }));
}

export default async function LibraryDetailPage({
  params,
}: LibraryDetailPageProps) {
  const { id } = await params;
  const character = libraryCharacters.find((item) => item.id === id);

  if (!character) {
    notFound();
  }

  return <LibraryDetailClient character={character} />;
}
