import Separator from "@/components/ui/separator";
import { GITHUB_CV_URL, GITHUB_REPO_URL, LOCALES, LOCALE_DISPLAY_MAP } from "@/shared/constants";
import { FormattedMessage } from "@/shared/i18n/translation";
import { BaseCompProps } from "@/shared/types/comp";
import { tm } from "@/shared/utils";
import { GiClover } from "react-icons/gi/index";
import { ImHome } from "react-icons/im/index";
import { IoLanguage, IoLayers, IoNavigateCircle } from "react-icons/io5/index";
import { MdWork } from "react-icons/md/index";
import { RiContactsBook2Fill, RiFilePaper2Fill } from "react-icons/ri/index";
import { SiGithub } from "react-icons/si/index";
import * as dropdown from "../../ui/dropdown";
import NavItem from "./nav-item";
import ThemeButton from "./theme-button";
import IconedText from "@/components/ui/icon-text";

export default async function Header({ className, messages, locale, ...props }: BaseCompProps<"header">) {
    return (
        <header className={tm("w-full", className)} {...props}>
            <nav className="flex w-full flex-row flex-wrap items-center justify-center gap-2 md:gap-4 xl:gap-6">
                <NavItem href={"/"} locale={locale} messages={messages}>
                    <ImHome className="icon-md" />
                    <FormattedMessage messages={messages} id="header.home" />
                </NavItem>

                <dropdown.Container>
                    <IconedText>
                        <IoLanguage className="icon-md" />
                        {LOCALE_DISPLAY_MAP[locale]}
                    </IconedText>
                    <dropdown.Dropdown variant="glass">
                        {(LOCALES ?? []).map(locale => (
                            <NavItem
                                key={locale}
                                locale={locale}
                                messages={messages}
                                className="flex flex-row items-center justify-center uppercase">
                                <span>{LOCALE_DISPLAY_MAP[locale]}</span>
                            </NavItem>
                        ))}
                    </dropdown.Dropdown>
                </dropdown.Container>

                <ThemeButton locale={locale} messages={messages} />

                <dropdown.Container>
                    <IconedText>
                        <IoNavigateCircle className="icon-md" />
                        <FormattedMessage messages={messages} id={"header.explore"} />
                    </IconedText>
                    <dropdown.Dropdown variant="glass" sep={false}>
                        <NavItem locale={locale} messages={messages} href={"/blogs"}>
                            <RiFilePaper2Fill className="icon-md" />
                            <FormattedMessage messages={messages} id="header.blogs" />
                        </NavItem>
                        <Separator variant="sm" />
                        <NavItem locale={locale} messages={messages} href={"/about"}>
                            <RiContactsBook2Fill className="icon-md" />
                            <FormattedMessage messages={messages} id="header.about" />
                        </NavItem>
                        <Separator variant="sm" />
                        <NavItem locale={locale} messages={messages} href={"/anime"}>
                            <GiClover className="icon-md" />
                            <FormattedMessage messages={messages} id="header.anime" />
                        </NavItem>
                        <Separator variant="sm" />
                        <NavItem locale={locale} messages={messages} href={"/rss"}>
                            <IoLayers className="icon-md" />
                            <FormattedMessage messages={messages} id="header.rss" />
                        </NavItem>

                        <Separator variant="sm" className="mx-0 border-2 border-gray-600" />

                        <NavItem locale={locale} messages={messages} href={GITHUB_CV_URL} target="_blank">
                            <MdWork className="icon-md" />
                            <FormattedMessage messages={messages} id="header.cv" />
                        </NavItem>
                        <Separator variant="sm" />
                        <NavItem locale={locale} messages={messages} href={GITHUB_REPO_URL} target="_blank">
                            <SiGithub className="icon-md" />
                            <FormattedMessage messages={messages} id="header.source" />
                        </NavItem>
                    </dropdown.Dropdown>
                </dropdown.Container>
            </nav>
        </header>
    );
}
