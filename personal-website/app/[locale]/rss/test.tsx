"use client";

import { FeedResult, RSSProvider, useRSS } from "@/components/rss/manager";
import Separator from "@/components/ui/Separator";
import { timeSince, tm } from "@/shared/utils";
import { sanitize } from "dompurify";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Item, Output } from "rss-parser";
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
    const { feeds } = useRSS();

    const feedData = Object.values(feeds);

    // title stuff
    const initialTitleToActive: TitleToActive = feedData.reduce((acc, feed) => {
        acc[feed.title] = false;
        return acc;
    }, {} as TitleToActive);
    const [titleToActive, setTitleToActive] = useImmer<TitleToActive>(initialTitleToActive);
    const toggleTitleActive = useCallback(
        (title: string) =>
            setTitleToActive((draft) => {
                draft[title] = !draft[title];
            }),
        []
    );

    // feeds stuff
    // const [activeFeeds, setActiveFeeds] = useState<FeedResult[]>([]);
    useEffect(() => {
        // set active feeds
        const activeFeeds = feedData.filter((feed) => titleToActive[feed.title]);
        // setActiveFeeds(activeFeeds);
        const activeFeedData = activeFeeds.flatMap((feed) => {
            const { items, ...rest } = feed?.data || {};
            return (items || []).map((item) => ({ ...item, ...rest }));
        });
        setActiveFeedData(activeFeedData);
    }, [titleToActive]);

    // console.log("titleToActive", titleToActive);

    // console.log("activeFeeds", activeFeeds);

    const [activeFeedData, setActiveFeedData] = useState<(Item & Omit<Output<{}>, "items">)[]>([]);
    // useEffect(() => {

    // }, [activeFeeds]);

    // console.log("activeFeedData", activeFeedData);

    return (
        <>
            <ul className="my-2 flex h-fit flex-row flex-wrap">
                {feedData.map((feed) => (
                    <TitleButton
                        key={feed.title}
                        feed={feed}
                        active={titleToActive[feed.title]}
                        onClick={() => toggleTitleActive(feed.title)}
                    />
                ))}
            </ul>
            <ul>
                {activeFeedData.map((feedData) => (
                    <FeedData key={`${feedData.guid}_${feedData.title}_${feedData.link}`} feedData={feedData} />
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

function TitleButton({ feed, active, ...rest }: { feed: FeedResult; active: boolean }) {
    return (
        <button
            key={feed.title}
            className={tm("hover-shadow mx-1 w-fit px-2 py-2", active && "shadow-inset-sm")}
            {...rest}>
            {feed.title}
        </button>
    );
}

function FeedData({ feedData }: { feedData: Item & Omit<Output<{}>, "items"> }) {
    return (
        <li
            key={`${feedData.guid}_${feedData.title}_${feedData.link}`}
            className="mx-2 my-3 rounded-md border border-black p-2">
            <details>
                <summary>
                    <h3>{feedData?.title}</h3>
                    <span>
                        {timeSince(
                            new Date(),
                            new Date(feedData.isoDate || feedData.pubDate || feedData.lastBuildDate || "")
                        )}{" "}
                        ago
                    </span>
                    <p>{feedData.summary}</p>
                    <Link href={feedData?.link || "#"} className="hover:underline">
                        {feedData?.link}
                    </Link>
                </summary>
                <Separator className="mb-2 h-2" />
                <p dangerouslySetInnerHTML={{ __html: sanitize(feedData.content || "") }}></p>
            </details>
        </li>
    );
}
