'use client'

import { useState } from 'react';
import axios from 'axios';
import styles from './TimeframeParser.module.css';
import { useUser } from '@/context/UserContext';

const TimeframeParser = () => {
  const [timeframe, setTimeframe] = useState('');
  const [result, setResult] = useState<{ start_date: string; end_date: string } | null>(null);
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
      const response = await axios.post('/api/parse-timeframe', { timeframe,
        userId: userProfile.user_id
       });
      setResult(response.data);
    } catch (err) {
      setError('Error parsing timeframe. Please check your input.');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Timeframe Parser</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          placeholder="Enter query"
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          Parse
        </button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
      {result && (
        <div className={styles.result}>
          <p>Start Date: {result.start_date}</p>
          <p>End Date: {result.end_date}</p>
        </div>
      )}
    </div>
  );
};

export default TimeframeParser;