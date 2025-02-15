"use client";

import { AdminProjectsAction } from "@/app/profile/[username]/portfolio/actions";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";



const UserProjectPage = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const projectId = pathSegments[pathSegments.length - 1];

  const [project, setProject] = useState<any>(null);
  const [enlargedImage, setEnlargedImage] = useState<{ src: string; title: string } | null>(null);

  useEffect(() => {
    const fetchProjectData = async () => {
      const response = await AdminProjectsAction({ projectId });

      if (response.success) {
        setProject(response.project);
      } else {
        console.error("Failed to fetch project:", response.message);
      }
    };

    fetchProjectData();
  }, [projectId]);

  if (!project) {
    return <div className="text-center p-6 text-white">Loading project details...</div>;
  }

  return (
    <div className="relative min-h-screen ">
      <div className="flex justify-between items-center p-4">
        <div className="text-4xl font-semibold text-myBlack">
          {project.name}
          <p className="text-sm font-normal">{project.details || "No details available."}</p>
        </div>
      </div>

      <div className="p-6">
        {project.sheets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {project.sheets.map((sheet: any) => (
              <div
                key={sheet.id}
                className="bg-gray-300 text-black shadow-md overflow-hidden relative"
              >
                <div className="relative group">
                  <img
                    src={sheet.image || "/default-sheet-image.jpg"}
                    alt={sheet.title}
                    className="w-full h-48 object-cover cursor-pointer"
                    onClick={() => setEnlargedImage({ src: sheet.image, title: sheet.title })}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-lg font-semibold text-center opacity-0 group-hover:opacity-100 transition duration-300">
                    {sheet.title}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No sheets available for this project.</p>
        )}
      </div>

      

      {enlargedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center"
          onClick={() => setEnlargedImage(null)}
        >
          <div className="relative p-4 bg-white rounded-md shadow-lg max-w-[80vw] max-h-[80vh] flex flex-col items-center">
            <img src={enlargedImage.src} alt="Enlarged sheet" className="max-w-full max-h-[70vh]" />
            <p className="mt-2 text-lg font-semibold">{enlargedImage.title}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProjectPage;
