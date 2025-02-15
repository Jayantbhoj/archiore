"use client";

import { useEffect, useState, useRef } from "react";
import BeautifulCard from "@/components/BeautifulCard";
import { useSearchParams } from "next/navigation";
import { searchPostsAction } from "@/app/actions";
import { Loader2 } from "lucide-react"; // Loading Spinner
import LoadingSpinner from "@/app/loading";

interface Post {
  id: string;
  title: string;
  imgUrl: string;
  createdAt: string;
  user: {
    username: string;
    image: string;
  };
}

const SearchBody = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false); // New: Separate fetching state
  const columnRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
  const [columnOffsets, setColumnOffsets] = useState<number[]>([0, 0, 0, 0]);

  // Split posts into columns
  const getColumnPosts = (columnIndex: number) => {
    return posts.filter((_, index) => index % 4 === columnIndex);
  };

  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    setLoading(true);
  }, [query]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!query || !hasMore || isFetching) return;
      setIsFetching(true);

      try {
        const { posts: newPosts, hasMore: more } = await searchPostsAction(query, page);

        const normalizedPosts = newPosts.map((post: any) => ({
          ...post,
          createdAt: new Date(post.createdAt).toISOString(),
          user: {
            ...post.user,
            image: post.user.image || "/noAvatar.png",
          },
        }));

        // Ensure unique posts
        setPosts((prev) => {
          const uniquePosts = [...prev, ...normalizedPosts].filter(
            (post, index, self) => index === self.findIndex((p) => p.id === post.id)
          );
          return uniquePosts;
        });

        setHasMore(more);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
        setIsFetching(false);
      }
    };

    fetchPosts();
  }, [query, page]);

  // Infinite Scroll Handler
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 && hasMore && !isFetching) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, isFetching]);

  useEffect(() => {
    const handleScrollEffect = () => {
      columnRefs.forEach((ref, index) => {
        if (!ref.current) return;

        const speed = 0.05 * (index + 1); // Different speed for each column
        const scrolled = window.scrollY;
        const offset = scrolled * speed;

        setColumnOffsets((prev) => {
          const newOffsets = [...prev];
          newOffsets[index] = offset;
          return newOffsets;
        });
      });
    };

    window.addEventListener("scroll", handleScrollEffect, { passive: true });
    return () => window.removeEventListener("scroll", handleScrollEffect);
  }, []);

  if (loading && posts.length === 0) {
    return (
        <LoadingSpinner/>
    );
  }

  return (

    <div className="p-4 md:p-6 bg-myWhite min-h-screen">
      <h1 className="text-2xl font-semibold text-center mb-6">Search Results for "{query}"</h1>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((columnIndex) => (
          <div
            key={columnIndex}
            ref={columnRefs[columnIndex]}
            className="space-y-4"
            style={{
              transform: `translateY(${columnOffsets[columnIndex]}px)`,
              transition: "transform 0.1s cubic-bezier(0.4, 1, 0.6, 1)",
              willChange: "transform",
            }}
          >
            {getColumnPosts(columnIndex).map((post) => (
              <BeautifulCard
                key={post.id}
                post={{
                  id: post.id,
                  title: post.title,
                  imgUrl: post.imgUrl,
                  createdAt: post.createdAt,
                  user: {
                    username: post.user.username,
                    image: post.user.image,
                  },
                }}
              />
            ))}
          </div>
        ))}
      </div>
        
      {isFetching && (
        <div className="flex justify-center items-center mt-12">
          <Loader2 className="w-6 h-6 text-myRed animate-spin" />
        </div>
      )}



      {posts.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-500">
          <p className="text-lg font-medium">No posts found</p>
          <p className="text-sm mt-2">Try refining your search</p>
        </div>
      )}
    </div>
  );
};

export default SearchBody;
