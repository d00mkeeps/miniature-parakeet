'use client'

import React from 'react';
import { useUserExercises } from '@/context/UserExercisesContext';
import Select from 'react-select';
import { Exercise, ExerciseSelectFieldProps } from '@/types';

type ExerciseOption = {
  value: number;
  label: string;
  exercise: Exercise;
};

const ExerciseSelectField: React.FC<ExerciseSelectFieldProps> = ({ onExerciseSelect, value }) => {
  const { exercises, loading, error } = useUserExercises();

  if (loading) return <div>Loading exercises...</div>;
  if (error) return <div>Error loading exercises: {error.message}</div>;

  if (exercises.length === 0) {
    return <div>No exercises found. Please add some exercises first.</div>;
  }

  const options: ExerciseOption[]= exercises.map(exercise => ({
    value: exercise.id,
    label: exercise.name,
    exercise: exercise,
  }));

  return (
    <Select<ExerciseOption>
  value={value ? { value: value.id, label: value.name, exercise: value } : null}
  options={options}
  onChange={(selectedOption) => onExerciseSelect(selectedOption ? selectedOption.exercise : null)}
  placeholder="Search exercises..."
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
