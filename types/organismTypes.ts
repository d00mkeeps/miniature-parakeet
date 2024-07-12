export interface AddExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: number, name: string, inputValues: {
    weight: number;
    reps: number;
    duration: { minutes: number; seconds: number };
    distance: number;
  }) => void;
}


export interface Set {
  duration: any;
  distance: any;
  id: number;
  weight: number;
  reps: number;
}

export interface ExerciseProps {
  index: number;
  exerciseId: number; // Regular id for fetching exercise data
  uniqueId: string;   // Unique id for workout-specific operations
  onDelete: (uniqueId: string) => void;
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
  