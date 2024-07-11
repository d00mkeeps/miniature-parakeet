import { Exercise } from ".";

export 
interface UserProfile {
  first_name: string | null;
  last_name: string | null;
  date_of_birth: string | null;
  is_imperial: boolean;
  display_name: string | null;
  user_id: number;
  auth_user_uuid: string | null;
}


export interface UserContextType {
    userProfile: UserProfile | null;
    setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
    loading: boolean;
    error: Error | null;
  }

export interface UserExercisesContextType {
  exercises: Exercise[];
  loading: boolean;
  error: Error | null;
  refetchExercises: (fetchTemplatesOnly?: boolean) => Promise<void>;
}