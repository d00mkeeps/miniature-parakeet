import { useState, useCallback, useEffect } from 'react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface UseConversationOptions {
    apiEndpoint: string;
    initialMessages?: Message[];
}

const useConversation = ({ apiEndpoint, initialMessages = [] }: UseConversationOptions) => {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [isLoading, setIsLoading] = useState(false);
    const [streamingMessage, setStreamingMessage] = useState('');
    const [error, setError] = useState<string | null>(null);

    const sendMessage = useCallback(async (userMessage: string) => {
        if (!userMessage.trim()) return;

        setIsLoading(true);
        setError(null);
        const newUserMessage: Message = { role: 'user', content: userMessage };
        setMessages(prevMessages => [...prevMessages, newUserMessage]);
        setStreamingMessage('');

        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [...messages, newUserMessage] }),
            });

            if (!response.body) throw new Error('No response body');
            const reader = response.body.getReader();
            let accumulatedResponse = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = new TextDecoder().decode(value);
                const lines = chunk.split('\n\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') {
                            if (accumulatedResponse) {
                                const finalMessage: Message = { role: 'assistant', content: accumulatedResponse };
                                setMessages(prevMessages => [...prevMessages, finalMessage]);
                                setStreamingMessage('');
                            }
                        } else {
                            try {
                                const parsedData = JSON.parse(data);
                                accumulatedResponse += parsedData.content;
                                setStreamingMessage(accumulatedResponse);
                            } catch (e) {
                                console.error('Error parsing streaming data:', e);
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error in conversation:', error);
            setError(error instanceof Error ? error.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    }, [apiEndpoint, messages]);

    const resetConversation = useCallback(() => {
        setMessages(initialMessages);
        setStreamingMessage('');
        setError(null);
    }, [initialMessages]);

    return {
        messages,
        isLoading,
        streamingMessage,
        sendMessage,
        resetConversation,
        error,
        setMessages
    };
};

export default useConversation;