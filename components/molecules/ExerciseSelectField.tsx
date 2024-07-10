import React from 'react';
import { useUserExercises } from '@/hooks/useUserExercises';
import Select, {StylesConfig} from 'react-select';

interface ExerciseSelectFieldProps {
  onExerciseSelect: (exerciseId: number | null) => void;
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
      onChange={(selectedOption) => onExerciseSelect(selectedOption ? selectedOption.value : null)}
      placeholder="Select an exercise"
      isClearable
      isSearchable
      className="select-container" // Add a class for the container
      classNamePrefix="select" // This is important for targeting inner elements
      styles={{
        // Target the text color of various parts
        option: (base) => ({
          ...base,
          color: '#333333', // Darker text for options
        }),
        singleValue: (base) => ({
          ...base,
          color: '#333333', // Darker text for selected value
        }),
        placeholder: (base) => ({
          ...base,
          color: '#666666', // Slightly lighter for placeholder
        }),
      }}
    />
  );
};

export default ExerciseSelectField;
