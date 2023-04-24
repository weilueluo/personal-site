import Layout from "@/components/ui/Layout";
import ThemeProvider from "@/shared/themes";
import TranslationProvider from "@/shared/translation";
import { Analytics } from "@vercel/analytics/react";
import { AppProps } from "next/app";
import { NextApiRequestCookies } from "next/dist/server/api-utils";
import "./globals.css";

interface MyAppProps {
    messages: Record<string, string>;
    cookies: NextApiRequestCookies;
}

export default function App({ Component, pageProps }: AppProps<MyAppProps>) {
    return (
        <ThemeProvider cookies={pageProps.cookies}>
            <TranslationProvider messages={pageProps.messages}>
                <Layout useCanvas>
                    <Component {...pageProps} />

                    <Analytics />
                </Layout>
            </TranslationProvider>
        </ThemeProvider>
    );
}
