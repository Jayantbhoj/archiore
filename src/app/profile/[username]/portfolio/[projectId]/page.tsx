import React from 'react'

import { isSignedInAction } from '@/app/actions';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import LandingNavbar from '@/components/LandingNavbar';
import ProjectPage from './ProjectPage';





export default async function UserPage() {


  const { signedIn } = await isSignedInAction(); // Now properly cached

  return (
    <>
      {signedIn ? <Navbar shadow='sm' /> : <LandingNavbar />}
       <ProjectPage/>
    </>
  );
}