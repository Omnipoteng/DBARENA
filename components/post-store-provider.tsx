"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { initialPosts } from "@/data/posts"; 
import { 
  loadSupabasePosts, 
  saveSupabasePosts, 
} from "@/lib/supabase-store"; 
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

  useEffect(() => { 
    let cancelled = false; 

    void loadSupabasePosts(initialPosts).then((remotePosts) => { 
      if (cancelled) return; 
      if (remotePosts.length > 0) { 
        setPosts((current) => { 
          const customPosts = current.filter((post) => !initialPostIds.has(post.id)); 
          const merged = [...customPosts, ...remotePosts]; 
          const seen = new Set<string>(); 

          return merged.filter((post) => { 
            if (seen.has(post.id)) return false; 
            seen.add(post.id); 
            return true; 
          }); 
        }); 
      } 
    }); 

    return () => { 
      cancelled = true; 
    }; 
  }, []); 

  useEffect(() => { 
    const customPosts = posts.filter((post) => !initialPostIds.has(post.id)); 
    void saveSupabasePosts(customPosts); 
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
