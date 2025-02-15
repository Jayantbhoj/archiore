"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { SheetgetSignedURL } from "../actions";

export default function AddSheet({
  onClose,
  projectId, // Receive projectId as a prop
}: {
  onClose: () => void;
  projectId: string; // Expect projectId prop
}) {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setImage(e.dataTransfer.files[0]);
      setImagePreview(URL.createObjectURL(e.dataTransfer.files[0]));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const computeSHA256 = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    let formErrors: { [key: string]: string } = {};
    if (!title) formErrors.title = "Title is required";
    if (!image) formErrors.image = "Image is required";
  
    setErrors(formErrors);
    if (Object.keys(formErrors).length > 0) return;
  
    try {
      setLoading(true);
  
      console.log("Project ID:", projectId); // Log projectId for debugging
  
      const response = await SheetgetSignedURL({
        fileType: image!.type,
        fileSize: image!.size,
        checksum: await computeSHA256(image!),
        title: title,
        projectId: projectId, 
      });
  
      if ("success" in response) {
        const { url, fileName } = response.success;
  
        const uploadResponse = await fetch(url, {
          method: "PUT",
          body: image,
          headers: {
            "Content-Type": image!.type,
          },
        });
  
        if (!uploadResponse.ok) throw new Error("Image upload failed.");
        window.location.reload();

        alert("Image uploaded successfully!");
        console.log("Uploaded file name:", fileName);
        console.log("url: ", url);
      } else if ("failure" in response) {
        throw new Error(response.failure);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while uploading.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-md flex items-center justify-center z-[110] p-6"
      onClick={onClose} // Close modal when clicking outside
    >
      <div
        className="bg-white shadow-md rounded-lg p-6 max-w-md w-full relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-900 text-xl"
          onClick={onClose}
        >
          ✖
        </button>

        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Add Sheet To Your Project</h2>

        <div
          className={`w-full h-40 ${
            imagePreview ? "" : "border-2 border-dashed border-gray-400"
          } rounded-lg p-4 text-center flex flex-col justify-center`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" className="max-w-full max-h-40 object-contain" />
          ) : (
            <>
              <p className="text-gray-500">Drag and drop an image here, or click to select</p>
              <input
                type="file"
                id="image-upload"
                className="hidden"
                onChange={handleFileSelect}
                accept="image/*"
              />
              <label htmlFor="image-upload" className="block mt-2 text-myRed underline cursor-pointer">
                Select a file
              </label>
            </>
          )}
          {errors.image && <p className="text-red-500 text-sm mt-2">{errors.image}</p>}
        </div>

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-800 text-sm font-medium mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            {errors.title && <p className="text-red-500 text-sm mt-2">{errors.title}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-myRed text-white font-bold py-2 px-4 rounded-md hover:bg-myBlack transition-all duration-300"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>
    </div>
  );
}
