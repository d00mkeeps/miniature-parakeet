'use client'
import React from 'react';
import WorkoutHistoryConversation from '@/components/conversation/WorkoutHistoryConversation';

const WorkoutPage: React.FC = () => {

  const handleSummaryGenerated = (summary: string) => {
    console.log('Generated summary:', summary);
  };
const handleHistoryUpdated = (resetConversation: () => void) => {console.log('Training history updated!')

  setTimeout(() => {
    console.log("Resetting conversation after a delay");
    resetConversation();
  }, 500);  // Reset after 3 seconds, for example

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