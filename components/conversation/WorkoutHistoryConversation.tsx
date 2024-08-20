import React, { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import useConversation from '@/hooks/useConversation';
import ConversationUI from './public/ConversationUI';
import { UserProfile } from '@/types';

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
    setMessages,
    sendMessage,
    resetConversation,
    error,
  } = useConversation({
    apiEndpoint: 'http://localhost:8000/api/welcome_llm',
    initialMessages,
  });

  const { userProfile, updateProfile } = useUser();
  const [latestSummary, setLatestSummary] = useState<string | null>(null);
  const formatSummary = (rawSummary: string) => {
    console.log("Raw summary to format:", rawSummary);
    // Split the summary into text and JSON parts
    const [textPart, jsonPart] = rawSummary.split('---');
  
    // Format the text part
    const formattedText = textPart.trim().split('\n').map(line => {
      const colonIndex = line.indexOf(':');
      if (colonIndex !== -1) {
        const key = line.slice(0, colonIndex).trim();
        const value = line.slice(colonIndex + 1).trim();
        return `• ${key}: ${value}`;
      }
      return `• ${line.trim()}`;
    }).join('\n');
  
    // Parse and format the JSON part
    try {
      const jsonObject = JSON.parse(jsonPart.trim());
      const formattedJson = JSON.stringify(jsonObject, null, 2);
      return `${formattedText}\n\n---\n\n${formattedJson}`;
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return `${formattedText}\n\n---\n\nError parsing JSON`;
    }
  };
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'assistant') {
      console.log("Last message content:", lastMessage.content);
      if (lastMessage.content.trim() === 'DAVEGROHL') {
        const summaryMessage = messages[messages.length - 2];
        if (summaryMessage && summaryMessage.role === 'assistant') {
          console.log("Summary message content:", summaryMessage.content)
          try {
            const formattedSummary = formatSummary(summaryMessage.content);
            const parts = formattedSummary.split('---');
            const jsonStr = parts[parts.length - 1].trim();
            const summaryObject = JSON.parse(jsonStr);
            Object.entries(summaryObject).forEach(([key, value]) => {
              updateProfile(key as keyof UserProfile, value as string | boolean);
            });
            onSummaryGenerated?.('Summary approved and profile updated');
            setMessages((prevMessages) => [
              ...prevMessages.slice(0, -2), {role: 'assistant', content: formattedSummary}]);
            setLatestSummary(formattedSummary);
          } catch (error) {
            console.error('Error parsing summary JSON:', error);
          }
        }
      } else if (lastMessage.content.includes('---')) {
        console.log("Message with '---' detected:", lastMessage.content);
        const formattedSummary = formatSummary(lastMessage.content);
        setLatestSummary(formattedSummary);
      }
    }
  }, [messages, onSummaryGenerated, updateProfile, setMessages]);
  return (
    <div>
      <ConversationUI
        messages={messages}
        isLoading={isLoading}
        streamingMessage={streamingMessage}
        onSendMessage={sendMessage}
        onReset={resetConversation}
        title="Let's get to know each other!"
        subtitle='Send a message to speak with the TrainSmart coach'
      />
      
    </div>
  );
};

export default WorkoutHistoryConversation;