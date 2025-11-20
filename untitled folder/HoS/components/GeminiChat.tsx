import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../contexts/ChatContext';
// Use type-only imports to prevent module execution on load
import type { GoogleGenAI, Chat } from '@google/genai';

type Message = {
    role: 'user' | 'model';
    text: string;
};

export const GeminiChat: React.FC = () => {
    const [isAvailable, setIsAvailable] = useState(false);
    // FIX: Destructured 'openChat' from the useChat hook to make it available for use.
    const { isChatOpen, openChat, closeChat, proactiveMessage, clearProactiveMessage } = useChat();
    
    // Check for API key availability on mount. This determines if the component should render.
    useEffect(() => {
        // This check is safe because it only runs in the browser after initial load.
        if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
            setIsAvailable(true);
        } else {
            console.error("Gemini API Key not found. Chat feature will be disabled.");
        }
    }, []);

    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const chatRef = useRef<Chat | null>(null);
    const aiRef = useRef<GoogleGenAI | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    // Initialize AI and chat session when the component opens for the first time
    useEffect(() => {
        // Guard: Only run if it's available, open, and not already initialized
        if (!isAvailable || !isChatOpen || chatRef.current) return;

        const initializeChat = async () => {
            setIsLoading(true);
            try {
                // Dynamically import the library only when needed
                const { GoogleGenAI } = await import('@google/genai');
                
                const apiKey = process.env.API_KEY;
                if (!apiKey) throw new Error("API Key is missing after initial check.");

                aiRef.current = new GoogleGenAI({ apiKey });
                
                const systemInstruction = "You are the 'House of Spells Oracle,' a friendly and knowledgeable magical assistant. Your purpose is to help users find products, answer questions about the wizarding world and other fandoms like Lord of the Rings, and provide a fun, immersive shopping experience. Use magical and thematic language where appropriate. Keep your answers concise and helpful.";
                
                chatRef.current = aiRef.current.chats.create({
                    model: 'gemini-2.5-flash',
                    config: {
                        systemInstruction: systemInstruction,
                    },
                });

                // Greet the user, with a proactive message if available
                const initialMessage = proactiveMessage || "Greetings! I am the House of Spells Oracle. Ask me about our magical wares, or any secrets you wish to uncover about your favorite fandoms.";
                setMessages([{ role: 'model', text: initialMessage }]);
                if (proactiveMessage) clearProactiveMessage(); // Consume the message

            } catch (error) {
                console.error("Failed to initialize or create Gemini chat session:", error);
                setMessages([{ role: 'model', text: 'The Oracle is currently unavailable. Please try again later.'}]);
            } finally {
                setIsLoading(false);
            }
        };

        initializeChat();
        
    }, [isChatOpen, isAvailable, proactiveMessage, clearProactiveMessage]);

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
            setMessages([...newMessages, { role: 'model', text: 'Apologies, my crystal ball seems to be cloudy. Please try asking again later.' }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    // Don't render the button if the API key isn't available
    if (!isAvailable) {
        return null;
    }
    
    return (
        <>
            {/* Floating Action Button */}
            <button
                onClick={() => openChat()}
                className="fixed bottom-6 right-6 bg-[--accent] text-[--accent-foreground] w-16 h-16 rounded-full shadow-lg hover:bg-[--accent-hover] flex items-center justify-center transform hover:scale-110 transition-all z-50"
                aria-label="Open Magical Assistant"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036a3.375 3.375 0 0 0 2.456 2.456l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258a3.375 3.375 0 0 0-2.456 2.456l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a3.375 3.375 0 0 0-2.456-2.456l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a3.375 3.375 0 0 0 2.456-2.456l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.558l.52 1.95a2.25 2.25 0 0 0 1.54 1.54l1.95.52a.75.75 0 0 1 0 1.424l-1.95.52a2.25 2.25 0 0 0-1.54 1.54l-.52 1.95a.75.75 0 0 1-1.424 0l-.52-1.95a2.25 2.25 0 0 0-1.54-1.54l-1.95-.52a.75.75 0 0 1 0-1.424l1.95.52a2.25 2.25 0 0 0 1.54-1.54l.52-1.95a.75.75 0 0 1 .712-.558Z" clipRule="evenodd" />
                </svg>
            </button>

            {/* Chat Widget */}
            <div className={`fixed bottom-0 right-0 sm:bottom-6 sm:right-6 bg-[--bg-secondary] text-[--text-primary] rounded-t-lg sm:rounded-lg shadow-2xl border border-[--border-color] w-full h-full sm:w-96 sm:h-[600px] flex flex-col transition-transform duration-300 ease-in-out z-50 ${isChatOpen ? 'translate-y-0' : 'translate-y-full sm:translate-y-0 sm:scale-0 sm:origin-bottom-right'}`}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-[--border-color] bg-[--bg-primary] rounded-t-lg">
                    <h3 className="text-lg font-cinzel font-bold text-[--accent]">Magical Assistant</h3>
                    <button onClick={closeChat} className="text-[--text-muted] hover:text-[--text-primary]" aria-label="Close chat">
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