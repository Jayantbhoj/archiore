import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  imgUrl: string;
  createdAt: string;
  user: {
    username: string;
    image: string | '/noAvatar.png';
  };
  comments?: {
    description: string;
    user: {
      username: string;
    };
  }[];
}

const BeautifulCard = ({ post }: { post: Post }) => {
  const [hovered, setHovered] = useState(false);
  const [isBookmarkFilled, setIsBookmarkFilled] = useState(false);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarkFilled((prev) => !prev);
  };

  return (
    <div
      className="relative w-full break-inside-avoid mb-4"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/posts/${post.id}`} passHref>
        <div className="relative w-full rounded-lg overflow-hidden shadow-md cursor-pointer">
          {/* Image Container */}
          <div className="relative w-full">
            <Image
              src={post.imgUrl}
              alt={post.title}
              width={500}
              height={0}
              className="w-full h-auto"
              style={{ display: "block" }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          {/* Overlay Content */}
          <div
            className={`absolute inset-0 bg-black/40 text-white p-4 flex flex-col justify-between transition-opacity duration-300 ${
              hovered ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Title */}
            <div className="font-semibold text-lg">{post.title}</div>

            {/* Bottom Content */}
            <div className="flex justify-between items-center mt-4">
              {/* User Info */}
              <div className="flex items-center space-x-2">
                  <div className="relative w-8 h-8 cursor-pointer">
                    <Image
                      src={post.user.image || "/noAvatar.png"}
                      alt={post.user.username}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <span className="font-semibold text-sm cursor-pointer">
                    {post.user.username}
                  </span>
              </div>
            </div>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={handleBookmarkClick}
            className={`absolute top-4 right-4 p-2 rounded-full hover:bg-black/60 transition-all ${
              hovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={isBookmarkFilled ? "/whiteBookmarkFilled.png" : "/whiteBookmark.png"}
              alt="Bookmark"
              className="w-6 h-6"
            />
          </button>
        </div>
      </Link>
    </div>
  );
};

export default BeautifulCard;
