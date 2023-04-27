"use client";

import { Feed, FeedInfo, RSSProvider, useRSS } from "@/components/rss/manager";
import Separator from "@/components/ui/Separator";
import { timeSince, tm } from "@/shared/utils";
import { sanitize } from "dompurify";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
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
    const { feeds, feedInfo, rssConfigs } = useRSS();

    // const feedData = Object.values(feeds);

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
                        info={info}
                        onClick={() => toggleTitleActive(title)}
                    />
                ))}
            </ul>
            <ul>
                {activeFeedData.map((feedData) => (
                    <FeedData
                        key={`${feedData.item.guid}_${feedData.item.title}_${feedData.item.link}`}
                        feedData={feedData}
                    />
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

function TitleButton({
    title,
    active,
    info,
    ...rest
}: {
    title: string;
    active: boolean;
    info: FeedInfo;
    onClick: () => void;
}) {
    return (
        <button key={title} className={tm("hover-shadow mx-1 w-fit px-2 py-2", active && "shadow-inset-sm")} {...rest}>
            <h3>{title}</h3>
            <span>{`${info.error ? info.error : info.status}`}</span>
        </button>
    );
}

function FeedData({ feedData }: { feedData: Feed }) {
    return (
        <li
            key={`${feedData.item.guid}_${feedData.item.title}_${feedData.item.link}`}
            className="mx-2 my-3 rounded-md border border-black p-2">
            <details>
                <summary>
                    <h3>{feedData.item.title}</h3>
                    <span className="italic text-sm">
                        {feedData.config.title}
                        {" - "}
                        {timeSince(
                            new Date(),
                            new Date(
                                feedData.item.isoDate || feedData.item.pubDate || feedData.item.lastBuildDate || ""
                            )
                        )}{" "}
                        ago
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
