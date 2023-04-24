import { useEffect, useMemo, useState } from "react";

import { timeSince, tm } from "@/shared/utils";
import styles from "./Feed.module.sass";
import { FlatFeed } from "./RSS.d";

export default function Feed(props: { flatFeed: FlatFeed; i: number }) {
    const feed = props.flatFeed;

    const feedName = feed.name;
    const title = feed.title;
    // const author = feed.creator || feed.author || 'n/a';
    const description =
        feed.summary || feed.contentSnippet || feed.content || "description unavailable";
    const key = feed.uniqueKey;

    // display time string
    const [displayTime, setDisplayTime] = useState<string>("time unavailable");
    const [displayAgoTime, setDisplayAgoTime] = useState(true);
    const displayTimeOnClicked = () => setDisplayAgoTime(!displayAgoTime);
    useEffect(() => {
        if (feed.jsDate) {
            if (displayAgoTime) {
                setDisplayTime(timeSince(new Date(), feed.jsDate) + " ago");
            } else {
                setDisplayTime(feed.jsDate.toLocaleString());
            }
        }
    }, [displayAgoTime, feed.jsDate]);

    // expand collapse description
    // https://stackoverflow.com/a/47224153
    const getContentWidth = (element: any) => {
        const styles = getComputedStyle(element);

        return (
            element.clientWidth - parseFloat(styles.paddingLeft) - parseFloat(styles.paddingRight)
        );
    };
    const isOverflown = useMemo(
        () => (element: any, parent: any) => {
            // + 16 because the collapse/expand icon is 16px
            return getContentWidth(parent) < getContentWidth(element) + 16;
        },
        []
    );
    const [overflown, setOverflown] = useState(false);
    useEffect(() => {
        const description = document.getElementById(`feed-description-${props.i}`);
        const container = document.getElementById(`feed-description-container-${props.i}`);
        setOverflown(isOverflown(description, container));
    }, [isOverflown, props.i]);
    const [expandActive, setExpandActive] = useState(false);
    const expandOnClick = () => setExpandActive(!expandActive);

    return (
        <li key={key} className="flex w-96 max-w-full flex-col justify-start">
            <span
                className="order-1 cursor-pointer text-lg font-bold hover:underline"
                onClick={() => titleOnClick(feed)}>
                {title}
            </span>

            <div className="order-2 flex w-full flex-row text-sm">
                <span className="my-1 after:content-[\2022]">{feedName}</span>
                <span className="italic" onClick={displayTimeOnClicked}>
                    {displayTime}
                </span>
            </div>

            <span
                id={`feed-description-container-${props.i}`}
                className={tm(
                    "order-3 mt-1 flex flex-row justify-between",
                    expandActive && " line-clamp-6 max-h-60",
                    overflown && "cursor-pointer"
                )}
                onClick={() => expandOnClick()}>
                <p id={`feed-description-${props.i}`} className={styles.feedDescription}>
                    {description}
                </p>
                {/* eslint-disable-next-line */}
                {overflown && expandActive && (
                    <span className="order-2 self-end italic">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            className="h-4 w-4"
                            src="/icons/misc/angle-up-solid.svg"
                            alt="collapse"
                        />
                    </span>
                )}
                {/* eslint-disable-next-line */}
                {overflown && !expandActive && (
                    <span className="order-2 self-end italic">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            className="h-4 w-4"
                            src="/icons/misc/angle-down-solid.svg"
                            alt="expand"
                        />
                    </span>
                )}
            </span>
        </li>
    );
}

function titleOnClick(feed: FlatFeed) {
    feed.link && window.open(feed.link, "_blank");
}
