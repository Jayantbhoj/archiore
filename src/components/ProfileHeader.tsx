import { useState, useEffect } from 'react';
import EditProfileModal from './EditProfileModal';
import ProfilePicModal from './ProfilePicModal';
import { getSignedURLpfp } from '@/app/profile/[username]/actions';
import Link from 'next/link';
import { userDetailsAction } from '@/app/actions';
import Loading from '@/app/loading';

interface ProfileHeaderProps {
  selectedTab: 'posts' | 'saved';
  setSelectedTab: (tab: 'posts' | 'saved') => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ selectedTab, setSelectedTab }) => {

  const [userDetails, setUserDetails] = useState({
    firstName: '',
    lastName: '',
    username: '',
    image: '/noAvatar.png',
    bio: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);


  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const data = await userDetailsAction();
        if (data) {
          setUserDetails({
            firstName: data.name || '',
            lastName: data.surname || '',
            username: data.username || '',
            image: data.image || '/noAvatar.png',
            bio: data.bio || '',
          });
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, []);


  const computeSHA256 = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  };

  if (isLoading) return <Loading />;

  return (
    <div className='z-100'>
      <div className='profile-container bg-myWhite px-3 p-3'>
        <div className='profile-header w-full p-2 mb-3'>
          <div className='flex items-center justify-around sm:flex-row flex-col'>
            <div className='flex items-center gap-1 sm:gap-6 sm:flex-row flex-col sm:items-center'>
              <img
                src={userDetails.image}
                alt='User Avatar'
                className='w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover cursor-pointer'
                onClick={() => setIsImageModalOpen(true)}
              />
              <div className='text-center sm:text-left mt-3 sm:mt-0'>
                <h1 className='text-2xl text-myBlack font-bold'>
                  {userDetails.firstName} {userDetails.lastName}
                </h1>
                <p className='text-sm font-semibold text-gray-500'>@{userDetails.username}</p>
                <p className='text-sm font-semibold text-gray-700 mb-1'>{userDetails.bio}</p>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className='text-myRed text-sm hover:underline'
                >
                  Edit Profile
                </button>
              </div>
            </div>

            <div className='flex flex-col sm:flex-row items-center sm:items-start gap-1'>
              <h3 className='text-myBlack font-bold mt-3 text-2xl mr-2'>Portfolio</h3>
              <Link href={`/profile/${userDetails.username}/portfolio`}>
                <img
                  src='/portfolio.png'
                  alt='portfolio'
                  className='w-32 h-32 cursor-pointer'
                />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className='flex justify-center pb-4'>
        <button
          className={`px-5 py-2 rounded-full text-lg font-semibold mx-2 transition ${
            selectedTab === 'posts' ? 'bg-myBlack text-white' : 'bg-gray-200 text-myBlack hover:bg-gray-300'
          }`}
          onClick={() => setSelectedTab('posts')}
        >
          My Posts
        </button>

        <button
          className={`px-5 py-2 rounded-full text-lg font-semibold mx-2 transition ${
            selectedTab === 'saved' ? 'bg-myBlack text-white' : 'bg-gray-200 text-myBlack hover:bg-gray-300'
          }`}
          onClick={() => setSelectedTab('saved')}
        >
          Saved
        </button>
      </div>

      <ProfilePicModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onChange={async (image: File) => {
          try {
            const response = await getSignedURLpfp({
              fileType: image.type,
              fileSize: image.size,
              checksum: await computeSHA256(image),
            });

            if ('success' in response) {
              const { url, fileName } = response.success;
              const uploadResponse = await fetch(url, {
                method: 'PUT',
                body: image,
                headers: { 'Content-Type': image.type },
              });

              if (!uploadResponse.ok) throw new Error('Image upload failed.');

              alert('Profile picture changed!');
              console.log('Uploaded file name:', fileName);
            } else if ('failure' in response) {
              throw new Error(response.failure);
            }
          } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while uploading.');
          }
        }}
        onRemove={() => setUserDetails((prev) => ({ ...prev, image: '/noAvatar.png' }))}
      />

      {isModalOpen && <EditProfileModal userDetails={userDetails} onSave={() => setIsModalOpen(false)} onCancel={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default ProfileHeader;
