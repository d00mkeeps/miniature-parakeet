'use client'

import React from 'react';
import { ProgramWorkout, useUserProgramWorkouts} from '@/context/ProgramWorkoutContext';
import Select from 'react-select';

interface WorkoutOption {
  value: string;
  label: string;
  workout: ProgramWorkout;
}

interface WorkoutSelectFieldProps {
  onWorkoutSelect: (workout: ProgramWorkout | null) => void;
  value: ProgramWorkout | null;
}

const WorkoutSelectField: React.FC<WorkoutSelectFieldProps> = ({ onWorkoutSelect, value }) => {
  const { workouts, loading, error } = useUserProgramWorkouts();

  if (loading) return <div>Loading workouts...</div>;
  if (error) return <div>Error loading workouts: {error.message}</div>;

  if (workouts.length === 0) {
    return <div>No workouts found. Please add some workouts first.</div>;
  }

  const options: WorkoutOption[] = workouts.map(workout => ({
    value: workout.id,
    label: workout.name,
    workout: workout,
  }));

  return (
    <Select<WorkoutOption>
      value={value ? { value: value.id, label: value.name, workout: value } : null}
      options={options}
      onChange={(selectedOption) => onWorkoutSelect(selectedOption ? selectedOption.workout : null)}
      placeholder="Search workouts..."
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

export default WorkoutSelectField;