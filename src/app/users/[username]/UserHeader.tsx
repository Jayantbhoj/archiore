"use client";

import { useState, useEffect } from "react";
import { usePathname, notFound } from "next/navigation";
import Link from "next/link";
import { getUserByUsername } from "./actions";
import LoadingSpinner from "@/app/loading";

const UserHeader = () => {
  const pathname = usePathname(); // Get the current route
  console.log("Current Pathname:", pathname);

  const username = pathname.split("/")[2]; // Extract username from `/users/username`
  console.log("Extracted Username:", username);

  const [userDetails, setUserDetails] = useState<{
    firstName: string;
    lastName: string;
    username: string;
    image: string | null;
    bio: string;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!username) {
        console.error("Username is missing in URL");
        setIsLoading(false);
        return;
      }

      try {
        const data = await getUserByUsername(username);
        console.log("Fetched User Data:", data);

        if (data) {
          setUserDetails({
            firstName: data.name || "",
            lastName: data.surname || "",
            username: data.username || "",
            image: data.image || "/noAvatar.png",
            bio: data.bio || "",
          });
        } else {
          console.warn("User not found:", username);
          setUserDetails(null);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        setUserDetails(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [username]);

  if (isLoading) return <LoadingSpinner/>;

  if (!userDetails) return notFound(); // Show 404 page if user not found

  return (
    <div className="z-100">
      <div className="profile-container bg-myWhite px-3 p-3">
        <div className="profile-header w-full p-2 mb-3">
          <div className="flex items-center justify-around sm:flex-row flex-col">
            <div className="flex items-center gap-1 sm:gap-6 sm:flex-row flex-col sm:items-center">
              <img
                src={userDetails.image || "/noAvatar.png"}
                alt="User Avatar"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover"
              />
              <div className="text-center sm:text-left mt-3 sm:mt-0">
                <h1 className="text-2xl text-myBlack font-bold">
                  {userDetails.firstName} {userDetails.lastName}
                </h1>
                <p className="text-sm font-semibold text-gray-500">
                  @{userDetails.username}
                </p>
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  {userDetails.bio}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-1">
              <div>
                <h3 className="text-myBlack font-bold mt-3 text-2xl mr-2">
                  Portfolio
                </h3>
              </div>
              <div>
                <Link href={`/users/${userDetails.username}/portfolio`}>
                  <img
                    src="/portfolio.png"
                    alt="portfolio"
                    className="w-32 h-32 cursor-pointer"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHeader;
