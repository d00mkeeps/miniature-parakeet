'use client'
import React from 'react';
import WorkoutHistoryConversation from '@/components/conversation/WorkoutHistoryConversation';

const WorkoutPage: React.FC = () => {
  const handleSummaryGenerated = (summary: string) => {
    console.log('Generated summary:', summary);
  };

  return (
    <div>
      <WorkoutHistoryConversation onSummaryGenerated={handleSummaryGenerated} />
    </div>
  );
};

export default WorkoutPage;