import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ChatContextType {
  isChatOpen: boolean;
  proactiveMessage: string | null;
  openChat: (message?: string) => void;
  closeChat: () => void;
  clearProactiveMessage: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [proactiveMessage, setProactiveMessage] = useState<string | null>(null);

  const openChat = (message?: string) => {
    if (message) {
      setProactiveMessage(message);
    }
    setIsChatOpen(true);
  };

  const closeChat = () => {
    setIsChatOpen(false);
    setProactiveMessage(null); // Clear message on close
  };
  
  const clearProactiveMessage = () => {
    setProactiveMessage(null);
  }

  return (
    <ChatContext.Provider value={{ isChatOpen, proactiveMessage, openChat, closeChat, clearProactiveMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};