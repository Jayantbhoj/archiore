"use client"
import ExploreCards from "@/components/ExploreCards";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { isSignedInAction } from "../actions";
import LandingNavbar from "@/components/LandingNavbar";

export default function Explore() {
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
  }, []); // Empty dependency array to fetch data only on mount
  
    return (
    <div className="min-h-screen bg-myWhite">

{signedIn ? <Navbar /> : <LandingNavbar />}
      <ExploreCards/>
    </div>)
  }
  
