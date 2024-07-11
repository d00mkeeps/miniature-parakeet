export interface AddExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (exerciseId: number, exerciseName: string) => void;
}

export interface Set {
  id: number;
  weight: number;
  reps: number;
}

export interface ExerciseProps {
  index: number;
  exercise: {
    id: number;
    name: string;
    uniqueId: string;
  };
  onDelete: () => void;
}

export interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface FormData {
    displayName: string;
    firstName: string;
    lastName: string;
    isImperial: boolean;
  }

  export interface TrackedExercise {
    id: number
    name: string
    uniqueId: string
    sets?:Set[]
  }
  