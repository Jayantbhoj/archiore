"use client"
import LandingNavbar from '@/components/LandingNavbar'
import Navbar from '@/components/Navbar';
import { SparklesCore } from '@/components/ui/Sparkles'

import React, { useEffect, useState } from 'react'
import { isSignedInAction } from '../actions';
import Link from 'next/link';

const page = () => {
    const [signedIn, setSignedIn] = useState<boolean>(false); // State for signed-in status
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const { signedIn } = await isSignedInAction(); // Check if signed in
          setSignedIn(signedIn);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
  
      fetchData();
    }, []);

    return (
    <>
      {signedIn ? <Navbar /> : <LandingNavbar />}

      <div className="bg-black text-white min-h-screen py-16 px-6 md:px-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-center">Terms and Conditions</h1>
          <p className="text-gray-300 mb-4">
            Welcome to Archiore! By using our platform, you agree to comply with the
            following terms and conditions.
          </p>
          
          <h2 className="text-2xl font-semibold mt-6">1. Acceptance of Terms</h2>
          <p className="text-gray-300 mt-2">
            By accessing and using Archiore, you agree to be bound by these Terms
            and our Privacy Policy.
          </p>

          <h2 className="text-2xl font-semibold mt-6">2. User Responsibilities</h2>
          <p className="text-gray-300 mt-2">
            Users are responsible for the content they upload, ensuring it does not
            violate copyright laws, privacy rights, or any legal regulations.
          </p>

          <h2 className="text-2xl font-semibold mt-6">3. Content Ownership</h2>
          <p className="text-gray-300 mt-2">
            Users retain ownership of their uploaded content but grant Archiore a
            license to display and distribute it on the platform.
          </p>

          <h2 className="text-2xl font-semibold mt-6">4. Prohibited Activities</h2>
          <p className="text-gray-300 mt-2">
            Users must not engage in illegal activities, harassment, or the
            distribution of harmful content.
          </p>

          <h2 className="text-2xl font-semibold mt-6">5. Account Termination</h2>
          <p className="text-gray-300 mt-2">
            We reserve the right to suspend or terminate accounts that violate these
            terms without prior notice.
          </p>

          <h2 className="text-2xl font-semibold mt-6">6. Modifications to Terms</h2>
          <p className="text-gray-300 mt-2">
            Archiore may update these terms at any time. Continued use of the
            platform constitutes acceptance of the updated terms.
          </p>

          <h2 className="text-2xl font-semibold mt-6">7. Contact Information</h2>
          <p className="text-gray-300 mt-2">
            If you have any questions regarding these terms, please contact us at
            support@archiore.com.
          </p>
        </div>
      </div>
<footer className="bg-black py-4">
  <div className="container mx-auto flex justify-center items-center text-white">
    <p className="text-sm mr-6">
      &copy; {new Date().getFullYear()} 
    </p>
    <p className="text-sm mr-6">
      Archiore. 
    </p>
    <p className="text-sm mr-6">
      All Rights Reserved. 
    </p>

    <div>
      <a href="/terms" className="text-sm hover:text-gray-400 mx-2">Terms</a>
      <a href="/privacy" className="text-sm hover:text-gray-400 mx-2">Privacy</a>
      <a href="/contact" className="text-sm hover:text-gray-400 mx-2">Contact</a>
    </div>
  </div>
</footer>

    </>
  )
}

export default page;
