"use client";

import { useEffect, useState, useRef } from "react";
import { getFeedAction } from "@/app/actions";
import BeautifulCard from "@/components/BeautifulCard";

interface Post {
  id: string;
  title: string;
  imgUrl: string;
  createdAt: string;
  user: {
    username: string;
    image: string;
  };
  comments: { content: string; user: { username: string } }[];
}

const Body = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const columnRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
  const [columnOffsets, setColumnOffsets] = useState<number[]>([0, 0, 0, 0]);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostRef = useRef<HTMLDivElement | null>(null);

  // Split posts into 4 columns
  const getColumnPosts = (columnIndex: number) => posts.filter((_, index) => index % 4 === columnIndex);

  // Smooth scrolling effect for each column
  useEffect(() => {
    const handleScroll = () => {
      columnRefs.forEach((ref, index) => {
        if (!ref.current) return;

        const speed = 0.05 * (index + 1);
        const offset = window.scrollY * speed;

        setColumnOffsets((prev) => {
          const newOffsets = [...prev];
          newOffsets[index] = offset;
          return newOffsets;
        });
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch posts (Initial + Pagination)
  const fetchPosts = async (pageNumber: number) => {
    if (!hasMore) return;
    setLoading(true);

    try {
      const postsData = await getFeedAction(pageNumber);
      const normalizedPosts = postsData.map((post: any) => ({
        ...post,
        user: {
          ...post.user,
          image: post.user.image || "/noAvatar.png",
        },
      }));

      setPosts((prev) => [...prev, ...normalizedPosts]);

      // Stop fetching if fewer than 10 posts are returned
      if (normalizedPosts.length < 10) setHasMore(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load more posts when the last post is visible
  useEffect(() => {
    if (!lastPostRef.current) return;

    observer.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasMore) {
        setPage((prev) => prev + 1);
      }
    });

    observer.current.observe(lastPostRef.current);

    return () => observer.current?.disconnect();
  }, [posts]);

  // Fetch initial posts on mount & when `page` changes
  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  if (loading && posts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-lg font-medium text-gray-600">Loading your feed...</div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-myWhite min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
            {getColumnPosts(columnIndex).map((post, index, arr) => (
              <div key={post.id} ref={index === arr.length - 1 ? lastPostRef : null}>
                <BeautifulCard
                  post={{
                    id: post.id,
                    title: post.title,
                    imgUrl: post.imgUrl,
                    createdAt: post.createdAt,
                    user: {
                      username: post.user.username,
                      image: post.user.image,
                    },
                    comments: post.comments.map((comment) => ({
                      description: comment.content,
                      user: comment.user,
                    })),
                  }}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
  
      {/* Show loader when fetching more posts */}
      {loading && hasMore && (
        <div className="flex justify-center mt-6">
          <div className="animate-spin h-6 w-6 border-4 border-gray-300 border-t-myRed rounded-full"></div>
        </div>
      )}
  
      {/* Show message when no more posts left */}
      {!hasMore && (
        <div className="text-center text-gray-500 mt-60">
          <p>End of feed</p>
        </div>
      )}
    </div>
  );
  
};

export default Body;
