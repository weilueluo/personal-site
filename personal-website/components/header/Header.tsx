"use client";

import ThemeButton from "@/components/theme/ThemeButton";
import { DEFAULT_LOCALE, GITHUB_REPO_URL, LOCALES } from "@/shared/constants";
import { getPathWithLocale, replaceLocale } from "@/shared/locale";
import { useMessages } from "@/shared/translation";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React, { ComponentPropsWithoutRef, forwardRef } from "react";
import { GiClover } from "react-icons/gi";
import { ImHome } from "react-icons/im";
import { IoLanguage, IoLayers, IoNavigateCircle } from "react-icons/io5";
import { MdWork } from "react-icons/md";
import { RiContactsBook2Fill, RiFilePaper2Fill } from "react-icons/ri";
import { SiGithub } from "react-icons/si";
import dropdown from "../ui/dropdown";
import { tm } from "@/shared/utils";

export interface HeaderProps extends ComponentPropsWithoutRef<"header"> {}

const Header = React.forwardRef<React.ElementRef<"header">, HeaderProps>(({ className, ...props }, ref) => {
    const pathname = usePathname();
    const messages = useMessages("header");

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

    const currentLocale = useParams().locale || DEFAULT_LOCALE;

    return (
        <header className="w-full" ref={ref} {...props}>
            <nav className="flex w-full flex-row flex-wrap items-center justify-center gap-6">
                <NavItem href={homePath}>
                    <ImHome className="icon-md" />
                    HOME
                </NavItem>

                {/* <li
                    className={tm(
                        listItemClassName,
                        (pathname === "/" || pathname === homePath) && activeClassName
                    )}></li> */}
                {/* <LocaleButton className={tm("px-1")} /> */}

                <dropdown.Container>
                    <div className="icon-text std-pad">
                        <IoLanguage className="icon-md" />
                        {currentLocale.toUpperCase()}
                    </div>
                    <dropdown.Dropdown variant="glass">
                        {(LOCALES ?? []).map((locale) => (
                            <NavItem
                                key={locale}
                                href={replaceLocale(pathname, currentLocale, locale)}
                                // data-active={locale === currentLocale}
                                className="flex flex-row items-center justify-center uppercase">
                                <span>{locale}</span>
                            </NavItem>
                        ))}
                    </dropdown.Dropdown>
                </dropdown.Container>

                <ThemeButton />

                <dropdown.Container>
                    <div className="icon-text std-pad">
                        <IoNavigateCircle className="icon-md" />
                        Explore
                    </div>
                    <dropdown.Dropdown variant="glass">
                        <NavItem href={GITHUB_REPO_URL}>
                            <SiGithub className="icon-md" />
                            {messages["source"]}
                        </NavItem>
                        {/* <Separator variant="sm" /> */}
                        <NavItem href={blogsPath}>
                            <RiFilePaper2Fill className="icon-md" />
                            {messages["blogs"]}
                        </NavItem>
                        {/* <Separator variant="sm" /> */}
                        <NavItem href={contactPath}>
                            <RiContactsBook2Fill className="icon-md" />
                            {messages["contact"]}
                        </NavItem>
                        {/* <Separator variant="sm" /> */}
                        <NavItem href={animePath}>
                            <GiClover className="icon-md" />
                            {messages["anime"]}
                        </NavItem>
                        {/* <Separator variant="sm" /> */}
                        <NavItem href={rssPath}>
                            <IoLayers className="icon-md" />
                            {messages["rss"]}
                        </NavItem>
                        {/* <Separator variant="sm" /> */}
                        <NavItem href={cvPath}>
                            <MdWork className="icon-md" />
                            {messages["cv"]}
                        </NavItem>
                    </dropdown.Dropdown>
                </dropdown.Container>
            </nav>
        </header>
    );
});
Header.displayName = "Header";

interface NavItemProps extends ComponentPropsWithoutRef<"a"> {
    href: string;
    children: React.ReactNode;
}
const NavItem = forwardRef<HTMLAnchorElement, NavItemProps>(({ href, children, className, ...rest }, ref) => {
    const { locale } = useParams();
    return (
        <Link
            href={href}
            locale={locale}
            className={tm("icon-text std-pad hover:bg-button-std", className)}
            ref={ref}
            {...rest}>
            {children}
        </Link>
    );
});
NavItem.displayName = "NavItem";

export default Header;
