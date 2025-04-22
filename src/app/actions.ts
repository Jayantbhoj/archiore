'use server';

import bcrypt from 'bcrypt';
import prisma from '../../db'; 
import { z } from 'zod';
import { createSession, updateSession, decrypt, verifySession, deleteSession } from '@/lib/session'; // Assuming createSession, updateSession, and decrypt are in this path
import { cookies } from 'next/headers'; 
import { redirect } from 'next/navigation';




const signupSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  username: z.string().min(3, 'Username must be at least 3 characters.'),
  firstName: z.string().min(1, 'First name is required.'),
  lastName: z.string().min(1, 'Last name is required.'),
});

export async function signupAction(data: {
  email: string;
  password: string;
  username: string;
  firstName: string;
  lastName: string;
}) {
  try {
    const { email, password, username, firstName, lastName } = signupSchema.parse(data);

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return { ok: false, error: 'Email already exists. Please use a different one.' };
      }
      if (existingUser.username === username) {
        return { ok: false, error: 'Username already exists. Please choose another one.' };
      }
    }


    const hashedPassword = await bcrypt.hash(password, 10);


    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
        name: firstName,
        surname: lastName, 
      },
    });
    const portfolio = await prisma.portfolio.create({
      data: {
        userId: newUser.id, 
      },
    });

    // Get session details
    const cookieStore = await cookies();
    const session = await decrypt(cookieStore.get('session')?.value);

    if (session) {
      await updateSession();
    } else {
      await createSession(newUser.id); 
    }

    return { ok: true, message: 'Signup successful!' };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { ok: false, error: error.errors.map((e) => e.message).join(', ') };
    }
    return { ok: false, error: 'An error occurred during signup. Please try again later.' };
  }
}

const loginSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});



export async function loginAction(data: { email: string; password: string }) {
  try {

    const { email, password } = loginSchema.parse(data);

    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return { ok: false, error: 'Invalid email or password.' };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { ok: false, error: 'Invalid email or password.' };
    }

    const cookieStore = await cookies();
    const session = await decrypt(cookieStore.get('session')?.value);
    if (session) {

      await updateSession();
    } else {

      await createSession(user.id); 
    }
    return { ok: true, message: 'Login successful!' };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { ok: false, error: error.errors.map((e) => e.message).join(', ') };
    }
    return { ok: false, error: 'An error occurred during login. Please try again later.' };
  }
}



export const isSignedInAction = cache(async () => {  
  const sessionPayload = await verifySession();  
  if (sessionPayload) {  
    return { signedIn: true, userId: sessionPayload.userId };  
  }  
  return { signedIn: false };  
});




export async function logoutAction() {
  await deleteSession()

  redirect('/');
}



export async function userDetailsAction() {
  try {

    const sessionPayload = await verifySession();
    if (!sessionPayload || !sessionPayload.userId) {
      return null;
    }

    const userId = sessionPayload.userId;


    const user = await prisma.user.findUnique({
      where: {
        id: userId, 
      },
      select: {
        id: true,
        name:true,
        surname:true,
        username: true,
        image: true, 
        bio:true,
      },
    });
    return user;

  } catch (error) {
    console.error('Error fetching user details:', error);
    return null;
  }
}



const updateProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  bio: z.string().max(200, 'Bio cannot exceed 200 characters'),
});


export async function updateProfileAction(data: {
  firstName: string;
  lastName: string;
  username: string;
  bio: string;
}) {
  try {
    const { firstName, lastName, username, bio } = updateProfileSchema.parse(data);


    const sessionPayload = await verifySession();

    if (!sessionPayload) {
      return { ok: false, error: 'User is not authenticated.' };
    }

    const userId = sessionPayload.userId;


    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser && existingUser.id !== userId) {
      return { ok: false, error: 'Username already exists. Please choose another one.' };
    }


    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: firstName,
        surname: lastName,
        username,
        bio,
      },
    });

    return { ok: true, user: updatedUser };

  } catch (error) {
    if (error instanceof z.ZodError) {
      return { ok: false, error: error.errors.map((e) => e.message).join(', ') };
    }
    return { ok: false, error: 'An error occurred while updating the profile.' };
  }
}






import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { cache } from 'react';


const accessKeyId = process.env.R2_ACCESS_KEY || "";
const secretAccessKey = process.env.R2_SECRET_KEY || "";
const endpoint = process.env.CLOUDFLARE_ENDPOINT || "";

if (!accessKeyId || !secretAccessKey || !endpoint) {
  throw new Error("Missing required Cloudflare R2 credentials or endpoint.");
}

const r2 = new S3Client({
  region: "auto",
  endpoint: endpoint,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export const uploadImageAction = async (file: File) => {
  try {
    if (!file) {
      throw new Error("No file provided");
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const putObjectCommand = new PutObjectCommand({
      Bucket: "archiore", 
      Key: file.name, 
      Body: buffer, 
    });

    const response = await r2.send(putObjectCommand);
    console.log("Upload successful:", response);

    return { success: true };
  } catch (error) {
    console.log("upload to r2 failed")
  }
};

export async function savePostAction(userId: string, postId: string) {
  try {

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        savedPosts: {
          connect: { id: postId }, 
        },
      },
    });

    return updatedUser; 
  } catch (error) {
    console.error('Error saving post:', error);
    throw new Error('Failed to save the post');
  }
}


export async function deleteSavedPostAction(userId: string, postId: string) {
  try {

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        savedPosts: {
          disconnect: {
            id: postId, 
          },
        },
      },
    });

    return updatedUser;
  } catch (error) {
    console.error("Error removing saved post:", error);
    throw new Error("Failed to delete saved post.");
  }
}

export const postDetailsAction = async (postId: string) => {

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      user: true, 
      comments: {
        include: {
          user: true, 
        },
      },
    },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  return post;
};



export async function getFeedAction(page: number = 1, limit: number = 10) {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc", 
      },
      include: {
        user: true,
        comments: true,
      },
      skip: (page - 1) * limit, 
      take: limit, 
    });

    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Failed to fetch posts.");
  }
}


export async function searchPostsAction(query: string, page: number = 1, limit: number = 10) {
  if (!query) return { posts: [], hasMore: false };

  try {
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { tags: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { user: { username: { contains: query, mode: "insensitive" } } },
          { user: { name: { contains: query, mode: "insensitive" } } },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      skip: (page - 1) * limit,
      include: {
        user: { select: { username: true, name: true, image: true } },
      },
    });

    const totalPosts = await prisma.post.count({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { tags: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { user: { username: { contains: query, mode: "insensitive" } } },
          { user: { name: { contains: query, mode: "insensitive" } } },
        ],
      },
    });

    return { posts, hasMore: totalPosts > page * limit };
  } catch (error) {
    console.error("Error searching posts:", error);
    return { posts: [], hasMore: false };
  }
}







export const relatedPostsAction = async (postId: string) => {
  try {
    console.log("Fetching related posts for:", postId); 

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { tags: true },
    });

    if (!post) {
      console.log("Post not found:", postId);
      return [];
    }

    console.log("Current post tags:", post.tags);


    const relatedPosts = await prisma.post.findMany({
      where: {
        tags: post.tags, 
        id: { not: postId },
      },
      select: {
        id: true,
        title: true,
        imgUrl: true,
        createdAt: true,
        user: {
          select: {
            username: true,
            image: true,
          },
        },
      },
      take: 10, 
    });

    console.log("Related posts found:", relatedPosts.length);
    return relatedPosts;
  } catch (error) {
    console.error("Error fetching related posts:", error);
    return [];
  }
};


export const exploreRelatedPostsAction = async (tag: string) => {
  try {
    console.log("Fetching related posts for tag:", tag);

    const relatedPosts = await prisma.post.findMany({
      where: {
        tags: tag, 
      },
      select: {
        id: true,
        title: true,
        imgUrl: true,
        createdAt: true,
        user: {
          select: {
            username: true,
            image: true,
          },
        },
      },
      take: 10, // Limit results
    });

    console.log("Related posts found:", relatedPosts.length);
    return relatedPosts;
  } catch (error) {
    console.error("Error fetching related posts:", error);
    return [];
  }
};


export async function generateOtpAction(email: string) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  try {
    // Try creating a new OTP record
    await prisma.oTP.create({
      data: { email, code: otp, expiresAt },
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      // Unique constraint violation: email already exists → update OTP
      await prisma.oTP.update({
        where: { email },
        data: { code: otp, expiresAt },
      });
    } else {
      console.error("Error generating OTP:", error);
      return { ok: false, message: "Error generating OTP. Please try again." };
    }
  }

  return { ok: true, message: "OTP sent successfully!", otp }; // Remove `otp` in production
}



export async function verifyOtpAction(email: string, otp: string) {
  const storedOtp = await prisma.oTP.findUnique({ where: { email } });

  if (!storedOtp || storedOtp.code !== otp) return { ok: false, message: "Invalid OTP" };
  if (new Date() > storedOtp.expiresAt) return { ok: false, message: "OTP expired" };

  await prisma.oTP.delete({ where: { email } }); // Delete OTP after use

  return { ok: true, message: "OTP verified!" };
}



import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOtpAction(email: string) {
  const result = await generateOtpAction(email);
  const user = await prisma.user.findUnique({
    where: { email },
  });
  
  if (!user) {
    return { ok: false, message: "Email not found." };
  }
  if (!result.ok) return { ok: false, message: result.message }; // Handle error

  const otp = result.otp; // Extract OTP

  // Send email using Resend
  try {
    await resend.emails.send({
      from: "noreply@archiore.com", 
      to: email,
      subject: "Your OTP for Archiore",
      html: `<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
  <h2 style="color: #222;">Email Verification Request</h2>
  <p>Dear User,</p>
  <p>You requested to verify your email address. Please use the OTP below to complete the verification process:</p>
  <p style="font-size: 18px; font-weight: bold; color: #d32f2f;">${otp}</p>
  <p>If you did not request this, please ignore this email.</p>
  <p>Best regards,<br>Archiore Team</p>
</div>`,
    });

    return { ok: true, message: "OTP sent successfully." };
  } catch (err) {
    console.error("Resend Error:", err);
    return { ok: false, message: "Failed to send OTP. Try again later." };
  }
}

export async function signupSendOtpAction(email: string) {
  const result = await generateOtpAction(email);
  
  if (!result.ok) return { ok: false, message: result.message }; // Handle error

  const otp = result.otp; // Extract OTP

  // Send email using Resend
  try {
    await resend.emails.send({
      from: "noreply@archiore.com", 
      to: email,
      subject: "Welcome to Archiore!",
      html: `<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
  <h2 style="color: #222;">Welcome to Archiore!</h2>
  <p>We're thrilled to have you on board. To get started, please verify your email using the OTP below:</p>
  <p style="font-size: 18px; font-weight: bold; color: #d32f2f;">${otp}</p>
  <p>If you didn’t sign up for Archiore, please ignore this email.</p>
  <p>Best regards,<br>Archiore Team</p>
</div>
`,
    });

    return { ok: true, message: "OTP sent successfully." };
  } catch (err) {
    console.error("Resend Error:", err);
    return { ok: false, message: "Failed to send OTP. Try again later." };
  }
}

export async function changePasswordAction(email: string, newPassword: string) {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (!user) {
    return { ok: false, message: "User not found!" };
  }
  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
  });
  await prisma.session.deleteMany({
    where: { userId: user.id },
  });
await deleteSession()

  return { ok: true, message: "Password updated successfully!" };
}