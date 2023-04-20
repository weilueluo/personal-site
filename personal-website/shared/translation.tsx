import React, { useContext } from "react";

const TranslationContext = React.createContext({ messages: {} as Record<string, string> });

export default function TranslationProvider({
    children,
    messages,
}: {
    children: React.ReactNode;
    messages: Record<string, string>;
}) {
    return (
        <TranslationContext.Provider value={{ messages }}>{children}</TranslationContext.Provider>
    );
}

export function useMessages({ index = undefined }: { index?: string | undefined }) {
    const { messages } = useContext(TranslationContext);

    // console.log(`useMessages: messages=${JSON.stringify(messages)}`);
    
    return {
        messages: index ? messages[index] : messages,
    };
}

export function getMessagesKey(locale: string) {
    return `/messages/${locale}.json`;
}
