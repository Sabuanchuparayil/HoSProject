import React, { useState, useRef, useEffect } from 'react';
// Use type-only imports to prevent module execution on load
import type { GoogleGenAI, Chat } from '@google/genai';

type Message = {
    role: 'user' | 'model';
    text: string;
};

export const AdminGeminiChat: React.FC = () => {
    const [isAvailable, setIsAvailable] = useState(false);
    
    useEffect(() => {
        if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
            setIsAvailable(true);
        } else {
            console.warn("Gemini API Key not found for Admin Chat. Feature will be disabled.");
        }
    }, []);

    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const chatRef = useRef<Chat | null>(null);
    const aiRef = useRef<GoogleGenAI | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    useEffect(() => {
        if (!isAvailable || !isOpen || chatRef.current) return;

        const initializeChat = async () => {
            setIsLoading(true);
            try {
                const { GoogleGenAI } = await import('@google/genai');
                
                const apiKey = process.env.API_KEY;
                if (!apiKey) throw new Error("API Key is missing after initial check.");

                aiRef.current = new GoogleGenAI({ apiKey });
                
                const systemInstruction = "You are the 'Merchant's Mentor,' a specialist assistant for sellers and administrators on the House of Spells platform. Your role is to provide clear, concise, and actionable advice to help users manage the marketplace. Answer questions about adding products, understanding analytics, managing orders, financial payouts, and following platform guidelines. Maintain a professional and helpful tone.";
                
                chatRef.current = aiRef.current.chats.create({
                    model: 'gemini-2.5-flash',
                    config: {
                        systemInstruction: systemInstruction,
                    },
                });

                setMessages([{ role: 'model', text: "Welcome to the Merchant's Mentor. How can I assist you with managing the marketplace today? Ask about products, orders, analytics, and more." }]);
            } catch (error) {
                console.error("Failed to initialize or create Gemini chat session:", error);
                setMessages([{ role: 'model', text: 'The Mentor is currently unavailable. Please try again later.'}]);
            } finally {
                setIsLoading(false);
            }
        };

        initializeChat();
        
    }, [isOpen, isAvailable]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        const userMessage = inputValue.trim();
        if (!userMessage || isLoading || !chatRef.current) return;

        const newMessages: Message[] = [...messages, { role: 'user', text: userMessage }];
        setMessages(newMessages);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await chatRef.current.sendMessage({ message: userMessage });
            const modelResponse = response.text;
            setMessages([...newMessages, { role: 'model', text: modelResponse }]);
        } catch (error) {
            console.error('Gemini API error:', error);
            setMessages([...newMessages, { role: 'model', text: 'Apologies, my connection to the knowledge archives is unstable. Please try asking again later.' }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    if (!isAvailable) {
        return null;
    }
    
    return (
        <>
            {/* Floating Action Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 bg-[--accent] text-[--accent-foreground] w-16 h-16 rounded-full shadow-lg hover:bg-[--accent-hover] flex items-center justify-center transform hover:scale-110 transition-all z-50"
                aria-label="Open Merchant Mentor"
            >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </button>

            {/* Chat Widget */}
            <div className={`fixed bottom-0 right-0 sm:bottom-6 sm:right-6 bg-[--bg-secondary] text-[--text-primary] rounded-t-lg sm:rounded-lg shadow-2xl border border-[--border-color] w-full h-full sm:w-96 sm:h-[600px] flex flex-col transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-y-0' : 'translate-y-full sm:translate-y-0 sm:scale-0 sm:origin-bottom-right'}`}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-[--border-color] bg-[--bg-tertiary] rounded-t-lg">
                    <h3 className="text-lg font-cinzel font-bold text-[--accent]">Merchant's Mentor</h3>
                    <button onClick={() => setIsOpen(false)} className="text-[--text-muted] hover:text-[--text-primary]" aria-label="Close chat">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-grow p-4 overflow-y-auto space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs md:max-w-sm rounded-lg px-4 py-2 ${msg.role === 'user' ? 'bg-[--accent] text-[--accent-foreground]' : 'bg-[--bg-primary]'}`}>
                                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex justify-start">
                            <div className="max-w-xs md:max-w-sm rounded-lg px-4 py-2 bg-[--bg-primary]">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-[--text-muted] rounded-full animate-pulse"></div>
                                    <div className="w-2 h-2 bg-[--text-muted] rounded-full animate-pulse delay-75"></div>
                                    <div className="w-2 h-2 bg-[--text-muted] rounded-full animate-pulse delay-150"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-[--border-color]">
                    <div className="flex items-center bg-[--bg-primary] rounded-full border border-[--border-color] focus-within:ring-2 focus-within:ring-[--accent]">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ask a question..."
                            className="flex-grow bg-transparent px-4 py-2 text-sm text-[--text-primary] focus:outline-none"
                            disabled={isLoading}
                        />
                        <button type="submit" className="p-2 text-[--accent] hover:text-[--accent-hover] disabled:opacity-50" disabled={isLoading || !inputValue}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 12h14" /></svg>
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};