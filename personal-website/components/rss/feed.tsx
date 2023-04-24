import React, { ComponentPropsWithoutRef, Suspense, useEffect, useImperativeHandle, useRef } from "react";
import useSWR from "swr";

import { reTriggerAnimateFunction, tm } from "@/shared/utils";
import { sanitize } from "dompurify";
import Separator from "../ui/Separator";
import { rssFetcher } from "./fetcher";

import { Item } from "rss-parser";
import styles from "./feed.module.scss";
import { ErrorBoundary } from "react-error-boundary";

export interface FeedProps extends ComponentPropsWithoutRef<"div"> {
    url: string;
}

const Feed = React.forwardRef<React.ElementRef<"div">, FeedProps>(({ url, className, ...otherProps }, ref) => {
    const { data, error, isLoading } = useSWR(url, rssFetcher);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div ref={ref} className={tm("flex w-full flex-col items-center overflow-hidden p-2", className)} {...otherProps}>
            <div className="h-32 w-full">
                <h3 className="w-full text-center text-xl font-bold">
                    <a href={data?.link}>{data?.title}</a>
                </h3>
                <span className="w-full italic">{data?.description}</span>
            </div>
            <Suspense fallback={"loading list"}>
                <ul className="m-4 flex w-full flex-col items-center overflow-x-hidden overflow-y-scroll border">
                    {data?.items?.map((item) => (
                        <FeedItem key={item?.guid || item?.link} item={item} />
                    ))}
                </ul>
            </Suspense>
        </div>
    );
});
Feed.displayName = "Feed";

interface FeedItemProps extends ComponentPropsWithoutRef<"li"> {
    item: Item;
}

const FeedItem = React.forwardRef<React.ElementRef<"li">, FeedItemProps>(({ item, className, ...otherProps }, ref) => {
    const summary = item?.summary || item?.contentSnippet || "<span>empty description</span>";
    const content = item?.content || item?.contentSnippet || "<span>empty content</span>";
    const [active, setActive] = React.useState(false);

    const feedItemRef = useRef<HTMLLIElement>(null!);
    useImperativeHandle(ref, () => feedItemRef.current);

    useEffect(() => {
        if (!feedItemRef.current) return;

        const element = feedItemRef.current;

        element.addEventListener("click", reTriggerAnimateFunction(feedItemRef, styles.animate), false);
    }, []);

    return (
        <li
            className="m-4 w-full border [&_img]:h-48"
            onClick={() => {
                setActive(!active);
            }}
            ref={feedItemRef}
            {...otherProps}>
            <ErrorBoundary fallback={<span>error while loading feed item</span>}>
                <Suspense fallback={"loading item"}>
                    <details className={tm(styles.details, active && styles.active)}>
                        <summary>
                            <a href={item?.link}>{item?.title}</a>
                            <Separator />
                            <span dangerouslySetInnerHTML={{ __html: sanitize(summary) }}></span>
                            <Separator />
                        </summary>

                        <p dangerouslySetInnerHTML={{ __html: sanitize(content) }}></p>
                    </details>
                </Suspense>
            </ErrorBoundary>
        </li>
    );
});

export default Feed;
