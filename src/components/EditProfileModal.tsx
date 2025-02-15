'use client';

import { updateProfileAction } from '@/app/actions';
import { useState } from 'react';

interface EditProfileModalProps {
  userDetails: {
    firstName: string;
    lastName: string;
    username: string;
    bio: string;
  };
  onSave: () => void;
  onCancel: () => void;
}

export default function EditProfileModal({ userDetails, onSave, onCancel }: EditProfileModalProps) {
  const [firstName, setFirstName] = useState(userDetails.firstName);
  const [lastName, setLastName] = useState(userDetails.lastName);
  const [username, setUsername] = useState(userDetails.username);
  const [bio, setBio] = useState(userDetails.bio);


  const handleSubmit = async () => {
    try {
      // Here, call your updateProfileAction with the updated details
      const result = await updateProfileAction({ firstName, lastName, username, bio });
      
      if (result.ok) {
        console.log('Profile updated successfully');
        onSave(); // Notify parent component of the successful save
        window.location.reload();
      } else {
        console.log('Failed to update profile', result.error);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-myBlack bg-opacity-70 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-96 max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-myBlack">Edit Profile</h2>
          <button
            onClick={onCancel}
            className="text-xl text-myBlack">
            x
          </button>
        </div>
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-myBlack">First Name</label>
            <input
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-1 focus:ring-myBlack"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-myBlack">Last Name</label>
            <input
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-1 focus:ring-myBlack"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-myBlack">Username</label>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-1 focus:ring-myBlack"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-myBlack">Bio</label>
            <input
              type="text"
              placeholder="Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-1 focus:ring-myBlack"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-between">
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-gray-300 text-myBlack rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 text-myRed rounded-md hover:bg-gray-300"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
