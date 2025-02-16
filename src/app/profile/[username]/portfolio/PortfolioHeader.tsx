"use client"; // Ensure you're in the client-side context

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation"; // Import usePathname hook
import { TypewriterEffect } from "@/components/ui/TypewriterEffect";
import { createProjectAction } from "./actions";


type PortfolioHeaderProps = {
  userId: string;  // userId should be of type string
  name: string | null; // name could be string or null
};

const PortfolioHeader: React.FC<PortfolioHeaderProps> = ({ userId, name }) => {
  const pathname = usePathname(); // Get the current path

  const [projectName, setProjectName] = useState(""); // State for the new project name
  const [projectDescription, setProjectDescription] = useState(""); // State for the project description
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility



  const handleProjectNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProjectName(event.target.value);
  };

  const handleProjectDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProjectDescription(event.target.value);
  };

  const handleAddProject = async () => {
    if (projectName) {
      console.log("New Project Name:", projectName);

      // Call the createProjectAction server action
      const result = await createProjectAction({
        userId,
        name: projectName,
        details: projectDescription,
      });

      if (result.success) {
        console.log("Project Created Successfully:", result.project);
        window.location.reload();

      } else {
        console.error("Error Creating Project:", result.message);
      }

      setIsModalOpen(false); // Close the modal after submitting
      setProjectName(""); // Clear the input
      setProjectDescription(""); // Clear the description input
    }
  };



  return (
    <header className="relative flex flex-col md:flex-row md:justify-between p-4 md:p-8">
      <div className="flex justify-start p-8">
        <TypewriterEffect
          words={[
            { text: `${name}'s` },
            { text: "Portfolio" },
          ]}
          className="text-3xl md:text-4xl font-semibold text-white"
          cursorClassName="bg-white"
        />
      </div>

      {/* Add Project Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="absolute top-8 right-8 px-6 py-2 bg-myBlack text-white rounded-md"
      >
        Add Project
      </button>

      {/* Add Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div
            className="bg-white p-6 rounded-md w-[400px] shadow-md animate__animated animate__fadeIn"
            onClick={(e) => e.stopPropagation()} // Prevent click event from closing the modal
          >
            <h2 className="text-xl font-semibold mb-4">Add New Project</h2>
            <div className="mb-4">
              <label htmlFor="projectName" className="block text-sm font-medium">
                Project Name *
              </label>
              <input
                type="text"
                id="projectName"
                value={projectName}
                onChange={handleProjectNameChange}
                placeholder="Enter project name"
                className="border-2 border-gray-300 p-2 rounded-md w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="projectDescription"
                className="block text-sm font-medium"
              >
                Project Description
              </label>
              <input
                type="text"
                id="projectDescription"
                value={projectDescription}
                onChange={handleProjectDescriptionChange}
                placeholder="Enter project description"
                className="border-2 border-gray-300 p-2 rounded-md w-full"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProject}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Add Project
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default PortfolioHeader;
