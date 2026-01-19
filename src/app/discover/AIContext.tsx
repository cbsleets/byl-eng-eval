"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type AIContextType = {
  // Summary state
  summary: string | null;
  setSummary: (summary: string | null) => void;
  summaryLoaded: boolean;
  setSummaryLoaded: (loaded: boolean) => void;
  
  // Chat state
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
};

const AIContext = createContext<AIContextType | null>(null);

export function AIProvider({ children }: { children: ReactNode }) {
  const [summary, setSummary] = useState<string | null>(null);
  const [summaryLoaded, setSummaryLoaded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  return (
    <AIContext.Provider
      value={{
        summary,
        setSummary,
        summaryLoaded,
        setSummaryLoaded,
        messages,
        setMessages,
        addMessage,
      }}
    >
      {children}
    </AIContext.Provider>
  );
}

export function useAI() {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error("useAI must be used within an AIProvider");
  }
  return context;
}

