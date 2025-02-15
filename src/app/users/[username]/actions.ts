"use server";

import prisma from "../../../../db"



export async function getUserByUsername(username: string) {
  if (!username) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

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

  export async function UserPortfolioAction(userId: string) {
    if (!userId) {
      throw new Error("User ID is required");
    }
  
    // Fetch user with portfolio and projects
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        portfolio: {
          include: { projects: true },
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
  