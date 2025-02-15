"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { isSignedInAction } from "@/app/actions";

interface AuthContextType {
  signedIn: boolean | null;
  userId: string | null;
  setAuthState: (state: { signedIn: boolean; userId: string | null }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<{ signedIn: boolean | null; userId: string | null }>({
    signedIn: null,
    userId: null,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await isSignedInAction();
        setAuthState({
          signedIn: session.signedIn,
          userId: session.userId ?? null, // Convert undefined to null
        });        
      } catch (error) {
        console.error("Error fetching authentication state:", error);
        setAuthState({ signedIn: false, userId: null });
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signedIn: authState.signedIn,
        userId: authState.userId,
        setAuthState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
