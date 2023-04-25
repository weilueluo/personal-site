"use client";

import { useParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";

export const TranslationContext = React.createContext({ messages: {} as Record<string, string> });

export default function TranslationProvider({
    children,
    messages: initialMessages,
}: {
    children: React.ReactNode;
    messages: any;
}) {
    const { locale } = useParams();

    const [messages, setMessages] = useState(initialMessages);

    useEffect(() => {
        import(`../public/messages/${locale ?? "en"}.json`).then((messages) => setMessages(messages.default));
    }, [locale]);

    return <TranslationContext.Provider value={{ messages }}>{children}</TranslationContext.Provider>;
}

export function useMessages(index: string | undefined = undefined) {
    const { messages } = useContext(TranslationContext);
    return index ? messages[index] : messages;
}

export function getMessagesKey(locale: string) {
    return `/messages/${locale}.json`;
}
