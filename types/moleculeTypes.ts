import { Exercise, Program, Set } from "."

export interface ExerciseSelectFieldProps {
  onExerciseSelect: (exercise: Exercise | null) => void;
  value: Exercise | null;
}

export interface SetDivProps {
  set: Set;
  onDelete: (id: number) => void;
  onUpdate: (id: number, weight: number, reps: number, duration: number, distance: number) => void;
  exerciseProps: {
    tracks_weight: boolean;
    tracks_reps: boolean;
    tracks_duration: boolean;
    tracks_distance: boolean;
  };
}

export interface DistanceInputFieldProps {
  value: number;
  onChange: (value: number) => void;
}

export interface DurationInputFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export interface RepsInputFieldProps {
  value: number;
  onChange: (value: number) => void;
}

export interface WeightInputFieldProps {
  value: number;
  onChange: (value: number) => void;
}

export type ExerciseOption = {
  value: number;
  label: string;
  exercise: Exercise;
};

export interface CreateProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProgramCreated?: (program: Program) => void;
}


export interface ProgramCardProps {
  program: Program;
  onDelete: (id: string) => void;  // Changed to string assuming UUID
}