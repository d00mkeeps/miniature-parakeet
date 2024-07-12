import { Exercise, Set } from "."

export interface ExerciseSelectFieldProps {
  onExerciseSelect: (exercise: Exercise | null) => void;
  value: {
    name: any;id: number
  } | null
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