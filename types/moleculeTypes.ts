export interface ExerciseSelectFieldProps {
  onExerciseSelect: (exercise: { id: number; name: string } | null) => void;
  value: {id: number, name: string} | null
}