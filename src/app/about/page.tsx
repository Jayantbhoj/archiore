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

      {/* Hero Section */}
      <div className="h-[40rem] w-full bg-black flex flex-col items-center justify-center relative overflow-hidden">
        <h3 className="md:text-6xl text-3xl lg:text-7xl font-bold text-center mt-20 text-white relative z-20">
          Welcome to Archiore
        </h3>
        <div className="w-[40rem] h-40 relative mt-6">
          {/* Gradients */}
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />

          {/* Core component */}
          <SparklesCore
            background="transparent"
            minSize={0.4}
            maxSize={1}
            particleDensity={1200}
            className="w-full h-full"
            particleColor="#FFFFFF"
          />

          {/* Radial Gradient to prevent sharp edges */}
          <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
        </div>
      </div>

      {/* About Archiore Section */}
      <section className="bg-black text-white py-20 px-6 text-center">
        <h2 className="text-3xl font-bold mb-6">About Archiore</h2>
        <p className="max-w-3xl mx-auto text-lg text-gray-300">
          Archiore is a platform built for architects, whether professionals or students, 
          to showcase their work, connect with peers, and explore innovative designs. 
          Whether you're looking to present your portfolio, discover inspiring projects, 
          or collaborate with like-minded individuals, Archiore provides the space to bring 
          creativity to life.
        </p>
      </section>

{/* Why Archiore? (Motivation) Section */}
<section className="bg-black text-white py-20 px-6 text-center">
  <h2 className="text-3xl font-bold mb-6">Why Archiore?</h2>

  {/* Reference Sheets */}
  <div className="max-w-3xl mx-auto text-lg text-gray-300">
    <h3 className="text-2xl font-semibold text-white mb-4">Access & Share Reference Sheets</h3>
    <p>
      Architecture students and professionals rely on well-structured reference sheets 
      for quick access to essential details like building standards, materials, and design principles. 
      However, finding high-quality, community-verified reference materials can be difficult.
    </p>
    <p className="mt-4">
      Archiore provides a dedicated space for architects to upload, organize, and explore reference sheets. 
      Whether you need quick construction guidelines, zoning regulations, or historical design references, 
      you can find or contribute valuable resources in one centralized hub.
    </p>
  </div>

  {/* Portfolio Sharing */}
  <div className="max-w-3xl mx-auto text-lg text-gray-300 mt-10">
    <h3 className="text-2xl font-semibold text-white mb-4">Seamless Portfolio Sharing</h3>
    <p>
      A strong portfolio is crucial for architects and students to showcase their skills, 
      yet traditional platforms often lack the community engagement that makes portfolios more valuable.
    </p>
    <p className="mt-4">
      With Archiore, you can create an interactive portfolio where peers and professionals 
      can view, comment, and appreciate your work. Unlike generic portfolio sites, 
      Archiore is built specifically for architects, ensuring your work reaches the right audience 
      while opening doors to opportunities and collaborations.
    </p>
  </div>
</section>

      <section className="bg-black text-white py-20 px-6 text-center">
  <h2 className="text-3xl font-bold mb-6">Features & Benefits</h2>
  <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10">
    <div className="p-6 border border-gray-700 rounded-lg">
      <h3 className="text-xl font-semibold">🎨 Showcase Your Work</h3>
      <p className="text-gray-300 mt-2">Upload architecture sheets, projects, and designs in high quality.</p>
    </div>
    <div className="p-6 border border-gray-700 rounded-lg">
      <h3 className="text-xl font-semibold">🌍 Connect with Peers</h3>
      <p className="text-gray-300 mt-2">Engage with other architects, students, and professionals.</p>
    </div>
    <div className="p-6 border border-gray-700 rounded-lg">
      <h3 className="text-xl font-semibold">🔎 Discover New Ideas</h3>
      <p className="text-gray-300 mt-2">Browse trending architecture projects and get inspired.</p>
    </div>
    <div className="p-6 border border-gray-700 rounded-lg">
      <h3 className="text-xl font-semibold">🤝 Collaborate & Grow</h3>
      <p className="text-gray-300 mt-2">Work on projects together and receive feedback from experts.</p>
    </div>
  </div>
</section>
<section className="bg-black text-white py-20 px-6 text-center">
  <h2 className="text-3xl font-bold mb-6">Ready to Showcase Your Work?</h2>
  <p className="max-w-3xl mx-auto text-lg text-gray-300">
    Join thousands of architects and students on Archiore. Upload your designs, 
    connect with peers, and take your portfolio to the next level!
  </p>

  <Link href="/signup">

  <button className="mt-6 px-6 py-3 bg-myRed hover:bg-myBlack hover:text-white text-white font-semibold rounded-lg">
    Get Started
  </button>
  </Link>
</section>
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
