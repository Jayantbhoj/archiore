"use server";

import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import prisma from "../../../../db";
import { verifySession } from "@/lib/session";
import { userDetailsAction } from "@/app/actions";

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

type GetSignedURLpfpParams = {
  fileType: string;
  fileSize: number;
  checksum: string;
};

export const getSignedURLpfp = async ({
  fileType,
  fileSize,
  checksum,
}: GetSignedURLpfpParams): SignedURLResponse => {
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
    const userId = session.userId;

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

    // Store the post details in the database
    await prisma.user.update({
      where: { id: userId },
      data: { image: uploadUrl },
    });

    return { success: { url, fileName } };
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return { failure: "An error occurred while generating the signed URL" };
  }
};

// New delete profile picture action
export const deleteProfile = async () => {
  try {
    // Verify session and get userId
    const session = await verifySession();
    if (!session) {
      return { failure: "User is not authenticated" };
    }
    const userId = session.userId;

    // Find user by username
    const user = await prisma.user.findUnique({
      where: { id:userId },
      select: { image: true },
    });

    if (!user || !user.image) {
      return { failure: "No profile picture found for this user" };
    }

    const fileName = user.image.split("/").pop()!;

    // Delete the image from Cloudflare R2
    const deleteObjectCommand = new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: fileName,
    });
    await s3Client.send(deleteObjectCommand);

    // Remove the image URL from the user's profile in the database
    await prisma.user.update({
      where: { id: userId },
      data: { image: null },
    });
    window.location.reload();
    return { success: "Profile picture deleted successfully" };

  } catch (error) {
    console.error("Error deleting profile picture:", error);
    return { failure: "An error occurred while deleting the profile picture" };
  }
};






export const getUserPostsAction = async (username: string) => {
  try {
    // Find the user to get userId
    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Fetch the posts and include user information (such as username)
    const posts = await prisma.post.findMany({
      where: { userId: user.id },
      include: {
        comments: {
          include: {
            user: { select: { username: true, image: true } }, // Ensure user data is included in comments as well
          },
        },
        user: { select: { username: true, image: true } }, // Ensure user data is included in posts
      },
      orderBy: {
        createdAt: 'desc', // Order posts by createdAt in descending order (newest first)
      },
    });

    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};



export const getUserAction = async (username: string) => {
  try {
    // Fetch the user based on the provided username
    const user = await prisma.user.findUnique({
      where: { username }, // Search for the user by username
      select: {
        id: true,
        username: true,
        bio: true,
        name: true,
        surname: true,
        image: true, // You can include more fields as needed
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null; // Return null or an empty object if an error occurs
  }
};

export async function AdminPortfolioAction() {
  const sessionPayload = await userDetailsAction();
  if (!sessionPayload || !sessionPayload.id) {
    return null;
  }

  const userId = sessionPayload.id;

  // Fetch user with portfolio and projects
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      portfolio: {
        include: {
          projects: {
            orderBy: {
              createdAt: 'desc', // Order projects by createdAt in descending order
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return {
    user: {
      id: user.id,
      name: user.name,
    },
    portfolio: user.portfolio,
    projects: user.portfolio?.projects ?? [],
  };
}



export async function deletePostAction(postId: string) {
  try {
    // Find the post to get the image URL
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { imgUrl: true }, // Fetch image URL for deletion
    });

    if (!post) {
      throw new Error("Post not found");
    }

    // Delete the post from the database
    await prisma.post.delete({ where: { id: postId } });

    // If the post had an associated image, delete it from Cloudflare R2
    if (post.imgUrl) {
      try {
        const url = new URL(post.imgUrl);
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

    return { success: true, message: "Post deleted successfully" };
  } catch (error) {
    console.error("Error deleting post:", error);
    return { success: false, message: "Failed to delete post. Please try again." };
  }
}
