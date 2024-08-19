'use client'

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import styles from './Test.module.css';
import Button from '../../atoms/Button';  // Adjust the import path as needed

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const Test: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [streamingMessage, setStreamingMessage] = useState('');
    const scrollableRef = useRef<HTMLDivElement>(null);

    const handleSendMessage = async () => {
        if (!inputText.trim()) return;
    
        setIsLoading(true);
        const userMessage: Message = { role: 'user', content: inputText };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
    
        console.log('Full conversation:', updatedMessages);
    
        setInputText('');
        setStreamingMessage('');
    
        try {
            const response = await fetch('http://localhost:8000/api/welcome_llm', {
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
                            setMessages(prev => [...prev, { role: 'assistant', content: fullResponse }]);
                            setStreamingMessage('');
                        } else {
                            fullResponse += data;
                            setStreamingMessage(fullResponse);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching coach response:', error);
            // Optionally, add error handling UI here
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (scrollableRef.current) {
            scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
        }
    }, [messages, streamingMessage]);

    return (
        <div className={styles.container}>
            <h1>LLM Coach Conversation</h1>
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
        </div>
    );
};

export default Test;