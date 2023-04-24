import React, { useContext } from "react";

const TranslationContext = React.createContext({ messages: {} as Record<string, string> });

export default function TranslationProvider({ children, messages }: { children: React.ReactNode; messages: any }) {

    // keep messages in state so that between transitions, the old messages are still available
    // console.log( "messages", messages);
    
    const [messagesState, _] = React.useState(messages);  

    return <TranslationContext.Provider value={{ messages: messagesState }}>{children}</TranslationContext.Provider>;
}

export function useMessages({ index = undefined }: { index?: string | undefined }) {
    const { messages } = useContext(TranslationContext);
    return {
        messages: index ? messages[index] : messages,
    };
}

export function getMessagesKey(locale: string) {
    return `/messages/${locale}.json`;
}
