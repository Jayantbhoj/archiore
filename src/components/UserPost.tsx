import { deletePostAction } from "@/app/profile/[username]/actions";
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
    image: string | null;
  };
  comments: {
    id: number;
    description: string;
    createdAt: string;
    user: {
      username: string;
      image: string | null;
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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for delete confirmation modal
  const openImageModal = () => setIsImageModalOpen(true); // Open large image modal
  const closeImageModal = () => setIsImageModalOpen(false); // Close large image modal
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  
  
  const handleDeletePost = async () => {
    if (!post.id) return;
  
    setIsLoading(true); // Show loading spinner during the delete process
    const response = await deletePostAction(post.id);
    
    if (response.success) {
      setIsDeleteModalOpen(false); // Close the delete modal
      window.location.reload(); // Refresh the page to reflect the changes
    } else {
      console.error("Failed to delete post:", response.message);
    }
    
    setIsLoading(false); // Hide loading spinner after the process is completed
  };
  
  
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

                  <button
                    className="absolute top-7 left-7 bg-gray-300 bg-opacity-30 text-white p-1 rounded-md text-sm hover:shadow  w-7 h-7 transition"
                    onClick={() => {

                      setIsDeleteModalOpen(true); // Show the delete confirmation modal
                    }}
                  >
                    <img src="/trash.png" alt="trash" />
                  </button>
              </div>

              {/* Right Section: Post Details */}
              <div className="md:ml-6 mt-6 md:mt-0 w-full md:w-1/2">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{post.title}</h2>
                <p className="text-base md:text-lg text-gray-700 mt-2">{post.description}</p>

                {/* User Info */}
                <div className="mt-4 text-gray-600 text-sm">
                  <p>Posted by: <span className="font-semibold">{post.user.username}</span></p>
                  <p>Created At: {new Date(post.createdAt).toLocaleDateString()}</p>
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
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[80]">
          <div className="bg-white p-6 rounded-md shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Delete Sheet</h2>
            <p className="text-sm mb-4">Are you sure you want to delete this sheet?</p>
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-300 px-4 py-2 rounded-md"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-myRed text-white px-4 py-2 rounded-md"
                onClick={handleDeletePost}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserPost;
