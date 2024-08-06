import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useUser } from "@/context/UserContext";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Button from "../atoms/Button";
import { Input } from "../atoms/Input";
import { Label } from "../atoms/Label";
import { WelcomeModalProps, FormData, UserProfile } from "@/types";

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { userProfile, setUserProfile } = useUser();
  const supabase = createClientComponentClient();
  const [currentSlide, setCurrentSlide] = useState(1);
  const [userInfo, setUserInfo] = useState<Omit<FormData, 'goal' | 'trainingHistory'>>({
    displayName: "",
    firstName: "",
    lastName: "",
    isImperial: false,
    training_history: "",
  });
  const [trainingHistory, setTrainingHistory] = useState("");
  const [initialGoal, setInitialGoal] = useState("");
  const [improvedGoal, setImprovedGoal] = useState("");

  const {
    register: registerUserInfo,
    handleSubmit: handleSubmitUserInfo,
    formState: { errors: userInfoErrors },
  } = useForm<Omit<FormData, 'goal' | 'trainingHistory'>>({
    defaultValues: userInfo,
  });

  const {
    register: registerTrainingHistory,
    handleSubmit: handleSubmitTrainingHistory,
    formState: { errors: trainingHistoryErrors },
  } = useForm<{ trainingHistory: string }>({
    defaultValues: {
      trainingHistory: "",
    },
  });

  const {
    register: registerGoal,
    handleSubmit: handleSubmitGoal,
    formState: { errors: goalErrors },
  } = useForm<{ goal: string }>({
    defaultValues: {
      goal: "",
    },
  });

  if (!isOpen || !userProfile) return null;

  const onSubmitUserInfo: SubmitHandler<Omit<FormData, 'goal' | 'trainingHistory'>> = (data) => {
    setUserInfo(data);
    setCurrentSlide(2);
  };

  const onSubmitTrainingHistory: SubmitHandler<{ trainingHistory: string }> = (data) => {
    setTrainingHistory(data.trainingHistory);
    setCurrentSlide(3);
  };

  const callImproveGoalAPI = async (initialGoal: string, userProfile: UserProfile) => {
    try {
      const response = await fetch('http://localhost:8000/api/improve_goal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userProfile.user_id,
          initial_goal: initialGoal,
          training_history: userProfile.training_history,
          current_goals: userProfile.goals
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to improve goal');
      }
  
      return await response.json(); // Return the whole response object
    } catch (error) {
      console.error('Error improving goal:', error);
      throw error;
    }
  };

  const onSubmitGoal: SubmitHandler<{ goal: string }> = async (data) => {
    setInitialGoal(data.goal);
    
    try {
      const improvedGoalResponse = await callImproveGoalAPI(data.goal, userProfile);
      setImprovedGoal(improvedGoalResponse.text); // Assuming the response has a 'text' field
      setCurrentSlide(4); // Move to a new slide for goal confirmation
    } catch (error) {
      console.error('Error improving goal:', error);
      // Update UI to show error message
      // setErrorMessage("Failed to improve goal. Please try again.");
    }
  };

  const handleSaveGoal = async () => {
    try {
      const { error } = await supabase
        .from("user_profiles")
        .update({
          display_name: userInfo.displayName,
          first_name: userInfo.firstName || null,
          last_name: userInfo.lastName || null,
          is_imperial: userInfo.isImperial,
          training_history: trainingHistory,
          goals: improvedGoal
        })
        .eq("auth_user_uuid", userProfile.auth_user_uuid);

      if (error) throw error;

      setUserProfile({
        ...userProfile,
        display_name: userInfo.displayName,
        first_name: userInfo.firstName || null,
        last_name: userInfo.lastName || null,
        is_imperial: userInfo.isImperial,
        training_history: trainingHistory,
        goals: improvedGoal
      });

      onClose();
    } catch (error) {
      console.error("Error updating user profile:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-500 p-8 rounded-lg w-96 shadow-xl border border-gray-300">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">
          Welcome to SuperCoach!
        </h2>
        {currentSlide === 1 ? (
          <form onSubmit={handleSubmitUserInfo(onSubmitUserInfo)}>
            <div className="mb-4">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                {...registerUserInfo("displayName", { required: "Display name is required" })}
                className="w-full p-2 border rounded bg-gray-800"
                placeholder="kingjohn21"
              />
              {userInfoErrors.displayName && (
                <span className="text-red-500">{userInfoErrors.displayName.message}</span>
              )}
            </div>
            <div className="mb-4">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                {...registerUserInfo("firstName")}
                className="w-full p-2 border rounded bg-gray-800"
                placeholder="John"
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                {...registerUserInfo("lastName")}
                className="w-full p-2 border rounded bg-gray-800"
                placeholder="Doe"
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="isImperial">
                <input
                  id="isImperial"
                  type="checkbox"
                  {...registerUserInfo("isImperial")}
                  className="mr-2"
                />
                Use Imperial System
              </Label>
            </div>
            <Button type="submit" variant="primary" size="large" className="w-full mt-4">
              Next
            </Button>
          </form>
        ) : currentSlide === 2 ? (
          <form onSubmit={handleSubmitTrainingHistory(onSubmitTrainingHistory)}>
            <div className="mb-4">
              <Label htmlFor="trainingHistory">Your Training History</Label>
              <textarea
                id="trainingHistory"
                {...registerTrainingHistory("trainingHistory", { required: "Training history is required" })}
                className="w-full p-2 border rounded bg-gray-800"
                rows={5}
                placeholder="Tell us about your training experience..."
              ></textarea>
              {trainingHistoryErrors.trainingHistory && (
                <span className="text-red-500">{trainingHistoryErrors.trainingHistory.message}</span>
              )}
            </div>
            <Button type="submit" variant="primary" size="large" className="w-full mt-4">
              Next
            </Button>
          </form>
        ) : currentSlide === 3 ? (
          <form onSubmit={handleSubmitGoal(onSubmitGoal)}>
            <div className="mb-4">
              <Label htmlFor="goal">Your Goal</Label>
              <textarea
                id="goal"
                {...registerGoal("goal", { required: "Goal is required" })}
                className="w-full p-2 border rounded bg-gray-800"
                rows={3}
                placeholder="I want to do a muscle up as quickly as possible"
              ></textarea>
              {goalErrors.goal && (
                <span className="text-red-500">{goalErrors.goal.message}</span>
              )}
            </div>
            <Button type="submit" variant="primary" size="large" className="w-full mt-4">
              Improve Goal
            </Button>
          </form>
        ) : currentSlide === 4 && (
          <div>
    <h3>Improved Goal</h3>
    <p>Our AI coach has suggested the following improved goal based on your input:</p>
    <p className="font-bold">{improvedGoal}</p>
    <p>You can edit this goal if you'd like:</p>
    <textarea
      value={improvedGoal}
      onChange={(e) => setImprovedGoal(e.target.value)}
      className="w-full p-2 border rounded bg-gray-800"
      rows={3}
    />
    <Button onClick={handleSaveGoal} variant="primary" size="large" className="w-full mt-4">
      Save Goal
    </Button>
  </div>
)}
      </div>
    </div>
  );
};