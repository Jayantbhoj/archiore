"use client";

import { userDetailsAction } from "@/app/actions";
import { getSignedURL } from "@/app/upload/actions";
import { useState, ChangeEvent, FormEvent } from "react";
import Toast from "./Toast";

export default function Upload() {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [description, setDescription] = useState("");
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
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    return hashHex;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formErrors: { [key: string]: string } = {};
    if (!title) formErrors.title = "Title is required";
    if (!tags) formErrors.tags = "Tags are required";
    if (!image) formErrors.image = "Image is required";

    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) return;

    try {
      setLoading(true);

      const response = await getSignedURL({
        fileType: image!.type,
        fileSize: image!.size,
        checksum: await computeSHA256(image!),
        title,
        tags,
        description,
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

        if (!uploadResponse.ok) {
          throw new Error("Image upload failed.");
        }

        const user = await userDetailsAction();
        const username = user!.username;
        window.location.href = `/profile/${username}`;

        console.log("Uploaded file name:", fileName);
        console.log("url: ", url);

        setLoading(false);
      } else if ("failure" in response) {
        throw new Error(response.failure);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while uploading.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-myWhite flex items-center justify-center p-6">
      <div className="w-full max-w-6xl bg-white shadow-md rounded-lg p-8 flex flex-col lg:flex-row">
        <div className="lg:w-2/5 p-6">
          <h2 className="text-3xl font-bold text-myBlack mb-6">Upload Your Work</h2>
          <div
            className={`w-full h-48 ${
              imagePreview ? "" : "border-2 border-dashed border-myBlack"
            } rounded-lg p-6 text-center flex flex-col justify-center`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {imagePreview ? (
              <>
                <img
                  src={imagePreview}
                  alt="Image preview"
                  className="max-w-full max-h-48 object-contain mb-4"
                />
                <label
                  htmlFor="image-upload"
                  className="block mt-2 text-myRed cursor-pointer underline"
                >
                  Change Picture
                </label>
              </>
            ) : (
              <>
                <p className="text-myBlack">Drag and drop an image here, or click to select</p>
                <input
                  type="file"
                  id="image-upload"
                  className="hidden"
                  onChange={handleFileSelect}
                  accept="image/*"
                />
                <label
                  htmlFor="image-upload"
                  className="block mt-4 cursor-pointer text-myRed underline"
                >
                  Select a file
                </label>
              </>
            )}
            {errors.image && <p className="text-red-500 text-sm mt-2">{errors.image}</p>}
          </div>
          <input
            type="file"
            id="image-upload"
            className="hidden"
            onChange={handleFileSelect}
            accept="image/*"
          />
        </div>
        <div className="lg:w-3/5 p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="title" className="block text-myBlack text-sm font-medium mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                className="w-full p-2 border border-myBlack rounded-md focus:outline-none focus:ring-2 focus:ring-myBlack"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              {errors.title && <p className="text-red-500 text-sm mt-2">{errors.title}</p>}
            </div>
            <div className="mb-6">
              <label className="block text-myBlack text-sm font-medium mb-2">
                Tag <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {["Site Plan", "Interior", "Zoning", "Section", "Elevation", "Floor Plan", "Site Analysis", "Model"].map((tagOption) => (
                  <label
                    key={tagOption}
                    className={`cursor-pointer px-4 py-2 rounded-md border ${
                      tags === tagOption ? "bg-myRed text-white border-myRed" : "border-myBlack text-myBlack"
                    } transition-all duration-200`}
                  >
                    <input
                      type="radio"
                      name="tag"
                      value={tagOption}
                      checked={tags === tagOption}
                      onChange={(e) => setTags(e.target.value)}
                      className="hidden"
                    />
                    {tagOption}
                  </label>
                ))}
              </div>
              {errors.tags && <p className="text-red-500 text-sm mt-2">{errors.tags}</p>}
            </div>

            <div className="mb-6">
              <label htmlFor="description" className="block text-myBlack text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                id="description"
                className="w-full p-2 border border-myBlack rounded-md focus:outline-none focus:ring-2 focus:ring-myBlack"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-myRed text-white font-bold py-2 px-4 rounded-md hover:bg-myBlack hover:text-myRed transition-all duration-300"
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
