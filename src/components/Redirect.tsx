// components/Redirect.tsx
"use client";

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Redirect = ({ to }: { to: string }) => {
  const { isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Redirect if the user is signed in
    if (isSignedIn) {
      router.push(to);
    }
  }, [isSignedIn, router, to]);

  return null; // This component does not render anything
};

export default Redirect;
