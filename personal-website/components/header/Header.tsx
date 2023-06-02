"use client";

import { DEFAULT_LOCALE, GITHUB_CV_URL, GITHUB_REPO_URL, LOCALES } from "@/shared/constants";
import { getPathWithLocale, replaceLocale } from "@/shared/locale";
import { tm } from "@/shared/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React, { ComponentPropsWithoutRef, forwardRef } from "react";
import { GiClover } from "react-icons/gi";
import { ImHome, ImNewTab } from "react-icons/im";
import { IoLanguage, IoLayers, IoNavigateCircle } from "react-icons/io5";
import { MdWork } from "react-icons/md";
import { RiContactsBook2Fill, RiFilePaper2Fill } from "react-icons/ri";
import { SiGithub } from "react-icons/si";
import dropdown from "../ui/dropdown";
import ThemeButton from "./ThemeButton";
import { useMessages } from "@/app/context";

export interface HeaderProps extends ComponentPropsWithoutRef<"header"> {}

const Header = React.forwardRef<React.ElementRef<"header">, HeaderProps>(({ className, ...props }, ref) => {
    const pathname = usePathname();
    const messages = useMessages("header");

    const homePath = getPathWithLocale(pathname, "/");
    const blogsPath = getPathWithLocale(pathname, "/blogs");
    const aboutPath = getPathWithLocale(pathname, "/about");
    const animePath = getPathWithLocale(pathname, "/anime");
    const rssPath = getPathWithLocale(pathname, "/rss");

    // console.log(`pathname=${pathname}`);
    // console.log(`homePath=${homePath}`);
    // console.log(`blogsPath=${blogsPath}`);
    // console.log(`contactPath=${contactPath}`);
    // console.log(`animePath=${animePath}`);
    // console.log(`rssPath=${rssPath}`);
    // console.log(`cvPath=${cvPath}`);

    const currentLocale = useParams().locale || DEFAULT_LOCALE;

    return (
        <header className={tm("w-full", className)} ref={ref} {...props}>
            <nav className="flex w-full flex-row flex-wrap items-center justify-center gap-2 md:gap-4 xl:gap-6">
                <NavItem href={homePath}>
                    <ImHome className="icon-md" />
                    HOME
                </NavItem>

                <dropdown.Container>
                    <div className="icon-text std-pad std-hover">
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
                    <div className="icon-text std-pad std-hover">
                        <IoNavigateCircle className="icon-md" />
                        Explore
                    </div>
                    <dropdown.Dropdown variant="glass">
                        <NavItem href={GITHUB_REPO_URL} target="_blank">
                            <SiGithub className="icon-md" />
                            {messages["source"]}
                        </NavItem>
                        {/* <Separator variant="sm" /> */}
                        <NavItem href={blogsPath}>
                            <RiFilePaper2Fill className="icon-md" />
                            {messages["blogs"]}
                        </NavItem>
                        {/* <Separator variant="sm" /> */}
                        <NavItem href={aboutPath}>
                            <RiContactsBook2Fill className="icon-md" />
                            {messages["about"]}
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
                        <NavItem href={GITHUB_CV_URL} target="_blank">
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
    const useNewTabIcon = rest.target === "_blank";
    const [hover, setHover] = React.useState(false);
    return (
        <Link
            href={href}
            locale={locale}
            className={tm("icon-text std-pad std-hover relative", className)}
            ref={ref}
            onMouseEnter={() => setHover(true)}
            onMouseOut={() => setHover(false)}
            {...rest}>
            {useNewTabIcon && hover && (
                <ImNewTab className="pointer-events-none absolute right-0 top-0 z-10 bg-white" />
            )}
            {children}
        </Link>
    );
});
NavItem.displayName = "NavItem";

export default Header;
