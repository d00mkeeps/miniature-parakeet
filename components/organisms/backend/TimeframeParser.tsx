'use client'

import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '@/context/UserContext';
import styles from '@/styles/organisms.module.css';
import { ParsedTimeframe } from '@/types';

const TimeframeParser = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<ParsedTimeframe | null>(null);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { userProfile, loading, error: userError } = useUser();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [query]);

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
        timeframe: query,
        user_id: userProfile.user_id,
        training_history: userProfile.training_history,
        goals: userProfile.goals,
      });
      setResult(response.data);
    } catch (err) {
      setError('Error parsing query or fetching workout data. Please try again.');
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
      <h2 className={styles.title}>AI Coaching Advice</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <textarea
          ref={textareaRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your query (e.g., 'Please look over my workout history over the last 6 weeks and give me tips to increase my bench press.')"
          className={styles.textarea}
          rows={1}
        />
        <button type="submit" className={styles.button} disabled={!userProfile || !query.trim()}>
          Get Advice
        </button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
      {result && result.ai_advice && (
        <div className={styles.aiAdviceSection}>
          <strong>AI Coaching Advice:</strong>
          <div className={styles.scrollableContent}>
            {result.ai_advice.map((block, index) => (
              <pre key={index} className={styles.adviceText}>{block.text}</pre>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeframeParser;