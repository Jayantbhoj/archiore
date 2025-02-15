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

      <div className="min-h-screen bg-black text-white py-20 px-6 flex flex-col items-center">
        <div className="max-w-3xl text-center">
          <h1 className="text-4xl font-bold mb-6">Get in Touch</h1>
          <p className="text-gray-300 mb-8">
            Have questions, feedback, or collaboration ideas? We’d love to hear from you!  
            Reach out to us through the details below, and we'll get back to you as soon as possible.
          </p>

          {/* Contact Email */}
          <div className="border border-gray-700 p-6 rounded-lg shadow-lg w-full">
            <h2 className="text-2xl font-semibold mb-4">Email</h2>
            <p className="text-lg">
              For general inquiries, support, or feedback, email us at:
            </p>
            <p className="text-lg font-semibold mt-2">
              <Link href="mailto:contact@archiore.com" className="text-myRed hover:underline">
                contact@archiore.com
              </Link>
            </p>
          </div>

          {/* Response Time Information */}
          <div className="border border-gray-700 p-6 rounded-lg shadow-lg w-full mt-8">
            <h2 className="text-2xl font-semibold mb-4">Response Time</h2>
            <p className="text-lg">
              We aim to respond to all inquiries within <span className="text-white font-semibold">24-48 hours</span>. 
              During busy periods, responses may take slightly longer, but we appreciate your patience.
            </p>
          </div>

          {/* Frequently Asked Questions */}
          <div className="border border-gray-700 p-6 rounded-lg shadow-lg w-full mt-8">
            <h2 className="text-2xl font-semibold mb-4">What Can You Contact Us About?</h2>
            <ul className="text-lg text-gray-300 list-disc list-inside">
              <li className="mb-2">📌 Issues with your account or login</li>
              <li className="mb-2">📌 Questions about uploading portfolios</li>
              <li className="mb-2">📌 Reporting bugs or technical issues</li>
              <li className="mb-2">📌 Collaboration and partnership opportunities</li>
              <li className="mb-2">📌 Suggestions and feedback to improve Archiore</li>
            </ul>
          </div>

          {/* Thank You Note */}
          <div className="border border-gray-700 p-6 rounded-lg shadow-lg w-full mt-8">
            <h2 className="text-2xl font-semibold mb-4">Thank You!</h2>
            <p className="text-lg text-gray-300">
              We truly appreciate your interest in Archiore. Whether you're here to showcase your work, explore inspiring projects, 
              or connect with fellow architects, we’re excited to have you with us! 
            </p>
          </div>
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
  );
};

export default page;
