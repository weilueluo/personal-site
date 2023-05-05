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
import { GiHandTruck } from "react-icons/gi";
import { ImNewTab, ImSpinner9 } from "react-icons/im";
import { IoMdRefreshCircle } from "react-icons/io";
import { MdOutlineError } from "react-icons/md";
import { useSingleUserFeedConfigs, useUserRSSConfigs } from "./user-config";

export default function RSS() {
    const { feeds, infoMap, configs: rssConfigs } = useRSS();
    const { userConfigs } = useUserRSSConfigs();

    useEffect(() => {
        const activeFeeds = feeds
            .filter((feed) => userConfigs.perFeedConfigs[feed.config.title].active)
            .sort((a, b) => {
                if (a.date === undefined) {
                    return 1;
                } else if (b.date === undefined) {
                    return -1;
                } else {
                    return a.date <= b.date ? 1 : -1;
                }
            });
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
                {/* <Separator /> */}
            </>

            <ul className="mt-8">
                {displayFeeds.map((feedData) => (
                    <FeedData key={`${rssUtils.hash(feedData)}`} feedData={feedData} />
                ))}
            </ul>
            <div className="flex justify-center">
                {isLoading ? (
                    <GiHandTruck className=" animate-in animate-out fade-in fade-out slide-in-from-left-8 slide-out-to-right-8 duration-1000 running repeat-infinite" />
                ) : hasMoreFeeds ? (
                    <span className="hover-subtext mb-2 px-2 py-1" onClick={() => setDisplayAmount(displayAmount + 20)}>
                        click to view 20 more ({displayAmount}/{activeFeeds.length})
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
            <div className="flex h-fit flex-row items-center justify-center gap-1 rounded-md">
                <span>{title}</span>
            </div>

            <div className="mx-1 flex h-full w-fit flex-row items-center gap-1">
                <span className="flex h-full text-sm">
                    {isFetchingFeed
                        ? `...`
                        : info.status === FeedStatus.ERROR
                        ? info.error?.message
                        : `${info.amount} feeds`}
                </span>
                <span className="grid h-full place-items-center px-2">{STATUS_2_ICON[info.status]}</span>

                <span
                    className={tm(
                        "hover-shadow rounded-md px-2 py-1 text-sm",
                        isFetchingFeed && "shadow-inset-sm pointer-events-none"
                    )}
                    onClick={() => mutate()}>
                    <IoMdRefreshCircle size={"1.2em"} />
                </span>

                <span
                    className={tm("hover-shadow rounded-md px-2 py-1 text-sm", active && "shadow-inset-sm")}
                    onClick={() => setActive(title, !active)}>
                    {active ? <AiFillEye size={"1.2em"} /> : <AiFillEyeInvisible size={"1.2em"} />}
                </span>
            </div>
        </div>
    );
}

function FeedData({ feedData }: { feedData: Feed }) {
    const [showDetails, setShowDetails] = useState(false);
    const detailsOnClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        setShowDetails((v) => !v);
    };
    const { setShowRawDate, userConfigs } = useUserRSSConfigs();
    const content = feedData.item.summary || feedData.item.contentSnippet || feedData.item.content;
    const sanitizedContent = content ? sanitize(content) : undefined;

    const date = userConfigs.globalConfigs.showRawDate
        ? feedData.date?.toDateString()
        : feedData.date && `${timeSince(new Date(), feedData.date)} ago`;
    const dateOnClick = (e: React.MouseEvent<HTMLSpanElement>) => {
        e.stopPropagation();
        setShowRawDate(!userConfigs.globalConfigs.showRawDate);
    };

    return (
        <li
            key={rssUtils.hash(feedData)}
            className={tm("my-3 break-all rounded-md border border-transparent p-2", showDetails && "border-black")}>
            <div className="animate-in slide-in-from-bottom-4">
                {/* summary */}
                <div className="flex flex-row">
                    {/* 
                    {feedData.image && (
                        <div className=" min-h-full">
                            <Image
                                src={feedData.image?.url || "#"}
                                alt={feedData.image?.title || `image from ${feedData.config.title}`}
                                width={48}
                                height={48}
                                className=" object-cover"
                            />
                        </div>
                    )} */}
                    {/* title, source, date, etc */}
                    <div>
                        {/* first row: title */}
                        <Link
                            href={feedData.item?.link || "#"}
                            target="_blank"
                            className="w-fit hover:cursor-pointer hover:underline">
                            <h3 className="flex w-fit flex-row items-center gap-1 font-bold">
                                {feedData.item.title}
                                <ImNewTab className="inline-block" />
                            </h3>
                        </Link>
                        {/* second row */}
                        <span className="text-sm text-gray-600">
                            <Link
                                href={feedData.config.homeUrl}
                                className="hover-subtext inline-flex flex-row items-center italic hover:cursor-pointer hover:underline"
                                target="_blank">
                                {`${feedData.config.title}`}
                                {/* <ImNewTab className="ml-1 inline-block" /> */}
                            </Link>
                            {date && (
                                <>
                                    <span className="px-1">{" | "}</span>
                                    <span
                                        onClick={dateOnClick}
                                        className="hover-subtext pr-1 italic hover:cursor-default hover:underline">
                                        {date}
                                    </span>
                                </>
                            )}
                        </span>
                    </div>
                </div>

                {/* details */}
                <div onClick={detailsOnClick} className="flex flex-row hover:cursor-pointer">
                    {!showDetails && (
                        <div>
                            <div className="line-clamp-3 animate-in slide-in-from-bottom-4">
                                {sanitizedContent ? (
                                    <p dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
                                ) : (
                                    <p className="italic">~empty content~</p>
                                )}
                            </div>
                            {/* <div className="w-fill text-right">
                                <span className="text-sm italic text-gray-600">(click to expand)</span>
                            </div> */}
                        </div>
                    )}

                    {showDetails && (
                        <div className="animate-in slide-in-from-top-4">
                            <Separator className="mb-2 h-2" />
                            {sanitizedContent ? (
                                <p
                                    dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                                    className="max-h-64 overflow-y-scroll"
                                />
                            ) : (
                                <p className="italic">~empty content~</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </li>
    );
}
