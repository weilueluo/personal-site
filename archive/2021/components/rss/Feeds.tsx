import { type Dispatch, type SetStateAction, useState } from "react";
import Feed from "./Feed";
import styles from './Feeds.module.sass';
import { FlatFeed } from "./RSS.d";
import { sortFlatFeedsDesc } from "./Utils";


const INITIAL_FEEDS_LIMIT = 20
const INCREMENT = 20

type FeedsProps = {
    flatFeeds: FlatFeed[];
};

type LoadMoreProps = {
    flatFeeds: FlatFeed[];
    feedLimitState: [number, Dispatch<SetStateAction<number>>];
};

export default function Feeds(props: FeedsProps) {
    const flatFeeds = sortFlatFeedsDesc(props.flatFeeds)

    const [feedLimit, setFeedLimit] = useState(INITIAL_FEEDS_LIMIT)

    // map flat feed to jsx element
    const feedJsxs = flatFeeds.slice(0, feedLimit).map((flatFeed: FlatFeed, i: number) => (
        <Feed key={flatFeed.uniqueKey} flatFeed={flatFeed} i={i} />
    ));

    feedJsxs.push(<LoadMore key={'load-more'} flatFeeds={flatFeeds} feedLimitState={[feedLimit, setFeedLimit]} />)

    return (
        <ul className={styles['feeds-container']}>{feedJsxs}</ul>
    )
}


function LoadMore({ flatFeeds, feedLimitState }: LoadMoreProps) {
    const [feedLimit, setFeedLimit] = feedLimitState

    const remaining = flatFeeds.length - feedLimit
    const loaded = Math.min(flatFeeds.length, feedLimit)

    const loadMoreOnClick = () => setFeedLimit(feedLimit + INCREMENT)

    if (remaining <= 0) {
        return (
            <span className={styles['no-more-feeds']}>~end of all feeds~</span>
        )
    } else {
        return (
            <div className={styles['load-more-feeds']}>
                <button className={styles['load-more-button']} onClick={loadMoreOnClick}>{INCREMENT} more</button>
                <br />
                <span className={styles['load-more-info']}>~Loaded {loaded}/{flatFeeds.length}~</span>
            </div>
        )
    }
}
