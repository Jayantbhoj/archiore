'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { postDetailsAction } from '@/app/actions';
import Link from 'next/link';
import LoadingSpinner from '@/app/loading';

export default function Post() {
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const postId = usePathname().split('/').pop();

  useEffect(() => {
    if (postId) {
      const fetchPostDetails = async () => {
        try {
          const data = await postDetailsAction(postId as string);
          setPost(data);
        } catch (error) {
          console.error('Error fetching post details:', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchPostDetails();
    }
  }, [postId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        <p>Post not found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row p-8 bg-white border-1 color-myWhite rounded-lg mb-8 max-w-4xl min-w-[450px] mx-auto">
      {/* Left Side: Image Section */}
      <div className="flex-1 pr-8 mb-8 lg:mb-0">
        <img
          src={post.imgUrl}
          alt="Post image"
          className="w-full h-auto rounded-lg cursor-pointer object-contain min-h-[300px]"
          onClick={() => setIsImageModalOpen(true)}
        />
      </div>

      {/* Right Side: Interaction Section */}
      <div className="flex flex-col justify-start w-full lg:w-1/2 pl-8">
        <div className="flex items-center mb-1">
          <p className="text-2xl font-semibold text-myBlack flex-1">{post.title}</p>
        </div>
        {post.description && (
          <div>
            <p className="text-lg">{post.description}</p>
          </div>
        )}

        <div>
          <p className='font-semibold text-sm text-black p-1'>Tags </p>
          
          <p className="text-xs font-semibold border border-gray-300 text-gray-700 bg-gray-100 px-3 py-1 rounded-full inline-block mb-2">
            {post.tags}
          </p>

        </div>

        {/* Profile Section */}
        <Link href={`/users/${post.user?.username}`} passHref>
          <span className="flex items-center mb-4">
            <img
              src={post.user?.image || "/noAvatar.png"}
              alt="Profile"
              className="rounded-full mr-4 w-8 h-8 object-cover"
            />
            <p className="text-myBlack text-sm font-semibold text-lg">{post.user?.username}</p>
          </span>
        </Link>
      </div>

      {/* Image Modal */}
      {isImageModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-[80]"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div className="w-full max-w-4xl p-6" onClick={(e) => e.stopPropagation()}>
            <img
              src={post.imgUrl}
              alt="Post image"
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg shadow-md"
            />
          </div>

          <button
            onClick={() => setIsImageModalOpen(false)}
            className="absolute top-6 right-6 text-white text-4xl hover:text-gray-400 transition-colors"
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
}
