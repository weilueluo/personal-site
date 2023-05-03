"use client";

import { Feed, FeedStatus, useRSS, useSingleRSS } from "@/components/rss/manager";
import { rssUtils } from "@/components/rss/utils";
import Separator from "@/components/ui/Separator";
import { timeSince, tm } from "@/shared/utils";
import { sanitize } from "dompurify";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AiFillCheckCircle, AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { CgFormatSeparator } from "react-icons/cg";
import { ImSpinner9 } from "react-icons/im";
import { IoMdRefreshCircle } from "react-icons/io";
import { MdOutlineError } from "react-icons/md";
import { useSingleUserFeedConfigs, useUserRSSConfigs } from "./user-config";
import { GiHandTruck } from "react-icons/gi";

export default function RSS() {
    const { feeds, infoMap, configs: rssConfigs } = useRSS();
    const { userConfigs } = useUserRSSConfigs();

    useEffect(() => {
        const activeFeeds = feeds
            .filter((feed) => userConfigs[feed.config.title].active)
            .sort((a, b) => (a.date <= b.date ? 1 : -1));
        setActiveFeeds(activeFeeds);
    }, [userConfigs, feeds]);

    const [activeFeeds, setActiveFeeds] = useState<Feed[]>([]);

    // const [showTitle, setShowTitle] = useState(false);

    const [displayAmount, setDisplayAmount] = useState(20);
    const [hasMoreFeeds, setHasMoreFeeds] = useState(true);
    const [displayFeeds, setDisplayFeeds] = useState<Feed[]>([]);
    useEffect(() => {
        setDisplayFeeds(activeFeeds.slice(0, displayAmount));
    }, [activeFeeds, displayAmount]);
    useEffect(() => {
        setHasMoreFeeds(displayFeeds.length < activeFeeds.length);
    }, [activeFeeds, displayFeeds]);

    const isLoading =
        Array.from(infoMap.entries()).filter(([title, info]) => info.status !== FeedStatus.LOADING).length === 0;

    return (
        <>
            <div className="grid place-items-center">
                <h3 className="text-xl font-semibold">RSS Feed</h3>
                <Separator className="h-3" />
            </div>

            <>
                <ul className="my-2 flex h-fit w-full flex-col gap-2">
                    {Array.from(infoMap).map(([title, info]) => (
                        <FeedTitle key={title} title={title} />
                    ))}
                </ul>
                <Separator />
            </>

            <ul>
                {displayFeeds.map((feedData) => (
                    <FeedData key={`${rssUtils.hash(feedData)}`} feedData={feedData} />
                ))}
            </ul>
            <div className="flex justify-center">
                {isLoading ? (
                    <GiHandTruck className=" animate-in animate-out slide-in-from-left-8 slide-out-to-right-8 duration-1000 running repeat-infinite fade-in fade-out" />
                ) : hasMoreFeeds ? (
                    <span
                        className="hover-shadow mb-2 px-2 py-1 hover:cursor-pointer"
                        onClick={() => setDisplayAmount(displayAmount + 20)}>
                        click to view 20 more (current: {displayAmount}/{activeFeeds.length})
                    </span>
                ) : (
                    <span className="italic">~ displayed all {displayFeeds.length} feeds ~</span>
                )}
            </div>
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

function FeedTitle({ title, ...rest }: { title: string }) {
    const { feeds, info, config, mutate } = useSingleRSS(title);
    const { active, setActive } = useSingleUserFeedConfigs(title);
    const isFetchingFeed = info.status === FeedStatus.VALIDATING || info.status === FeedStatus.LOADING;

    return (
        <div className={tm("flex h-fit flex-row items-center justify-between gap-1 rounded-md")} {...rest}>
            <div className="flex h-fit flex-row items-center justify-center gap-1 rounded-md px-1">
                <span>{title}</span>
            </div>

            <div className="mx-1 flex h-full w-fit flex-row items-center gap-1">
                <span className="flex h-full text-sm">
                    {isFetchingFeed ? `-` : info.status === FeedStatus.ERROR ? info.error?.message : `${info.amount}`}
                </span>
                <span className="grid h-full place-items-center px-2">{STATUS_2_ICON[info.status]}</span>
                {/* <Tooltip.Container>
                    <span className="grid h-full place-items-center">{STATUS_2_ICON[info.status]}</span>
                    <Tooltip.Content className="w-fit whitespace-nowrap text-sm">
                        {info.status === FeedStatus.ERROR ? info.error?.message : `amount=${info.amount}`}
                    </Tooltip.Content>
                </Tooltip.Container> */}

                <span
                    className={tm("hover-shadow rounded-md px-2 py-1 text-sm", active && "shadow-inset-sm")}
                    onClick={() => setActive(title, !active)}>
                    {active ? <AiFillEye size={"1.2em"} /> : <AiFillEyeInvisible size={"1.2em"} />}
                </span>

                <span
                    className={tm(
                        "hover-shadow rounded-md px-2 py-1 text-sm",
                        isFetchingFeed && "shadow-inset-sm pointer-events-none"
                    )}
                    onClick={() => mutate()}>
                    <IoMdRefreshCircle size={"1.2em"} />
                </span>
            </div>
        </div>
    );
}

function FeedData({ feedData }: { feedData: Feed }) {
    const now = new Date();
    return (
        <li
            key={rssUtils.hash(feedData)}
            className="mx-2 my-3 break-all rounded-md border border-black p-2 hover:cursor-pointer">
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
