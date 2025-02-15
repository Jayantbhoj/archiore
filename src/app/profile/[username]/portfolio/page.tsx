"use client"

import React, { useState, useEffect } from 'react';
import PortfolioHeader from './PortfolioHeader';
import { isSignedInAction } from '@/app/actions';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import LandingNavbar from '@/components/LandingNavbar';
import PortfolioBody from './PortfolioBody';
import { AdminPortfolioAction } from '../actions';
import Loading from '@/app/loading';  // Your custom loading component



export default function Page() {

  // State management for loading and data
  const [isLoading, setIsLoading] = useState(true);
  const [portfolioData, setPortfolioData] = useState<any>(null);
  const [signedIn, setSignedIn] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { signedIn } = await isSignedInAction(); // Check if signed in
        setSignedIn(signedIn);

        // Call AdminPortfolioAction to get the userId and portfolio data
        const data = await AdminPortfolioAction();
        setPortfolioData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // If loading, show the loading component
  if (isLoading) return <Loading />;

  if (!portfolioData) {
    notFound(); // If portfolioData is null, user is not found
  }

  const { id, name } = portfolioData.user; // Destructure 'id' as 'userId' from portfolioData.user

  return (
    <>
      {signedIn ? <Navbar /> : <LandingNavbar />}
      <PortfolioHeader userId={id} name={name} />
      <PortfolioBody userId={id} projects={portfolioData.projects} />
    </>
  );
}
