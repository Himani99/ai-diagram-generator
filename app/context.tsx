"use client";
import type { Message } from "@/types/type";
import { createContext, useContext, useState } from "react";

interface ContextType {
    draftMessage: string;
    setDraftMessage: (message: string) => void;
    messages: Message[];
    setMessages: (messages: Message[]) => void;
    draftOutputCode: string;
    setDraftOutputCode: (code: string) => void;
    outputCode: string;
    setOutputCode: (code: string) => void;
    mode: 'mermaid' | 'svg';
    setMode : (mode: 'mermaid' | 'svg') => void;
}

const Context = createContext<ContextType | undefined>(undefined);

export const ContextProvider : React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [draftMessage, setDraftMessage] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [draftOutputCode, setDraftOutputCode] = useState<string>("");
    const [outputCode, setOutputCode] = useState<string>("");
    const [mode, setMode] = useState<'mermaid' | 'svg'>('svg');

    return (
        <Context.Provider
            value={{
                draftMessage,
                setDraftMessage,
                messages,
                setMessages,
                draftOutputCode,
                setDraftOutputCode,
                outputCode,
                setOutputCode,
                mode,
                setMode,
            }}
        >
            {children}
        </Context.Provider>
    );
}

export const useContextValues = () => {
    const context = useContext(Context);
    if (!context) {
        throw new Error("useContextValues must be used within a ContextProvider");
    }
    return context;
}