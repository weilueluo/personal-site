import Header from "@/components/header/Header";
import Separator from "@/components/ui/Separator";
import Init from "@/shared/init";
import ThemeProvider from "@/shared/themes";
import TranslationProvider from "@/shared/translation";
import { Analytics } from "@vercel/analytics/react";
import { cookies } from "next/headers";
import "./global.css";
import Script from "next/script";
import { inter } from "@/shared/fonts";
import { tm } from "@/shared/utils";

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
                    <body className={tm("grid place-items-center", inter.className)}>
                        <Init />
                        <Analytics />
                        <main className="max-w-screen relative flex h-fit min-h-screen w-[60em] max-w-[100vw] flex-col p-4 md:px-24 md:py-4">
                            <Header />
                            <Separator className="mb-2 h-2" />
                            {children}
                        </main>
                        {/* <!-- Google tag (gtag.js) --> */}
                        <Script
                            src="https://www.googletagmanager.com/gtag/js?id=G-Q4960EHJRQ"
                            strategy="afterInteractive"
                        />
                        <Script id="google-analytics" strategy="afterInteractive">
                            {`
                                window.dataLayer = window.dataLayer || [];
                                function gtag(){window.dataLayer.push(arguments);}
                                gtag('js', new Date());

                                gtag('config', 'G-Q4960EHJRQ');
                            `}
                        </Script>
                    </body>
                </html>
            </TranslationProvider>
        </ThemeProvider>
    );
}
