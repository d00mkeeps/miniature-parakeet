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
  exercise: {
    tracks_weight: boolean;
    tracks_reps: boolean;
    tracks_duration: boolean;
    tracks_distance: boolean;
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
  