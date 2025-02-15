"use client";

import { isSignedInAction } from "@/app/actions";

import LandingNavbar from "@/components/LandingNavbar";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // ✅ Import useParams

import ExploreRelatedPosts from "@/components/ExploreRelated";

const ExplorePage = () => {
  const params = useParams(); // ✅ Get params safely
  const title = params?.title as string; // ✅ Type assertion (since params might be undefined)
  if (!title) return null; // Handle edge case where title is missing

  const decodedTitle = decodeURIComponent(title);

  // Simulate fetching image based on title
  const imageSrc = `/${decodedTitle.toLowerCase().replace(/\s+/g, "-")}.jpg`;
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
      <div className=" bg-myWhite dark:bg-neutral-950 py-4 px-4 md:px-12">
        {/* Image Section with Overlay and Title */}
        <div
          className="relative w-full md:w-2/3 mx-auto rounded-lg overflow-hidden mb-8"
          style={{ maxWidth: "600px", height: "270px" }}
        >
          <Image
            src={imageSrc}
            alt={decodedTitle}
            layout="fill" // Use 'fill' layout to ensure it covers the entire container
            objectFit="cover" // Ensure it covers the container without stretching
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50 flex items-end justify-center p-4">
            <h1 className="text-lg md:text-xl font-extrabold text-white text-center">
              {`Explore ${decodedTitle}`}
            </h1>
          </div>
        </div>

        {/* Content Section */}
        <div className="text-center">
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Dive deeper into architectural sheets and explore {decodedTitle}.
          </p>
        </div>
      </div>
      <ExploreRelatedPosts />
    </>
  );
};

export default ExplorePage;