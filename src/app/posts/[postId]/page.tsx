"use client"
import { isSignedInAction } from '@/app/actions';
import LoadingSpinner from '@/app/loading';
import LandingNavbar from '@/components/LandingNavbar';
import Navbar from '@/components/Navbar';
import Post from '@/components/Posts';
import RelatedPosts from '@/components/RelatedPosts';
import React, { useEffect, useState } from 'react';
import { ParallaxProvider } from 'react-scroll-parallax';

const Page = () => {
  const [signedIn, setSignedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { signedIn } = await isSignedInAction();
        setSignedIn(signedIn);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <LoadingSpinner/>
    );
  }

  return (
    <div>
      {signedIn ? <Navbar /> : <LandingNavbar />}
      <Post />
      <ParallaxProvider>
        <RelatedPosts/>
      </ParallaxProvider>
    </div>
  );
};

export default Page;
