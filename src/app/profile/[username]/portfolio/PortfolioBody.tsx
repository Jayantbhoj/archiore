"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getUsernameByUserId } from "./actions";

type Project = {
  id: number;
  name: string;
  cover: string;
};

type PortfolioBodyProps = {
  userId: string;
  projects: Project[];
};

const PortfolioBody: React.FC<PortfolioBodyProps> = ({ userId, projects }) => {
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUsername = async () => {
      const fetchedUsername = await getUsernameByUserId(userId);
      setUsername(fetchedUsername);
    };

    fetchUsername();
  }, [userId]);

  const handleProjectClick = (projectId: number) => {
    if (username) {
      router.push(`/profile/${username}/portfolio/${projectId}`);
    }
  };

  return (
    <section className="p-8">
      <h2 className="text-2xl font-bold text-white mb-6">Projects</h2>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="relative group overflow-hidden rounded-lg shadow-lg border border-gray-700 bg-gray-800 cursor-pointer"
              onClick={() => handleProjectClick(project.id)}
            >
              <Image
               src={project.cover || "/noCover.png"}
                alt={project.name}
                width={300}
                height={200}
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="p-4 bg-myBlack">
                <h3 className="text-white text-lg font-semibold">{project.name}</h3>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 mt-6">
          <p className="text-lg">No projects yet. Add one?</p>
        </div>
      )}
    </section>
  );
};

export default PortfolioBody;
