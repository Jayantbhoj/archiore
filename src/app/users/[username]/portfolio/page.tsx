"use client";
import React, { useEffect, useState } from "react";
import UserPortfolioHeader from "./UserPortfolioHeader";
import { notFound, usePathname } from "next/navigation";
import { getUserByUsername, UserPortfolioAction } from "../actions";
import UserPortfolioBody from "./UserPortfolioBody";
import LoadingSpinner from "@/app/loading";
import { isSignedInAction } from "@/app/actions";
import Navbar from "@/components/Navbar";
import LandingNavbar from "@/components/LandingNavbar";

const Page = () => {
  const pathname = usePathname();
  const username = pathname.split("/")[2]; // Extract username from URL

  const [user, setUser] = useState<{ id: string; name: string } | null>(null);
  const [portfolioData, setPortfolioData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
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
  useEffect(() => {
    const fetchUser = async () => {
      if (!username) return;

      try {
        const userData = await getUserByUsername(username);
        if (!userData) {
          setUser(null);
          setIsLoading(false);
          return;
        }

        setUser({ id: userData.id, name: userData.name ?? "" });

        // Now fetch portfolio data using the valid userId
        const data = await UserPortfolioAction(userData.id);
        setPortfolioData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [username]);

  if (isLoading) return <LoadingSpinner />;
  if (!user || !portfolioData) {
    notFound();
  }

  return (
    <div>
      {signedIn ? <Navbar /> : <LandingNavbar />}
      <UserPortfolioHeader name={user.name} />
      <UserPortfolioBody userId={user.id} projects={portfolioData.projects} />
    </div>
  );
};

export default Page;
