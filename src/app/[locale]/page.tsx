import NavItem from "@/components/header/nav-item";
import CanvasLayout from "@/components/three/layout";
import "@/components/ui/board.scss";
import { GITHUB_CV_URL, GITHUB_REPO_URL, V1_URL, V2_URL } from "@/shared/constants";
import Loading from "@/components/ui/loading/spinner";
import { FormattedMessage, fetchMessages } from "@/shared/i18n/translation";
import { BasePageProps } from "@/shared/types/comp";
import dynamic from "next/dynamic";
import { GiClover } from "react-icons/gi/index";
import { IoLayers } from "react-icons/io5/index";
import { RiContactsBook2Fill, RiFilePaper2Fill } from "react-icons/ri/index";
import { MdWork } from "react-icons/md/index";
import { SiGithub } from "react-icons/si/index";
import { FaRegClone } from "react-icons/fa/index";
import "@/components/ui/border.scss";

const MyRoom = dynamic(() => import("@/components/locale/my-room"), {
    ssr: false,
    loading: () => <Loading />,
});

export default async function Page({ params }: BasePageProps) {
    const messages = await fetchMessages(params.locale);

    return (
        <CanvasLayout>
            <div className="std-bg flex h-fit w-full flex-col items-center justify-center">
                <MyRoom />

                <span className="mt-6">
                    Hello I&#39;m <b>Weilue Luo</b>
                </span>

                <div className="mt-4 flex w-full flex-col items-center justify-center">
                    {/* <div>
                        <FormattedMessage messages={messages} id="index.title" />
                    </div> */}
                    <div className="flex w-full flex-row flex-wrap items-center justify-center gap-2 md:gap-4 xl:gap-6">
                        <NavItem className="std-pad" locale={params.locale} messages={messages} href={"/blog"}>
                            <RiFilePaper2Fill className="icon-md" />
                            <span className="grow">
                                <FormattedMessage messages={messages} id="header.blogs" />
                            </span>
                        </NavItem>

                        <NavItem className="std-pad" locale={params.locale} messages={messages} href={"/about"}>
                            <RiContactsBook2Fill className="icon-md" />
                            <span className="grow">
                                <FormattedMessage messages={messages} id="header.about" />
                            </span>
                        </NavItem>

                        <NavItem className="std-pad" locale={params.locale} messages={messages} href={"/anime"}>
                            <GiClover className="icon-md" />
                            <span className="grow">
                                <FormattedMessage messages={messages} id="header.anime" />
                            </span>
                        </NavItem>

                        <NavItem className="std-pad" locale={params.locale} messages={messages} href={"/rss"}>
                            <IoLayers className="icon-md" />
                            <span className="grow">
                                <FormattedMessage messages={messages} id="header.rss" />
                            </span>
                        </NavItem>
                    </div>
                    <div className="flex w-full flex-row flex-wrap items-center justify-center gap-2 md:gap-4 xl:gap-6">
                        <NavItem
                            className="std-pad flex flex-row"
                            locale={params.locale}
                            messages={messages}
                            href={GITHUB_CV_URL}
                            target="_blank">
                            <MdWork className="icon-md" />
                            <span className="grow">
                                <FormattedMessage messages={messages} id="header.cv" />
                            </span>
                        </NavItem>

                        <NavItem
                            className="std-pad"
                            locale={params.locale}
                            messages={messages}
                            href={GITHUB_REPO_URL}
                            target="_blank">
                            <SiGithub className="icon-md" />
                            <span className="grow">
                                <FormattedMessage messages={messages} id="header.source" />
                            </span>
                        </NavItem>

                        <NavItem
                            className="std-pad"
                            locale={params.locale}
                            messages={messages}
                            href={V1_URL}
                            target="_blank">
                            <FaRegClone className="icon-md" />
                            <span className="grow">
                                <FormattedMessage messages={messages} id="header.v1.long" />
                            </span>
                        </NavItem>

                        <NavItem
                            className="std-pad"
                            locale={params.locale}
                            messages={messages}
                            href={V2_URL}
                            target="_blank">
                            <FaRegClone className="icon-md" />
                            <span className="grow">
                                <FormattedMessage messages={messages} id="header.v2.long" />
                            </span>
                        </NavItem>
                    </div>

                    {/* <div className=" rounded-md overflow-hidden">
                            <img src="/images/head.jpg" alt="head" className=""/>
                        </div> */}
                </div>
            </div>
        </CanvasLayout>
    );
}
