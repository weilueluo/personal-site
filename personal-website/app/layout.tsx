import Header from "@/components/header/Header";
import Separator from "@/components/ui/Separator";
import ThemeProvider from "@/shared/themes";
import TranslationProvider from "@/shared/translation";
import { enableMapSet } from "immer";
import { cookies } from "next/headers";
import "./global.css";

interface Params {
    locale: string;
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Params }) {
    const locale = params.locale ?? "en";

    const messages = (await import(`../public/messages/${locale}.json`)).default;

    // console.log("messages", typeof messages);
    // console.log("messages", messages);

    return (
        <ThemeProvider cookies={cookies()}>
            <TranslationProvider messages={messages}>
                <html lang={locale}>
                    <body className="grid place-items-center">
                        <main className="max-w-screen relative flex h-fit min-h-screen w-[57em] flex-col bg-sky-200 p-6 md:px-24 md:py-4">
                            <Header />
                            <Separator className="mb-2" />
                            {children}
                        </main>
                    </body>
                </html>
            </TranslationProvider>
        </ThemeProvider>
    );
}
