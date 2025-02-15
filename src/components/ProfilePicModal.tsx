'use client';

import { useState } from 'react';

interface ProfilePicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChange: (file: File) => void;
  onRemove: () => void;
}

const ProfilePicModal: React.FC<ProfilePicModalProps> = ({ isOpen, onClose, onChange, onRemove }) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file); // Pass selected file to the parent
    }
  };

  const handleRemove = async () => {
    try {
      // Call the onRemove function passed down from the parent (this should invoke the server-side action to delete the profile pic)
      await onRemove();
      onClose(); // Close the modal after removal
    } catch (error) {
      console.error("Error removing profile picture:", error);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-myBlack bg-opacity-70 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-96 max-w-md">
            <h2 className="text-xl font-semibold text-myBlack">Edit profile picture?</h2>
            <div className="mt-4">
              <button
                onClick={() => {
                  document.getElementById('file-input')?.click(); // Open file input dialog
                  onClose(); // Close modal after triggering the file input
                }}
                className="px-6 py-2 bg-myRed text-white rounded-md hover:bg-red-700 w-full mb-3"
              >
                Change Picture
              </button>
              <button
                onClick={handleRemove} // Call the remove handler on click
                className="px-6 py-2 bg-gray-300 text-myBlack rounded-md hover:bg-gray-400 w-full"
              >
                Remove Picture
              </button>
              <button
                onClick={onClose} // Close the modal without action
                className="px-6 py-2 bg-gray-200 text-myBlack rounded-md hover:bg-gray-300 w-full mt-3"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        id="file-input"
        className="hidden"
        onChange={handleImageChange} // Handle image selection
      />
    </>
  );
};

export default ProfilePicModal;
