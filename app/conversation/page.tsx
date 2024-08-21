'use client'
import React from 'react';
import WorkoutHistoryConversation from '@/components/conversation/WorkoutHistoryConversation';

const WorkoutPage: React.FC = () => {

  const handleSummaryGenerated = (summary: string) => {
  };
const handleHistoryUpdated = (resetConversation: () => void) => {

  setTimeout(() => {
    resetConversation()
  }, 500);

}
  return (
    <div>
      <WorkoutHistoryConversation
       onSummaryGenerated={handleSummaryGenerated}
       onHistoryUpdated={handleHistoryUpdated} />
    </div>
  );
};

export default WorkoutPage;