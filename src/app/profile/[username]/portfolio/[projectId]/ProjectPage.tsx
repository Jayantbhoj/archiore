"use client";

import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import AddSheet from "./AddSheet";
import { AdminProjectsAction, EditProjectAction, deleteProjectAction, deleteSheetAction } from "../actions"; // Import deleteSheetAction
import LoadingSpinner from "@/app/loading"; // Import your loading spinner
import ProjectCoverUpload from "./ProjectCoverUpload";

const ProjectPage = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const projectId = pathSegments[pathSegments.length - 1];

  const [project, setProject] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState<{ src: string; title: string } | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const [deleteSheetId, setDeleteSheetId] = useState<string | null>(null); // Sheet ID to delete
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for delete confirmation modal
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);

  useEffect(() => {
    const fetchProjectData = async () => {
      setIsLoading(true); // Set loading to true before fetching data
      const response = await AdminProjectsAction({ projectId });

      if (response.success && response.project) {
        setProject(response.project);
        setEditedTitle(response.project.name);
        setEditedDescription(response.project.details || "");
      } else {
        console.error("Failed to fetch project:", response.message);
      }
      setIsLoading(false); // Set loading to false after fetching data
    };

    fetchProjectData();
  }, [projectId]);

  const handleDeleteSheet = async () => {
    if (!deleteSheetId) return;

    setIsLoading(true); // Show loading spinner during the delete process
    const response = await deleteSheetAction(deleteSheetId);
    if (response.success) {
      setProject((prev: any) => ({
        ...prev,
        sheets: prev.sheets.filter((sheet: any) => sheet.id !== deleteSheetId),
      }));
      setIsDeleteModalOpen(false); // Close the delete modal
      window.location.reload();
    } else {
      console.error("Failed to delete sheet:", response.message);
    }
    setIsLoading(false); // Hide loading spinner after the process is completed
  };

  const handleSaveChanges = async () => {
    setIsLoading(true); // Show loading spinner during the update process
    const response = await EditProjectAction({
      projectId,
      name: editedTitle,
      details: editedDescription,
    });

    if (response.success) {
      setProject((prev: any) => ({
        ...prev,
        name: editedTitle,
        details: editedDescription,
      }));
      setIsEditModalOpen(false);
    } else {
      console.error("Failed to update project:", response.message);
    }
    setIsLoading(false); // Hide loading spinner after the process is completed
  };
  const handleDeleteProject = async () => {
    setIsLoading(true);
  
    const response = await deleteProjectAction(projectId);
  
    if (response.success) {
      console.log("Project deleted successfully");
      alert("Project deleted successfully!");
      // Extract username from the current path
      const pathSegments = pathname.split("/");
      const username = pathSegments[2]; // Assuming "profile/username/portfolio/projectid"
  
      // Redirect to profile/username/portfolio
      window.location.href = `/profile/${username}/portfolio`;
    } else {
      console.error("Failed to delete project:", response.message);
      alert("Project not deleted!");
    }
  
    setIsLoading(false);
  };
  

  return (
    <div className="relative min-h-screen ">
      {isLoading && <LoadingSpinner />} {/* Show loading spinner if data is loading */}

      <div className="flex justify-between items-center py-2 px-6 mt-3">
      <div className="text-3xl sm:text-4xl font-semibold text-myBlack break-words max-w-full">
  {project?.name}
</div>

<div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
  <button
    className="bg-black text-white py-2 px-4 rounded-md hover:bg-myRed transition w-full sm:w-auto"
    onClick={() => setIsModalOpen(true)}
  >
    Add Sheet
  </button>
</div>

      </div>

      <div className="px-6 py-2 flex flex-col gap-3">
        {/* Description Section */}
        <div>
          <p className="text-sm font-normal">{project?.details || "No details available."}</p>
        </div>

        {/* Edit Button */}
        <div>
          <button
            className="text-myRed hover:underline text-sm"
            onClick={() => setIsEditModalOpen(true)}
          >
            Edit
          </button>
        </div>

        {/* Sheets Section */}
        <div>
          {project?.sheets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {project.sheets.map((sheet: any) => (
                <div key={sheet.id} className="bg-gray-300 text-black shadow-md overflow-hidden relative">
                  <div className="relative group">
                    <img
                      src={sheet.image || "/default-sheet-image.jpg"}
                      alt={sheet.title}
                      className="w-full h-48 object-cover cursor-pointer"
                      onClick={() => setEnlargedImage({ src: sheet.image, title: sheet.title })}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xl font-semibold text-center opacity-0 group-hover:opacity-100 transition duration-300">
                      {sheet.title}
                    </div>
                  </div>
                  {/* Delete Button */}
                  <button
                    className="absolute top-2 right-2  text-white p-1 rounded-md text-sm hover:shadow rounded w-7 h-7 transition"
                    onClick={() => {
                      setDeleteSheetId(sheet.id);
                      setIsDeleteModalOpen(true); // Show the delete confirmation modal
                    }}
                  >
                    <img src="/trash.png" alt="trash" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No sheets available for this project.</p>
          )}
        </div>
      </div>

      {/* Enlarged Image Modal */}
      {enlargedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
          onClick={() => setEnlargedImage(null)}
        >
          <div className="relative">
            <img
              src={enlargedImage.src}
              alt={enlargedImage.title}
              className="max-w-4xl max-h-4xl object-contain"
            />
            <div
              className="absolute top-0 right-0 p-4 text-white cursor-pointer text-2xl"
              onClick={() => setEnlargedImage(null)}
            >
              &times;
            </div>
          </div>
        </div>
      )}

      {isModalOpen && <AddSheet onClose={() => setIsModalOpen(false)} projectId={projectId} />}

{/* Edit Modal */}
{isEditModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-md shadow-lg w-96">
      <h2 className="text-xl font-bold mb-4">Edit Project</h2>
      <label className="block text-sm font-medium text-gray-700">Project Title</label>
      <input
        type="text"
        className="w-full p-2 border rounded-md mb-4"
        value={editedTitle}
        onChange={(e) => setEditedTitle(e.target.value)}
      />
      <label className="block text-sm font-medium text-gray-700">Project Description</label>
      <textarea
        className="w-full p-2 border rounded-md mb-4"
        value={editedDescription}
        onChange={(e) => setEditedDescription(e.target.value)}
      />
      
      {/* New Buttons */}
      <div className="flex justify-between space-x-2 mb-4">
        <button
          className="bg-myBlack text-white px-4 py-2 rounded-md"
          onClick={() => setIsCoverModalOpen(true)} // Open nested modal
        >
          Change Project Cover
        </button>
        <button
          className="bg-myRed text-white px-4 py-2 rounded-md"
          onClick={handleDeleteProject}
        >
          Delete Project
        </button>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          className="bg-gray-300 px-4 py-2 rounded-md"
          onClick={() => setIsEditModalOpen(false)}
        >
          Cancel
        </button>
        <button
          className="bg-myRed text-white px-4 py-2 rounded-md"
          onClick={handleSaveChanges}
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}

{/* Nested Modal for Changing Cover */}
{isCoverModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-md shadow-lg w-96">
      <h2 className="text-xl font-bold mb-4">Change Project Cover</h2>
      
      {/* Render ProfileCoverUpload Component */}
      <ProjectCoverUpload
      projectId={projectId} 
        onClose={() => setIsCoverModalOpen(false)} // Close modal when done
      />

      {/* Close Button */}
      <button
        className="mt-4 bg-gray-300 px-4 py-2 rounded-md"
        onClick={() => setIsCoverModalOpen(false)}
      >
        Close
      </button>
    </div>
  </div>
)}




      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Delete Sheet</h2>
            <p className="text-sm mb-4">Are you sure you want to delete this sheet?</p>
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-300 px-4 py-2 rounded-md"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-myRed text-white px-4 py-2 rounded-md"
                onClick={handleDeleteSheet}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectPage;
