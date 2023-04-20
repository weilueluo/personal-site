import LocaleButton from "@/components/locale/LocaleButton";
import ThemeButton from "@/components/theme/ThemeButton";
import { GITHUB_REPO_URL } from "@/shared/constants";
import { L_FONT } from "@/shared/fonts";
import { useMessages } from "@/shared/translation";
import { tm } from "@/shared/utils";
import Link from "next/link";
import React, { ComponentPropsWithoutRef, forwardRef } from "react";
import { GiClover } from "react-icons/gi";
import { HiAcademicCap } from "react-icons/hi";
import { IoLayers } from "react-icons/io5";
import { MdWork } from "react-icons/md";
import { RiContactsBook2Fill, RiFilePaper2Fill } from "react-icons/ri";
import { SiGithub } from "react-icons/si";
import List from "../ui/List";
import { useRouter } from "next/router";

export interface HeaderProps extends ComponentPropsWithoutRef<"header"> {}

const Header = React.forwardRef<React.ElementRef<"header">, HeaderProps>(
    ({ className, ...props }, ref) => {
        const { locale } = useRouter();
        const { messages }: any = useMessages({ index: "header" });
        const linkClassName = tm(
            "self-center flex flex-row items-center gap-2 p-2 rounded-xl hover:shadow-gray-600 transition-[box-shadow] hover:shadow-md duration-150"
        );
        const linkIconClassName = tm("w-6 h-6");
        const listItemClassName = tm("mx-1");

        return (
            <header className={tm("w-full", L_FONT.className)} ref={ref} {...props}>
                <nav className="flex w-full flex-row flex-wrap justify-between gap-4">
                    <List className="flex-row">
                        <li className={listItemClassName}>
                            <Link href={"/"} locale={locale} className={linkClassName}>
                                <HiAcademicCap className={linkIconClassName} />
                                <h3>LUOWEILUE</h3>
                            </Link>
                        </li>
                    </List>

                    <List className="flex-row">
                        <li className={listItemClassName}>
                            <Link href={GITHUB_REPO_URL} className={linkClassName}>
                                <SiGithub className={linkIconClassName} />
                                {messages['source']}
                            </Link>
                        </li>
                        <li className={listItemClassName}>
                            <Link href={`/blogs`} locale={locale} className={linkClassName}>
                                <RiFilePaper2Fill className={linkIconClassName} />
                                {messages['blogs']}
                            </Link>
                        </li>
                        <li className={listItemClassName}>
                            <Link href={`/contact`} locale={locale} className={linkClassName}>
                                <RiContactsBook2Fill className={linkIconClassName} />
                                {messages['contact']}
                            </Link>
                        </li>
                        <li className={listItemClassName}>
                            <Link href={`/anime`} locale={locale} className={linkClassName}>
                                <GiClover className={linkIconClassName} />
                                {messages['anime']}
                            </Link>
                        </li>
                        <li className={listItemClassName}>
                            <Link href={`/rss`} locale={locale} className={linkClassName}>
                                <IoLayers className={linkIconClassName} />
                                {messages['rss']}
                            </Link>
                        </li>
                        <li className={listItemClassName}>
                            <Link href={`/cv`} locale={locale} className={linkClassName}>
                                <MdWork className={linkIconClassName} />
                                {messages['cv']}
                            </Link>
                        </li>
                    </List>

                    <List className="flex-row">
                        <ThemeButton className={listItemClassName} />
                        <LocaleButton className={listItemClassName} />
                    </List>
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
