import React from 'react';
import WorkoutHistoryConversation from '@/components/conversation/WorkoutHistoryConversation';

type TrainingHistoryStepProps = {
  onNext: (history: any) => void;  // Changed to 'any' to accommodate JSON format
};

export const TrainingHistoryStep: React.FC<TrainingHistoryStepProps> = ({ onNext }) => {
  const handleSummaryGenerated = (summary: any) => {
    // You might want to do something with the summary here
    console.log('Summary generated:', summary);
  };

  const handleHistoryUpdated = (history: any) => {
    // Call onNext with the updated history
    onNext(history);
  };

  return (
    <WorkoutHistoryConversation
      onSummaryGenerated={handleSummaryGenerated}
      onHistoryUpdated={handleHistoryUpdated}
    />
  );
};