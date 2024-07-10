import React from 'react';
import { useUserExercises } from '@/hooks/useUserExercises';
import Select, {StylesConfig} from 'react-select';

interface ExerciseSelectFieldProps {
  onExerciseSelect: (exercise: { id: number; name: string } | null) => void;
}

const ExerciseSelectField: React.FC<ExerciseSelectFieldProps> = ({ onExerciseSelect }) => {
  const { exercises, loading, error } = useUserExercises();

  if (loading) return <div>Loading exercises...</div>;
  if (error) return <div>Error loading exercises: {error.message}</div>;

  if (exercises.length === 0) {
    return <div>No exercises found. Please add some exercises first.</div>;
  }

  const options = exercises.map(exercise => ({
    value: exercise.id,
    label: exercise.name,
    isTemplate: exercise.is_template,
    description: exercise.description,
  }));

  return (
    <Select
      options={options}
      onChange={(selectedOption) => onExerciseSelect(selectedOption ? { id: selectedOption.value, name: selectedOption.label } : null)}
      placeholder="Select an exercise"
      isClearable
      isSearchable
      className="select-container" 
      classNamePrefix="select" 
      styles={{
        option: (base) => ({
          ...base,
          color: '#333333', 
        }),
        singleValue: (base) => ({
          ...base,
          color: '#333333', 
        }),
        placeholder: (base) => ({
          ...base,
          color: '#666666', 
        }),
      }}
    />
  );
};

export default ExerciseSelectField;
