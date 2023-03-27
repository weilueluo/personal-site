import LocaleButton from "@/components/locale/LocaleButton";
import ThemeButton from "@/components/theme/ThemeButton";
import { m } from "@/shared/css";
import { L_FONT } from "@/shared/fonts";
import { getTranslation } from "@/shared/i18n";
import { GITHUB_REPO_URL } from "@/shared/settings";
import Link from "next/link";
import { GiClover } from "react-icons/gi";
import { HiAcademicCap } from "react-icons/hi";
import { IoLayers } from "react-icons/io5";
import { MdWork } from "react-icons/md";
import { RiContactsBook2Fill, RiFilePaper2Fill } from "react-icons/ri";
import { SiGithub } from "react-icons/si";
import styles from "./Header.module.scss";

export default async function Header({ locale }: { locale: string }) {
    const msg = await getTranslation(locale, "header");

    return (
        <header className={m(styles.header, L_FONT.className)}>
            <nav className={styles.nav}>
                <ul className={styles.list}>
                    <li className={styles.item}>
                        <Link href={`/${locale}`} className={styles.link}>
                            <HiAcademicCap />
                            <h3>LUOWEILUE</h3>
                        </Link>
                    </li>
                </ul>

                <ul className={styles.list}>
                    <li className={styles.item}>
                        <Link href={GITHUB_REPO_URL} className={styles.link}>
                            <SiGithub />
                            {msg.source}
                        </Link>
                    </li>
                    <li className={styles.item}>
                        <Link href={`/${locale}/blogs`} className={styles.link}>
                            <RiFilePaper2Fill />
                            {msg.blogs}
                        </Link>
                    </li>
                    <li className={styles.item}>
                        <Link href={`/${locale}/contact`} className={styles.link}>
                            <RiContactsBook2Fill />
                            {msg.contact}
                        </Link>
                    </li>
                    <li className={styles.item}>
                        <Link href={`/${locale}/anime`} className={styles.link}>
                            <GiClover />
                            {msg.anime}
                        </Link>
                    </li>
                    <li className={styles.item}>
                        <Link href={`/${locale}/rss`} className={styles.link}>
                            <IoLayers />
                            {msg.rss}
                        </Link>
                    </li>
                    <li className={styles.item}>
                        <Link href={`/${locale}/cv`} className={styles.link}>
                            <MdWork />
                            {msg.cv}
                        </Link>
                    </li>
                </ul>

                <ul className={styles.list}>
                    <ThemeButton />
                    <LocaleButton locale={locale} />
                </ul>
            </nav>
        </header>
    );
}
