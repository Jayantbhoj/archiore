"use server";

import { verifySession } from "@/lib/session";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import prisma from "../../../../../db"


const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFLARE_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY!,
    secretAccessKey: process.env.R2_SECRET_KEY!,
  },
});
const r2pubUrl = process.env.R2_PUB_URL;

// Allowed file types and max size
const allowedFileTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
const maxFileSize = 1048576 * 10; // 10 MB

// Generate a unique file name
const generateFileName = (bytes = 32) => {
  const array = new Uint8Array(bytes);
  crypto.getRandomValues(array);
  return [...array].map((b) => b.toString(16).padStart(2, "0")).join("");
};

// Define the SignedURLResponse type
type SignedURLResponse = Promise<
  | { success: { url: string; fileName: string } }
  | { failure: string }
>;

type GetSignedURLParams = {
  fileType: string;
  fileSize: number;
  checksum: string;
  title: string;
  projectId: string;
};



export const SheetgetSignedURL = async ({
    fileType,
    fileSize,
    checksum,
    title,
    projectId, 
  }: GetSignedURLParams): SignedURLResponse => {
    try {
      // Validate file type
      if (!allowedFileTypes.includes(fileType)) {
        return { failure: "File type not allowed" };
      }
  
      // Validate file size
      if (fileSize > maxFileSize) {
        return { failure: "File size too large" };
      }
  
      // Verify session and get userId
      const session = await verifySession();
      console.log("Session:", session);  // Log session for debugging
      if (!session) {
        console.error("Session is null or undefined");
        return { failure: "User is not authenticated" };
      }
  
      const userId = session.userId;
  
      // Ensure projectId is defined
      console.log("Project ID:", projectId);  // Log projectId for debugging
      if (!projectId) {
        console.error("Project ID is null or undefined");
        return { failure: "Project ID is required" };
      }
  
      // Generate a unique file name
      const fileName = generateFileName();
      const uploadUrl = `https://${r2pubUrl}/${fileName}`;
  
      // Add metadata for the image
      const putObjectCommand = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: fileName,
        ContentType: fileType,
        ContentLength: fileSize,
      });
  
      // Generate the signed URL
      const url = await getSignedUrl(s3Client, putObjectCommand, { expiresIn: 60 });
  
      // Create the sheet in the database, linking it to the project
      const sheet = await prisma.sheet.create({
        data: {
          title, 
          projectId, 
          image: uploadUrl, 
        },
      });
  
      // Return signed URL and fileName
      return {
        success: { url, fileName },
      };
    } catch (error) {
      console.error("Error generating signed URL and creating sheet:", error);
      return { failure: "An error occurred while generating the signed URL and creating the sheet" };
    }
  };
  
  
  

// app/profile/[username]/actions.ts


export const createProjectAction = async ({ userId, name, details }: { userId: string, name: string, details: string }) => {
    try {
      // Find user's portfolio by userId
      const portfolio = await prisma.portfolio.findUnique({
        where: { userId },
      });
  
      if (!portfolio) {
        throw new Error('Portfolio not found for user.');
      }
  
      // Create a new project within that portfolio
      const project = await prisma.project.create({
        data: {
          name,
          details,
          portfolioId: portfolio.id,
          cover:'/noCover.png'
        },
      });
  
      return { success: true, project };
    } catch (error: unknown) {
      // TypeScript doesn't know the error type, so we check and cast it to an instance of Error
      if (error instanceof Error) {
        console.error('Error creating project:', error.message);
        return { success: false, message: error.message };
      }
      // In case the error is not an instance of Error, return a generic error message
      console.error('An unknown error occurred');
      return { success: false, message: 'An unknown error occurred' };
    }
  };

  

  // Example for getting username by userId in your actions.ts (server-side)
export const getUsernameByUserId = async (userId: string) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { username: true },
      });
  
      if (!user) {
        throw new Error("User not found");
      }
  
      return user.username;
    } catch (error) {
      console.error("Error fetching username:", error);
      return null;
    }
  };
  

  export const getUserByUsername = async (username: string) => {
    try {
      const user = await prisma.user.findUnique({
        where: { username },
        select: { id: true, name: true },
      });
  
      if (!user) {
        throw new Error("User not found");
      }
  
      return user;
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  };

  export const AdminProjectsAction = async ({ projectId }: { projectId: string }) => {
    try {
      // Fetch project with sheets from the database, ordered by the creation date (latest first)
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
          sheets: {
            select: { id: true, title: true, image: true },
            orderBy: {
              createdAt: 'desc', // This should now work correctly
            },
          },
        },
      });
  
      if (!project) {
        return { success: false, message: "Project not found" };
      }
  
      return { success: true, project };
    } catch (error) {
      console.error("Error fetching project:", error);
      return { success: false, message: "An error occurred while fetching the project" };
    }
  };
  
  


interface EditProjectParams {
  projectId: string;
  name: string;
  details: string;
}

export const EditProjectAction = async ({
  projectId,
  name,
  details,
}: EditProjectParams): Promise<{ success: boolean; project?: any; message?: string }> => {
  try {
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: { name, details },
    });

    return { success: true, project: updatedProject };
  } catch (error) {
    console.error("Error updating project:", error);
    return { success: false, message: "An error occurred while updating the project" };
  }
};



import { DeleteObjectCommand } from "@aws-sdk/client-s3";



export async function deleteSheetAction(projectId: string) {
  try {
    // Find the sheet to get the image URL and projectId
    const sheet = await prisma.sheet.findUnique({
      where: { id: projectId },
      select: { image: true, projectId: true }, // Fetch projectId for revalidation
    });

    if (!sheet) {
      throw new Error("Sheet not found");
    }

    // Delete the sheet from the database
    await prisma.sheet.delete({ where: { id: projectId } });

    // If the sheet had an associated image, delete it from Cloudflare R2
    if (sheet.image) {
      try {
        const url = new URL(sheet.image);
        const key = url.pathname.split("/").pop(); // Extract the filename safely

        if (key) {
          await s3Client.send(
            new DeleteObjectCommand({
              Bucket: process.env.R2_BUCKET_NAME!,
              Key: key,
            })
          );
        }
      } catch (error) {
        console.error("Failed to delete image from Cloudflare R2:", error);
      }
    }

    return { success: true, message: "Sheet deleted successfully" };
  } catch (error) {
    console.error("Error deleting sheet:", error);
    return { success: false, message: "Failed to delete sheet. Please try again." };
  }
}




export async function deleteProjectAction(projectId: string) {
  if (!projectId) {
    console.error("Invalid projectId:", projectId);
    return { success: false, message: "Invalid projectId." };
  }

  try {
    // Fetch the project, including its cover image
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { cover: true },
    });

    if (!project) {
      return { success: false, message: "Project not found." };
    }

    // Delete the project from the database
    await prisma.project.delete({ where: { id: projectId } });

    // If the project has a cover image, delete it from R2
    if (project.cover) {
      try {
        const url = new URL(project.cover);
        const key = url.pathname.split("/").pop(); // Extract the key from the URL

        if (key) {
          await s3Client.send(
            new DeleteObjectCommand({
              Bucket: process.env.R2_BUCKET_NAME!,
              Key: key,
            })
          );
        }
      } catch (error) {
        console.error("Failed to delete image from Cloudflare R2:", error);
      }
    }

    return { success: true, message: "Project deleted successfully." };
  } catch (error) {
    console.error("Error deleting project:", error);
    return { success: false, message: "Failed to delete project. Please try again." };
  }
}


export async function deleteProjectCoverAction(projectId: string) {
  try {
    // Find the project to get the cover image URL
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { cover: true },
    });

    if (!project) {
      throw new Error("Project not found");
    }

    // If the project has a cover image, delete it from Cloudflare R2
    if (project.cover) {
      try {
        const url = new URL(project.cover);
        const key = url.pathname.split("/").pop(); // Extract the filename safely

        if (key) {
          await s3Client.send(
            new DeleteObjectCommand({
              Bucket: process.env.R2_BUCKET_NAME!,
              Key: key,
            })
          );
        }
      } catch (error) {
        console.error("Failed to delete cover from Cloudflare R2:", error);
      }
    }

    // Update the project in the database to remove the cover URL
    await prisma.project.update({
      where: { id: projectId },
      data: { cover: null },
    });

    return { success: true, message: "Project cover deleted successfully" };
  } catch (error) {
    console.error("Error deleting project cover:", error);
    return { success: false, message: "Failed to delete project cover. Please try again." };
  }
}


type coverGetSignedURLParams = {
  fileType: string;
  fileSize: number;
  checksum: string;
  projectId: string;
};

export const changeCoverSignedURL = async ({
  fileType,
  fileSize,
  checksum,
  projectId,
}: coverGetSignedURLParams): SignedURLResponse => {
  try {
    // Validate file type
    if (!allowedFileTypes.includes(fileType)) {
      return { failure: "File type not allowed" };
    }

    // Validate file size
    if (fileSize > maxFileSize) {
      return { failure: "File size too large" };
    }

    // Verify session and get userId
    const session = await verifySession();
    if (!session) {
      return { failure: "User is not authenticated" };
    }

    // Fetch the project to get the existing cover image
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { cover: true },
    });

    if (!project) {
      return { failure: "Project not found" };
    }

    // Delete the previous cover image from Cloudflare R2 if it exists
    if (project.cover) {
      try {
        const url = new URL(project.cover);
        const key = url.pathname.split("/").pop(); // Extract filename safely

        if (key) {
          await s3Client.send(
            new DeleteObjectCommand({
              Bucket: process.env.R2_BUCKET_NAME!,
              Key: key,
            })
          );
        }
      } catch (error) {
        console.error("Failed to delete previous cover from Cloudflare R2:", error);
      }
    }

    // Generate a unique file name for the new cover image
    const fileName = generateFileName();
    const uploadUrl = `https://${r2pubUrl}/${fileName}`;

    // Generate the signed URL for uploading the new cover image
    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: fileName,
      ContentType: fileType,
      ContentLength: fileSize,
    });

    const url = await getSignedUrl(s3Client, putObjectCommand, { expiresIn: 60 });

    // Update the project in the database with the new cover image URL
    await prisma.project.update({
      where: { id: projectId },
      data: { cover: uploadUrl },
    });

    return {
      success: { url, fileName },
    };
  } catch (error) {
    console.error("Error changing project cover:", error);
    return { failure: "An error occurred while changing the project cover" };
  }
};