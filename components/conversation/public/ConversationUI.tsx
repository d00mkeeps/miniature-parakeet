'use client'
import React, { useState, useRef, useEffect } from 'react';
import styles from './ConversationUI.module.css';
import Button from '@/components/public/atoms/Button';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface ConversationUIProps {
    messages: Message[];
    isLoading: boolean;
    streamingMessage: string;
    onSendMessage: (message: string) => void;
    onReset: () => void;
    title?: string;
    subtitle?: string
}

const ConversationUI: React.FC<ConversationUIProps> = ({
    messages,
    isLoading,
    streamingMessage,
    onSendMessage,
    onReset,
    title,
    subtitle,
}) => {
    const [inputText, setInputText] = useState('');
    const scrollableRef = useRef<HTMLDivElement>(null);

    const handleSendMessage = () => {
        if (!inputText.trim()) return;
        onSendMessage(inputText);
        setInputText('');
    };

    useEffect(() => {
        if (scrollableRef.current) {
            scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
        }
    }, [messages, streamingMessage]);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{title}</h1>
            <h2 className={styles.subtitle}>{subtitle}</h2>
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
            <div className={styles.resetButton}>
            <Button
                onClick={onReset}
                variant="secondary"
                size="small"
            >
                Reset Conversation
            </Button>
            </div> 
        </div>
    );
};

export default ConversationUI;