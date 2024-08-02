import { Program } from ".";

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
  distance: number;
  id: number;
  weight: number;
  reps: number;
}

export interface ExerciseProps {
  index: number;
  exerciseId: number; 
  
  uniqueId: string;  
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
    training_history: string | null;
    goals?: string | null;
  }

  export interface TrackedExercise {
    id: number
    name: string
    uniqueId: string
    sets?:Set[]
  }
  
  export interface InputValues {
    weight: number;
    reps: number;
    duration: { minutes: number; seconds: number };
    distance: number;
  }

  export interface ParsedTimeframe {
    ai_advice: { text: string; type: string }[];
  }

  export interface ProgramListProps {
    programs: Program[];
    onDelete: (id: string) => void;
  }