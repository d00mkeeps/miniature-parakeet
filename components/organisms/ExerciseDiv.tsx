'use client';

import React, { useState } from 'react';
import Button from '../atoms/Button';  // Import your Button component
import { Set, ExerciseProps } from '@/types';

const ExerciseDiv: React.FC<ExerciseProps> = ({ index, exercise,onDelete }) => {
  const [sets, setSets] = useState<Set[]>([]);
  const [nextSetId, setNextSetId] = useState(1);

  const addSet = () => {
    const newSet: Set = {
      id: nextSetId,
      weight: 0,
      reps: 0
    };
    setSets(prevSets => [...prevSets, newSet]);
    setNextSetId(prevId => prevId + 1);
  };

  const deleteSet = (setId: number) => {
    setSets(prevSets => prevSets.filter(set => set.id !== setId));
  };

  return (
    <div className="exercise-container bg-gray-700 p-4 mb-4 rounded-lg shadow-md relative">
      <div className="absolute top-2 left-2 bg-gray-600 rounded-full w-6 h-6 flex items-center justify-center">
        <span className="text-white text-sm font-bold">{index+1}</span>
      </div>
      <div className="flex flex-col mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="w-8"></div> {/* Spacer to balance the delete button */}
          <p className="text-white text-center font-semibold text-xl flex-grow">{exercise.name}</p>
          <div>
            <Button
              onClick={onDelete}
              variant="danger"
              size="small"
            >
              Delete Exercise
            </Button>
          </div>
        </div>
      </div>
      <Button
        onClick={addSet}
        variant="secondary"
        size="small"
        className="mb-2"
      >
        Add Set
      </Button>
      {sets.map(set => (
        <div key={set.id} className="set-container mt-2 p-2 bg-gray-600 rounded flex justify-between items-center">
          <p className="text-white">Set {set.id}: {set.weight}kg x {set.reps} reps</p>
          <Button
            onClick={() => deleteSet(set.id)}
            variant="danger"
            size="small"
          >
            Delete Set
          </Button>
        </div>
      ))}
    </div>
  );
};

export default ExerciseDiv;