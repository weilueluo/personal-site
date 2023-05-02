"use client";

import { Feed, FeedInfo, FeedStatus, RSSProvider, useRSS, useSingleRSS } from "@/components/rss/manager";
import { rssUtils } from "@/components/rss/utils";
import Separator from "@/components/ui/Separator";
import Tooltip from "@/components/ui/Tooltip";
import { timeSince, tm } from "@/shared/utils";
import { sanitize } from "dompurify";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { AiFillCheckCircle, AiOutlineLoading3Quarters } from "react-icons/ai";
import { CgFormatSeparator, CgSpinnerTwoAlt } from "react-icons/cg";
import { ImSpinner9 } from "react-icons/im";
import { IoRefreshCircle } from "react-icons/io5";
import { MdOutlineError } from "react-icons/md";
import { TbTruckLoading } from "react-icons/tb";
import { useImmer } from "use-immer";

export default function TestRSS() {
    // console.log("feeds", feeds);

    return (
        <ErrorBoundary fallback={<span>Provider Error</span>}>
            <RSSProvider>
                <ErrorBoundary fallback={<span>TestRSS Error</span>}>
                    <RSS />
                </ErrorBoundary>
            </RSSProvider>
        </ErrorBoundary>
    );
}

type TitleToActive = {
    [title: string]: boolean;
};

function RSS() {
    const { feeds, infoMap: feedInfo, configs: rssConfigs } = useRSS();

    // title stuff
    const initialTitleToActive = useCallback(
        () =>
            rssConfigs.reduce((acc, config) => {
                acc[config.title] = false;
                return acc;
            }, {} as TitleToActive),
        [rssConfigs]
    );
    const [titleToActive, setTitleToActive] = useImmer<TitleToActive>(initialTitleToActive);
    const toggleTitleActive = useCallback(
        (title: string) =>
            setTitleToActive((draft) => {
                draft[title] = !draft[title];
            }),
        [setTitleToActive]
    );

    // feeds stuff
    // const [activeFeeds, setActiveFeeds] = useState<FeedResult[]>([]);
    useEffect(() => {
        // set active feeds
        const activeFeeds = feeds.filter((feed) => titleToActive[feed.config.title]);

        setActiveFeedData(activeFeeds);
    }, [titleToActive, feeds]);

    // console.log("titleToActive", titleToActive);

    // console.log("activeFeeds", activeFeeds);

    const [activeFeedData, setActiveFeedData] = useState<Feed[]>([]);
    // useEffect(() => {

    // }, [activeFeeds]);

    // console.log("activeFeedData", activeFeedData);

    return (
        <>
            <ul className="my-2 flex h-fit flex-row flex-wrap">
                {Array.from(feedInfo).map(([title, info]) => (
                    <TitleButton
                        key={title}
                        title={title}
                        active={titleToActive[title]}
                        onClick={() => toggleTitleActive(title)}
                    />
                ))}
            </ul>
            <ul>
                {activeFeedData.sort((a, b) => a.date <= b.date ? 1 : -1).map((feedData) => (
                    <FeedData key={`${rssUtils.hash(feedData)}`} feedData={feedData} />
                ))}
            </ul>
            {/* <Separator className="h-3 mb-3" /> */}
            {/* {Object.entries(feeds).map(([url, feed]) => {
                const data = feed.data;

                if (feed.isLoading) {
                    return <span key={url}>loading</span>;
                }
                if (feed.error) {
                    return <span key={url}>error: {feed.error}</span>;
                }

                console.log(`loading RSS, url=${url}, data=${JSON.stringify(data)}`);

                return (
                    <div key={url}>
                        <h3>{data?.title}</h3>
                        <ul>
                            {data?.items.map((item) => (
                                <li
                                    key={item.guid || item.link}
                                    dangerouslySetInnerHTML={{ __html: sanitize(item.content || "") }}></li>
                            ))}
                        </ul>
                    </div>
                );
            })} */}
        </>
    );
}

const STATUS_2_ICON = {
    [FeedStatus.COMPLETED]: <AiFillCheckCircle className="inline-block" />,
    [FeedStatus.ERROR]: <MdOutlineError className="inline-block" color="#8E354A" />,
    [FeedStatus.LOADING]: <ImSpinner9 className="inline-block animate-spin" />,
    [FeedStatus.PROCESSING]: <CgFormatSeparator className="inline-block" />,
    [FeedStatus.VALIDATING]: <ImSpinner9 className="inline-block animate-spin" />,
};

function TitleButton({ title, active, ...rest }: { title: string; active: boolean; onClick: () => void }) {
    const { feeds, info, config } = useSingleRSS(title);
    return (
        <button
            key={title}
            className={tm(
                "hover-shadow mx-1 flex w-fit flex-row items-center gap-1 px-2 py-2",
                active && "shadow-inset-sm"
            )}
            {...rest}>
            <div className="flex h-full w-fit flex-row items-center justify-center gap-1 rounded-md px-1">
                <span>{title}</span>
                <Tooltip.Container>
                    <span className="grid h-full place-items-center">{STATUS_2_ICON[info.status]}</span>
                    <Tooltip.Content className="w-fit whitespace-nowrap text-sm">
                        {info.status === FeedStatus.ERROR ? info.error?.message : `amount=${info.amount}`}
                    </Tooltip.Content>
                </Tooltip.Container>
                {/* {info.status === FeedStatus.COMPLETED && <span>{info.amount}</span>} */}
            </div>
        </button>
    );
}

function FeedData({ feedData }: { feedData: Feed }) {
    const now = new Date();
    return (
        <li
            key={`${feedData.item.guid}_${feedData.item.title}_${feedData.item.link}`}
            className="mx-2 my-3 rounded-md border border-black p-2 hover:cursor-pointer">
            <details>
                <summary>
                    <h3>{feedData.item.title}</h3>
                    <span className="text-sm italic">
                        {feedData.config.title}
                        {" - "}
                        {timeSince(now, feedData.date)} ago
                    </span>
                    <p>{feedData.item.summary}</p>
                    <Link href={feedData.item?.link || "#"} className="hover:underline">
                        {feedData.item?.link}
                    </Link>
                </summary>
                <Separator className="mb-2 h-2" />
                <p dangerouslySetInnerHTML={{ __html: sanitize(feedData.item.content || "") }}></p>
            </details>
        </li>
    );
}
