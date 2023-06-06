"use client";

import { Feed, FeedStatus, useRSS, useSingleRSS } from "@/components/rss/manager";
import Loading from "@/components/ui/loading/spinner";
import Separator from "@/components/ui/separator";
import { FormattedMessage, formattedMessage } from "@/shared/i18n/translation";
import { Messages } from "@/shared/i18n/type";
import { BaseCompProps } from "@/shared/types/comp";
import { stringHash, tm } from "@/shared/utils";
import { sanitize } from "dompurify";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
    AiFillCheckCircle,
    AiFillClockCircle,
    AiFillEye,
    AiFillEyeInvisible,
    AiFillTag,
    AiOutlineCloseCircle,
} from "react-icons/ai/index";
import { CgFormatSeparator } from "react-icons/cg/index";
import { FaAngleDown, FaAngleUp } from "react-icons/fa/index";
import { ImNewTab } from "react-icons/im/index";
import { IoMdRefreshCircle } from "react-icons/io/index";
import { VscLoading } from "react-icons/vsc/index";
import { useUserRSSConfigs, useSingleUserFeedConfigs } from "./context";

export default function RSS({ messages, locale }: BaseCompProps<"div">) {
    const { feeds, infoMap } = useRSS();
    const { userConfigs } = useUserRSSConfigs();

    useEffect(() => {
        const activeFeeds = feeds
            .filter(feed => userConfigs.perFeedConfigs[feed.config.title].active)
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

    const isLoading = Array.from(infoMap.entries()).some(([, info]) => info.status === FeedStatus.LOADING);

    return (
        <>
            <ul className="flex h-fit w-full flex-col gap-2 md:my-2">
                {Array.from(infoMap).map(([title]) => (
                    <FeedTitle key={title} title={title} messages={messages} locale={locale} />
                ))}
            </ul>
            <Separator className="mb-0 h-3" />

            <ul>
                {displayFeeds.map(feedData => (
                    <FeedData key={`${rsshash(feedData)}`} feedData={feedData} messages={messages} locale={locale} />
                ))}
            </ul>
            <div className="flex justify-center">
                {isLoading ? (
                    // <GiHandTruck className=" animate-in animate-out fade-in fade-out slide-in-from-left-8 slide-out-to-right-8 duration-1000 running repeat-infinite" />
                    <Loading />
                ) : hasMoreFeeds ? (
                    <span
                        className="hover-subtext mb-2 px-2 py-1 underline"
                        onClick={() => setDisplayAmount(displayAmount + 20)}>
                        <FormattedMessage
                            messages={messages}
                            id={"rss.view_more"}
                            locale={locale}
                            values={{
                                current: displayAmount,
                                total: activeFeeds.length,
                            }}
                        />
                    </span>
                ) : (
                    <span className="italic">
                        <FormattedMessage
                            messages={messages}
                            id={"rss.displayed_all"}
                            locale={locale}
                            values={{
                                size: displayFeeds.length,
                            }}
                        />
                    </span>
                )}
            </div>
        </>
    );
}

const STATUS_2_ICON = {
    [FeedStatus.COMPLETED]: <AiFillCheckCircle className="inline-block" />,
    [FeedStatus.ERROR]: <AiOutlineCloseCircle className="inline-block" color="#8E354A" />,
    [FeedStatus.LOADING]: <VscLoading className="inline-block animate-spin" />,
    [FeedStatus.PROCESSING]: <CgFormatSeparator className="inline-block" />,
    [FeedStatus.VALIDATING]: <VscLoading className="inline-block animate-spin" />,
};

function FeedTitle({ title, messages, locale, ...rest }: { title: keyof Messages } & BaseCompProps<"div">) {
    const { info, mutate } = useSingleRSS(title);
    const { active, setActive } = useSingleUserFeedConfigs(title);
    const isFetchingFeed = info.status === FeedStatus.VALIDATING || info.status === FeedStatus.LOADING;

    return (
        <div className={tm("flex h-fit flex-row items-center justify-between gap-1 rounded-md")} {...rest}>
            <div className="flex h-fit flex-row items-center justify-center gap-1 rounded-md">
                <span className="std-text-size">
                    <FormattedMessage messages={messages} id={title} />
                </span>
            </div>

            <div className="mx-1 flex h-full w-fit flex-row items-center gap-1">
                <span className="flex h-full text-sm">
                    {isFetchingFeed
                        ? formattedMessage(messages, "rss.title.fetching_feed")
                        : info.status === FeedStatus.ERROR
                        ? info.error?.message
                        : formattedMessage(messages, "rss.title.fetched_feed", locale, {
                              amount: info.amount,
                          })}
                </span>
                <span className="grid h-full place-items-center px-2">{STATUS_2_ICON[info.status]}</span>

                <span
                    className={tm("std-pad std-hover text-sm", isFetchingFeed && "shadow-inset-sm pointer-events-none")}
                    onClick={() => mutate()}>
                    <IoMdRefreshCircle size={"1.2em"} />
                </span>

                <span
                    className={tm("std-pad std-hover text-sm", active && "shadow-inset-sm")}
                    onClick={() => setActive(title, !active)}>
                    {active ? <AiFillEye size={"1.2em"} /> : <AiFillEyeInvisible size={"1.2em"} />}
                </span>
            </div>
        </div>
    );
}

function FeedData({ feedData, messages }: { feedData: Feed } & BaseCompProps<"li">) {
    const [showDetails, setShowDetails] = useState(false);
    const detailsOnClick = () => {
        setShowDetails(v => !v);
    };
    // click on details: open and close
    // drag on details: maybe expanding the details panel
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

    const date = userConfigs.globalConfigs.showRawDate ? feedData.date?.toISOString() : feedData.date?.toUTCString();
    const dateOnClick = (e: React.MouseEvent<HTMLSpanElement>) => {
        e.stopPropagation();
        setShowRawDate(!userConfigs.globalConfigs.showRawDate);
    };

    // hover hint
    const [showHint, setShowHint] = useState(false);
    const onDetailsMouseEnter = () => {
        setShowHint(true);
    };
    const onDetailsMouseLeave = () => {
        setShowHint(false);
    };

    return (
        <li key={rsshash(feedData)} className={tm("my-3 break-all border border-transparent")}>
            <div className="relative animate-in slide-in-from-bottom-4">
                {/* summary */}
                <div className="flex flex-row">
                    {/* title, source, date, etc */}
                    <div>
                        {/* first row: title */}
                        <Link
                            href={feedData.item?.link || "#"}
                            target="_blank"
                            className="w-fit hover:cursor-pointer hover:underline">
                            <h3 className="text-sm font-bold md:text-base">
                                {feedData.item.title} <ImNewTab className="inline-block" />
                            </h3>
                        </Link>
                        {/* second row */}
                        <div className="flex flex-row items-center gap-2 text-sm text-gray-600">
                            <Link
                                href={feedData.config.homeUrl}
                                className="hover-subtext inline-flex flex-row items-center gap-1 italic hover:cursor-pointer hover:underline"
                                target="_blank">
                                <AiFillTag className="inline-block" />
                                <FormattedMessage messages={messages} id={feedData.config.title} />
                                {/* <ImNewTab className="ml-1 inline-block" /> */}
                            </Link>
                            {date && (
                                <>
                                    <span className="hover-subtext flex flex-row items-center gap-1 hover:cursor-default hover:underline">
                                        <AiFillClockCircle className="inline-block" />
                                        <span onClick={dateOnClick} className="italic ">
                                            {date}
                                        </span>
                                    </span>
                                    {/* {showHint && (
                                        <span className=" flex flex-row items-center animate-in fade-in-0 slide-in-from-bottom-4">
                                            <MdLightbulb className="inline-block" />
                                            <span className="italic">{hint}</span>
                                        </span>
                                    )} */}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* details */}
                <div
                    onMouseDown={detailsMouseDown}
                    onMouseUp={detailsMouseUp}
                    onMouseEnter={onDetailsMouseEnter}
                    onMouseLeave={onDetailsMouseLeave}
                    className="std-text-size relative mt-1 flex flex-row hover:cursor-pointer">
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
            {showHint && !showDetails && (
                <FaAngleDown className="top-100 absolute left-[50%] animate-in fade-in slide-in-from-top-4" />
            )}
            {showHint && showDetails && (
                <FaAngleUp className="top-100 absolute left-[50%] animate-in fade-in slide-in-from-bottom-4" />
            )}
        </li>
    );
}

function rsshash(feed: Feed) {
    const key = (feed.item.guid || "") + (feed.item.title || "") + (feed.item.link || "");

    return stringHash(key);
}
