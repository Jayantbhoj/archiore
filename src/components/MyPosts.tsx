"use client";

import { useEffect, useState } from "react";

import UserPost from "@/components/UserPost";
import { userDetailsAction } from "@/app/actions";
import { getUserPostsAction } from "@/app/profile/[username]/actions";
import LoadingSpinner from "@/app/loading";

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
  createdAt: string; // Now strictly a string
  user: {
    username: string;
    image: string | null;
  };
}

interface Post {
  id: string;
  imgUrl: string;
  title: string;
  description: string | null;
  tags: string;
  createdAt: string; // Now strictly a string
  upvotes: number;
  user: {
    username: string;
    image: string | null;
  };
  comments: Comment[];
}

interface MyPostsProps {
  selectedTab: 'posts' | 'saved';
}

const MyPosts= () => {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      const userData = await userDetailsAction();
      setUser(userData);
    };
    fetchUserDetails();
  }, []);

  // Fetch posts from the database
  useEffect(() => {
    const fetchPosts = async () => {
      if (!user) return;
  
      setLoading(true); // Start loading
  
      try {
        const postData = await getUserPostsAction(user.username);
  
        // Convert createdAt to string
        const postsWithStringDates: Post[] = postData.map((post: any) => ({
          ...post,
          createdAt: new Date(post.createdAt).toISOString(),
          comments: post.comments.map((comment: any) => ({
            ...comment,
            createdAt: new Date(comment.createdAt).toISOString(),
          })),
        }));
  
        setPosts(postsWithStringDates);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };
  
    fetchPosts();
  }, [user]); // Re-fetch when `user` changes
  
  // Render logic
  if (loading) {
    return <LoadingSpinner />;
  }
  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
      {posts.map((post) => (
        <UserPost key={post.id} post={post} />
      ))}
    </div>
  );
};

export default MyPosts;
 