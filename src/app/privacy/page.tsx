"use client"
import LandingNavbar from '@/components/LandingNavbar'
import Navbar from '@/components/Navbar';


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

      <div className="min-h-screen bg-black text-white py-20 px-6 flex flex-col items-center">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-bold mb-6 text-center">Privacy Policy</h1>
        <p className="text-gray-300 mb-4">
          At Archiore, we value your privacy and are committed to protecting your personal data. 
          This Privacy Policy explains how we collect, use, and safeguard your information.
        </p>

        <h2 className="text-2xl font-semibold mt-6">1. Information We Collect</h2>
        <p className="text-gray-300 mb-4">
          We collect personal information such as your name, email, and uploaded content when 
          you sign up or interact with our platform.
        </p>

        <h2 className="text-2xl font-semibold mt-6">2. How We Use Your Information</h2>
        <p className="text-gray-300 mb-4">
          - To provide and improve our services.<br />
          - To communicate updates and respond to inquiries.<br />
          - To personalize your experience on the platform.
        </p>

        <h2 className="text-2xl font-semibold mt-6">3. Data Security</h2>
        <p className="text-gray-300 mb-4">
          We implement strong security measures to protect your data, but we cannot guarantee 
          complete security due to the nature of online services.
        </p>

        <h2 className="text-2xl font-semibold mt-6">4. Third-Party Services</h2>
        <p className="text-gray-300 mb-4">
          We may use third-party services for analytics, storage, and authentication. These services 
          have their own privacy policies.
        </p>

        <h2 className="text-2xl font-semibold mt-6">5. Your Rights</h2>
        <p className="text-gray-300 mb-4">
          You have the right to access, update, or delete your personal information. Contact us for 
          any privacy-related concerns.
        </p>

        <h2 className="text-2xl font-semibold mt-6">6. Changes to this Policy</h2>
        <p className="text-gray-300 mb-4">
          We may update this policy periodically. Continued use of our platform constitutes acceptance 
          of any changes.
        </p>

        <h2 className="text-2xl font-semibold mt-6">7. Contact Us</h2>
        <p className="text-gray-300 mb-4">
          If you have questions regarding our privacy policy, please contact us at 
          <Link href="/contact" className="text-myRed hover:underline"> Contact Us</Link>.
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
