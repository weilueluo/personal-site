import Header from "@/components/header/Header";
import CanvasLayout from "@/components/three/layout";
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

    // console.log("messages", typeof messages);
    // console.log("messages", messages);

    return (
        <ThemeProvider cookies={cookies()}>
            <TranslationProvider messages={messages}>
                <html lang={locale}>
                    <body>
                        <CanvasLayout>
                            <Header />
                            {children}
                        </CanvasLayout>
                    </body>
                </html>
            </TranslationProvider>
        </ThemeProvider>
    );
}
