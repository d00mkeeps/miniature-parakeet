import React, { useCallback } from 'react';
import useConversation from '@/hooks/useConversation';
import ConversationUI from './public/ConversationUI';

interface WorkoutHistoryConversationProps {
  onSummaryGenerated?: (summary: string) => void;
  initialMessages?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

const WorkoutHistoryConversation: React.FC<WorkoutHistoryConversationProps> = ({
  onSummaryGenerated,
  initialMessages = [],
}) => {
  const {
    messages,
    isLoading,
    streamingMessage,
    sendMessage,
    resetConversation,
  } = useConversation({
    apiEndpoint: 'http://localhost:8000/api/welcome_llm',
    initialMessages,
  });

  const handleSendMessage = useCallback(async (message: string) => {
    await sendMessage(message);
    
    // Check if there are messages and if the last message includes 'SUMMARY_READY'
    if (messages.length > 0 && messages[messages.length - 1].content.includes('SUMMARY_READY')) {
      const summary = await fetchSummary(messages);
      onSummaryGenerated?.(summary);
    }
  }, [messages, sendMessage, onSummaryGenerated]);

  const fetchSummary = async (conversationMessages: typeof messages) => {
    try {
      const response = await fetch('/api/get_summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: conversationMessages }),
      });
      const data = await response.json();
      return data.summary;
    } catch (error) {
      console.error('Error fetching summary:', error);
      return 'Error generating summary';
    }
  };

  return (
    <ConversationUI
      messages={messages}
      isLoading={isLoading}
      streamingMessage={streamingMessage}
      onSendMessage={handleSendMessage}
      onReset={resetConversation}
      title="Let's get to know each other!"
      subtitle="Enter a message to begin"
    />
  );
};

export default WorkoutHistoryConversation;