import React from 'react';
import UserProjectPage from './UserProjects';
import { isSignedInAction } from '@/app/actions';
import Navbar from '@/components/Navbar';
import LandingNavbar from '@/components/LandingNavbar';

export default async function Page() {
  const { signedIn } = await isSignedInAction(); 

  return (
    <div>
      {signedIn ? <Navbar shadow="sm" /> : <LandingNavbar />}
      <UserProjectPage />
    </div>
  );
}
