// components/other/WelcomeModal.tsx
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useUser } from "@/context/UserContext";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Button from "@/components/public/atoms/Button";
import { Input } from "../atoms/Input";
import { Label } from "../atoms/Label";
import { WelcomeModalProps, FormData } from "@/types";

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { userProfile, setUserProfile } = useUser();
  const supabase = createClientComponentClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      displayName: "",
      firstName: "",
      lastName: "",
      isImperial: false,
      about: "",
      goals: ""
    },
  });

  if (!isOpen || !userProfile) return null;

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    console.log("Submitting data to Supabase:", data);

    try {
      const { data: updateData, error } = await supabase
        .from("user_profiles")
        .update({
          display_name: data.displayName,
          first_name: data.firstName || null,
          last_name: data.lastName || null,
          is_imperial: data.isImperial,
          about: data.about,
          goals: data.goals
        })
        .eq("auth_user_uuid", userProfile.auth_user_uuid);

      console.log("Supabase update response:", { data: updateData, error });

      if (error) throw error;

      console.log("Supabase update successful");

      // Update local state
      setUserProfile({
        ...userProfile,
        display_name: data.displayName,
        first_name: data.firstName || null,
        last_name: data.lastName || null,
        is_imperial: data.isImperial,
        training_history: data.about,
        goals: data.goals
      });

      console.log("Local state updated");
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
        <p className="mb-6 text-gray-900 text-lg">
          Let's get to know each other a little better...
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              {...register("displayName", {
                required: "Display name is required",
              })}
              className="w-full p-2 border rounded bg-gray-800"
              placeholder="kingjohn21"
            />
            {errors.displayName && (
              <span className="text-red-500">{errors.displayName.message}</span>
            )}
          </div>
          <div className="mb-4">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              {...register("firstName")}
              className="w-full p-2 border rounded bg-gray-800"
              placeholder="John"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              {...register("lastName")}
              className="w-full p-2 border rounded bg-gray-800"
              placeholder="Doe"
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="goals">Goals</Label>
            <textarea
              id="goals"
              {...register("goals")}
              className="w-full p-2 border rounded bg-gray-800"
              rows={3}
              placeholder="I want to get healthier!"
            ></textarea>
          </div>

          <div className="mb-4">
            <Label htmlFor="about">About You</Label>
            <textarea
              id="about"
              {...register("about")}
              className="w-full p-2 border rounded bg-gray-800"
              placeholder="I've been training for a little while now..."
            />
          </div>


          <div className="mb-4">
            <Label htmlFor="isImperial">
              <input
                id="isImperial"
                type="checkbox"
                {...register("isImperial")}
                className="mr-2"
              />
              Use Imperial System
            </Label>
          </div>
          <Button
            type="submit"
            variant="primary"
            size="large"
            className="w-full mt-4"
          >
            Save
          </Button>
        </form>
      </div>
    </div>
  );
};
