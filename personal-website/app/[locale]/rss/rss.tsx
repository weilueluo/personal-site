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
import { ImNewTab } from "react-icons/im";
import { IoMdRefreshCircle } from "react-icons/io";
import { MdOutlineError } from "react-icons/md";
import { VscLoading } from "react-icons/vsc";
import { useSingleUserFeedConfigs, useUserRSSConfigs } from "../../../components/rss/user-config";

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
            <ul className="my-2 flex h-fit w-full flex-col gap-2">
                {Array.from(infoMap).map(([title, info]) => (
                    <FeedTitle key={title} title={title} />
                ))}
            </ul>
            <Separator className="mb-0 h-3" />

            <ul>
                {displayFeeds.map((feedData) => (
                    <FeedData key={`${rssUtils.hash(feedData)}`} feedData={feedData} />
                ))}
            </ul>
            <div className="flex justify-center">
                {isLoading ? (
                    // <GiHandTruck className=" animate-in animate-out fade-in fade-out slide-in-from-left-8 slide-out-to-right-8 duration-1000 running repeat-infinite" />
                    <VscLoading className="mt-4 inline-block animate-spin" />
                ) : hasMoreFeeds ? (
                    <span
                        className="hover-subtext mb-2 px-2 py-1 underline"
                        onClick={() => setDisplayAmount(displayAmount + 20)}>
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
    [FeedStatus.LOADING]: <VscLoading className="inline-block animate-spin" />,
    [FeedStatus.PROCESSING]: <CgFormatSeparator className="inline-block" />,
    [FeedStatus.VALIDATING]: <VscLoading className="inline-block animate-spin" />,
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
                        ? `?`
                        : info.status === FeedStatus.ERROR
                        ? info.error?.message
                        : `${info.amount} feeds`}
                </span>
                <span className="grid h-full place-items-center px-2">{STATUS_2_ICON[info.status]}</span>

                <span
                    className={tm(
                        "rounded-md px-2 py-1 text-sm",
                        isFetchingFeed && "shadow-inset-sm pointer-events-none"
                    )}
                    onClick={() => mutate()}>
                    <IoMdRefreshCircle size={"1.2em"} />
                </span>

                <span
                    className={tm("rounded-md px-2 py-1 text-sm", active && "shadow-inset-sm")}
                    onClick={() => setActive(title, !active)}>
                    {active ? <AiFillEye size={"1.2em"} /> : <AiFillEyeInvisible size={"1.2em"} />}
                </span>
            </div>
        </div>
    );
}

function FeedData({ feedData }: { feedData: Feed }) {
    const [showDetails, setShowDetails] = useState(false);
    const detailsOnClick = () => {
        setShowDetails((v) => !v);
    };
    // to distinguish click and drag: https://stackoverflow.com/questions/6042202/how-to-distinguish-mouse-click-and-drag
    let mouseX = 0,
        mouseY = 0;
    const detailsMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        [mouseX, mouseY] = [e.pageX, e.pageY];
    };
    const detailsMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
        const [diffX, diffY] = [Math.abs(e.pageX - mouseX), Math.abs(e.pageY - mouseY)];
        if (diffX < 6 && diffY < 6) {
            detailsOnClick();
        } else {
            // drag
        }
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

    // hover hint
    const [showHint, setShowHint] = useState(false);
    const onDetailsMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
        setShowHint(true);
    };
    const onDetailsMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        setShowHint(false);
    };
    const hint = showDetails ? "click to collapse" : "click to expand";

    return (
        <li key={rssUtils.hash(feedData)} className={tm("my-3 break-all rounded-md border border-transparent")}>
            <div className="animate-in slide-in-from-bottom-4">
                {/* summary */}
                <div className="flex flex-row">
                    {/* title, source, date, etc */}
                    <div>
                        {/* first row: title */}
                        <Link
                            href={feedData.item?.link || "#"}
                            target="_blank"
                            className="w-fit hover:cursor-pointer hover:underline">
                            <h3 className="font-bold">
                                {feedData.item.title} <ImNewTab className="inline-block" />
                            </h3>
                        </Link>
                        {/* second row */}
                        <div>
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
                                        <span className="px-2">{"|"}</span>
                                        <span
                                            onClick={dateOnClick}
                                            className="hover-subtext italic hover:cursor-default hover:underline">
                                            {date}
                                        </span>
                                        {showHint && (
                                            <>
                                                <div className="inline-block text-sm text-gray-500 animate-in slide-in-from-left-4">
                                                    <span className="px-2">{"|"}</span>
                                                    <span className="italic">{hint}</span>
                                                </div>
                                            </>
                                        )}
                                    </>
                                )}
                            </span>
                        </div>
                    </div>
                </div>

                {/* details */}
                <div
                    onMouseDown={detailsMouseDown}
                    onMouseUp={detailsMouseUp}
                    onMouseEnter={onDetailsMouseEnter}
                    onMouseLeave={onDetailsMouseLeave}
                    className="relative flex flex-row hover:cursor-pointer">
                    {!showDetails && (
                        <div>
                            <div className="line-clamp-3 break-normal text-gray-700 animate-in slide-in-from-bottom-4">
                                {sanitizedContent ? (
                                    <p dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
                                ) : (
                                    <p className="italic">~empty content~</p>
                                )}
                            </div>
                        </div>
                    )}

                    {showDetails && (
                        <div className="animate-in slide-in-from-top-4">
                            <Separator className="mb-2 h-2" />
                            {sanitizedContent ? (
                                <p
                                    dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                                    className="h-64 resize-y overflow-y-scroll break-normal"
                                />
                            ) : (
                                <p className="italic">~empty content~</p>
                            )}
                            <Separator className="mb-2 h-2" />
                        </div>
                    )}
                </div>
            </div>
        </li>
    );
}
