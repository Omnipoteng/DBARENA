"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { initialPosts } from "@/data/posts";
import type { Post } from "@/types/post";

type NewPost = Omit<Post, "id">;

type PostStoreContextValue = {
  posts: Post[];
  addPost: (post: NewPost) => void;
};

const STORAGE_KEY = "dbarena-posts";
const initialPostIds = new Set(initialPosts.map((post) => post.id));

const PostStoreContext = createContext<PostStoreContextValue | null>(null);

export function PostStoreProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(() => {
    if (typeof window === "undefined") {
      return initialPosts;
    }

    const savedPosts = window.localStorage.getItem(STORAGE_KEY);

    if (!savedPosts) {
      return initialPosts;
    }

    try {
      const parsedPosts = JSON.parse(savedPosts) as Post[];

      if (!Array.isArray(parsedPosts) || parsedPosts.length === 0) {
        return initialPosts;
      }

      const customPosts = parsedPosts.filter(
        (post) => !initialPostIds.has(post.id),
      );

      return [...customPosts, ...initialPosts];
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);

      return initialPosts;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }, [posts]);

  function addPost(post: NewPost) {
    setPosts((current) => [
      {
        id: `post-${Date.now()}`,
        ...post,
      },
      ...current,
    ]);
  }

  return (
    <PostStoreContext.Provider
      value={{
        posts,
        addPost,
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
