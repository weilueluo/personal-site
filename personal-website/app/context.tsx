"use client";
import React, { useContext } from "react";

export const TranslationContext = React.createContext<{ messages: any }>({ messages: {} });

export function TranslationContextProvider({ messages, children }: { messages: any; children: React.ReactNode }) {
    return <TranslationContext.Provider value={{ messages }}>{children}</TranslationContext.Provider>;
}

export function useMessages(index: string | undefined = undefined) {
    const { messages } = useContext(TranslationContext);
    return index ? messages[index] : messages;
}
