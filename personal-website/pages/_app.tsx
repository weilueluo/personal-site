import Layout from "@/components/ui/Layout";
import ThemeProvider from "@/shared/themes";
import TranslationProvider from "@/shared/translation";
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
                </Layout>
            </TranslationProvider>
        </ThemeProvider>
    );
}
