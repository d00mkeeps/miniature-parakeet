'use client'

import { useState } from 'react';
import axios from 'axios';
import { useUser } from '@/context/UserContext';
import styles from './TimeframeParser.module.css';

interface WorkoutExercise {
  id: string;
  exercise_name: string;
  set_data: Record<string, any>;
  order_in_workout: number;
}

interface Workout {
  id: string;
  name: string;
  created_at: string;
  description: string;
  exercises: WorkoutExercise[];
}

interface ParsedTimeframe {
  start_date: string;
  end_date: string;
  original_query: string;
  workout_data: Workout[];
}

const TimeframeParser = () => {
  const [timeframe, setTimeframe] = useState('');
  const [result, setResult] = useState<ParsedTimeframe | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { userProfile, loading, error: userError } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!userProfile) {
      setError('User profile not available. Please try again later.');
      return;
    }

    try {
      const response = await axios.post('/api/parse-timeframe', { 
        timeframe, 
        user_id: userProfile.user_id 
      });
      setResult(response.data);
    } catch (err) {
      setError('Error parsing timeframe or fetching workout data. Please try again.');
      console.error(err);
    }
  };

  if (loading) {
    return <div>Loading user profile...</div>;
  }

  if (userError) {
    return <div>Error loading user profile: {userError.message}</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Workout Data Retrieval</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          placeholder="Enter timeframe (e.g., 'last 2 weeks')"
          className={styles.input}
        />
        <button type="submit" className={styles.button} disabled={!userProfile}>
          Fetch Data
        </button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
      {result && (
        <div className={styles.result}>
          <h3>Parsed Timeframe:</h3>
          <p>Start Date: {result.start_date}</p>
          <p>End Date: {result.end_date}</p>
          <h3>Workouts:</h3>
          {result.workout_data.length === 0 ? (
            <p>No workouts found in this timeframe.</p>
          ) : (
            result.workout_data.map((workout) => (
              <div key={workout.id} className={styles.workout}>
                <h4>{workout.name || 'Unnamed Workout'}</h4>
                <p>Date: {new Date(workout.created_at).toLocaleDateString()}</p>
                <p>Description: {workout.description || 'No description'}</p>
                <h5>Exercises:</h5>
                {workout.exercises.length === 0 ? (
                  <p>No exercises recorded for this workout.</p>
                ) : (
                  <ul>
                    {workout.exercises.map((exercise) => (
                      <li key={exercise.id}>
                        {exercise.exercise_name || 'Unnamed Exercise'} (Sets: {JSON.stringify(exercise.set_data)})
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default TimeframeParser;