import Header from "@/components/header/Header";
import Separator from "@/components/ui/Separator";
import Init from "@/shared/init";
import ThemeProvider from "@/shared/themes";
import TranslationProvider from "@/shared/translation";
import { cookies } from "next/headers";
import "./global.css";

interface Params {
    locale: string;
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Params }) {
    const locale = params.locale ?? "en";

    const messages = (await import(`../public/messages/${locale}.json`)).default;

    return (
        <ThemeProvider cookies={cookies()}>
            <TranslationProvider messages={messages}>
                <html lang={locale}>
                    <body className="grid place-items-center">
                        <Init />
                        <main className="max-w-screen relative flex h-fit min-h-screen w-[60em] max-w-[100vw] flex-col p-4 md:px-24 md:py-4">
                            <Header />
                            <Separator className="mb-2 h-2" />
                            {children}
                        </main>
                    </body>
                </html>
            </TranslationProvider>
        </ThemeProvider>
    );
}
