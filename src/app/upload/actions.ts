"use server";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import prisma from "../../../db"
import { verifySession } from "@/lib/session";


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
  tags: string;
  description?: string;
};

export const getSignedURL = async ({
  fileType,
  fileSize,
  checksum,
  title,
  tags,
  description,
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
    await prisma.post.create({
      data: {
        imgUrl: uploadUrl, // Public R2 URL
        description: description || null,
        title:title,
        tags:tags,
        userId,
        upvotes: 0,
      },
    });

    return { success: { url, fileName } };
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return { failure: "An error occurred while generating the signed URL" };
  }
};
