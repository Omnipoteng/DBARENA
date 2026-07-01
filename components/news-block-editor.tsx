"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { ContentBlock, EmbedBlock } from "@/types/post";
import { uploadImageToStorage } from "@/lib/supabase-store";

const BLOCK_TYPES = [
  { type: "heading", label: "Heading", icon: "H" },
  { type: "paragraph", label: "Paragraf", icon: "¶" },
  { type: "image", label: "Gambar", icon: "🖼" },
  { type: "embed", label: "Embed Link", icon: "🔗" },
  { type: "voting", label: "Voting", icon: "🗳" },
  { type: "quote", label: "Quote", icon: "❝" },
  { type: "divider", label: "Divider", icon: "—" },
] as const;

function generateId() {
  return Math.random().toString(36).slice(2);
}

type BlockWithId = ContentBlock & { _id: string };

interface BlockEditorProps {
  blocks: BlockWithId[];
  onChange: (blocks: BlockWithId[]) => void;
}

export type { BlockWithId };

export default function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [insertAfterIndex, setInsertAfterIndex] = useState<number | null>(null);
  const [uploadingBlockId, setUploadingBlockId] = useState<string | null>(null);
  const [embedLoadingId, setEmbedLoadingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingInsertForId = useRef<string | null>(null);

  function addBlock(type: string, afterIndex: number | null) {
    const newBlock = createEmptyBlock(type);
    if (!newBlock) return;
    const idx = afterIndex === null ? blocks.length : afterIndex + 1;
    const newBlocks = [...blocks];
    newBlocks.splice(idx, 0, newBlock);
    onChange(newBlocks);
    setIsAddMenuOpen(false);
    setInsertAfterIndex(null);
  }

  function createEmptyBlock(type: string): BlockWithId | null {
    const _id = generateId();
    switch (type) {
      case "heading": return { _id, type: "heading", text: "", level: 2 };
      case "paragraph": return { _id, type: "paragraph", text: "" };
      case "image": return { _id, type: "image", image_url: "", caption: "" };
      case "embed": return { _id, type: "embed", url: "" };
      case "voting": return { _id, type: "voting", poll_id: "", question: "", options: ["", ""] };
      case "quote": return { _id, type: "quote", text: "", author: "" };
      case "divider": return { _id, type: "divider" };
      default: return null;
    }
  }

  function updateBlock(id: string, updates: Partial<ContentBlock>) {
    onChange(blocks.map((b) => b._id === id ? { ...b, ...updates } as BlockWithId : b));
  }

  function removeBlock(id: string) {
    onChange(blocks.filter((b) => b._id !== id));
  }

  function moveBlock(index: number, direction: -1 | 1) {
    const newBlocks = [...blocks];
    const swapIdx = index + direction;
    if (swapIdx < 0 || swapIdx >= newBlocks.length) return;
    [newBlocks[index], newBlocks[swapIdx]] = [newBlocks[swapIdx], newBlocks[index]];
    onChange(newBlocks);
  }

  async function handleImageFileChange(blockId: string, file: File) {
    setUploadingBlockId(blockId);
    try {
      const url = await uploadImageToStorage(file, "blocks");
      if (url) updateBlock(blockId, { image_url: url } as Partial<ContentBlock>);
    } finally {
      setUploadingBlockId(null);
    }
  }

  async function fetchEmbedMetadata(blockId: string, url: string) {
    if (!url.trim()) return;
    setEmbedLoadingId(blockId);
    try {
      const res = await fetch(`/api/embed-metadata?url=${encodeURIComponent(url)}`);
      if (res.ok) {
        const meta = await res.json();
        updateBlock(blockId, { metadata: meta } as Partial<ContentBlock>);
      }
    } finally {
      setEmbedLoadingId(null);
    }
  }

  function renderBlockEditor(block: BlockWithId, index: number) {
    const controls = (
      <div className="absolute right-2 top-2 hidden items-center gap-1 group-hover:flex">
        <button
          type="button"
          onClick={() => moveBlock(index, -1)}
          disabled={index === 0}
          className="flex h-6 w-6 items-center justify-center rounded bg-black/5 text-xs text-black/50 transition hover:bg-black/10 disabled:opacity-30"
          title="Move up"
        >↑</button>
        <button
          type="button"
          onClick={() => moveBlock(index, 1)}
          disabled={index === blocks.length - 1}
          className="flex h-6 w-6 items-center justify-center rounded bg-black/5 text-xs text-black/50 transition hover:bg-black/10 disabled:opacity-30"
          title="Move down"
        >↓</button>
        <button
          type="button"
          onClick={() => removeBlock(block._id)}
          className="flex h-6 w-6 items-center justify-center rounded bg-red-50 text-xs text-red-400 transition hover:bg-red-100"
          title="Remove block"
        >✕</button>
      </div>
    );

    const wrapperCls = "group relative rounded-xl border border-black/8 bg-white p-4 transition hover:border-black/20 hover:shadow-sm";

    switch (block.type) {
      case "heading":
        return (
          <div key={block._id} className={wrapperCls}>
            {controls}
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-black/35">Heading</p>
            <div className="flex items-center gap-2">
              <select
                value={block.level}
                onChange={(e) => updateBlock(block._id, { level: Number(e.target.value) as 2 | 3 | 4 })}
                className="rounded-md border border-black/10 bg-white px-2 py-1 text-xs text-black outline-none"
              >
                <option value={2}>H2</option>
                <option value={3}>H3</option>
                <option value={4}>H4</option>
              </select>
              <input
                type="text"
                value={block.text}
                onChange={(e) => updateBlock(block._id, { text: e.target.value })}
                placeholder="Judul seksi..."
                className={`flex-1 border-b border-black/10 bg-transparent py-1 text-black outline-none placeholder:text-black/35 ${block.level === 2 ? "text-2xl font-bold" : block.level === 3 ? "text-xl font-semibold" : "text-lg font-medium"}`}
              />
            </div>
          </div>
        );

      case "paragraph":
        return (
          <div key={block._id} className={wrapperCls}>
            {controls}
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-black/35">Paragraf</p>
            <textarea
              value={block.text}
              onChange={(e) => updateBlock(block._id, { text: e.target.value })}
              placeholder="Tulis paragraf disini..."
              rows={4}
              className="w-full resize-none bg-transparent text-sm leading-7 text-black outline-none placeholder:text-black/35"
            />
          </div>
        );

      case "image":
        return (
          <div key={block._id} className={wrapperCls}>
            {controls}
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-black/35">Gambar</p>
            {block.image_url ? (
              <div className="space-y-3">
                <div className="relative h-48 w-full overflow-hidden rounded-lg bg-black/5">
                  <Image src={block.image_url} alt={block.caption || "Block image"} fill className="object-cover" />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={block.caption ?? ""}
                    onChange={(e) => updateBlock(block._id, { caption: e.target.value })}
                    placeholder="Caption (opsional)..."
                    className="flex-1 rounded-md border border-black/10 px-3 py-1.5 text-xs text-black outline-none placeholder:text-black/35 focus:border-black/30"
                  />
                  <button
                    type="button"
                    onClick={() => updateBlock(block._id, { image_url: "" } as Partial<ContentBlock>)}
                    className="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs text-red-500 transition hover:bg-red-100"
                  >Ganti</button>
                </div>
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-black/15 p-6 text-center transition hover:border-black/30">
                {uploadingBlockId === block._id ? (
                  <span className="text-sm text-black/50">Mengupload...</span>
                ) : (
                  <>
                    <span className="text-2xl">🖼</span>
                    <span className="text-sm text-black/50">Klik untuk upload gambar</span>
                    <span className="text-xs text-black/35">JPG, PNG, WEBP</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  disabled={uploadingBlockId === block._id}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageFileChange(block._id, file);
                  }}
                />
              </label>
            )}
          </div>
        );

      case "embed":
        return (
          <div key={block._id} className={wrapperCls}>
            {controls}
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-black/35">Embed Link</p>
            <div className="flex gap-2">
              <input
                type="url"
                value={block.url}
                onChange={(e) => updateBlock(block._id, { url: e.target.value, metadata: undefined } as Partial<ContentBlock>)}
                placeholder="https://youtube.com/... atau URL lainnya"
                className="flex-1 rounded-md border border-black/10 px-3 py-2 text-sm text-black outline-none placeholder:text-black/35 focus:border-black/30"
              />
              <button
                type="button"
                onClick={() => fetchEmbedMetadata(block._id, block.url)}
                disabled={!block.url || embedLoadingId === block._id}
                className="rounded-md bg-black px-3 py-2 text-xs font-medium text-white transition hover:bg-neutral-800 disabled:opacity-40"
              >
                {embedLoadingId === block._id ? "..." : "Preview"}
              </button>
            </div>
            {block.metadata && (
              <div className="mt-3 flex gap-3 rounded-xl border border-black/10 bg-black/[0.02] p-3">
                {block.metadata.image && (
                  <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-black/5">
                    <Image src={block.metadata.image} alt="" fill className="object-cover" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-black/40">{block.metadata.platform || block.metadata.site_name}</p>
                  <p className="mt-0.5 truncate text-sm font-semibold text-black">{block.metadata.title}</p>
                  {block.metadata.description && (
                    <p className="mt-0.5 line-clamp-2 text-xs text-black/55">{block.metadata.description}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        );

      case "voting":
        return (
          <div key={block._id} className={wrapperCls}>
            {controls}
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-black/35">Voting / Poll</p>
            <input
              type="text"
              value={block.question}
              onChange={(e) => updateBlock(block._id, { question: e.target.value })}
              placeholder="Pertanyaan poll..."
              className="w-full rounded-md border border-black/10 px-3 py-2 text-sm font-semibold text-black outline-none placeholder:text-black/35 focus:border-black/30"
            />
            <div className="mt-3 space-y-2">
              {block.options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="shrink-0 text-xs text-black/30">{i + 1}.</span>
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => {
                      const newOptions = [...block.options];
                      newOptions[i] = e.target.value;
                      updateBlock(block._id, { options: newOptions });
                    }}
                    placeholder={`Pilihan ${i + 1}`}
                    className="flex-1 rounded-md border border-black/10 px-3 py-1.5 text-sm text-black outline-none placeholder:text-black/35 focus:border-black/30"
                  />
                  {block.options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newOptions = block.options.filter((_, idx) => idx !== i);
                        updateBlock(block._id, { options: newOptions });
                      }}
                      className="shrink-0 text-xs text-red-400 hover:text-red-600"
                    >✕</button>
                  )}
                </div>
              ))}
            </div>
            {block.options.length < 8 && (
              <button
                type="button"
                onClick={() => updateBlock(block._id, { options: [...block.options, ""] })}
                className="mt-2 text-xs text-black/45 transition hover:text-black"
              >+ Tambah pilihan</button>
            )}
            <p className="mt-3 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-700">
              Poll ID akan dibuat otomatis saat publish. User wajib login untuk vote.
            </p>
          </div>
        );

      case "quote":
        return (
          <div key={block._id} className={wrapperCls}>
            {controls}
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-black/35">Quote</p>
            <textarea
              value={block.text}
              onChange={(e) => updateBlock(block._id, { text: e.target.value })}
              placeholder="Isi kutipan..."
              rows={3}
              className="w-full resize-none border-l-4 border-black/20 bg-transparent pl-4 text-base italic leading-7 text-black/75 outline-none placeholder:text-black/25"
            />
            <input
              type="text"
              value={block.author ?? ""}
              onChange={(e) => updateBlock(block._id, { author: e.target.value })}
              placeholder="Sumber / penulis (opsional)"
              className="mt-2 w-full bg-transparent text-xs text-black/40 outline-none placeholder:text-black/25"
            />
          </div>
        );

      case "divider":
        return (
          <div key={block._id} className={wrapperCls}>
            {controls}
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-black/35">Divider</p>
            <div className="flex items-center gap-3">
              <hr className="flex-1 border-black/15" />
              <span className="text-xs text-black/25">✦</span>
              <hr className="flex-1 border-black/15" />
            </div>
          </div>
        );

      default:
        return null;
    }
  }

  return (
    <div className="space-y-3">
      {blocks.length === 0 && (
        <div className="rounded-xl border-2 border-dashed border-black/10 py-10 text-center">
          <p className="text-sm text-black/40">Belum ada block. Klik tombol + untuk menambah block pertama.</p>
        </div>
      )}

      {blocks.map((block, index) => (
        <div key={block._id}>
          {renderBlockEditor(block, index)}
          {/* Insert between blocks */}
          <div className="flex items-center justify-center py-1">
            <button
              type="button"
              onClick={() => { setInsertAfterIndex(index); setIsAddMenuOpen(true); }}
              className="flex h-5 w-5 items-center justify-center rounded-full border border-black/15 bg-white text-xs text-black/35 transition hover:border-black/40 hover:text-black"
            >+</button>
          </div>
        </div>
      ))}

      {/* Add block button (at end when empty, always accessible) */}
      <button
        type="button"
        onClick={() => { setInsertAfterIndex(null); setIsAddMenuOpen(true); }}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-black/15 bg-white py-3 text-sm text-black/40 transition hover:border-black/30 hover:text-black"
      >
        <span className="text-base leading-none">+</span>
        <span>Tambah Block</span>
      </button>

      {/* Block type picker modal */}
      {isAddMenuOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={() => setIsAddMenuOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-black/10 bg-white p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-black">Pilih Tipe Block</p>
              <button
                type="button"
                onClick={() => setIsAddMenuOpen(false)}
                className="text-sm text-black/40 hover:text-black"
              >✕</button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {BLOCK_TYPES.map(({ type, label, icon }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => addBlock(type, insertAfterIndex)}
                  className="flex items-center gap-3 rounded-xl border border-black/8 bg-black/[0.02] p-3 text-left transition hover:border-black/20 hover:bg-black/[0.04]"
                >
                  <span className="text-xl">{icon}</span>
                  <span className="text-sm font-medium text-black">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
