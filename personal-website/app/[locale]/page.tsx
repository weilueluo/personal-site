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
    // const msgs: any = await getTranslation(params.locale);

    return (
        <>
            <Header locale={params.locale} />
        </>
    );
}
