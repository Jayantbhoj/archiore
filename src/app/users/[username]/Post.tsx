import { useState, useEffect } from "react";

interface Post {
  id: string;
  imgUrl: string;
  title: string;
  description: string | null;
  tags: string;
  createdAt: string;
  upvotes: number;
  user: {
    username: string;
    image: string | '/noAvatar.png';
  };
  comments: {
    id: number;
    description: string;
    createdAt: string;
    user: {
      username: string;
      image: string | '/noAvatar.png';
    };
  }[];
}

const UserPost: React.FC<{ post: Post }> = ({ post }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false); // For larger image modal

  useEffect(() => {
    if (isModalOpen || isImageModalOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [isModalOpen, isImageModalOpen]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openImageModal = () => setIsImageModalOpen(true); // Open large image modal
  const closeImageModal = () => setIsImageModalOpen(false); // Close large image modal

  return (
    <>
      {/* Post Image */}
      <div className="cursor-pointer" onClick={openModal}>
        <img
          src={post.imgUrl}
          alt={post.title}
          className="w-full h-40 object-cover rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Main Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center p-4 z-[70]"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-xl w-full max-w-lg md:max-w-4xl p-6 shadow-lg relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-600 text-3xl hover:text-gray-800 transition-colors"
            >
              &times;
            </button>

            <div className="flex flex-col md:flex-row">
              {/* Left Section: Image */}
              <div className="w-full md:w-1/2">
                <img
                  src={post.imgUrl}
                  alt={post.title}
                  className="w-full h-auto max-h-96 object-contain rounded-lg shadow-md cursor-pointer"
                  onClick={openImageModal} // Open the image in a modal
                />
              </div>

              {/* Right Section: Post Details */}
              <div className="md:ml-6 mt-6 md:mt-0 w-full md:w-1/2">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{post.title}</h2>
                <p className="text-base md:text-lg text-gray-700 mt-2">{post.description}</p>

                {/* User Info */}
                <div className="mt-4 text-gray-600 text-sm">
                  <p>Posted by: <span className="font-semibold">{post.user.username}</span></p>
                </div>

                {/* Comments Section */}
                <div className="mt-6">
                  <h4 className="text-lg md:text-xl font-semibold text-gray-800">Comments</h4>
                  <ul className="mt-2 space-y-3">
                    {post.comments.map((comment) => (
                      <li key={comment.id} className="text-gray-600">
                        <strong>{comment.user.username}:</strong> {comment.description}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Large Image Modal */}
      {isImageModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-[80]"
          onClick={closeImageModal}
        >
          <div
            className="w-full max-w-3xl p-4"
            onClick={(e) => e.stopPropagation()} // Prevent click propagation to modal background
          >
            <img
              src={post.imgUrl}
              alt={post.title}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg shadow-md"
            />
          </div>

          {/* Close Button for Image Modal */}
          <button
            onClick={closeImageModal}
            className="absolute top-4 right-4 text-white text-3xl hover:text-gray-400 transition-colors"
          >
            &times;
          </button>
        </div>
      )}
    </>
  );
};

export default UserPost;
