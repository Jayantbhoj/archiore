"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation"; // Use pathname hook
import { userDetailsAction } from "@/app/actions";
import { getUserPostsAction } from "./actions";
import UserPost from "./Post";

interface User {
  username: string;
  image: string | null;
  bio: string | null;
  name: string | null;
  surname: string | null;
}

interface Comment {
  id: number;
  description: string;
  createdAt: string; // Use string here to match Post interface
  user: {
    username: string;
    image: string | "/noAvatar.png";
  };
}

interface Post {
  id: string;
  imgUrl: string;
  title: string;
  description: string | null;
  tags: string;
  createdAt: string; // Use string here to match Post interface
  upvotes: number;
  user: {  // Ensure user field is here
    username: string;
    image: string | "/noAvatar.png";
  };
  comments: Comment[];
}

const UserBody = () => {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const pathname = usePathname(); // Get the current pathname

  // Extract username from pathname (assuming it follows /users/[username] pattern)
  const username = pathname?.split("/")[2]; // Assuming the path is '/users/[username]'

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (username) {
        const userData = await userDetailsAction();
        setUser(userData);
      }
    };
    fetchUserDetails();
  }, [username]);

  // Fetch posts based on username
  useEffect(() => {
    const fetchPosts = async () => {
      if (username) {
        const postData = await getUserPostsAction(username);
        
        // Convert createdAt to string
        const postsWithUser = postData.map((post: any) => ({
          ...post,
          createdAt: post.createdAt.toString(), // Convert Date to string
          comments: post.comments.map((comment: any) => ({
            ...comment,
            createdAt: comment.createdAt.toString(), // Convert Date to string
          })),
          user: {
            username: post.user.username,
            image: post.user.image || null,
          },
        }));
        
        setPosts(postsWithUser);
      }
    };
    fetchPosts();
  }, [username]);

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
      {posts.map((post) => (
        <UserPost key={post.id} post={post} />
      ))}
    </div>
  );
};

export default UserBody;
