import React from "react";
import { TranslationContextProvider } from "../contexts/translation";

export default async function TranslationProvider({ locale, children }: { locale: string; children: React.ReactNode }) {
    const messages = (await import(`../../public/messages/${locale ?? "en"}.json`, { assert: { type: "json" } }))
        .default;

    return <TranslationContextProvider messages={messages}>{children}</TranslationContextProvider>;
}
