"use client";

import LocaleButton from "@/components/locale/LocaleButton";
import ThemeButton from "@/components/theme/ThemeButton";
import { GITHUB_REPO_URL } from "@/shared/constants";
import { L_FONT } from "@/shared/fonts";
import { getPathWithLocale } from "@/shared/locale";
import { useMessages } from "@/shared/translation";
import { tm } from "@/shared/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React, { ComponentPropsWithoutRef, forwardRef } from "react";
import { GiClover } from "react-icons/gi";
import { HiAcademicCap } from "react-icons/hi";
import { IoLayers } from "react-icons/io5";
import { MdWork } from "react-icons/md";
import { RiContactsBook2Fill, RiFilePaper2Fill } from "react-icons/ri";
import { SiGithub } from "react-icons/si";
import List from "../ui/List";

export interface HeaderProps extends ComponentPropsWithoutRef<"header"> {}

const Header = React.forwardRef<React.ElementRef<"header">, HeaderProps>(({ className, ...props }, ref) => {
    const { locale } = useParams();
    const pathname = usePathname();
    const messages = useMessages("header");
    const linkClassName = tm("self-center flex flex-row items-center gap-2 p-2 hover-shadow");
    const linkIconClassName = tm("w-6 h-6");
    const listItemClassName = tm("mx-1");
    const activeClassName = tm("[&:not(:hover)]:shadow-inset-sm");

    const homePath = getPathWithLocale(pathname, "/");
    const blogsPath = getPathWithLocale(pathname, "/blogs");
    const contactPath = getPathWithLocale(pathname, "/contact");
    const animePath = getPathWithLocale(pathname, "/anime");
    const rssPath = getPathWithLocale(pathname, "/rss");
    const cvPath = getPathWithLocale(pathname, "/cv");

    // console.log(`pathname=${pathname}`);
    // console.log(`homePath=${homePath}`);
    // console.log(`blogsPath=${blogsPath}`);
    // console.log(`contactPath=${contactPath}`);
    // console.log(`animePath=${animePath}`);
    // console.log(`rssPath=${rssPath}`);
    // console.log(`cvPath=${cvPath}`);

    return (
        <header className={tm("w-full")} ref={ref} {...props}>
            <nav className="flex w-full flex-row flex-wrap justify-between gap-4">
                <List className="flex-row">
                    <ThemeButton className={listItemClassName} />
                    <li className={tm(listItemClassName, (pathname === "/" || pathname === homePath) && activeClassName)}>
                        <Link href={homePath} locale={locale} className={linkClassName}>
                            <HiAcademicCap className={linkIconClassName} />
                            <h3>LUOWEILUE</h3>
                        </Link>
                    </li>
                    <LocaleButton className={tm(listItemClassName, "px-2")} />
                </List>

                <List className="flex-row">
                    <li className={listItemClassName}>
                        <Link href={GITHUB_REPO_URL} className={linkClassName}>
                            <SiGithub className={linkIconClassName} />
                            {messages["source"]}
                        </Link>
                    </li>
                    <li className={tm(listItemClassName, pathname.startsWith(blogsPath) && activeClassName)}>
                        <Link href={blogsPath} locale={locale} className={linkClassName}>
                            <RiFilePaper2Fill className={linkIconClassName} />
                            {messages["blogs"]}
                        </Link>
                    </li>
                    <li className={tm(listItemClassName, pathname.startsWith(contactPath) && activeClassName)}>
                        <Link href={contactPath} locale={locale} className={linkClassName}>
                            <RiContactsBook2Fill className={linkIconClassName} />
                            {messages["contact"]}
                        </Link>
                    </li>
                    <li className={tm(listItemClassName, pathname.startsWith(animePath) && activeClassName)}>
                        <Link href={animePath} locale={locale} className={linkClassName}>
                            <GiClover className={linkIconClassName} />
                            {messages["anime"]}
                        </Link>
                    </li>
                    <li className={tm(listItemClassName, pathname.startsWith(rssPath) && activeClassName)}>
                        <Link href={rssPath} locale={locale} className={linkClassName}>
                            <IoLayers className={linkIconClassName} />
                            {messages["rss"]}
                        </Link>
                    </li>
                    <li className={tm(listItemClassName, pathname.startsWith(cvPath) && activeClassName)}>
                        <Link href={cvPath} locale={locale} className={linkClassName}>
                            <MdWork className={linkIconClassName} />
                            {messages["cv"]}
                        </Link>
                    </li>
                </List>

                {/* <List className="flex-row">
                    <ThemeButton className={listItemClassName} />
                    <LocaleButton className={tm(listItemClassName, "shadow-inset-sm px-2")} />
                </List> */}
            </nav>
        </header>
    );
});

const LinkIcon = forwardRef<HTMLAnchorElement, ComponentPropsWithoutRef<"a">>((props, ref) => {
    // hover:shadow-gray-600 transition-[box-shadow] hover:shadow-md duration-150
    return (
        <a ref={ref} {...props}>
            <span className="sr-only">{props.children}</span>
        </a>
    );
});

LinkIcon.displayName = "LinkIcon";

Header.displayName = "Header";

export default Header;
