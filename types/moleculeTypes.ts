import { Set } from "."

export interface ExerciseSelectFieldProps {
  onExerciseSelect: (exercise: { id: number; name: string } | null) => void;
  value: {id: number, name: string} | null
}

export interface SetDivProps {
  set: Set;
  onDelete: (id: number) => void;
  onUpdate: (id: number, weight: number, reps: number) => void;
}