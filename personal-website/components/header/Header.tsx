import LocaleButton from "@/components/locale/LocaleButton";
import ThemeButton from "@/components/theme/ThemeButton";
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
import { ComponentPropsWithoutRef, forwardRef } from "react";
import React from "react";
import { tm } from "@/shared/utils";

export interface HeaderProps extends ComponentPropsWithoutRef<"header"> {
    locale: string;
}

const Header = React.forwardRef<React.ElementRef<"header">, HeaderProps>(
    // @ts-expect-error: async server components
    async ({ className, locale, ...props }, ref) => {
        const msg = await getTranslation(locale, "header");
        const linkClassName = tm(
            "self-center flex flex-row items-center gap-2 p-2 rounded-xl hover:shadow-gray-600 transition-[box-shadow] hover:shadow-md duration-150"
        );
        const linkIconClassName = tm("w-6 h-6");
        const listClassName = tm(
            "flex-row justify-center items-center flex gap-2 grow flex-wrap"
        );
        const listItemClassName = tm("");

        return (
            <header className={tm("w-full", L_FONT.className)} ref={ref} {...props}>
                <nav className="flex w-full flex-row flex-wrap justify-between">
                    <ul className={listClassName}>
                        <li className={listItemClassName}>
                            <Link href={`/${locale}`} className={linkClassName}>
                                <HiAcademicCap className={linkIconClassName} />
                                <h3>LUOWEILUE</h3>
                            </Link>
                        </li>
                    </ul>

                    <ul className={listClassName}>
                        <li className={listItemClassName}>
                            <Link href={GITHUB_REPO_URL} className={linkClassName}>
                                <SiGithub className={linkIconClassName} />
                                {msg.source}
                            </Link>
                        </li>
                        <li className={listItemClassName}>
                            <Link href={`/${locale}/blogs`} className={linkClassName}>
                                <RiFilePaper2Fill className={linkIconClassName} />
                                {msg.blogs}
                            </Link>
                        </li>
                        <li className={listItemClassName}>
                            <Link href={`/${locale}/contact`} className={linkClassName}>
                                <RiContactsBook2Fill className={linkIconClassName} />
                                {msg.contact}
                            </Link>
                        </li>
                        <li className={listItemClassName}>
                            <Link href={`/${locale}/anime`} className={linkClassName}>
                                <GiClover className={linkIconClassName} />
                                {msg.anime}
                            </Link>
                        </li>
                        <li className={listItemClassName}>
                            <Link href={`/${locale}/rss`} className={linkClassName}>
                                <IoLayers className={linkIconClassName} />
                                {msg.rss}
                            </Link>
                        </li>
                        <li className={listItemClassName}>
                            <Link href={`/${locale}/cv`} className={linkClassName}>
                                <MdWork className={linkIconClassName} />
                                {msg.cv}
                            </Link>
                        </li>
                    </ul>

                    <ul className={listClassName}>
                        <ThemeButton />
                        <LocaleButton locale={locale} />
                    </ul>
                </nav>
            </header>
        );
    }
);

const LinkIcon = forwardRef<HTMLAnchorElement, ComponentPropsWithoutRef<"a">>((props, ref) => {
    // hover:shadow-gray-600 transition-[box-shadow] hover:shadow-md duration-150
    return (
        <a ref={ref} {...props}>
            <span className="sr-only">{props.children}</span>
        </a>
    );
});

Header.displayName = "Header";

export default Header;
