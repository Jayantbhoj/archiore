"use client"; // Ensure you're in the client-side context

import { getUsernameByUserId } from "@/app/profile/[username]/portfolio/actions";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Import the router from next/navigation
import { useState, useEffect } from "react";



type Project = {
  id: number;
  name: string;
  cover: string;
};

type UserProps = {
  userId: string; // Expecting userId as a prop
  projects: Project[]; // Expecting projects as a prop
};

const UserPortfolioBody: React.FC<UserProps> = ({ userId, projects }) => {
  const [username, setUsername] = useState<string | null>(null); // State to store the username
  const router = useRouter(); // Initialize the router

  useEffect(() => {
    const fetchUsername = async () => {
      // Use userId to fetch username from the server (or database)
      const fetchedUsername = await getUsernameByUserId(userId);
      setUsername(fetchedUsername);
    };

    fetchUsername();
  }, [userId]);

  const handleProjectClick = (projectId: number) => {
    // Navigate to the specific project page using the username
    if (username) {
      router.push(`/users/${username}/portfolio/${projectId}`);
    }
  };

  return (
    <section className="p-8">
      <h2 className="text-2xl font-bold text-white mb-6">Projects</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="relative group overflow-hidden rounded-lg shadow-lg border border-gray-700 bg-gray-800 cursor-pointer" // Add cursor-pointer here
            onClick={() => handleProjectClick(project.id)} // Add click event to navigate
          >
            {/* Cover Image */}
            <Image
              src={project.cover && project.cover.trim() !== "" ? project.cover : "/noCover.png"}
              alt={project.name}
              width={300}
              height={200}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            
            {/* Project Name */}
            <div className="p-4 bg-myBlack">
              <h3 className="text-white text-lg font-semibold">{project.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default UserPortfolioBody;
