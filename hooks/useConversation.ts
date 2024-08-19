import {useState, useCallback} from 'react'
interface Message {
    role: 'user'|'assistant';
    content: string
}

interface UseConversationOptions {
    apiEndpoint: string
    initialMessages?: Message[]
}

const useConversation = ({ apiEndpoint, initialMessages = [] }: UseConversationOptions) => {
    const [messages, setMessages] = useState<Message[]>(initialMessages)
    const [isLoading, setIsLoading] = useState(false)
    const [streamingMessage, setStreamingMessage] = useState('')
    const sendMessage = useCallback(async (userMessage: string) => {
        if (!userMessage.trim()) return;
    
        setIsLoading(true);
        const newUserMessage: Message = { role: 'user', content: userMessage };
        setMessages(prevMessages => [...prevMessages, newUserMessage]);
        setStreamingMessage('');
    
        try {
          const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messages: [...messages, newUserMessage],
            }),
          });
    
          if (!response.body) throw new Error('No response body');
          const reader = response.body.getReader();
          let fullResponse = '';
    
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
    
            const chunk = new TextDecoder().decode(value);
            const lines = chunk.split('\n');
            
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') {
                  const finalMessage: Message = { role: 'assistant', content: fullResponse };
                  setMessages(prevMessages => [...prevMessages, finalMessage]);
                  setStreamingMessage('');
                } else {
                  fullResponse += data;
                  setStreamingMessage(fullResponse);
                }
              }
            }
          }
        } catch (error) {
          console.error('Error in conversation:', error);
          // Optionally, add error state handling here
        } finally {
          setIsLoading(false);
        }
      }, [apiEndpoint, messages]);
    const resetConversation = useCallback(() => {
        setMessages(initialMessages)
        setStreamingMessage('')
    }, [initialMessages])
    return {
        messages, 
        isLoading,
        streamingMessage,
        sendMessage,
        resetConversation,
    }
}

export default useConversation