// pages/index.js
import styles from '@/styles/pages.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>RAG System for Workout Analysis & Coaching</h1>
      
      <div className={styles.step}>
        <h2 className={styles.stepTitle}>1. User Input</h2>
        <p className={styles.stepContent}>
          User submits a natural language query about their workouts. 
          Example: "How has my squat performance improved over the last month?"
        </p>
      </div>

      <div className={styles.step}>
        <h2 className={styles.stepTitle}>2. Query Parsing</h2>
        <p className={styles.stepContent}>
          System parses the query to extract key information:
        </p>
        <ul className={styles.stepList}>
          <li>User ID (implicit from authenticated session)</li>
          <li>Timeframe (e.g., "last month")</li>
          <li>Relevant exercise (e.g., "squat")</li>
        </ul>
      </div>

      <div className={styles.step}>
        <h2 className={styles.stepTitle}>3. Metadata Filtering</h2>
        <p className={styles.stepContent}>
          Using extracted information, system filters RAG data:
        </p>
        <ul className={styles.stepList}>
          <li>Filter by User ID</li>
          <li>Filter by parsed timeframe</li>
          <li>Initial filter for relevant exercise data</li>
        </ul>
      </div>

      <div className={styles.step}>
        <h2 className={styles.stepTitle}>4. RAG Retrieval</h2>
        <p className={styles.stepContent}>
          System retrieves relevant data chunks:
        </p>
        <ul className={styles.stepList}>
          <li>User's workout data for the specified period</li>
          <li>Related exercise information</li>
          <li>Relevant coaching tips and advice</li>
        </ul>
      </div>

      <div className={styles.step}>
        <h2 className={styles.stepTitle}>5. LLM Processing</h2>
        <p className={styles.stepContent}>
          Single, powerful LLM processes the query and retrieved data:
        </p>
        <ul className={styles.stepList}>
          <li>Analyzes workout data trends</li>
          <li>Identifies relevant exercises and performance metrics</li>
          <li>Incorporates appropriate coaching advice</li>
        </ul>
      </div>

      <div className={styles.step}>
        <h2 className={styles.stepTitle}>6. Response Generation</h2>
        <p className={styles.stepContent}>
          LLM generates a comprehensive response:
        </p>
        <ul className={styles.stepList}>
          <li>Performance analysis based on user data</li>
          <li>Personalized insights on progress</li>
          <li>Tailored coaching advice for improvement</li>
        </ul>
      </div>

      <div className={styles.step}>
        <h2 className={styles.stepTitle}>7. User Presentation</h2>
        <p className={styles.stepContent}>
          System presents the response to the user in a clear, structured format:
        </p>
        <ul className={styles.stepList}>
          <li>Data visualization of progress (if applicable)</li>
          <li>Written analysis of performance</li>
          <li>Actionable coaching tips</li>
        </ul>
      </div>
    </div>
  );
}