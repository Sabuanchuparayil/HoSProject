import React, { useState, useRef, useEffect } from "react";
import { useChat } from "../../contexts/ChatContext";
import type { GenerativeModel, ChatSession } from "@google/generative-ai";

type Message = {
    role: "user" | "model";
    text: string;
};

export const AdminGeminiChat: React.FC = () => {
    // ChatContext
    const { isChatOpen, openChat, closeChat, proactiveMessage, clearProactiveMessage } =
        useChat();

    const [isAvailable, setIsAvailable] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [inputValue, setInputValue] = useState("");

    const modelRef = useRef<GenerativeModel | null>(null);
    const chatRef = useRef<ChatSession | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Check API Key availability
    useEffect(() => {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.API_KEY;
        if (apiKey) setIsAvailable(true);
        else console.warn("Gemini API key missing for customer chat");
    }, []);

    // Scroll to last message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Initialize chat session
    useEffect(() => {
        if (!isAvailable || !isChatOpen || chatRef.current) return;

        const initializeChat = async () => {
            setIsLoading(true);
            try {
                const { GoogleGenerativeAI } = await import("@google/generative-ai");

                const apiKey =
                    import.meta.env.VITE_GEMINI_API_KEY || process.env.API_KEY;
                if (!apiKey) throw new Error("No Gemini API key found.");

                const ai = new GoogleGenerativeAI(apiKey);

                modelRef.current = ai.getGenerativeModel({
                    model: "gemini-2.5-flash",
                    systemInstruction:
                        "You are the House of Spells Oracle. Be magical, friendly, and helpful.",
                });

                chatRef.current = modelRef.current.startChat();

                const greeting =
                    proactiveMessage ||
                    "Greetings, traveler! I am the House of Spells Oracle. How may I assist you today?";

                setMessages([{ role: "model", text: greeting }]);

                if (proactiveMessage) clearProactiveMessage();
            } catch (err) {
                console.error("Gemini init error:", err);
                setMessages([
                    { role: "model", text: "The Oracle is temporarily unavailable." },
                ]);
            } finally {
                setIsLoading(false);
            }
        };

        initializeChat();
    }, [isAvailable, isChatOpen, proactiveMessage, clearProactiveMessage]);

    // Send message
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        const text = inputValue.trim();
        if (!text || !chatRef.current) return;

        const newList = [...messages, { role: "user", text }];
        setMessages(newList);
        setInputValue("");
        setIsLoading(true);

        try {
            const result = await chatRef.current.sendMessage(text);
            const responseText = await result.response.text();

            setMessages([...newList, { role: "model", text: responseText }]);
        } catch (err) {
            console.error(err);
            setMessages([
                ...newList,
                {
                    role: "model",
                    text: "The magical winds are unstable… please try again shortly.",
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isAvailable) return null;

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={openChat}
                className="fixed bottom-6 right-6 w-16 h-16 bg-[--accent] text-white rounded-full shadow-xl z-50 flex items-center justify-center hover:scale-110 transition-all"
            >
                💬
            </button>

            {/* Chat Window */}
            <div
                className={`fixed bottom-0 right-0 sm:bottom-6 sm:right-6
                    w-full h-full sm:w-96 sm:h-[600px]
                    bg-[--bg-secondary] rounded-t-xl sm:rounded-xl shadow-xl border
                    transition-all duration-300 z-50
                    ${isChatOpen ? "translate-y-0" : "translate-y-full sm:scale-0"}
                `}
            >
                {/* Header */}
                <div className="p-4 bg-[--bg-primary] border-b flex justify-between items-center rounded-t-xl">
                    <h3 className="text-lg font-bold text-[--accent]">Magical Assistant</h3>
                    <button onClick={closeChat}>✖</button>
                </div>

                {/* Messages */}
                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, i) => (
                        <div
                            key={i}
                            className={`flex ${
                                msg.role === "user" ? "justify-end" : "justify-start"
                            }`}
                        >
                            <div
                                className={`px-4 py-2 rounded-lg max-w-xs ${
                                    msg.role === "user"
                                        ? "bg-[--accent] text-white"
                                        : "bg-[--bg-primary]"
                                }`}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="animate-pulse flex space-x-2">
                                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t">
                    <div className="flex bg-[--bg-primary] rounded-full border px-3">
                        <input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="flex-grow bg-transparent py-2 focus:outline-none"
                            placeholder="Ask something magical…"
                        />
                        <button type="submit" disabled={!inputValue} className="px-3">
                            ➤
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};
