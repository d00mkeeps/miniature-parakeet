"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { WelcomeModal } from "@/components/public/organisms/WelcomeModal";
import Button from "../public/atoms/Button";
import TimeframeParser from "@/components/backend/TimeframeParser";

export default function HomePageContent() {
  const { userProfile, loading } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log(
    "Rendering HomePageContent. UserProfile:",
    userProfile,
    "Loading:",
    loading
  );

  useEffect(() => {
    if (!loading && userProfile && userProfile.display_name == null) {
      const timer = setTimeout(() => {
        setIsModalOpen(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [userProfile, loading]);
  return (
    <>
      <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 max-w-4xl px-3">
        <main className="flex-1 flex flex-col gap-6">
          <h2 className="font-bold text-4xl mb-4">Welcome to TrainSmart!</h2>
          <p>You have lots of work to do.</p>
          <TimeframeParser/>
        </main>
        <div>
          <Button 
          href="/workout/track"
            >
            Track Workout
          </Button>
        </div>
      </div>

      {isModalOpen && (
        <WelcomeModal
          isOpen={isModalOpen}
          onClose={() => {
            console.log("Closing modal");
            setIsModalOpen(false);
          }}
        />
      )}
    </>
  );
}
