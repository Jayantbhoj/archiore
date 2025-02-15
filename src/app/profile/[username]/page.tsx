'use client';

import Navbar from '@/components/Navbar';
import ProfileBody from '@/components/ProfileBody';
import ProfileHeader from '@/components/ProfileHeader';
import { useState } from 'react';



const ProfilePage = () => {
  const [selectedTab, setSelectedTab] = useState<'posts' | 'saved'>('posts');

  return (
    <div>
      <Navbar />
      <div className="md:sticky md:top-[77px] z-[60] bg-myWhite">
        {/* Pass state and setter to ProfileHeader */}
        <ProfileHeader selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      </div>
      <div className="pt-[1px]">
        {/* Pass selectedTab to ProfileBody */}
        <ProfileBody selectedTab={selectedTab} />
      </div>
    </div>
  );
};
export default ProfilePage;
