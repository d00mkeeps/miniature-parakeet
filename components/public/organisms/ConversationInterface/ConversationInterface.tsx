'use client'

import React, { useState, useRef, useEffect } from 'react';
import styles from './ConversationInterface.module.css';
import Button from '../../atoms/Button'; 
import UserProfileConfirmationModal from '../../molecules/UserProfileConfirmationModal'

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface ConversationInterfaceProps {
    apiEndpoint: string;
    summaryEndpoint: string;
    title?: string;
}

const ConversationInterface: React.FC<ConversationInterfaceProps> = ({ 
    apiEndpoint, 
    summaryEndpoint,
    title = "Training History Collection" 
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [streamingMessage, setStreamingMessage] = useState('');
    const [summary, setSummary] = useState<string | null>(null);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const scrollableRef = useRef<HTMLDivElement>(null);

    const handleSendMessage = async () => {
        if (!inputText.trim()) return;
    
        setIsLoading(true);
        const userMessage: Message = { role: 'user', content: inputText };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
    
        setInputText('');
        setStreamingMessage('');
    
        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ messages: updatedMessages }),
            });
    
            const reader = response.body?.getReader();
            if (!reader) throw new Error('No reader available');
    
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
                            const finalMessage = { role: 'assistant' as const, content: fullResponse };
                            setMessages(prev => [...prev, finalMessage]);
                            setStreamingMessage('');
                            
                            if (fullResponse.includes('SUMMARY_READY')) {
                                await getSummary([...updatedMessages, finalMessage]);
                            }
                        } else {
                            fullResponse += data;
                            setStreamingMessage(fullResponse);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching response:', error);
            // Optionally, add error handling UI here
        }
        setIsLoading(false);
    };

    const getSummary = async (conversationMessages: Message[]) => {
        try {
            const response = await fetch(summaryEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ messages: conversationMessages }),
            });

            if (!response.ok) {
                throw new Error('Failed to get summary');
            }

            const data = await response.json();
            setSummary(data.summary);
            setShowConfirmationModal(true);
            console.log('User Training History Summary:', data.summary);
        } catch (error) {
            console.error('Error getting summary:', error);
        }
    };

    const handleConfirmSummary = () => {
        setShowConfirmationModal(false);
        // You can add any additional actions here after confirmation
    };

    const handleCancelSummary = () => {
        setShowConfirmationModal(false);
        setSummary(null);
        // You can add any additional actions here after cancellation
    };
    useEffect(() => {
        if (scrollableRef.current) {
            scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
        }
    }, [messages, streamingMessage]);

    return (
        <div className={styles.container}>
            <h1>{title}</h1>
            <div className={styles.scrollableContainer} ref={scrollableRef}>
                <div className={styles.messageList}>
                    {messages.map((message, index) => (
                        <div key={index} className={`${styles.messageItem} ${styles[message.role]}`}>
                            {message.content}
                        </div>
                    ))}
                    {streamingMessage && (
                        <div className={`${styles.messageItem} ${styles.assistant}`}>
                            {streamingMessage}
                        </div>
                    )}
                </div>
            </div>
            <div className={styles.inputContainer}>
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type your message here..."
                    className={styles.input}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputText.trim()}
                    variant="primary"
                    size="medium"
                >
                    {isLoading ? 'Sending...' : 'Send'}
                </Button>
            </div>
            {showConfirmationModal && summary && (
                <UserProfileConfirmationModal
                    summary={summary}
                    onConfirm={handleConfirmSummary}
                    onCancel={handleCancelSummary}
                />
            )}
            </div>
    );
};

export default ConversationInterface;