"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ContentBlock, VotingBlock } from "@/types/post";
import { fetchSupabasePollDetails, castSupabasePollVote, type PollDetails } from "@/lib/supabase-store";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

interface NewsContentRendererProps {
  content: string;
  postId: string;
}

// ---------------------------------------------------------------------------
// Voting block sub-component
// ---------------------------------------------------------------------------
function VotingBlockRenderer({ block }: { block: VotingBlock }) {
  const [poll, setPoll] = useState<PollDetails | null>(null);
  const [userKey, setUserKey] = useState<string | null>(null);
  const [voting, setVoting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const supabase = getSupabaseBrowserClient();
      let resolvedUserKey: string | null = null;
      if (supabase) {
        const { data } = await supabase.auth.getSession();
        resolvedUserKey = data.session?.user?.user_metadata?.user_key ?? data.session?.user?.id ?? null;
      }
      if (!cancelled) setUserKey(resolvedUserKey ?? null);

      const details = await fetchSupabasePollDetails(block.poll_id, resolvedUserKey ?? undefined);
      if (!cancelled) {
        setPoll(details);
        setIsLoading(false);
      }
    }

    if (block.poll_id) {
      void load();
    } else {
      setIsLoading(false);
    }

    return () => { cancelled = true; };
  }, [block.poll_id]);

  async function handleVote(optionId: string) {
    if (!userKey) {
      alert("Kamu harus login untuk vote.");
      return;
    }
    if (!poll || poll.hasVoted) return;
    setVoting(true);
    const ok = await castSupabasePollVote(block.poll_id, optionId, userKey);
    if (ok) {
      // Refresh poll after voting
      const updated = await fetchSupabasePollDetails(block.poll_id, userKey);
      setPoll(updated);
    }
    setVoting(false);
  }

  if (!block.poll_id) return null;
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-black/10 bg-black/[0.03] p-6 text-center">
        <p className="text-sm text-black/45">Memuat voting...</p>
      </div>
    );
  }
  if (!poll) return null;

  const totalVotes = poll.totalVotes;

  return (
    <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
      <div className="border-b border-black/8 bg-black/[0.02] px-5 py-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-black/40">🗳 Voting</p>
        <p className="mt-1 text-base font-semibold text-black">{poll.question}</p>
        <p className="mt-0.5 text-xs text-black/45">{totalVotes} suara{poll.hasVoted ? " · Kamu sudah vote" : ""}</p>
      </div>
      <div className="divide-y divide-black/6">
        {poll.options.map((option) => {
          const pct = totalVotes > 0 ? Math.round((option.votes_count / totalVotes) * 100) : 0;
          const isVoted = poll.votedOptionId === option.id;
          const showResults = poll.hasVoted;

          return (
            <div key={option.id} className="px-5 py-3">
              {showResults ? (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-sm ${isVoted ? "font-semibold text-black" : "text-black/70"}`}>
                      {isVoted && <span className="mr-1.5 text-xs">✓</span>}
                      {option.option_text}
                    </span>
                    <span className="shrink-0 text-xs font-semibold text-black/60">{pct}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-black/8">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${isVoted ? "bg-black" : "bg-black/30"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-black/40">{option.votes_count} suara</p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleVote(option.id)}
                  disabled={voting}
                  className="flex w-full items-center gap-3 rounded-xl border border-black/10 bg-black/[0.02] px-4 py-3 text-left text-sm font-medium text-black transition hover:border-black/25 hover:bg-black/[0.04] disabled:opacity-50"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-black/20 bg-white text-[10px] text-black/30">○</span>
                  {option.option_text}
                </button>
              )}
            </div>
          );
        })}
      </div>
      {!poll.hasVoted && !userKey && (
        <div className="border-t border-black/8 px-5 py-3">
          <p className="text-xs text-black/45">
            <Link href="/login" className="font-semibold text-black underline">Login</Link> untuk berpartisipasi dalam voting ini.
          </p>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Embed card sub-component
// ---------------------------------------------------------------------------
function EmbedCard({ url, metadata }: { url: string; metadata?: Record<string, string> }) {
  const [meta, setMeta] = useState<Record<string, string> | null>(metadata ?? null);
  const [loading, setLoading] = useState(!metadata);

  useEffect(() => {
    if (metadata) return;
    let cancelled = false;
    setLoading(true);
    fetch(`/api/embed-metadata?url=${encodeURIComponent(url)}`)
      .then((r) => r.json())
      .then((data) => { if (!cancelled) setMeta(data); })
      .catch(() => { if (!cancelled) setMeta(null); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [url, metadata]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-black/8 bg-black/[0.02] px-5 py-4 text-sm text-black/40">
        Memuat preview...
      </div>
    );
  }

  const displayUrl = (() => { try { return new URL(url).hostname; } catch { return url; } })();

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition hover:shadow-md"
    >
      {meta?.image && (
        <div className="relative h-auto w-28 shrink-0 bg-black/5 sm:w-40">
          <Image
            src={meta.image}
            alt={meta.title ?? ""}
            fill
            className="object-cover"
            loading="lazy"
          />
        </div>
      )}
      <div className="min-w-0 flex-1 p-4">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-black/40">
          {meta?.platform || meta?.site_name || displayUrl}
        </p>
        {meta?.title && (
          <p className="mt-1 line-clamp-2 text-sm font-semibold text-black group-hover:underline">
            {meta.title}
          </p>
        )}
        {meta?.description && (
          <p className="mt-1 line-clamp-2 text-xs text-black/55">{meta.description}</p>
        )}
        <p className="mt-2 truncate text-xs text-black/35">{displayUrl}</p>
      </div>
    </a>
  );
}

// ---------------------------------------------------------------------------
// Parse content
// ---------------------------------------------------------------------------
function parseContent(content: string): ContentBlock[] | null {
  const trimmed = content.trim();
  if (!trimmed.startsWith("[")) return null;
  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) return parsed as ContentBlock[];
    return null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Main renderer
// ---------------------------------------------------------------------------
export default function NewsContentRenderer({ content, postId }: NewsContentRendererProps) {
  const blocks = parseContent(content);

  // Legacy fallback: plain text paragraphs
  if (!blocks) {
    const paragraphs = content.trim().split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
    return (
      <div className="space-y-6 text-base leading-8 text-black/75">
        {paragraphs.map((para, i) => (
          <p key={`${postId}-legacy-${i}`}>{para}</p>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {blocks.map((block, i) => {
        const key = `${postId}-block-${i}`;

        switch (block.type) {
          case "heading": {
            const Tag = `h${block.level}` as "h2" | "h3" | "h4";
            const cls: Record<number, string> = {
              2: "mt-2 text-3xl font-bold text-black sm:text-4xl",
              3: "mt-1 text-2xl font-semibold text-black",
              4: "mt-1 text-xl font-semibold text-black",
            };
            return <Tag key={key} className={cls[block.level]}>{block.text}</Tag>;
          }

          case "paragraph":
            return (
              <p key={key} className="text-base leading-8 text-black/75">
                {block.text}
              </p>
            );

          case "image":
            return (
              <figure key={key} className="space-y-2">
                <div className="relative w-full overflow-hidden rounded-2xl bg-black/5" style={{ aspectRatio: "16/9" }}>
                  <Image
                    src={block.image_url}
                    alt={block.caption ?? "Article image"}
                    fill
                    className="object-cover"
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 840px"
                  />
                </div>
                {block.caption && (
                  <figcaption className="text-center text-xs text-black/40">{block.caption}</figcaption>
                )}
              </figure>
            );

          case "embed":
            return (
              <div key={key}>
                <EmbedCard url={block.url} metadata={block.metadata as Record<string, string> | undefined} />
              </div>
            );

          case "voting":
            return <VotingBlockRenderer key={key} block={block} />;

          case "quote":
            return (
              <blockquote key={key} className="border-l-4 border-black/20 pl-5">
                <p className="text-lg italic leading-8 text-black/70">&ldquo;{block.text}&rdquo;</p>
                {block.author && (
                  <footer className="mt-2 text-sm font-semibold text-black/45">— {block.author}</footer>
                )}
              </blockquote>
            );

          case "divider":
            return (
              <div key={key} className="flex items-center gap-4 py-2">
                <hr className="flex-1 border-black/12" />
                <span className="text-sm text-black/20">✦</span>
                <hr className="flex-1 border-black/12" />
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
