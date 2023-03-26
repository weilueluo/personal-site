import LocaleButton from "@/components/locale/LocaleButton";
import ThemeButton from "@/components/theme/ThemeButton";
import { m } from "@/shared/css";
import { L_FONT } from "@/shared/fonts";
import { getTranslation } from "@/shared/i18n";
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
                        <HiAcademicCap />
                        <h3>LUOWEILUE</h3>
                    </li>
                </ul>

                <ul className={styles.list}>
                    <a>
                        <li className={styles.item}>
                            <SiGithub />
                            {msg["source"]}
                        </li>
                    </a>
                    <a>
                        <li className={styles.item}>
                            <RiFilePaper2Fill />
                            {msg["blogs"]}
                        </li>
                    </a>
                    <a>
                        <li className={styles.item}>
                            <RiContactsBook2Fill />
                            {msg["contact"]}
                        </li>
                    </a>
                    <a>
                        <li className={styles.item}>
                            <GiClover />
                            {msg["anime"]}
                        </li>
                    </a>
                    <a>
                        <li className={styles.item}>
                            <IoLayers />
                            {msg["rss"]}
                        </li>
                    </a>
                    <a>
                        <li className={styles.item}>
                            <MdWork />
                            {msg["cv"]}
                        </li>
                    </a>
                </ul>

                <ul className={styles.list}>
                    <ThemeButton />
                    <LocaleButton />
                </ul>
            </nav>
        </header>
    );
}
