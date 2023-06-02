import { TranslationContextProvider } from "@/app/context";
import React from "react";

export default async function TranslationProvider({ locale, children }: { locale: string; children: React.ReactNode }) {
    const messages = (await import(`../public/messages/${locale ?? "en"}.json`, { assert: { type: "json" } })).default;

    return <TranslationContextProvider messages={messages}>{children}</TranslationContextProvider>;
}
