import React, { useState, useCallback } from 'react';
import { useUser } from '@/context/UserContext';
import useConversation from '@/hooks/useConversation';
import ConversationUI from './public/ConversationUI';

interface WorkoutHistoryConversationProps {
  onSummaryGenerated?: (summary: string) => void;
  onHistoryUpdated?: (resetConversation: () => void) => void;
  initialMessages?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

const Notification: React.FC<{ message: string; type: 'success' | 'error' }> = ({ message, type }) => (
  <div style={{
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '10px 20px',
    borderRadius: '5px',
    backgroundColor: type === 'success' ? '#4CAF50' : '#f44336',
    color: 'white',
    zIndex: 1000
  }}>
    {message}
  </div>
);

const WorkoutHistoryConversation: React.FC<WorkoutHistoryConversationProps> = ({
  onSummaryGenerated,
  onHistoryUpdated,
  initialMessages = [],
}) => {
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const { userProfile, updateProfile } = useUser();

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000); // Hide after 3 seconds
  };

  const {
    messages,
    isLoading,
    streamingMessage,
    setMessages,
    sendMessage,
    resetConversation,
    error,
  } = useConversation({
    apiEndpoint: 'http://localhost:8000/api/welcome_llm',
    initialMessages,
    onSummaryApproved: () => {
      const summaryMessage = messages[messages.length - 1];
      if (summaryMessage && summaryMessage.role === 'assistant') {
        try {
          console.log("Summary message content:", summaryMessage.content);
          
          const parts = summaryMessage.content.split('---');
          const jsonPart = parts[parts.length - 1].trim();
          
          console.log("JSON part:", jsonPart);

          const summaryObject = JSON.parse(jsonPart);
          
          console.log("Parsed summary object:", summaryObject);

          updateProfile('training_history', summaryObject)
            .then((success) => {
              if (success) {
                showNotification('Training history updated successfully!', 'success');
                if (onHistoryUpdated) {
                  onHistoryUpdated(resetConversation);
                }
                onSummaryGenerated?.('Summary approved and profile updated');
              } else {
                console.error('Failed to update profile');
                showNotification('Failed to update training history', 'error');
              }
            })
            .catch((error) => {
              console.error('Error updating profile:', error);
              showNotification('Error updating training history', 'error');
            });

        } catch (error) {
          console.error('Error processing summary:', error);
          console.error('Summary content:', summaryMessage.content);
          showNotification('Error processing summary', 'error');
        }
      } else {
        console.error('No valid summary message found');
        showNotification('No valid summary found', 'error');
      }
    },
  });

  return (
    <div>
      {notification && <Notification message={notification.message} type={notification.type} />}
      <ConversationUI
        messages={messages}
        isLoading={isLoading}
        streamingMessage={streamingMessage}
        onSendMessage={sendMessage}
        onReset={resetConversation}
        title="Let's get to know each other!"
        subtitle=''
      />
    </div>
  );
};

export default WorkoutHistoryConversation;