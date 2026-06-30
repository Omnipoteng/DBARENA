"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  insertSupabasePost,
  loadSupabasePosts,
  loadSupabasePostsByOrigin,
  uploadImageToStorage,
} from "@/lib/supabase-store";
import type { Post } from "@/types/post";

export type { Post };

type NewPost = Omit<Post, "id">;

type PostStoreContextValue = {
  posts: Post[];
  newsPosts: Post[];
  addPost: (post: NewPost) => void;
  refreshPosts: () => Promise<void>;
  publishPost: (params: {
    title: string;
    description: string;
    content?: string;
    date: string;
    origin: string;
    imageFile: File; // required — upload ke Supabase Storage wajib
  }) => Promise<Post>;
};

const PostStoreContext = createContext<PostStoreContextValue | null>(null);

export function PostStoreProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newsPosts, setNewsPosts] = useState<Post[]>([]);

  const loadFromDb = useCallback(async () => {
    // Load all posts from Supabase database
    const remotePosts = await loadSupabasePosts([]);
    setPosts(remotePosts);
    // Filter news posts
    const news = remotePosts.filter((p) => p.origin === "news");
    setNewsPosts(news);
  }, []);

  useEffect(() => {
    void loadFromDb();
  }, [loadFromDb]);

  const refreshPosts = useCallback(async () => {
    await loadFromDb();
  }, [loadFromDb]);

  function addPost(post: NewPost) {
    const newEntry: Post = {
      id: `post-${Date.now()}`,
      ...post,
    };
    setPosts((current) => [newEntry, ...current]);
    setNewsPosts((current) => [newEntry, ...current]);
  }

  type PublishPostParams = {
    title: string;
    description: string;
    content?: string;
    date: string;
    origin: string;
    imageFile: File; // Upload wajib — tidak ada fallback path lokal
  };

  async function publishPost(params: PublishPostParams): Promise<Post> {
    // Upload gambar ke Supabase Storage bucket "post" — WAJIB
    console.log("[publishPost] Uploading image file:", params.imageFile.name, "size:", params.imageFile.size);

    const uploaded = await uploadImageToStorage(params.imageFile, params.origin);

    if (!uploaded) {
      throw new Error(
        "Upload gambar gagal. Pastikan bucket \"post\" sudah ada dan bersifat Public di Supabase Storage."
      );
    }

    console.log("[publishPost] Upload berhasil. publicUrl:", uploaded);
    console.log("[publishPost] image_url yang akan disimpan ke database:", uploaded);

    // Insert ke Supabase — langsung published, tanpa approval
    const inserted = await insertSupabasePost({
      title: params.title,
      description: params.description,
      content: params.content ?? "",
      image_url: uploaded, // selalu dari Storage, tidak pernah path lokal
      date: params.date,
      origin: params.origin,
    });

    if (!inserted) {
      throw new Error("Gagal menyimpan ke database. Cek koneksi Supabase.");
    }

    // Refresh posts from database
    await loadFromDb();

    return inserted;
  }

  return (
    <PostStoreContext.Provider
      value={{
        posts,
        newsPosts,
        addPost,
        refreshPosts,
        publishPost,
      }}
    >
      {children}
    </PostStoreContext.Provider>
  );
}

export function usePosts() {
  const context = useContext(PostStoreContext);

  if (!context) {
    throw new Error("usePosts must be used within PostStoreProvider");
  }

  return context;
}
