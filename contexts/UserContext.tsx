"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "../utils/supabase/client"; // Adjust this import path as needed

interface UserProfile {
  first_name: string | null;
  last_name: string | null;
  date_of_birth: string | null;
  is_imperial: boolean;
  display_name: string | null;
  user_id: number;
  auth_user_uuid: string | null;
}

interface UserContextType {
  userProfile: UserProfile | null;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  loading: boolean;
  error: Error | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClient();

  useEffect(() => {
    let isMounted = true;
    let retryInterval: NodeJS.Timeout | null = null;

    const fetchUserProfile = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
          const { data, error } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("auth_user_uuid", session.user.id)
            .single();

          if (error) throw error;

          if (data && isMounted) {
            setUserProfile(data);
            setLoading(false);
            if (retryInterval) clearInterval(retryInterval);
          } else {
            throw new Error("No user profile found");
          }
        } else {
          throw new Error("No session found");
        }
      } catch (err) {
        console.error("Error fetching user profile: ", err);
        if (isMounted) {
          setError(
            err instanceof Error ? err : new Error("An unknown error occurred")
          );
        }
      }
    };

    const startFetchingProfile = () => {
      fetchUserProfile();
      retryInterval = setInterval(fetchUserProfile, 1000);
    };

    startFetchingProfile();

    return () => {
      isMounted = false;
      if (retryInterval) clearInterval(retryInterval);
    };
  }, []);

  console.log("UserProvider state:", { userProfile, loading, error });

  return (
    <UserContext.Provider
      value={{ userProfile, setUserProfile, loading, error }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
