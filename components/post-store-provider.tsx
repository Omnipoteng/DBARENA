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
    imageFile?: File | null;
    imageFallbackUrl?: string;
  }) => Promise<Post>;
};

const PostStoreContext = createContext<PostStoreContextValue | null>(null);

export function PostStoreProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newsPosts, setNewsPosts] = useState<Post[]>([]);

  const loadFromDb = useCallback(async () => {
    // Hanya ambil posts dengan origin = "news" dari Supabase
    // Tidak ada fallback ke data dummy — kalau kosong, tetap kosong
    const newsRemote = await loadSupabasePostsByOrigin("news", []);
    setNewsPosts(newsRemote);
    setPosts(newsRemote);
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

  async function publishPost(params: {
    title: string;
    description: string;
    date: string;
    origin: string;
    imageFile?: File | null;
    imageFallbackUrl?: string;
  }): Promise<Post> {
    let imageUrl = params.imageFallbackUrl ?? "";

    if (params.imageFile) {
      const uploaded = await uploadImageToStorage(
        params.imageFile,
        params.origin
      );
      if (uploaded) {
        imageUrl = uploaded;
      }
    }

    // Insert ke Supabase — langsung published, tanpa approval
    const inserted = await insertSupabasePost({
      title: params.title,
      description: params.description,
      content: params.content ?? "",
      image_url: imageUrl || "/images/1.jpg",
      date: params.date,
      origin: params.origin,
    });

    if (!inserted) {
      throw new Error("Gagal menyimpan ke database. Cek koneksi Supabase.");
    }

    // Optimistic update — langsung tampil di homepage tanpa reload
    setPosts((current) => [inserted, ...current]);
    setNewsPosts((current) => [inserted, ...current]);

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
