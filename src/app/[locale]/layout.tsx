import Header from "@/components/header/header";
import Separator from "@/components/ui/separator";
import { fetchMessages } from "@/shared/i18n/translation";
import Init from "@/shared/init";
import { BaseCompProps, BasePageProps } from "@/shared/types/comp";
import { tm } from "@/shared/utils";
import Script from "next/script";

export default async function Layout({ children, params }: BasePageProps) {
    const messages = await fetchMessages(params.locale);
    return (
        <>
            <Init />
            <Main messages={messages} locale={params.locale}>
                {children}
            </Main>
            <Analytics />
        </>
    );
}

function Main({ children, locale, messages, className, ...rest }: BaseCompProps<"main">) {
    return (
        <main
            className={tm(
                "max-w-screen relative flex h-fit min-h-screen w-[60em] max-w-[100vw] flex-col p-4 md:px-24 md:py-4",
                className
            )}
            {...rest}>
            {/* @ts-ignore Async Server Component */}
            <Header messages={messages} locale={locale} />
            <Separator className="mb-2 h-2" />
            {children}
        </main>
    );
}

function Analytics() {
    const g_tag = process.env.NEXT_PUBLIC_G_TAG;
    return (
        <>
            {/* <!-- Google tag (gtag.js) --> */}
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${g_tag}`} strategy="afterInteractive" />
            <Script id="google-analytics" strategy="afterInteractive">
                {`window.dataLayer = window.dataLayer || [];
                    function gtag(){window.dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${g_tag}');
                `}
            </Script>
        </>
    );
}
