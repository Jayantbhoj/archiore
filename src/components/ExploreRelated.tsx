"use client";

import { useEffect, useState, useRef } from "react";
import BeautifulCard from "@/components/BeautifulCard";
import { usePathname } from "next/navigation";
import { exploreRelatedPostsAction } from "@/app/actions";
import { Loader2 } from "lucide-react";

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

const ExploreRelatedPosts = () => {
  const pathname = usePathname();
  const tag = decodeURIComponent(pathname.split("/").pop() || "");

  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  const columnRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];
  const [columnOffsets, setColumnOffsets] = useState<number[]>([0, 0, 0, 0]);

  const getColumnPosts = (columnIndex: number) => {
    return posts.filter((_, index) => index % 4 === columnIndex);
  };

  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    setLoading(true);
  }, [tag]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!tag || !hasMore || isFetching) return;
      setIsFetching(true);

      try {
        const newPosts = await exploreRelatedPostsAction(tag);

        const normalizedPosts = newPosts.map((post: any) => ({
          ...post,
          user: {
            ...post.user,
            image: post.user.image || "/noAvatar.png",
          },
        }));

        setPosts((prev) => {
          const uniquePosts = [...prev, ...normalizedPosts].filter(
            (post, index, self) => index === self.findIndex((p) => p.id === post.id)
          );
          return uniquePosts;
        });

        if (newPosts.length === 0) setHasMore(false);
      } catch (error) {
        console.error("Error fetching related posts:", error);
      } finally {
        setLoading(false);
        setIsFetching(false);
      }
    };

    fetchPosts();
  }, [tag, page]);

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
        const speed = 0.05 * (index + 1);
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
      <div className="flex justify-center items-center h-32">
        <Loader2 className="w-6 h-6 text-myRed animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 bg-myWhite min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Related Posts for "{tag}"</h2>
  
      {posts.length === 0 && !loading ? (
        <div className="text-center text-gray-500">No related posts found.</div>
      ) : (
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
      )}
  
      {isFetching && (
        <div className="flex justify-center items-center mt-12">
          <Loader2 className="w-6 h-6 text-myRed animate-spin" />
        </div>
      )}
    </div>
  );
};

export default ExploreRelatedPosts;
