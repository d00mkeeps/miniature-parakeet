'use client'

import { useState } from 'react';
import axios from 'axios';
import { useUser } from '@/context/UserContext';
import styles from './TimeframeParser.module.css';

interface ParsedTimeframe {
  formatted_data: string;
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
  const formatOutput = (data: string) => {
    const parts = data.split('\n\n');
    const timeframeParts = parts[1].split('\n');
    
    return (
      <>
        <div className={styles.querySection}>
          <strong>Original Query:</strong>
          <p className={styles.wrappedText}>{parts[0].replace('Original query: ', '')}</p>
        </div>
        <div className={styles.timeframeSection}>
          <strong>Timeframe:</strong>
          <p>{timeframeParts[1]}</p>
          <p>{timeframeParts[2]}</p>
        </div>
        <div className={styles.workoutsSection}>
          <strong>Workouts:</strong>
          <div className={styles.scrollableContent}>
            <pre>{parts.slice(2).join('\n\n')}</pre>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Workout Data Retrieval</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          placeholder="Enter timeframe"
          className={styles.input}
        />
        <button type="submit" className={styles.button} disabled={!userProfile}>
          Fetch Data
        </button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
      {result && (
        <div className={styles.result}>
          {formatOutput(result.formatted_data)}
        </div>
      )}
    </div>
  );
};

export default TimeframeParser;