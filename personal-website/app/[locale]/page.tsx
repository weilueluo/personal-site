import Header from "@/components/header/Header";
import ThemeButton from "@/components/theme/ThemeButton";
import { getTranslation } from "@/shared/i18n";
import { LOCALES } from "@/shared/i18n/settings";
import { Inter } from "next/font/google";
import Image from "next/image";
import styles from "./page.module.css";

const inter = Inter({ subsets: ["latin"] });

export function generateStaticParams() {
    return LOCALES.map((locale) => ({
        locale,
    }));
}

export default async function Page({ params }: { params: { locale: string } }) {
    const msgs: any = await getTranslation(params.locale);

    return (
        <main className={styles.main}>
            {/* @ts-expect-error Async Server Component */}
            <Header locale={params.locale} />
            <h1>{msgs.Index.title}</h1>
            <div className={styles.description}>
                <ThemeButton />
                <p className={styles.test}>
                    Get started by editing&nbsp;
                    <code className={styles.code}>app/page.tsx</code>
                </p>
                <div>
                    <a
                        href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
                        target="_blank"
                        rel="noopener noreferrer">
                        By{" "}
                        <Image
                            src="/assets/vercel.svg"
                            alt="Vercel Logo"
                            className={styles.vercelLogo}
                            width={100}
                            height={24}
                            priority
                        />
                    </a>
                </div>
            </div>

            <div className={styles.center}>
                <Image
                    className={styles.logo}
                    src="/assets/next.svg"
                    alt="Next.js Logo"
                    width={180}
                    height={37}
                    priority
                />
                <div className={styles.thirteen}>
                    <Image src="/assets/thirteen.svg" alt="13" width={40} height={31} priority />
                </div>
            </div>

            <div className={styles.grid}>
                <a
                    href="https://beta.nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
                    className={styles.card}
                    target="_blank"
                    rel="noopener noreferrer">
                    <h2 className={inter.className}>
                        Docs <span>-&gt;</span>
                    </h2>
                    <p className={inter.className}>
                        Find in-depth information about Next.js features and API.
                    </p>
                </a>

                <a
                    href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
                    className={styles.card}
                    target="_blank"
                    rel="noopener noreferrer">
                    <h2 className={inter.className}>
                        Templates <span>-&gt;</span>
                    </h2>
                    <p className={inter.className}>Explore the Next.js 13 playground.</p>
                </a>

                <a
                    href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
                    className={styles.card}
                    target="_blank"
                    rel="noopener noreferrer">
                    <h2 className={inter.className}>
                        Deploy <span>-&gt;</span>
                    </h2>
                    <p className={inter.className}>
                        Instantly deploy your Next.js site to a shareable URL with Vercel.
                    </p>
                </a>
            </div>
        </main>
    );
}
